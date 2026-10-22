import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import express from 'express';
import { createProposalPaymentProxy } from '../proposal-payment-proxy.js';

const token = 'a'.repeat(43);
async function fixture(t) {
  const calls = [];
  const upstream = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    calls.push({ url: req.url, method: req.method, headers: req.headers, body });
    const query = new URL(req.url, 'http://localhost').searchParams;
    if (query.has('redirect')) {
      res.writeHead(303, { Location: query.get('redirect') });
      return res.end();
    }
    if (query.has('json')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end('{"private":"must not relay"}');
    }
    res.writeHead(query.has('expired') ? 410 : 200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; script-src 'nonce-test'; img-src data:; style-src 'unsafe-inline'",
      'Set-Cookie': 'staff=must-not-forward',
    });
    res.end('<!doctype html><title>Your order</title><form method="post"><input name="sign_0" value="1"></form>');
  });
  await new Promise((resolve) => upstream.listen(0, '127.0.0.1', resolve));
  const app = express();
  app.use(createProposalPaymentProxy({ upstream: `http://127.0.0.1:${upstream.address().port}` }));
  app.use((req, res) => res.sendStatus(404));
  const site = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => site.on('listening', resolve));
  const base = `http://127.0.0.1:${site.address().port}`;
  t.after(async () => {
    await Promise.all([site, upstream].map((server) => new Promise((resolve) => server.close(resolve))));
  });
  const request = (path, init = {}) => fetch(base + path, { redirect: 'manual', ...init });
  return { base, calls, request };
}

test('order and legacy paths relay the opaque token and option preselection without staff credentials', async (t) => {
  const h = await fixture(t);
  for (const prefix of ['/order', '/payments/q']) {
    const response = await h.request(`${prefix}/${token}?sign=0&option=1`, { headers: { Cookie: 'staff=private', Authorization: 'Bearer private' } });
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Your order/);
    assert.equal(h.calls.at(-1).url, `/payments/q/${token}?sign=0&option=1`);
    assert.equal(h.calls.at(-1).headers.cookie, undefined);
    assert.equal(h.calls.at(-1).headers.authorization, undefined);
    assert.equal(response.headers.get('set-cookie'), null);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal(response.headers.get('referrer-policy'), 'strict-origin');
    assert.match(response.headers.get('content-security-policy'), /nonce-test/);
  }
});

test('checkout forwards exact option form and original origin, then relays only a Stripe checkout redirect', async (t) => {
  const h = await fixture(t);
  const body = 'sign_0=1&sign_1=&accept_policies=yes';
  const response = await h.request(`/order/${token}/checkout?redirect=${encodeURIComponent('https://checkout.stripe.com/c/pay/TEST')}`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: h.base }, body,
  });
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), 'https://checkout.stripe.com/c/pay/TEST');
  assert.equal(h.calls[0].body, body);
  assert.equal(h.calls[0].headers.origin, h.base);
  assert.equal(h.calls[0].method, 'POST');
});

test('unrelated hosts and script redirects are not followed or exposed as checkout links', async (t) => {
  const h = await fixture(t);
  for (const target of ['https://example.invalid/pay', 'javascript:alert(1)', 'https://checkout.stripe.com.evil.invalid/pay', 'http://checkout.stripe.com/pay']) {
    const response = await h.request(`/order/${token}?redirect=${encodeURIComponent(target)}`);
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('location'), null);
  }
  assert.equal(h.calls.length, 4);
});

test('invalid tokens, cross-site forms and invalid content types are rejected before upstream access', async (t) => {
  const h = await fixture(t);
  assert.equal((await h.request('/order/invalid')).status, 404);
  for (const headers of [{ Origin: 'https://evil.invalid' }, { 'Sec-Fetch-Site': 'cross-site' }]) {
    assert.equal((await h.request(`/order/${token}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...headers }, body: 'sign_0=0' })).status, 403);
  }
  assert.equal((await h.request(`/order/${token}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 415);
  assert.equal(h.calls.length, 0);
});

test('public order relay never exposes staff APIs or webhook endpoints', async (t) => {
  const h = await fixture(t);
  for (const route of ['/api/admin/proposal-payments', '/api/proposal-payments/webhook', '/payments/q/../settings.json']) {
    assert.equal((await h.request(route)).status, 404);
  }
  assert.equal(h.calls.length, 0);
});

test('checkout attempts are limited by the website client before reaching the shared relay', async (t) => {
  const h = await fixture(t);
  for (let index = 0; index < 20; index++) {
    const response = await h.request(`/order/${token}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: h.base }, body: 'sign_0=0&accept_policies=yes' });
    assert.equal(response.status, 200);
    await response.text();
  }
  assert.equal((await h.request(`/order/${'b'.repeat(43)}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: h.base }, body: 'sign_0=0&accept_policies=yes' })).status, 429);
  assert.equal(h.calls.length, 20);
});

test('expired quote status is retained and unexpected non-HTML data is withheld', async (t) => {
  const h = await fixture(t);
  assert.equal((await h.request(`/order/${token}?expired=1`)).status, 410);
  const response = await h.request(`/order/${token}?json=1`);
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('private'));
});

test('upstream configuration accepts only a clean HTTPS origin or a loopback test origin', () => {
  for (const upstream of ['http://example.invalid', 'https://user:secret@example.invalid', 'https://example.invalid/private', 'https://example.invalid?key=secret']) {
    assert.throws(() => createProposalPaymentProxy({ upstream }));
  }
  assert.doesNotThrow(() => createProposalPaymentProxy({ upstream: 'https://proposal.controvallc.com' }));
});
