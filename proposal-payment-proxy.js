import express from 'express';

const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const MAX_RESPONSE_BYTES = 16 * 1024 * 1024;

// Relay only public, token-bound order pages. Staff APIs, keys and webhooks
// remain on the proposal server; no browser credentials are forwarded.
export function createProposalPaymentProxy({
  upstream = 'https://proposal.controvallc.com',
  siteOrigin = (req) => `${req.protocol}://${req.get('host')}`,
} = {}) {
  const target = new URL(upstream);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname);
  if (target.username || target.password || target.pathname !== '/' || target.search || target.hash ||
      (target.protocol !== 'https:' && !(local && target.protocol === 'http:'))) {
    throw new Error('PROPOSAL_PAYMENTS_ORIGIN must be an HTTPS origin (or loopback for local testing).');
  }

  const router = express.Router();
  const attempts = new Map();
  const pageRoutes = ['/order/:token', '/payments/q/:token'];
  const checkoutRoutes = pageRoutes.map((route) => `${route}/checkout`);
  const headers = {
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'strict-origin',
    'X-Robots-Tag': 'noindex, nofollow',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
  };
  const fail = (res, status, message) => res.status(status).set(headers).type('html').send(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Your order | Signage Crafting</title><body style="margin:0;background:#f6f4f0;color:#17201e;font:16px/1.6 system-ui,sans-serif"><main style="max-width:600px;margin:10vh auto;padding:32px"><h1>Your signage order</h1><p>${message}</p><a href="/contact" style="color:#a83108">Contact Signage Crafting</a></main></body></html>`,
  );

  function check(req, res, next) {
    res.set(headers);
    if (!TOKEN.test(req.params.token)) return fail(res, 404, 'Open the full order link from your proposal email or PDF.');
    if (req.originalUrl.length > 1500) return fail(res, 400, 'This order link is invalid. Open it again from your proposal.');
    if (req.method === 'POST') {
      if (req.get('sec-fetch-site') === 'cross-site' || (req.get('origin') && req.get('origin') !== siteOrigin(req))) {
        return fail(res, 403, 'Open the order link on this website before continuing to payment.');
      }
      if (!req.is('application/x-www-form-urlencoded')) return fail(res, 415, 'Submit your selection using the order page.');
      const at = Date.now();
      const ip = req.ip || 'unknown';
      const recent = (attempts.get(ip) || []).filter((time) => at - time < 60000);
      if (recent.length >= 20) return fail(res, 429, 'Too many checkout attempts. Please wait a minute and try again.');
      attempts.set(ip, [...recent, at]);
      for (const [key, times] of attempts) if (at - times.at(-1) >= 60000) attempts.delete(key);
    }
    next();
  }

  async function relay(req, res) {
    try {
      const url = new URL(`/payments/q/${req.params.token}${req.method === 'POST' ? '/checkout' : ''}`, target);
      url.search = new URL(req.originalUrl, 'http://localhost').search;
      const requestHeaders = { Accept: 'text/html' };
      if (req.method === 'POST') {
        requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        if (req.get('origin')) requestHeaders.Origin = req.get('origin');
      }
      const response = await fetch(url, {
        method: req.method, headers: requestHeaders, redirect: 'manual',
        body: req.method === 'POST' ? req.body : undefined,
        signal: AbortSignal.timeout(30000),
      });
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        const destination = new URL(location || '', target);
        // The payment backend checks its provider too; keep that boundary here.
        if (!location || destination.protocol !== 'https:' || destination.hostname !== 'checkout.stripe.com' || destination.username || destination.password) {
          await response.body?.cancel();
          return fail(res, 502, 'Secure checkout could not be opened. Please retry or contact the team.');
        }
        await response.body?.cancel();
        return res.redirect(303, destination.href);
      }
      if (!response.headers.get('content-type')?.startsWith('text/html')) {
        await response.body?.cancel();
        return fail(res, 502, 'The order service is unavailable. Please retry shortly.');
      }
      const reader = response.body?.getReader();
      const chunks = [];
      let length = 0;
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > MAX_RESPONSE_BYTES) {
            await reader.cancel();
            return fail(res, 502, 'The order could not be loaded. Please contact the team.');
          }
          chunks.push(value);
        }
      }
      for (const name of ['content-security-policy']) {
        const value = response.headers.get(name);
        if (value) res.set(name, value);
      }
      res.status(response.status).type('html').send(Buffer.concat(chunks));
    } catch {
      fail(res, 502, 'The order service is unavailable. Please retry shortly or contact the team.');
    }
  }

  router.get(pageRoutes, check, relay);
  router.post(checkoutRoutes, check, express.raw({ type: 'application/x-www-form-urlencoded', limit: '8kb' }), relay);
  router.all([...pageRoutes, ...checkoutRoutes], (req, res) => fail(res, 405, 'Use your proposal link to view the order and continue to payment.'));
  return router;
}
