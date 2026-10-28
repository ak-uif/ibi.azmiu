import assert from 'node:assert/strict';
import test from 'node:test';
import { contentConfig, payloadFromForm } from './content-config.js';
import { ContentPanel, escapeHtml } from './panel-content.js';

function response(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function fakeForm(config, values = {}) {
  const inputs = Object.fromEntries(config.fields.map(({ key, type }) => [key, {
    value: values[key] ?? (type === 'json' ? '[]' : ''), checked: Boolean(values[key])
  }]));
  const error = { textContent: '' };
  const submit = { disabled: false };
  return {
    elements: { namedItem: (key) => inputs[key] },
    querySelector: (selector) => selector === '#content-form-error' ? error : submit,
    error
  };
}

test('all six content pages use their matching authenticated CRUD APIs', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const calls = [];
  const rows = Object.fromEntries(Object.keys(contentConfig).map((key) => [key, []]));
  globalThis.window = { confirm: () => true, dispatchEvent: () => {} };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/api/auth/csrf')) return response(200, { token: 'test-token' });
    const match = url.match(/\/api\/admin\/([^/]+)(?:\/(\d+))?$/);
    assert.ok(match, `Unexpected path ${url}`);
    const [, slug, rawId] = match;
    const id = Number(rawId);
    if (!options.method || options.method === 'GET') return response(200, rows[slug].map((item) => ({ ...item })));
    assert.equal(options.credentials, 'include');
    assert.equal(options.headers['X-CSRF-TOKEN'], 'test-token');
    if (options.method === 'DELETE') {
      rows[slug] = rows[slug].filter((item) => item.id !== id);
      return response(204);
    }
    const body = JSON.parse(options.body);
    if (options.method === 'POST') {
      const created = { id: 1, ...body };
      rows[slug].push(created);
      return response(201, created);
    }
    rows[slug][0] = { id, ...body };
    return response(200, rows[slug][0]);
  };
  try {
    for (const [slug, config] of Object.entries(contentConfig)) {
      const panel = new ContentPanel(() => {});
      await panel.load(slug);
      assert.match(panel.markup(slug), /Hələ məlumat yoxdur/);
      const titleKey = config.title;
      const values = { [titleKey]: 'Test qeyd', descriptionAz: 'Test təsvir', status: 'open' };
      panel.formRecord = {};
      let form = fakeForm(config, values);
      await panel.submit({ preventDefault() {}, currentTarget: form });
      assert.equal(form.error.textContent, '');
      assert.equal(panel.rows.length, 1);
      assert.match(panel.markup(slug), /Test qeyd/);
      panel.query = 'heç bir nəticə';
      assert.match(panel.markup(slug), /Axtarışa uyğun nəticə yoxdur/);
      panel.query = '';
      panel.formRecord = panel.rows[0];
      form = fakeForm(config, { ...values, [titleKey]: 'Yenilənmiş qeyd' });
      await panel.submit({ preventDefault() {}, currentTarget: form });
      assert.equal(panel.rows[0][titleKey], 'Yenilənmiş qeyd');
      await panel.action(config.status === 'published' ? 'publish' : 'archive', 1);
      assert.equal(config.status === 'published' ? panel.rows[0].published : panel.rows[0].status,
        config.status === 'published' ? true : 'archived');
      await panel.action(config.status === 'published' ? 'publish' : 'archive', 1);
      assert.equal(config.status === 'published' ? panel.rows[0].published : panel.rows[0].status,
        config.status === 'published' ? false : 'draft');
      await panel.action('delete', 1);
      assert.equal(panel.rows.length, 0);
      const paths = calls.filter((item) => item.url.includes(`/api/admin/${slug}`)).map((item) => item.options.method || 'GET');
      assert.ok(paths.includes('POST') && paths.includes('PUT') && paths.includes('DELETE'));
    }
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test('form mapping validates founder JSON and escapes database text', () => {
  const config = contentConfig.startups;
  const form = fakeForm(config, { founders: 'not-json' });
  assert.throws(() => payloadFromForm(form, config), SyntaxError);
  assert.equal(escapeHtml('<script>'), '&lt;script&gt;');
});
