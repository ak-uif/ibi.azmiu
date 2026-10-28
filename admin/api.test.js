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
