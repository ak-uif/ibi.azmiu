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
    assert.deepEqual(JSON.parse(call.options.body), payload);
  }
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
