import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

// Run after npm run build. Each child uses its own temporary CMS folder and
// Unix socket so these tests never read or write the site's saved content.
async function startServer(t, content) {
  await fs.access(path.join(ROOT, 'dist', 'index.html'));
  await fs.access(path.join(ROOT, 'dist-server', 'entry-server.js'));
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'sc-canonical-'));
  const dataDir = path.join(temporary, 'data');
  const socketPath = path.join(temporary, 'http.sock');
  await fs.mkdir(dataDir);
  if (content !== undefined) await fs.writeFile(path.join(dataDir, 'content.json'), JSON.stringify(content));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: socketPath,
      DATA_DIR: dataDir,
      ADMIN_PASSWORD: '',
      ADMIN_TOTP_SECRET: '',
      SESSION_SECRET: 'canonical-integration-test-session-secret',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
    await fs.rm(temporary, { recursive: true, force: true });
  });
  let output = '';
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Server startup timed out:\n${output}`)), 15000);
    const finish = (error) => {
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve();
    };
    child.stdout.on('data', (chunk) => {
      output += chunk;
      if (output.includes('[server] Signage Crafting running on port')) finish();
    });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.once('error', finish);
    child.once('exit', (code, signal) => finish(new Error(`Server exited (${code ?? signal}):\n${output}`)));
  });

  return (host, requestPath = '/about', protocol = 'https') => new Promise((resolve, reject) => {
    const req = http.get({
      socketPath,
      path: requestPath,
      headers: { Host: host, 'X-Forwarded-Proto': protocol },
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      res.on('error', reject);
    });
    req.setTimeout(15000, () => req.destroy(new Error('HTTP request timed out')));
    req.on('error', reject);
  });
}

function canonical(response, expected) {
  assert.equal(response.status, 200);
  assert.equal(response.headers.location, undefined);
  assert.equal(response.body.match(/<link rel="canonical" href="([^"]+)"/u)?.[1], expected);
}

async function seoUsesOrigin(request, host, origin, protocol = 'https') {
  canonical(await request(host, '/about?ref=search', protocol), `${origin}/about`);
  const robots = await request(host, '/robots.txt', protocol);
  assert.equal(robots.status, 200);
  assert.ok(robots.body.includes(`Sitemap: ${origin}/sitemap.xml`));
  const sitemap = await request(host, '/sitemap.xml', protocol);
  assert.equal(sitemap.status, 200);
  const locations = Array.from(sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/gu), ([, location]) => location);
  assert.ok(locations.length > 5, 'The real SSR sitemap must contain the site pages');
  assert.ok(locations.every((location) => location.startsWith(`${origin}/`)), locations.join('\n'));
}

test('blank Site address redirects www to apex in one hop with the original path and query', async (t) => {
  const request = await startServer(t, { seo: { siteUrl: '' } });
  const originalPath = '/about?utm_source=search&size=48%22';
  for (const protocol of ['https', 'http']) {
    const response = await request('www.signagecrafting.com', originalPath, protocol);
    assert.equal(response.status, 301);
    assert.equal(response.headers.location, `https://signagecrafting.com${originalPath}`);
  }
  canonical(await request('signagecrafting.com', originalPath), 'https://signagecrafting.com/about');
  const httpApex = await request('signagecrafting.com', originalPath, 'http');
  assert.equal(httpApex.status, 301);
  assert.equal(httpApex.headers.location, `https://signagecrafting.com${originalPath}`);
});

test('canonical links, robots and sitemap share the apex fallback', async (t) => {
  const request = await startServer(t, { seo: { siteUrl: '' } });
  await seoUsesOrigin(request, 'signagecrafting.com', 'https://signagecrafting.com');
  for (const requestPath of ['/robots.txt', '/sitemap.xml']) {
    const response = await request('www.signagecrafting.com', requestPath);
    assert.equal(response.status, 301);
    assert.equal(response.headers.location, `https://signagecrafting.com${requestPath}`);
  }
});

test('missing saved content also uses the public apex fallback', async (t) => {
  const request = await startServer(t);
  await seoUsesOrigin(request, 'signagecrafting.com', 'https://signagecrafting.com');
  assert.equal((await request('www.signagecrafting.com')).headers.location, 'https://signagecrafting.com/about');
});

test('an explicit www Site address remains authoritative and normalizes URL casing and default ports', async (t) => {
  const request = await startServer(t, { seo: { siteUrl: 'HTTPS://WWW.SIGNAGECRAFTING.COM:443' } });
  const response = await request('signagecrafting.com', '/about?source=test');
  assert.equal(response.status, 301);
  assert.equal(response.headers.location, 'https://www.signagecrafting.com/about?source=test');
  await seoUsesOrigin(request, 'WWW.SIGNAGECRAFTING.COM', 'https://www.signagecrafting.com');
});

test('an explicit custom domain controls SEO and its www alias without moving unrelated hosts', async (t) => {
  const request = await startServer(t, { seo: { siteUrl: 'https://www.custom.example' } });
  const response = await request('custom.example', '/about?source=test');
  assert.equal(response.status, 301);
  assert.equal(response.headers.location, 'https://www.custom.example/about?source=test');
  await seoUsesOrigin(request, 'www.custom.example', 'https://www.custom.example');
  canonical(await request('signagecrafting.com'), 'https://www.custom.example/about');
  canonical(await request('localhost:3000', '/about', 'http'), 'https://www.custom.example/about');
});

test('configured non-default ports are preserved when redirecting a www alias', async (t) => {
  const request = await startServer(t, { seo: { siteUrl: 'https://www.custom.example:8443' } });
  const response = await request('custom.example:8443', '/about?source=test');
  assert.equal(response.status, 301);
  assert.equal(response.headers.location, 'https://www.custom.example:8443/about?source=test');
  await seoUsesOrigin(request, 'www.custom.example:8443', 'https://www.custom.example:8443');
});

test('local and unrelated deployment hosts retain their own origin when the setting is blank', async (t) => {
  const request = await startServer(t, { seo: { siteUrl: '' } });
  for (const host of ['localhost:3000', 'LOCALHOST:3000', '127.0.0.1:3000', '[::1]:3000']) {
    await seoUsesOrigin(request, host, `http://${host}`, 'http');
  }
  await seoUsesOrigin(request, 'preview.example.net', 'https://preview.example.net');
  const response = await request('preview.example.net', '/about?preview=1', 'http');
  assert.equal(response.status, 301);
  assert.equal(response.headers.location, 'https://preview.example.net/about?preview=1');
});

test('malformed saved Site addresses safely fall back to the current deployment', async (t) => {
  for (const siteUrl of [null, {}, 42, ' ', 'not a URL', 'javascript:alert(1)', 'https://signagecrafting.com/path', 'https://signagecrafting.com:99999', 'https://999.999.999.999']) {
    await t.test(JSON.stringify(siteUrl), async (caseTest) => {
      const request = await startServer(caseTest, { seo: { siteUrl } });
      await seoUsesOrigin(request, 'signagecrafting.com', 'https://signagecrafting.com');
      assert.equal((await request('www.signagecrafting.com')).headers.location, 'https://signagecrafting.com/about');
      await seoUsesOrigin(request, 'preview.example.net', 'https://preview.example.net');
    });
  }
});
