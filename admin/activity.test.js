import assert from 'node:assert/strict';
import test from 'node:test';
import { ActivityPanel, activityQuery } from './activity.js';

test('loads real entries and applies filters and pagination', async () => {
  const paths = [];
  const client = { get: async (path) => {
    paths.push(path);
    return { items: [{ id: 1, admin: 'akif', action: 'CONTENT_PUBLISHED',
      recordType: 'program', recordId: 12, detail: null, createdAt: '2026-11-08T10:00:00Z' }],
      total: 21, totalPages: 2 };
  } };
  const panel = new ActivityPanel(() => {}, client);
  await panel.load();
  assert.match(panel.markup(), /Qeyd dərc edildi/);
  assert.match(panel.markup(), /akif/);
  assert.match(panel.markup(), /#12/);
  await panel.setFilters({ action: 'CONTENT_PUBLISHED', admin: 'akif', from: '2026-11-01',
    to: '2026-11-08', recordType: 'program', recordId: '12' });
  await panel.setPage(1);
  const params = new URLSearchParams(paths.at(-1).split('?')[1]);
  assert.equal(params.get('action'), 'CONTENT_PUBLISHED');
  assert.equal(params.get('admin'), 'akif');
  assert.equal(params.get('from'), '2026-11-01');
  assert.equal(params.get('to'), '2026-11-08');
  assert.equal(params.get('recordType'), 'program');
  assert.equal(params.get('recordId'), '12');
  assert.equal(params.get('page'), '1');
  assert.equal(new URLSearchParams(activityQuery(panel.filters)).get('size'), '20');
});

test('shows loading, empty and error states without invented history', async () => {
  let resolve;
  const panel = new ActivityPanel(() => {}, { get: () => new Promise((done) => { resolve = done; }) });
  const pending = panel.load();
  assert.match(panel.markup(), /Fəaliyyətlər yüklənir/);
  resolve({ items: [], total: 0, totalPages: 0 });
  await pending;
  assert.match(panel.markup(), /Fəaliyyət tapılmadı/);
  assert.doesNotMatch(panel.markup(), /admin-activity-row/);
  const failing = new ActivityPanel(() => {}, { get: async () => { throw new Error('Network down'); } });
  await failing.load();
  assert.match(failing.markup(), /Network down/);
  assert.match(failing.markup(), /Yenidən yoxla/);
});

test('escapes log fields and discards late responses after logout', async () => {
  let resolve;
  const panel = new ActivityPanel(() => {}, { get: () => new Promise((done) => { resolve = done; }) });
  const pending = panel.load();
  panel.cancel();
  resolve({ items: [{ id: 1, admin: '<script>', action: 'LOGIN',
    recordType: null, recordId: null, detail: null, createdAt: '' }], total: 1, totalPages: 1 });
  await pending;
  assert.equal(panel.data, null);
  panel.data = { items: [{ id: 1, admin: '<script>', action: 'LOGIN',
    recordType: null, recordId: null, detail: null, createdAt: '' }], total: 1, totalPages: 1 };
  assert.match(panel.markup(), /&lt;script&gt;/);
  assert.doesNotMatch(panel.markup(), /<script>/);
});
