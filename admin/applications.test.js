import assert from 'node:assert/strict';
import test from 'node:test';
import { ApplicationPanel, applicationQuery } from './applications.js';

function client() {
  const calls = [];
  const rows = [{ type: 'mentor', id: 7, fullName: 'Test Mentor', title: 'Designer',
    status: 'NEW', createdAt: '2026-10-21T09:00:00Z', hasCv: true }];
  return {
    calls,
    async get(path) {
      calls.push(['get', path]);
      if (path.includes('/mentor/7')) return { type: 'mentor', id: 7, fullName: 'Test Mentor',
        email: 'test@example.com', phone: '+994 50 000 00 00', companyRole: 'Designer',
        expertise: 'Design', linkedin: '', bio: 'Experience', status: 'NEW',
        createdAt: '2026-10-21T09:00:00Z', hasCv: true };
      return { items: rows, total: 11, totalPages: 2, page: 0, size: 10 };
    },
    async mutate(path, method, body) {
      calls.push(['mutate', path, method, body]);
      return { type: 'mentor', id: 7, fullName: 'Test Mentor', status: body.status,
        createdAt: '2026-10-21T09:00:00Z', hasCv: true };
    },
    async download(path) {
      calls.push(['download', path]);
      return new Blob(['test']);
    }
  };
}

test('lists applications, filters, searches, and paginates with the selected query', async () => {
  const api = client();
  const panel = new ApplicationPanel(() => {}, api);
  await panel.load();
  assert.match(panel.markup(), /Test Mentor/);
  assert.match(panel.markup(), /11 müraciət/);
  await panel.selectType('mentor');
  await panel.setStatus('NEW');
  await panel.setSearch('Test Mentor');
  await panel.setSort('oldest');
  await panel.setPage(1);
  const query = new URLSearchParams(api.calls.at(-1)[1].split('?')[1]);
  assert.equal(query.get('type'), 'mentor');
  assert.equal(query.get('status'), 'NEW');
  assert.equal(query.get('search'), 'Test Mentor');
  assert.equal(query.get('sort'), 'oldest');
  assert.equal(query.get('page'), '1');
  assert.equal(query.get('size'), '10');
  assert.equal(new URLSearchParams(applicationQuery(panel.filters, false)).has('page'), false);
});

test('shows detail and saves status only after the backend confirms it', async () => {
  const api = client();
  const panel = new ApplicationPanel(() => {}, api);
  await panel.load();
  await panel.openDetail('mentor', 7);
  assert.match(panel.markup(), /test@example.com/);
  assert.match(panel.markup(), /CV-ni endir/);
  await panel.changeStatus('REVIEWING');
  assert.equal(panel.detail.status, 'REVIEWING');
  assert.match(panel.markup(), /statusu yeniləndi/);
  assert.deepEqual(api.calls.find(([kind]) => kind === 'mutate').slice(1),
    ['/api/admin/applications/mentor/7/status', 'PATCH', { status: 'REVIEWING' }]);
  assert.ok(await panel.downloadCv());
  assert.equal(api.calls.at(-1)[1], '/api/admin/mentor-applications/7/cv');
  assert.ok(await panel.exportCsv());
  const exportUrl = api.calls.at(-1)[1];
  assert.match(exportUrl, /^\/api\/admin\/applications\/export\?/);
  assert.ok(!exportUrl.includes('page='));
  panel.closeDetail();
  assert.doesNotMatch(panel.markup(), /test@example.com/);
});

test('shows loading, empty, and error states and does not report false success', async () => {
  let resolve;
  const panel = new ApplicationPanel(() => {}, {
    get: () => new Promise((done) => { resolve = done; }),
    mutate: async () => { throw new Error('Save failed'); }
  });
  const pending = panel.load();
  assert.match(panel.markup(), /Müraciətlər yüklənir/);
  resolve({ items: [], total: 0, totalPages: 0 });
  await pending;
  assert.match(panel.markup(), /Müraciət tapılmadı/);
  panel.detail = { type: 'mentor', id: 1, fullName: 'Test', status: 'NEW', hasCv: false };
  await panel.changeStatus('ACCEPTED');
  assert.match(panel.markup(), /Save failed/);
  assert.doesNotMatch(panel.markup(), /statusu yeniləndi/);
  assert.match(panel.markup(), /CV əlavə edilməyib/);
  const failing = new ApplicationPanel(() => {}, { get: async () => { throw new Error('Network down'); } });
  await failing.load();
  assert.match(failing.markup(), /Network down/);
  assert.match(failing.markup(), /Yenidən yoxla/);
});

test('escapes application data in list and detail views', async () => {
  const panel = new ApplicationPanel(() => {}, {
    get: async () => ({ items: [{ type: 'startup', id: 3, fullName: '<script>',
      title: '<img>', status: 'NEW', createdAt: '' }], total: 1, totalPages: 1 })
  });
  await panel.load();
  assert.doesNotMatch(panel.markup(), /<script>|<img>/);
  assert.match(panel.markup(), /&lt;script&gt;/);
});

test('logout discards late application details and private downloads', async () => {
  let resolveDetail;
  let resolveDownload;
  const panel = new ApplicationPanel(() => {}, {
    get: () => new Promise((done) => { resolveDetail = done; }),
    download: () => new Promise((done) => { resolveDownload = done; })
  });
  const detail = { type: 'mentor', id: 7, fullName: 'Private', hasCv: true };
  const pendingDetail = panel.openDetail('mentor', 7);
  panel.cancel();
  resolveDetail(detail);
  await pendingDetail;
  assert.equal(panel.detail, null);

  panel.detail = detail;
  const pendingCv = panel.downloadCv();
  panel.cancel();
  resolveDownload(new Blob(['private CV']));
  assert.equal(await pendingCv, null);
  assert.equal(panel.detail, null);

  const pendingCsv = panel.exportCsv();
  panel.cancel();
  resolveDownload(new Blob(['private applications']));
  assert.equal(await pendingCsv, null);
  assert.equal(panel.error, '');
});

test('failed CV and CSV downloads show errors without returning files', async () => {
  const panel = new ApplicationPanel(() => {}, { download: async () => { throw new Error('Download failed'); } });
  panel.detail = { type: 'mentor', id: 7, hasCv: true };
  assert.equal(await panel.downloadCv(), null);
  assert.match(panel.markup(), /Download failed/);
  assert.equal(await panel.exportCsv(), null);
  assert.match(panel.markup(), /Download failed/);
});
