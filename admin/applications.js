import { api } from './api.js';
import { escapeHtml } from './panel-content.js';

export const applicationTypes = [
  ['all', 'Bütün müraciətlər'], ['program', 'Proqramlar'], ['event', 'Tədbirlər'],
  ['mentor', 'Mentorlar'], ['startup', 'Startaplar']
];
export const applicationStatuses = ['ALL', 'NEW', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'ARCHIVED'];
const statusLabels = { ALL: 'Bütün statuslar', NEW: 'Yeni', REVIEWING: 'Baxılır',
  ACCEPTED: 'Qəbul edildi', REJECTED: 'Rədd edildi', ARCHIVED: 'Arxiv' };
const fieldLabels = {
  selectedProgram: 'Proqram', faculty: 'Fakültə', eventTitle: 'Tədbir', format: 'İştirak formatı',
  companyRole: 'Şirkət və vəzifə', expertise: 'İxtisas', linkedin: 'LinkedIn', bio: 'Qısa bio',
  startupTitle: 'Startap adı', stage: 'Mərhələ', description: 'Təsvir'
};
const typeFields = {
  program: ['selectedProgram', 'faculty'], event: ['eventTitle', 'format'],
  mentor: ['companyRole', 'expertise', 'linkedin', 'bio'],
  startup: ['startupTitle', 'stage', 'description']
};

export function applicationQuery(filters, includePage = true) {
  const params = new URLSearchParams({ type: filters.type, status: filters.status,
    search: filters.search, sort: filters.sort });
  if (includePage) {
    params.set('page', String(filters.page));
    params.set('size', String(filters.size));
  }
  return params.toString();
}

const date = (value) => value && !Number.isNaN(Date.parse(value))
  ? new Date(value).toLocaleString('az-AZ', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export class ApplicationPanel {
  constructor(update, client = api) {
    this.update = update;
    this.client = client;
    this.reset();
  }

  reset() {
    this.filters = { type: 'all', status: 'ALL', search: '', sort: 'newest', page: 0, size: 10 };
    this.data = null;
    this.detail = null;
    this.loading = false;
    this.busy = false;
    this.error = '';
    this.flash = '';
    this.loaded = false;
    this.requestId = (this.requestId || 0) + 1;
    this.generation = (this.generation || 0) + 1;
  }

  cancel() { this.reset(); }

  async load() {
    const requestId = ++this.requestId;
    this.loaded = true;
    this.loading = true;
    this.error = '';
    this.update();
    try {
      const result = await this.client.get(`/api/admin/applications?${applicationQuery(this.filters)}`);
      if (requestId === this.requestId) this.data = result;
    } catch (error) {
      if (requestId === this.requestId) { this.data = null; this.error = error.message; }
    } finally {
      if (requestId === this.requestId) { this.loading = false; this.update(); }
    }
  }

  selectType(type) {
    if (!applicationTypes.some(([key]) => key === type)) return;
    this.filters.type = type;
    this.filters.page = 0;
    this.detail = null;
    return this.load();
  }

  setStatus(status) {
    if (!applicationStatuses.includes(status)) return;
    this.filters.status = status;
    this.filters.page = 0;
    this.detail = null;
    return this.load();
  }

  setSearch(search) {
    this.filters.search = search.trim();
    this.filters.page = 0;
    this.detail = null;
    return this.load();
  }

  setSort(sort) {
    if (!['newest', 'oldest'].includes(sort)) return;
    this.filters.sort = sort;
    this.filters.page = 0;
    this.detail = null;
    return this.load();
  }

  setPage(page) {
    if (page < 0 || page >= (this.data?.totalPages || 0)) return;
    this.filters.page = page;
    this.detail = null;
    return this.load();
  }

  async openDetail(type, id) {
    const generation = this.generation;
    this.busy = true;
    this.error = '';
    this.update();
    try {
      const detail = await this.client.get(`/api/admin/applications/${type}/${id}`);
      if (generation === this.generation) this.detail = detail;
    } catch (error) { if (generation === this.generation) this.error = error.message; }
    finally { if (generation === this.generation) { this.busy = false; this.update(); } }
  }

  closeDetail() { this.detail = null; this.update(); }

  async changeStatus(status) {
    if (!this.detail || this.busy) return;
    const generation = this.generation;
    this.busy = true;
    this.error = '';
    this.flash = '';
    this.update();
    try {
      const detail = await this.client.mutate(
        `/api/admin/applications/${this.detail.type}/${this.detail.id}/status`, 'PATCH', { status });
      if (generation !== this.generation) return;
      this.detail = detail;
      this.flash = 'Müraciətin statusu yeniləndi.';
      await this.load();
    } catch (error) { if (generation === this.generation) this.error = error.message; }
    finally { if (generation === this.generation) { this.busy = false; this.update(); } }
  }

  async exportCsv() {
    const generation = this.generation;
    this.busy = true;
    this.error = '';
    this.update();
    try {
      const blob = await this.client.download(`/api/admin/applications/export?${applicationQuery(this.filters, false)}`);
      return generation === this.generation ? blob : null;
    } catch (error) { if (generation === this.generation) this.error = error.message; return null; }
    finally { if (generation === this.generation) { this.busy = false; this.update(); } }
  }

  async downloadCv() {
    if (this.detail?.type !== 'mentor' || !this.detail.hasCv) return null;
    const generation = this.generation;
    this.busy = true;
    this.error = '';
    this.update();
    try {
      const blob = await this.client.download(`/api/admin/mentor-applications/${this.detail.id}/cv`);
      return generation === this.generation ? blob : null;
    } catch (error) { if (generation === this.generation) this.error = error.message; return null; }
    finally { if (generation === this.generation) { this.busy = false; this.update(); } }
  }

  markup() {
    const f = this.filters;
    const rows = this.data?.items || [];
    const tabs = `<div class="admin-tabs" role="tablist" aria-label="Müraciət növü">${applicationTypes.map(([key, label]) =>
      `<button type="button" role="tab" aria-selected="${f.type === key}" class="${f.type === key ? 'active' : ''}" data-app-type="${key}">${label}</button>`).join('')}</div>`;
    const toolbar = `<div class="admin-card admin-section-card"><div class="admin-toolbar"><form id="application-search" class="admin-search"><label class="admin-sr-only" for="application-query">Axtarış</label><input id="application-query" type="search" value="${escapeHtml(f.search)}" placeholder="Ad, e-poçt və ya layihə axtar"/><button type="submit" class="admin-outline-button">Axtar</button></form><div class="admin-toolbar-actions"><select id="application-status" aria-label="Status filtri">${applicationStatuses.map((status) => `<option value="${status}" ${f.status === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('')}</select><select id="application-sort" aria-label="Tarix sırası"><option value="newest" ${f.sort === 'newest' ? 'selected' : ''}>Ən yeni</option><option value="oldest" ${f.sort === 'oldest' ? 'selected' : ''}>Ən köhnə</option></select><button type="button" id="application-export" class="admin-outline-button" ${this.busy ? 'disabled' : ''}>CSV endir</button></div></div>${this.flash ? `<p class="admin-flash" role="status">${escapeHtml(this.flash)}</p>` : ''}${this.error ? `<p class="admin-form-error" role="alert">${escapeHtml(this.error)} <button type="button" id="application-retry" class="admin-outline-button">Yenidən yoxla</button></p>` : ''}${this.loading ? '<div class="admin-state" role="status"><span class="admin-spinner"></span><p>Müraciətlər yüklənir...</p></div>' : this.data ? rows.length ? `<p class="admin-table-caption">${this.data.total} müraciət</p><div class="admin-application-list">${rows.map((row) => `<article class="admin-application-row"><div><small>${applicationTypes.find(([key]) => key === row.type)?.[1] || ''}</small><strong>${escapeHtml(row.fullName)}</strong><span>${escapeHtml(row.title)}</span></div><div><small>Göndərilmə tarixi</small><time>${escapeHtml(date(row.createdAt))}</time></div><div><small>Status</small><span class="admin-app-status">${escapeHtml(statusLabels[row.status] || row.status)}</span></div><button type="button" class="admin-outline-button" data-app-detail="${row.type}:${row.id}" ${this.busy ? 'disabled' : ''}>Ətraflı bax</button></article>`).join('')}</div><div class="admin-app-pages"><button type="button" id="app-prev" class="admin-outline-button" ${f.page === 0 ? 'disabled' : ''}>Əvvəlki</button><span>${f.page + 1} / ${this.data.totalPages}</span><button type="button" id="app-next" class="admin-outline-button" ${f.page + 1 >= this.data.totalPages ? 'disabled' : ''}>Növbəti</button></div>` : '<div class="admin-state" role="status"><h2>Müraciət tapılmadı</h2><p>Filterləri dəyişib yenidən yoxlayın.</p></div>' : ''}</div>`;
    return tabs + toolbar + (this.detail ? this.detailMarkup() : '');
  }

  detailMarkup() {
    const d = this.detail;
    const fields = [['fullName', 'Ad və soyad'], ['email', 'E-poçt'], ['phone', 'Telefon'],
      ...typeFields[d.type].map((key) => [key, fieldLabels[key]]), ['createdAt', 'Göndərilmə tarixi']];
    return `<section class="admin-card admin-section-card admin-app-detail" aria-label="Müraciət detalları"><div class="admin-card-heading"><h2>Müraciət #${d.id}</h2><button type="button" id="application-close" class="admin-outline-button">Bağla</button></div><dl>${fields.map(([key, label]) => `<div><dt>${label}</dt><dd>${escapeHtml(key === 'createdAt' ? date(d[key]) : d[key] ?? '—')}</dd></div>`).join('')}</dl><div class="admin-app-detail-actions"><label for="application-new-status">Status</label><select id="application-new-status">${applicationStatuses.filter((status) => status !== 'ALL').map((status) => `<option value="${status}" ${d.status === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('')}</select><button type="button" id="application-save-status" class="btn-primary" ${this.busy ? 'disabled' : ''}>Statusu saxla</button>${d.type === 'mentor' ? d.hasCv ? `<span>CV: ${escapeHtml(d.cvFormat || 'sənəd')}</span><button type="button" id="application-download-cv" class="admin-outline-button" ${this.busy ? 'disabled' : ''}>CV-ni endir</button>` : '<span>CV əlavə edilməyib.</span>' : ''}</div></section>`;
  }

  bind(root) {
    root.querySelectorAll('[data-app-type]').forEach((button) => button.addEventListener('click', () => this.selectType(button.dataset.appType)));
    root.querySelector('#application-search')?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.setSearch(root.querySelector('#application-query').value);
    });
    root.querySelector('#application-status')?.addEventListener('change', (event) => this.setStatus(event.target.value));
    root.querySelector('#application-sort')?.addEventListener('change', (event) => this.setSort(event.target.value));
    root.querySelector('#application-retry')?.addEventListener('click', () => this.load());
    root.querySelector('#app-prev')?.addEventListener('click', () => this.setPage(this.filters.page - 1));
    root.querySelector('#app-next')?.addEventListener('click', () => this.setPage(this.filters.page + 1));
    root.querySelectorAll('[data-app-detail]').forEach((button) => button.addEventListener('click', () => {
      const [type, id] = button.dataset.appDetail.split(':');
      this.openDetail(type, Number(id));
    }));
    root.querySelector('#application-close')?.addEventListener('click', () => this.closeDetail());
    root.querySelector('#application-save-status')?.addEventListener('click', () =>
      this.changeStatus(root.querySelector('#application-new-status').value));
    root.querySelector('#application-export')?.addEventListener('click', async () => {
      const blob = await this.exportCsv();
      if (blob) saveBlob(blob, 'applications.csv');
    });
    root.querySelector('#application-download-cv')?.addEventListener('click', async () => {
      const blob = await this.downloadCv();
      if (blob) saveBlob(blob, blob.type === 'application/pdf' ? 'mentor-cv.pdf'
        : blob.type === 'application/msword' ? 'mentor-cv.doc' : 'mentor-cv.docx');
    });
  }
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
