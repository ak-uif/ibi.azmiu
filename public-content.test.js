import test from 'node:test';
import assert from 'node:assert/strict';
import { contentTypes, contentStateMarkup, createContentStore, mapContent, splitPrograms } from './public-content.js';

test('all six sections start loading, then show empty API results without fallback records', async () => {
  const calls = [];
  const store = createContentStore('http://localhost:8080/', async (url) => {
    calls.push(url);
    return { ok: true, json: async () => [] };
  });
  for (const type of contentTypes) {
    assert.equal(store.state[type].status, 'loading');
    await store.load(type);
    assert.deepEqual(store.state[type], { status: 'ready', rows: [] });
  }
  assert.deepEqual(calls, contentTypes.map((type) => `http://localhost:8080/api/public/${type}`));
});

test('API failure is isolated to its own section and never retains stale content', async () => {
  let fail = false;
  const store = createContentStore('', async () => fail
    ? { ok: false, status: 503 }
    : { ok: true, json: async () => [{ id: 1, name: 'Partner' }] });
  await store.load('partners');
  assert.equal(store.state.partners.rows.length, 1);
  fail = true;
  await store.load('partners');
  assert.deepEqual(store.state.partners, { status: 'error', rows: [] });
  assert.equal(store.state.news.status, 'loading');
});

test('content mapping retains both languages and escapes HTML and unsafe links', () => {
  const program = mapContent('programs', { id: 3, status: 'active', titleAz: '<script>', titleEn: 'English' });
  assert.equal(program.title.az, '&lt;script&gt;');
  assert.equal(program.title.en, 'English');
  assert.equal(mapContent('mentors', { id: 4, name: 'Mentor', linkedinUrl: 'javascript:alert(1)' }).socials.linkedin, '');
});

test('loading, empty and error messages are localized for the public UI', () => {
  for (const status of ['loading', 'empty', 'error']) {
    assert.match(contentStateMarkup(status, 'az'), /role="status"/);
    assert.match(contentStateMarkup(status, 'en'), /role="status"/);
    assert.notEqual(contentStateMarkup(status, 'az'), contentStateMarkup(status, 'en'));
  }
});

test('current program without a period stays in active cards', () => {
  const active = mapContent('programs', { id: 1, status: 'active', titleAz: 'Example' });
  const past = mapContent('programs', { id: 2, status: 'active', periodAz: '2025' });
  assert.deepEqual(splitPrograms([active, past]), { current: [active], past: [past] });
});
