import { api } from './api.js';
import { contentConfig, payloadFromForm } from './content-config.js';

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const statusOf = (item, config) => config.status === 'published'
  ? (item.published ? 'Dərc olunub' : 'Qaralama') : item.status;

export class ContentPanel {
  constructor(update) {
    this.update = update;
    this.slug = null;
    this.rows = [];
    this.loading = false;
    this.error = '';
    this.flash = '';
    this.query = '';
    this.filter = 'all';
    this.formRecord = null;
    this.busy = false;
    this.version = 0;
  }

  async load(slug, reset = false) {
    if (reset || this.slug !== slug) {
      this.slug = slug;
      this.query = '';
      this.filter = 'all';
      this.formRecord = null;
      this.flash = '';
    }
    const version = ++this.version;
    this.loading = true;
    this.error = '';
    this.update();
    try {
      const rows = await api.get(`/api/admin/${slug}`);
      if (version !== this.version) return;
      this.rows = rows;
    } catch (error) {
      if (version !== this.version) return;
      this.error = error.message;
      this.rows = [];
    } finally {
      if (version === this.version) {
        this.loading = false;
        this.update();
      }
    }
  }

  cancel() {
    this.version++;
    this.slug = null;
    this.formRecord = null;
  }

  fieldMarkup(field, record) {
    const value = record?.[field.key];
    const id = `content-${field.key}`;
    if (field.type === 'checkbox') return `<label class="admin-check-field"><input id="${id}" name="${field.key}" type="checkbox" ${value ? 'checked' : ''} /> ${escapeHtml(field.label)}</label>`;
    const display = field.type === 'list' ? (value || []).join(', ') :
      field.type === 'json' ? JSON.stringify(value || [], null, 2) : value ?? '';
    const attrs = `id="${id}" name="${field.key}" ${field.required ? 'required' : ''}`;
    const control = field.type === 'textarea' || field.type === 'json'
      ? `<textarea ${attrs} rows="${field.type === 'json' ? 4 : 3}">${escapeHtml(display)}</textarea>`
      : field.type === 'program-status'
        ? `<select ${attrs}>${['draft', 'open', 'active', 'soon', 'archived', ...(value ? [value] : [])].filter((item, index, array) => array.indexOf(item) === index).map((item) => `<option value="${escapeHtml(item)}" ${item === value ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select>`
        : `<input ${attrs} type="${field.type === 'number' ? 'number' : 'text'}" ${field.type === 'number' ? 'min="0"' : ''} value="${escapeHtml(display)}" />`;
    return `<label class="admin-content-field" for="${id}"><span>${escapeHtml(field.label)}${field.required ? ' *' : ''}</span>${control}</label>`;
  }

  markup(slug) {
    const config = contentConfig[slug];
    if (this.slug !== slug) return '<div class="admin-card admin-section-card"><div class="admin-state" role="status"><span class="admin-spinner"></span><h2>Məlumatlar yüklənir</h2></div></div>';
    const filtered = this.rows.filter((row) => {
      const matchesText = Object.values(row).some((value) => typeof value === 'string' && value.toLocaleLowerCase('az').includes(this.query.toLocaleLowerCase('az')));
      const matchesStatus = this.filter === 'all' || (config.status === 'published'
        ? String(row.published) === this.filter : row.status === this.filter);
      return matchesText && matchesStatus;
    });
    const statuses = config.status === 'published'
      ? [['true', 'Dərc olunub'], ['false', 'Qaralama']]
      : [...new Set(this.rows.map((row) => row.status))].map((status) => [status, status]);
    let body;
    if (this.loading) body = '<div class="admin-state" role="status"><span class="admin-spinner"></span><h2>Məlumatlar yüklənir</h2></div>';
    else if (this.error) body = `<div class="admin-state" role="alert"><h2>Məlumatları yükləmək olmadı</h2><p>${escapeHtml(this.error)}</p><button type="button" class="admin-outline-button" data-action="retry">Yenidən yoxla</button></div>`;
    else if (!filtered.length) body = `<div class="admin-state"><h2>${this.rows.length ? 'Axtarışa uyğun nəticə yoxdur' : 'Hələ məlumat yoxdur'}</h2><p>${this.rows.length ? 'Filtrləri təmizləyib yenidən yoxlayın.' : 'İlk qeydi əlavə edə bilərsiniz.'}</p></div>`;
    else body = `<div class="admin-table-scroll"><table><thead><tr><th>Ad / başlıq</th><th>Ətraflı</th><th>Status</th><th>Əməliyyatlar</th></tr></thead><tbody>${filtered.map((row) => `<tr><td><strong>${escapeHtml(row[config.title])}</strong></td><td>${escapeHtml(row[config.subtitle])}</td><td><span class="admin-pill admin-pill-neutral">${escapeHtml(statusOf(row, config))}</span></td><td><div class="admin-row-actions"><button type="button" data-action="edit" data-id="${row.id}">Düzəliş et</button>${config.status === 'published' ? `<button type="button" data-action="publish" data-id="${row.id}">${row.published ? 'Yayından çıxar' : 'Dərc et'}</button>` : `<button type="button" data-action="archive" data-id="${row.id}">${row.status === 'archived' ? 'Bərpa et' : 'Arxivlə'}</button>`}<button type="button" data-action="delete" data-id="${row.id}" class="admin-danger">Sil</button></div></td></tr>`).join('')}</tbody></table></div>`;
    const modal = this.formRecord !== null ? `<div class="admin-modal-backdrop" data-action="close"><section class="admin-card admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div class="admin-editor-head"><h2 id="editor-title">${this.formRecord.id ? 'Qeydə düzəliş et' : 'Yeni qeyd əlavə et'}</h2><button type="button" class="admin-outline-button" data-action="close">Bağla</button></div><form id="content-form"><div class="admin-editor-fields">${config.fields.map((field) => this.fieldMarkup(field, this.formRecord)).join('')}</div><p class="admin-form-error" id="content-form-error" role="alert"></p><div class="admin-editor-actions"><button type="button" class="admin-outline-button" data-action="close">Ləğv et</button><button type="submit" class="btn-primary" ${this.busy ? 'disabled' : ''}>${this.busy ? 'Saxlanılır...' : 'Yadda saxla'}</button></div></form></section></div>` : '';
    return `<div class="admin-card admin-section-card"><div class="admin-toolbar"><form id="content-search" class="admin-search"><label class="admin-sr-only" for="content-query">Axtarış</label><input id="content-query" type="search" value="${escapeHtml(this.query)}" placeholder="${escapeHtml(config.label)} üzrə axtarış" /><button type="submit" class="admin-outline-button">Axtar</button></form><div class="admin-toolbar-actions"><label class="admin-sr-only" for="content-filter">Status filtri</label><select id="content-filter" aria-label="Status filtri"><option value="all">Bütün statuslar</option>${statuses.map(([value, label]) => `<option value="${escapeHtml(value)}" ${this.filter === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}</select><button type="button" class="admin-outline-button" data-action="clear">Təmizlə</button><button type="button" class="btn-primary admin-add-button" data-action="create">Əlavə et</button></div></div>${this.flash ? `<p class="admin-flash" role="status">${escapeHtml(this.flash)}</p>` : ''}<div class="admin-table-caption">${filtered.length} qeyd</div>${body}</div>${modal}`;
  }

  bind(root) {
    root.querySelector('#content-search')?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.query = root.querySelector('#content-query').value.trim();
      this.update();
    });
    root.querySelector('#content-filter')?.addEventListener('change', (event) => {
      this.filter = event.target.value;
      this.update();
    });
    root.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', (event) => {
      if (event.target.closest('.admin-editor') && button.dataset.action === 'close' && button.classList.contains('admin-modal-backdrop')) return;
      this.action(button.dataset.action, Number(button.dataset.id));
    }));
    root.querySelector('#content-form')?.addEventListener('submit', (event) => this.submit(event));
    if (this.formRecord !== null) root.querySelector('.admin-editor input:not([type="checkbox"]), .admin-editor select')?.focus();
  }

  async action(action, id) {
    if (action === 'retry') return this.load(this.slug);
    if (action === 'clear') { this.query = ''; this.filter = 'all'; this.update(); return; }
    if (action === 'close') { this.formRecord = null; this.update(); return; }
    if (action === 'create' || action === 'edit') {
      this.formRecord = action === 'create' ? {} : this.rows.find((row) => row.id === id);
      this.update();
      return;
    }
    const row = this.rows.find((item) => item.id === id);
    if (!row || this.busy) return;
    if (action === 'delete' && !window.confirm(`“${row[contentConfig[this.slug].title]}” silinsin? Bu əməliyyat geri qaytarılmır.`)) return;
    if (action === 'archive' && !window.confirm(row.status === 'archived' ? 'Qeyd qaralama kimi bərpa edilsin?' : 'Qeyd arxivlənsin?')) return;
    this.busy = true;
    this.flash = '';
    try {
      const path = `/api/admin/${this.slug}/${id}`;
      if (action === 'delete') await api.mutate(path, 'DELETE');
      else {
        const config = contentConfig[this.slug];
        const payload = Object.fromEntries(config.fields.map(({ key }) => [key, row[key]]));
        if (action === 'publish') payload.published = !row.published;
        else if (action === 'archive') payload.status = row.status === 'archived' ? 'draft' : 'archived';
        await api.mutate(path, 'PUT', payload);
      }
      this.flash = action === 'delete' ? 'Qeyd silindi.' : 'Status yeniləndi.';
      await this.load(this.slug);
    } catch (error) {
      this.error = error.message;
      this.update();
    } finally { this.busy = false; }
  }

  async submit(event) {
    event.preventDefault();
    if (this.busy) return;
    const form = event.currentTarget;
    const errorNode = form.querySelector('#content-form-error');
    let payload;
    try { payload = payloadFromForm(form, contentConfig[this.slug]); }
    catch (error) { errorNode.textContent = error.message; return; }
    this.busy = true;
    form.querySelector('[type="submit"]').disabled = true;
    try {
      const id = this.formRecord.id;
      await api.mutate(`/api/admin/${this.slug}${id ? `/${id}` : ''}`, id ? 'PUT' : 'POST', payload);
      this.formRecord = null;
      this.flash = id ? 'Qeyd yeniləndi.' : 'Qeyd əlavə edildi.';
      await this.load(this.slug);
    } catch (error) {
      errorNode.textContent = error.message;
      form.querySelector('[type="submit"]').disabled = false;
    } finally { this.busy = false; }
  }
}
