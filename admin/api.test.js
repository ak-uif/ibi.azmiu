import assert from 'node:assert/strict';
import test from 'node:test';
import { api, ApiError } from './api.js';

test('expired admin session notifies the panel and preserves a friendly error', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  let expired = 0;
  globalThis.window = { dispatchEvent: () => { expired++; } };
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ message: 'internal text' }) });
  try {
    await assert.rejects(api.get('/api/admin/programs'), (error) =>
      error instanceof ApiError && error.status === 401 && error.message === 'Giriş tələb olunur.');
    assert.equal(expired, 1);
  } finally { globalThis.fetch = originalFetch; globalThis.window = originalWindow; }
});

test('server validation errors reach the form without leaking raw response details', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 400, json: async () => ({ message: 'titleAz: must not be blank' }) });
  try {
    await assert.rejects(api.get('/api/admin/programs'), (error) =>
      error instanceof ApiError && error.status === 400 && error.message.includes('titleAz'));
  } finally { globalThis.fetch = originalFetch; }
});

test('a CSRF rejection checks whether the session expired', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  let expired = 0;
  globalThis.window = { dispatchEvent: () => { expired++; } };
  globalThis.fetch = async (url) => url.endsWith('/api/auth/me')
    ? { ok: false, status: 401, json: async () => ({}) }
    : { ok: false, status: 403, json: async () => ({}) };
  try {
    await assert.rejects(api.get('/api/admin/programs'), (error) => error.status === 403);
    assert.equal(expired, 1);
  } finally { globalThis.fetch = originalFetch; globalThis.window = originalWindow; }
});

test('CV download uses the authenticated session and returns a blob', async () => {
  const originalFetch = globalThis.fetch;
  let options;
  const pdf = new Blob(['%PDF-test'], { type: 'application/pdf' });
  globalThis.fetch = async (_, request) => {
    options = request;
    return { ok: true, status: 200, blob: async () => pdf };
  };
  try {
    assert.equal(await api.download('/api/admin/mentor-applications/7/cv'), pdf);
    assert.equal(options.credentials, 'include');
    assert.equal(options.cache, 'no-store');
  } finally { globalThis.fetch = originalFetch; }
});

test('login and logout obtain CSRF tokens and keep the browser session', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/api/auth/csrf')) return { ok: true, status: 200,
      json: async () => ({ token: 'test-csrf' }) };
    if (url.endsWith('/api/auth/login')) return { ok: true, status: 200,
      json: async () => ({ username: 'test-admin' }) };
    return { ok: true, status: 204 };
  };
  try {
    assert.deepEqual(await api.mutate('/api/auth/login', 'POST',
      { username: 'test-admin', password: 'test-only' }), { username: 'test-admin' });
    assert.equal(await api.mutate('/api/auth/logout', 'POST'), null);
    assert.equal(calls.filter(({ url }) => url.endsWith('/api/auth/csrf')).length, 2);
    for (const { options } of calls) assert.equal(options.credentials, 'include');
    assert.equal(calls[1].options.headers['X-CSRF-TOKEN'], 'test-csrf');
    assert.deepEqual(JSON.parse(calls[1].options.body),
      { username: 'test-admin', password: 'test-only' });
    assert.equal(calls[3].options.headers['X-CSRF-TOKEN'], 'test-csrf');
    assert.equal(calls[3].options.body, undefined);
  } finally { globalThis.fetch = originalFetch; }
});

test('invalid login does not announce an expired session', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  let expired = 0;
  globalThis.window = { dispatchEvent: () => { expired++; } };
  globalThis.fetch = async (url) => url.endsWith('/api/auth/csrf')
    ? { ok: true, status: 200, json: async () => ({ token: 'test-csrf' }) }
    : { ok: false, status: 401, json: async () => ({ message: 'wrong credentials' }) };
  try {
    await assert.rejects(api.mutate('/api/auth/login', 'POST',
      { username: 'wrong', password: 'wrong' }), (error) => error.status === 401);
    assert.equal(expired, 0);
  } finally { globalThis.fetch = originalFetch; globalThis.window = originalWindow; }
});
