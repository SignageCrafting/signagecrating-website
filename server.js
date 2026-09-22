// Production server for the Signage Crafting website.
//
// - Serves the built site with every page rendered to HTML (for SEO and AI crawlers)
// - Runs the /admin API: login, content editing, image uploads, form leads
// - Stores everything admins change in DATA_DIR, outside the deployed code, so
//   Hostinger redeploys never wipe it
//
// Environment variables (set them in Hostinger > Node.js app > Environment variables):
//   ADMIN_PASSWORD      required to enable /admin, at least 12 characters
//   ADMIN_USERNAME      optional, defaults to "admin"
//   ADMIN_TOTP_SECRET   optional 2-step verification secret (npm run admin:2fa)
//   SESSION_SECRET      optional, generated and stored in DATA_DIR if missing
//   DATA_DIR            optional, where content/uploads/leads live (see defaultDataDir)
//   PORT                set by Hostinger
// Hostinger starts this file through LiteSpeed's lsnode.js, which loads it with
// require(). That fails on any top-level `await`, so keep startup synchronous.
process.env.NODE_ENV ??= 'production';

import express from 'express';
import compression from 'compression';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-server', 'entry-server.js');
// Use PORT exactly as the host provides it: on Hostinger it can be a socket path
// rather than a number, and converting it would make the app unreachable (503).
const PORT = process.env.PORT || 3000;
const DEFAULT_ADS_ID = 'AW-18436661648';

// Hostinger runs the app from ~/domains/<domain>/hbuilds/..., which is replaced
// on every deploy. Keep data next to it in ~/domains/<domain>/cms-data instead.
function defaultDataDir() {
  const hostinger = ROOT.match(/^(.*?)\/hbuilds\//);
  return hostinger ? path.join(hostinger[1], 'cms-data') : path.join(ROOT, 'cms-data');
}

console.log(`[server] Starting: Node ${process.version}, app folder ${ROOT}, PORT=${PORT}`);

function usableDataDir(dir) {
  try {
    fs.mkdirSync(path.join(dir, 'uploads'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'history'), { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch (err) {
    console.error(`[server] Can't use data folder ${dir}: ${err.message}`);
    return false;
  }
}

// Prefer the persistent folder; if the host doesn't allow it, fall back to the
// app folder so the site still runs (the admin Dashboard then shows a warning).
let DATA_DIR = path.resolve(process.env.DATA_DIR || defaultDataDir());
if (!usableDataDir(DATA_DIR)) {
  const fallback = path.join(ROOT, 'cms-data');
  if (fallback !== DATA_DIR && usableDataDir(fallback)) {
    console.warn(`[server] Using ${fallback} instead. Set DATA_DIR to a writable folder outside the app so data survives redeploys.`);
    DATA_DIR = fallback;
  }
}
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const HISTORY_DIR = path.join(DATA_DIR, 'history');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit.log');
const SECRET_FILE = path.join(DATA_DIR, '.session-secret');


// ---------------------------------------------------------------------------
// Admin credentials and sessions
// ---------------------------------------------------------------------------

// Values pasted into the hosting panel often pick up spaces or quotes around
// them, which would make a correct password fail. Strip those.
function cleanSecret(value) {
  return String(value ?? '').trim().replace(/^(['"])(.*)\1$/s, '$2').trim();
}

const ADMIN_USERNAME = (cleanSecret(process.env.ADMIN_USERNAME) || 'admin').toLowerCase();
const ADMIN_PASSWORD = cleanSecret(process.env.ADMIN_PASSWORD);
const TOTP_SECRET = cleanSecret(process.env.ADMIN_TOTP_SECRET).replace(/\s+/g, '').toUpperCase();
const ADMIN_READY = ADMIN_PASSWORD.length >= 12;
const SESSION_COOKIE = 'sc_admin';
const SESSION_HOURS = 8;

if (ADMIN_PASSWORD && !ADMIN_READY) {
  console.warn('[admin] ADMIN_PASSWORD is shorter than 12 characters, so /admin login is disabled.');
}

function loadSessionSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  try {
    return fs.readFileSync(SECRET_FILE, 'utf8').trim();
  } catch {
    const secret = crypto.randomBytes(48).toString('hex');
    try {
      fs.writeFileSync(SECRET_FILE, secret, { mode: 0o600 });
    } catch (err) {
      console.error(`[server] Can't store the session secret (${err.message}); admins will be signed out on restart.`);
    }
    return secret;
  }
}

// Changing the password or 2FA secret signs everyone out.
const SESSION_KEY = crypto
  .createHash('sha256')
  .update(`${loadSessionSecret()}|${ADMIN_PASSWORD}|${TOTP_SECRET}|${ADMIN_USERNAME}`)
  .digest();

function sign(value) {
  return crypto.createHmac('sha256', SESSION_KEY).update(value).digest('base64url');
}

function createSession() {
  const payload = `v1.${Date.now() + SESSION_HOURS * 3600_000}.${crypto.randomBytes(12).toString('base64url')}`;
  return `${payload}.${sign(payload)}`;
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function validSession(token) {
  if (!ADMIN_READY || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 4 || parts[0] !== 'v1') return false;
  const payload = parts.slice(0, 3).join('.');
  if (!safeEqual(sign(payload), parts[3])) return false;
  return Number(parts[1]) > Date.now();
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return '';
}

function setSessionCookie(req, res, value, maxAgeSeconds) {
  const secure = req.secure ? '; Secure' : '';
  res.append('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${secure}`);
}

// RFC 6238 time-based one-time codes (Google Authenticator, Authy, 1Password…)
function base32Decode(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const ch of input.replace(/=+$/, '')) {
    const v = alphabet.indexOf(ch);
    if (v < 0) return null;
    bits += v.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

const TOTP_KEY = TOTP_SECRET ? base32Decode(TOTP_SECRET) : null;
if (TOTP_SECRET && !TOTP_KEY) console.warn('[admin] ADMIN_TOTP_SECRET is not valid base32; 2-step verification is off.');
let lastTotpCounter = 0;

function totpCode(counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac('sha1', TOTP_KEY).update(buf).digest();
  const offset = h[h.length - 1] & 0xf;
  return String((h.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

function verifyTotp(code) {
  if (!TOTP_KEY) return true;
  const clean = String(code || '').replace(/\s+/g, '');
  if (!/^\d{6}$/.test(clean)) return false;
  const now = Math.floor(Date.now() / 30_000);
  for (const c of [now - 1, now, now + 1]) {
    // Each code works once, so a code seen over someone's shoulder can't be reused.
    if (c > lastTotpCounter && safeEqual(totpCode(c), clean)) {
      lastTotpCounter = c;
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Rate limiting (in memory)
// ---------------------------------------------------------------------------

function limiter(max, windowMs) {
  const hits = new Map();
  return {
    blocked(key) {
      const entry = hits.get(key);
      return !!entry && entry.resetAt > Date.now() && entry.count >= max;
    },
    hit(key) {
      const now = Date.now();
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) hits.set(key, { count: 1, resetAt: now + windowMs });
      else entry.count++;
      if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      }
    },
    reset(key) {
      hits.delete(key);
    },
  };
}

const loginFailuresByIp = limiter(5, 15 * 60_000);
const loginFailuresGlobal = limiter(30, 15 * 60_000);
const leadsByIp = limiter(5, 10 * 60_000);
const leadsGlobal = limiter(200, 60 * 60_000);

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

async function writeJsonAtomic(file, data) {
  const tmp = `${file}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
  await fsp.rename(tmp, file);
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fsp.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

// Serialises writes to the same file so two requests can't overwrite each other.
const queues = new Map();
function withLock(key, fn) {
  const prev = queues.get(key) || Promise.resolve();
  const next = prev.then(fn, fn);
  queues.set(key, next.catch(() => {}));
  return next;
}

async function audit(req, action, detail = '') {
  const line = `${new Date().toISOString()}\t${req.ip}\t${action}\t${String(detail).replace(/[\r\n\t]+/g, ' ').slice(0, 300)}\n`;
  console.log(`[audit] ${line.trim()}`);
  await fsp.appendFile(AUDIT_FILE, line, { mode: 0o600 }).catch(() => {});
}

async function recentAudit(limit) {
  try {
    const text = await fsp.readFile(AUDIT_FILE, 'utf8');
    return text.trim().split('\n').slice(-limit).reverse().map((line) => {
      const [time, ip, action, detail] = line.split('\t');
      return { time, ip, action, detail };
    });
  } catch {
    return [];
  }
}

function readJsonSync(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

let savedContent = readJsonSync(CONTENT_FILE, null);
let savedAt = null;
if (savedContent) {
  try {
    savedAt = fs.statSync(CONTENT_FILE).mtime.toISOString();
  } catch {
    // Leave savedAt empty.
  }
}

// ---------------------------------------------------------------------------
// Server-side rendering bundle
// ---------------------------------------------------------------------------

let ssr = null;
let template = '';

async function loadBuildOutput() {
  try {
    template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  } catch {
    template = '';
  }
  try {
    ssr = await import(`${pathToFileURL(SSR_ENTRY).href}?t=${Date.now()}`);
  } catch (err) {
    ssr = null;
    if (template) console.error('[ssr] Could not load dist-server/entry-server.js; pages will render in the browser only.', err.message);
  }
}

// The template is read synchronously inside loadBuildOutput; the server bundle
// loads asynchronously and requests wait for it (see the middleware below).
let buildReady = loadBuildOutput();

// Safety net: if the host started the app without running `npm run build`,
// build it now (Vite only, no type check) and switch over when it's done.
let building = false;
function buildInBackground() {
  if (building || template) return;
  const vite = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
  if (!fs.existsSync(vite)) {
    console.error('[server] The site is not built and Vite is not installed. Set the build command to `npm run build`.');
    return;
  }
  building = true;
  console.log('[server] The site is not built yet; building it now…');
  const run = (args) =>
    new Promise((resolve) => {
      const child = spawn(process.execPath, [vite, ...args], { cwd: ROOT, stdio: 'inherit' });
      child.on('exit', (code) => resolve(code === 0));
      child.on('error', (err) => {
        console.error('[server] Build could not start:', err.message);
        resolve(false);
      });
    });
  run(['build'])
    .then((ok) => ok && run(['build', '--ssr', 'src/entry-server.tsx', '--outDir', 'dist-server']))
    .then(async (ok) => {
      buildReady = loadBuildOutput();
      await buildReady;
      building = false;
      console.log(ok && template ? '[server] Build finished; the site is live.' : '[server] Build failed; see the log above.');
    });
}

if (!template) buildInBackground();

function scriptJson(value) {
  return JSON.stringify(value ?? null)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function siteOrigin(req) {
  const configured = savedContent?.seo?.siteUrl;
  if (typeof configured === 'string' && /^https?:\/\/[a-z0-9.-]+(:\d+)?$/i.test(configured)) return configured;
  return `${req.protocol}://${req.get('host')}`;
}

// ---------------------------------------------------------------------------
// App and security headers
// ---------------------------------------------------------------------------

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());
app.use((req, res, next) => {
  buildReady.then(() => next(), next);
});

// `forMeta` drops frame-ancestors, which browsers ignore in a <meta> tag
// (X-Frame-Options covers framing instead).
function contentSecurityPolicy(nonce, secure, forMeta = false) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
    // googletagmanager / tagassistant: Google Tag Assistant's debug badge (tag testing).
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://tagassistant.google.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com https://tagassistant.google.com https://*.doubleclick.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(forMeta ? [] : ["frame-ancestors 'self'"]),
    ...(secure ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
}

app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  });
  if (req.secure) res.set('Strict-Transport-Security', 'max-age=31536000');
  next();
});

// Canonical host: force HTTPS and pick www / non-www to match the Site URL.
app.use((req, res, next) => {
  const host = req.get('host') || '';
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  if (!isLocal && req.get('x-forwarded-proto') === 'http') {
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  }
  const configured = savedContent?.seo?.siteUrl;
  if (!isLocal && typeof configured === 'string' && configured) {
    try {
      const want = new URL(configured).host;
      if (want !== host && want.replace(/^www\./, '') === host.replace(/^www\./, '')) {
        return res.redirect(301, `${new URL(configured).origin}${req.originalUrl}`);
      }
    } catch {
      // Ignore a malformed Site URL; sanitizeContent prevents saving one.
    }
  }
  next();
});

// Old WordPress and hacked-site URLs: answer "410 Gone" so Google drops them
// quickly instead of keeping spam pages indexed.
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (p === '/index.html') return res.redirect(301, '/');
  if (
    /\.(php\d?|aspx?|jsp|cgi|pl|env|git|sql|bak|old|ini|log|sh|html?|xml\.gz)$/.test(p) ||
    /^\/(wp-|wordpress|xmlrpc|cgi-bin|phpmyadmin|\.(?!well-known))/.test(p) ||
    /\/(feed|trackback)\/?$/.test(p)
  ) {
    return res.status(410).type('text/plain').set('X-Robots-Tag', 'noindex').send('410 Gone');
  }
  // One canonical URL per page: /about/ -> /about
  if (p.length > 1 && p.endsWith('/') && !p.startsWith('/api/')) {
    const q = req.originalUrl.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, '') + q);
  }
  next();
});

// ---------------------------------------------------------------------------
// Static files
// ---------------------------------------------------------------------------

app.use(
  express.static(DIST, {
    index: false,
    dotfiles: 'ignore',
    setHeaders(res, file) {
      if (file.includes(`${path.sep}assets${path.sep}`)) res.set('Cache-Control', 'public, max-age=31536000, immutable');
      else res.set('Cache-Control', 'public, max-age=86400');
    },
  }),
);

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
app.use('/uploads', (req, res, next) => (IMAGE_EXT.test(req.path) ? next() : res.status(404).end()));
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    index: false,
    dotfiles: 'ignore',
    fallthrough: false,
    setHeaders(res) {
      res.set({
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Security-Policy': "default-src 'none'; img-src 'self'; sandbox",
      });
    },
  }),
);

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

const api = express.Router();

api.use((req, res, next) => {
  res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
  // Block cross-site requests: state-changing calls must come from this site.
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const origin = req.get('origin');
    if (origin) {
      try {
        if (new URL(origin).host !== req.get('host')) return res.status(403).json({ error: 'Cross-site request blocked.' });
      } catch {
        return res.status(403).json({ error: 'Cross-site request blocked.' });
      }
    }
  }
  next();
});

function requireAdmin(req, res, next) {
  if (!validSession(readCookie(req, SESSION_COOKIE))) return res.status(401).json({ error: 'Please sign in again.' });
  // Extra CSRF guard on top of SameSite=Strict cookies.
  if (req.method !== 'GET' && req.get('x-requested-with') !== 'signage-admin') {
    return res.status(403).json({ error: 'Request blocked.' });
  }
  next();
}

const json = (limit) => express.json({ limit, strict: true });

api.get('/content', (req, res) => {
  res.json({ content: savedContent, savedAt });
});

api.get('/session', (req, res) => {
  res.json({
    configured: ADMIN_READY,
    twoFactor: !!TOTP_KEY,
    authenticated: validSession(readCookie(req, SESSION_COOKIE)),
  });
});

api.post('/login', json('10kb'), async (req, res) => {
  const ip = req.ip;
  if (!ADMIN_READY) return res.status(503).json({ error: 'Admin is not set up yet. Add an ADMIN_PASSWORD (12+ characters) in the hosting environment variables.' });
  if (loginFailuresByIp.blocked(ip) || loginFailuresGlobal.blocked('all')) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
  }
  const { username, password, code } = req.body || {};
  // Check both before deciding so response time doesn't reveal which one was wrong.
  const typedPassword = cleanSecret(password);
  const userOk = safeEqual(cleanSecret(username).toLowerCase(), ADMIN_USERNAME);
  const passOk = safeEqual(typedPassword, ADMIN_PASSWORD);
  const ok = userOk && passOk;
  const codeOk = ok ? verifyTotp(code) : false;
  if (!ok || !codeOk) {
    loginFailuresByIp.hit(ip);
    loginFailuresGlobal.hit('all');
    // Never log the password itself; just enough to tell a typo from a mismatch.
    const why = ok
      ? 'wrong 2-step code'
      : !userOk
        ? `unknown username "${cleanSecret(username).slice(0, 40)}"`
        : `wrong password (${typedPassword.length === ADMIN_PASSWORD.length ? 'same length as' : 'different length from'} ADMIN_PASSWORD)`;
    await audit(req, 'login-failed', why);
    await new Promise((r) => setTimeout(r, 600));
    return res.status(401).json({ error: ok ? 'That 6-digit code is not valid. Try the current code from your authenticator app.' : 'Wrong username or password.' });
  }
  loginFailuresByIp.reset(ip);
  setSessionCookie(req, res, createSession(), SESSION_HOURS * 3600);
  await audit(req, 'login');
  res.json({ ok: true });
});

api.post('/logout', async (req, res) => {
  setSessionCookie(req, res, '', 0);
  if (validSession(readCookie(req, SESSION_COOKIE))) await audit(req, 'logout');
  res.json({ ok: true });
});

api.put('/content', requireAdmin, json('3mb'), async (req, res) => {
  if (!ssr?.sanitizeContent) return res.status(500).json({ error: 'Server bundle missing. Redeploy the site.' });
  const clean = ssr.sanitizeContent(req.body?.content);
  await withLock('content', async () => {
    if (savedContent) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      await writeJsonAtomic(path.join(HISTORY_DIR, `content-${stamp}.json`), savedContent);
      const old = (await fsp.readdir(HISTORY_DIR)).filter((f) => f.endsWith('.json')).sort().reverse().slice(30);
      await Promise.all(old.map((f) => fsp.unlink(path.join(HISTORY_DIR, f)).catch(() => {})));
    }
    await writeJsonAtomic(CONTENT_FILE, clean);
    savedContent = clean;
    savedAt = new Date().toISOString();
  });
  await audit(req, 'content-saved', req.body?.section || '');
  res.json({ ok: true, content: clean, savedAt });
});

api.get('/history', requireAdmin, async (req, res) => {
  const files = (await fsp.readdir(HISTORY_DIR)).filter((f) => /^content-[\w-]+\.json$/.test(f)).sort().reverse();
  const items = await Promise.all(
    files.map(async (f) => {
      const stat = await fsp.stat(path.join(HISTORY_DIR, f));
      return { id: f.replace(/\.json$/, ''), savedAt: stat.mtime.toISOString(), size: stat.size };
    }),
  );
  res.json({ items });
});

api.post('/history/:id/restore', requireAdmin, async (req, res) => {
  if (!/^content-[\w-]+$/.test(req.params.id)) return res.status(400).json({ error: 'Invalid version.' });
  const snapshot = await readJson(path.join(HISTORY_DIR, `${req.params.id}.json`), null);
  if (!snapshot || !ssr?.sanitizeContent) return res.status(404).json({ error: 'Version not found.' });
  const clean = ssr.sanitizeContent(snapshot);
  await withLock('content', async () => {
    if (savedContent) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      await writeJsonAtomic(path.join(HISTORY_DIR, `content-${stamp}.json`), savedContent);
    }
    await writeJsonAtomic(CONTENT_FILE, clean);
    savedContent = clean;
    savedAt = new Date().toISOString();
  });
  await audit(req, 'content-restored', req.params.id);
  res.json({ ok: true, content: clean, savedAt });
});

// Only real images get through: the file's first bytes decide the type, not
// its name or the browser's claim.
function detectImage(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return 'gif';
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  if (buf.subarray(4, 12).toString('ascii') === 'ftypavif') return 'avif';
  return null;
}

api.post(
  '/upload',
  requireAdmin,
  express.raw({ type: () => true, limit: '8mb' }),
  async (req, res) => {
    const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    const ext = detectImage(buf);
    if (!ext) return res.status(400).json({ error: 'Only JPG, PNG, WebP, GIF or AVIF images can be uploaded.' });
    const base = String(req.query.name || 'image').replace(/\.[^.]*$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image';
    const name = `${base}-${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}.${ext}`;
    await fsp.writeFile(path.join(UPLOADS_DIR, name), buf, { mode: 0o644 });
    await audit(req, 'image-uploaded', name);
    res.json({ url: `/uploads/${name}`, name, size: buf.length });
  },
);

api.get('/media', requireAdmin, async (req, res) => {
  const list = async (dir, prefix) => {
    const files = (await fsp.readdir(dir).catch(() => [])).filter((f) => IMAGE_EXT.test(f));
    const items = await Promise.all(
      files.map(async (f) => {
        const stat = await fsp.stat(path.join(dir, f));
        return { name: f, url: `${prefix}${f}`, size: stat.size, modified: stat.mtime.toISOString() };
      }),
    );
    return items.sort((a, b) => b.modified.localeCompare(a.modified));
  };
  res.json({ uploads: await list(UPLOADS_DIR, '/uploads/'), builtIn: await list(DIST, '/') });
});

api.delete('/media/:name', requireAdmin, async (req, res) => {
  const name = path.basename(req.params.name);
  if (!IMAGE_EXT.test(name) || name !== req.params.name) return res.status(400).json({ error: 'Invalid file.' });
  await fsp.unlink(path.join(UPLOADS_DIR, name)).catch(() => {});
  await audit(req, 'image-deleted', name);
  res.json({ ok: true });
});

const LEAD_FIELDS = {
  quote: { fullName: 200, email: 200, phone: 50, businessName: 200, signType: 100, budget: 100, details: 5000 },
  contact: { name: 200, email: 200, phone: 50, message: 5000 },
};

api.post('/leads', json('32kb'), async (req, res) => {
  const ip = req.ip;
  const { type, fields, page } = req.body || {};
  const allowed = LEAD_FIELDS[type];
  if (!allowed || typeof fields !== 'object' || fields === null) return res.status(400).json({ error: 'Invalid form submission.' });

  // Bots fill the hidden "website" field; pretend it worked and drop it.
  if (typeof fields.website === 'string' && fields.website.trim()) return res.json({ ok: true });

  if (leadsByIp.blocked(ip) || leadsGlobal.blocked('all')) {
    return res.status(429).json({ error: 'Too many submissions. Please call or email us instead.' });
  }

  const clean = {};
  for (const [key, max] of Object.entries(allowed)) {
    const v = fields[key];
    clean[key] = typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max) : '';
  }
  const name = clean.fullName ?? clean.name;
  const message = clean.details ?? clean.message;
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) {
    return res.status(400).json({ error: 'Please fill in your name, a valid email address and your message.' });
  }

  leadsByIp.hit(ip);
  leadsGlobal.hit('all');
  const lead = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    read: false,
    page: typeof page === 'string' ? page.slice(0, 200) : '',
    ip,
    userAgent: String(req.get('user-agent') || '').slice(0, 300),
    fields: clean,
  };
  await withLock('leads', async () => {
    const leads = await readJson(LEADS_FILE, []);
    leads.unshift(lead);
    await writeJsonAtomic(LEADS_FILE, leads.slice(0, 5000));
  });
  console.log(`[leads] new ${type} lead from ${clean.email}`);
  res.json({ ok: true });
});

api.get('/leads', requireAdmin, async (req, res) => {
  res.json({ leads: await readJson(LEADS_FILE, []) });
});

api.patch('/leads/:id', requireAdmin, json('4kb'), async (req, res) => {
  await withLock('leads', async () => {
    const leads = await readJson(LEADS_FILE, []);
    const lead = leads.find((l) => l.id === req.params.id);
    if (lead) {
      lead.read = !!req.body?.read;
      await writeJsonAtomic(LEADS_FILE, leads);
    }
  });
  res.json({ ok: true });
});

api.delete('/leads/:id', requireAdmin, async (req, res) => {
  await withLock('leads', async () => {
    const leads = await readJson(LEADS_FILE, []);
    await writeJsonAtomic(LEADS_FILE, leads.filter((l) => l.id !== req.params.id));
  });
  await audit(req, 'lead-deleted', req.params.id);
  res.json({ ok: true });
});

api.get('/status', requireAdmin, async (req, res) => {
  let writable = true;
  try {
    await fsp.access(DATA_DIR, fs.constants.W_OK);
  } catch {
    writable = false;
  }
  const leads = await readJson(LEADS_FILE, []);
  const uploads = (await fsp.readdir(UPLOADS_DIR).catch(() => [])).filter((f) => IMAGE_EXT.test(f));
  res.json({
    dataDir: DATA_DIR,
    writable,
    // Data inside the deployed code folder would be wiped by the next redeploy.
    dataInsideApp: DATA_DIR.startsWith(ROOT + path.sep) && !process.env.DATA_DIR,
    serverRendering: !!ssr,
    twoFactor: !!TOTP_KEY,
    savedAt,
    leads: leads.length,
    unreadLeads: leads.filter((l) => !l.read).length,
    uploads: uploads.length,
    node: process.version,
    activity: await recentAudit(25),
  });
});

api.use((req, res) => res.status(404).json({ error: 'Not found.' }));

app.use('/api', api);

// ---------------------------------------------------------------------------
// SEO files
// ---------------------------------------------------------------------------

function mergedContent() {
  return ssr ? ssr.mergeContent(savedContent) : null;
}

app.get('/robots.txt', (req, res) => {
  if (!ssr) return res.type('text/plain').send('User-agent: *\nAllow: /\n');
  res.type('text/plain').set('Cache-Control', 'public, max-age=3600').send(ssr.buildRobots(siteOrigin(req)));
});

app.get('/sitemap.xml', (req, res) => {
  if (!ssr) return res.status(404).end();
  const lastmod = (savedAt || new Date().toISOString()).slice(0, 10);
  res.type('application/xml').set('Cache-Control', 'public, max-age=3600').send(ssr.buildSitemap(mergedContent(), siteOrigin(req), lastmod));
});

app.get(['/llms.txt', '/llms-full.txt'], (req, res) => {
  if (!ssr) return res.status(404).end();
  const full = req.path === '/llms-full.txt';
  res.type('text/plain; charset=utf-8').set('Cache-Control', 'public, max-age=3600').send(ssr.buildLlmsTxt(mergedContent(), siteOrigin(req), full));
});

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

app.get('*', (req, res) => {
  if (!template) {
    buildInBackground();
    return res
      .status(200)
      .set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' })
      .type('html')
      .send('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="15"><title>Signage Crafting</title><body style="font-family:system-ui,sans-serif;background:#080c0d;color:#fff;display:grid;place-items:center;height:100vh;margin:0"><p>We\u2019re updating the website. This page will refresh in a few seconds.</p>');
  }

  const nonce = crypto.randomBytes(16).toString('base64');
  const isAdmin = req.path === '/admin' || req.path.startsWith('/admin/');
  let headHtml = '';
  let appHtml = '';
  let status = 200;

  if (isAdmin) {
    headHtml = '<title>Admin | Signage Crafting</title>\n    <meta name="robots" content="noindex, nofollow" />';
    res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
  } else if (ssr) {
    try {
      ({ appHtml, headHtml, status } = ssr.render(req.originalUrl, savedContent, siteOrigin(req)));
    } catch (err) {
      console.error('[ssr] render failed for', req.originalUrl, err);
      headHtml = '';
      appHtml = '';
    }
    res.set('Cache-Control', 'no-cache');
  }

  let html = template;
  if (headHtml) html = html.replace(/<!--head-defaults-->[\s\S]*?<!--\/head-defaults-->/, headHtml);
  html = html
    .replace('<!--app-html-->', appHtml)
    .replace('</head>', `<script>window.__SITE_CONTENT__=${scriptJson(savedContent)}</script>\n  </head>`);

  const adsId = savedContent?.googleAds?.id;
  if (typeof adsId === 'string' && /^AW-\d{5,15}$/.test(adsId) && adsId !== DEFAULT_ADS_ID) {
    html = html.split(DEFAULT_ADS_ID).join(adsId);
  }
  html = html.replace(/<script(?![^>]*\bnonce=)/g, `<script nonce="${nonce}"`);
  // Hostinger's CDN replaces the Content-Security-Policy header with its own,
  // so also put the policy in the page. It must come before the first script.
  html = html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(nonce, req.secure, true)}" />`);

  res.set('Content-Security-Policy', contentSecurityPolicy(nonce, req.secure));
  res.status(status).type('html').send(html);
});

// Never leak stack traces to visitors.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('[server]', err);
  const message = status === 413 ? 'That file or request is too large.' : status < 500 ? 'Invalid request.' : 'Something went wrong.';
  if (req.path.startsWith('/api/')) return res.status(status).json({ error: message });
  res.status(status).type('text/plain').send(message);
});

process.on('unhandledRejection', (err) => console.error('[server] unhandled rejection', err));
process.on('uncaughtException', (err) => {
  console.error('[server] uncaught exception', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`[server] Signage Crafting running on port ${PORT}`);
  console.log(`[server] Data folder: ${DATA_DIR}`);
  console.log(`[server] Admin: ${ADMIN_READY ? `enabled for "${ADMIN_USERNAME}"${TOTP_KEY ? ' with 2-step verification' : ''}` : 'disabled (set ADMIN_PASSWORD)'}`);
});
