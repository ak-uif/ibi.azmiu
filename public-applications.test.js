import test from 'node:test';
import assert from 'node:assert/strict';
import { createApplicationSubmitter } from './public-applications.js';

const cases = [
  ['program', 'programs', { fullName: 'A', email: 'a@example.com', phone: '1234567', selectedProgram: 'Example Program', faculty: 'Architecture' }],
  ['event', 'events', { fullName: 'A', email: 'a@example.com', phone: '1234567', eventTitle: 'Example Event', format: 'online' }],
  ['mentor', 'mentors', { fullName: 'A', email: 'a@example.com', phone: '1234567', companyRole: 'Designer', expertise: 'design', linkedin: 'https://linkedin.com/in/a', bio: 'Experience' }],
  ['idea', 'startups', { fullName: 'A', email: 'a@example.com', phone: '1234567', startupTitle: 'Idea', stage: 'mvp', description: 'Text' }],
];

test('all four forms send every field to their matching endpoint', async () => {
  for (const [type, path, payload] of cases) {
    let call;
    const submitter = createApplicationSubmitter('http://localhost:8080/', async (url, options) => {
      call = { url, options };
      return { ok: true, status: 201, json: async () => ({ status: 'submitted' }) };
    });
    assert.deepEqual(await submitter.submit(type, Object.entries(payload)), { status: 'submitted' });
    assert.equal(call.url, `http://localhost:8080/api/public/applications/${path}`);
    assert.equal(call.options.method, 'POST');
    if (type === 'mentor') {
      assert.ok(call.options.body instanceof FormData);
      assert.equal(call.options.headers['Content-Type'], undefined);
      assert.deepEqual(JSON.parse(await call.options.body.get('application').text()), payload);
      assert.equal(call.options.body.has('cv'), false);
    } else {
      assert.deepEqual(JSON.parse(call.options.body), payload);
    }
  }
});

test('mentor CV is attached only when selected and a confirmed save is required', async () => {
  const cv = new File(['%PDF-1.4\n%%EOF'], 'resume.pdf', { type: 'application/pdf' });
  let body;
  const submitter = createApplicationSubmitter('', async (_, options) => {
    body = options.body;
    return { ok: true, status: 201, json: async () => ({ status: 'submitted' }) };
  });
  await submitter.submit('mentor', [['fullName', 'A'], ['cv', cv]]);
  assert.equal(body.get('cv').name, 'resume.pdf');
  assert.equal((await body.get('cv').text()), await cv.text());
  assert.deepEqual(JSON.parse(await body.get('application').text()), { fullName: 'A' });
});

test('oversized CV is rejected before request and backend upload errors propagate', async () => {
  let calls = 0;
  const submitter = createApplicationSubmitter('', async () => { calls++; return { ok: false, status: 400,
    json: async () => ({ code: 'invalid_upload', message: 'CV file content is invalid' }) }; });
  const large = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' });
  await assert.rejects(submitter.submit('mentor', [['cv', large]]), { code: 'file_too_large' });
  assert.equal(calls, 0);
  const malformed = new File(['bad'], 'bad.pdf', { type: 'application/pdf' });
  await assert.rejects(submitter.submit('mentor', [['cv', malformed]]), { code: 'invalid_upload' });
  assert.equal(calls, 1);
});

test('success requires a confirmed 201 response', async () => {
  const submitter = createApplicationSubmitter('', async () => ({ ok: true, status: 200, json: async () => ({ status: 'submitted' }) }));
  await assert.rejects(submitter.submit('program', []), { code: 'server_error' });
});

test('validation and network failures reject without claiming success', async () => {
  const invalid = createApplicationSubmitter('', async () => ({
    ok: false, status: 400, json: async () => ({ code: 'validation_failed', message: 'email: must be valid' }),
  }));
  await assert.rejects(invalid.submit('program', []), { code: 'validation_failed', message: 'email: must be valid' });
  const offline = createApplicationSubmitter('', async () => { throw new Error('offline'); });
  await assert.rejects(offline.submit('event', []));
  assert.equal(offline.inFlight, false);
});

test('honeypot field is sent and rate-limit feedback reaches the form', async () => {
  let body;
  const submitter = createApplicationSubmitter('', async (_, options) => {
    body = options.body;
    return { ok: false, status: 429, json: async () => ({ code: 'rate_limited', message: 'Try later' }) };
  });
  await assert.rejects(submitter.submit('program', [['fullName', 'A'], ['websiteConfirm', '']]),
    { code: 'rate_limited' });
  assert.equal(JSON.parse(body).websiteConfirm, '');
  assert.equal(submitter.inFlight, false);
});

test('repeated click cannot create a second request while the first is pending', async () => {
  let resolve;
  let calls = 0;
  const submitter = createApplicationSubmitter('', async () => {
    calls++;
    return new Promise((done) => { resolve = done; });
  });
  const first = submitter.submit('idea', []);
  await assert.rejects(submitter.submit('idea', []), { code: 'in_progress' });
  assert.equal(calls, 1);
  resolve({ ok: true, status: 201, json: async () => ({ status: 'submitted' }) });
  await first;
  assert.equal(submitter.inFlight, false);
});
