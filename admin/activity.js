import { api } from './api.js';
import { escapeHtml } from './panel-content.js';

export const activityActions = [
  ['LOGIN', 'Giriş'], ['LOGOUT', 'Çıxış'], ['CONTENT_CREATED', 'Qeyd əlavə edildi'],
  ['CONTENT_UPDATED', 'Qeyd yeniləndi'], ['CONTENT_PUBLISHED', 'Qeyd dərc edildi'],
  ['CONTENT_UNPUBLISHED', 'Qeyd yayından çıxarıldı'], ['CONTENT_ARCHIVED', 'Qeyd arxivləndi'],
  ['CONTENT_RESTORED', 'Qeyd bərpa edildi'], ['CONTENT_DELETED', 'Qeyd silindi'],
  ['APPLICATION_VIEWED', 'Müraciətə baxıldı'], ['APPLICATION_STATUS_CHANGED', 'Müraciət statusu dəyişdi'],
  ['CV_DOWNLOADED', 'CV endirildi'], ['APPLICATIONS_EXPORTED', 'Müraciətlər CSV-yə çıxarıldı']
];
export const recordTypes = [
  ['program', 'Proqram'], ['event', 'Tədbir'], ['news', 'Xəbər'],
  ['mentor', 'Mentor'], ['startup', 'Startap'], ['partner', 'Partnyor'],
  ['program_application', 'Proqram müraciəti'], ['event_registration', 'Tədbir qeydiyyatı'],
  ['mentor_application', 'Mentor müraciəti'], ['startup_application', 'Startap müraciəti'],
  ['applications', 'Müraciətlər']
];
export const actionLabel = (action) => activityActions.find(([key]) => key === action)?.[1] || action;
const recordLabel = (type) => recordTypes.find(([key]) => key === type)?.[1] || type;
const date = (value) => value && !Number.isNaN(Date.parse(value))
  ? new Date(value).toLocaleString('az-AZ', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export function activityQuery(filters) {
  return new URLSearchParams(Object.fromEntries(Object.entries(filters)
    .filter(([, value]) => value !== '' && value !== null).map(([key, value]) => [key, String(value)]))).toString();
}

export class ActivityPanel {
  constructor(update, client = api) {
    this.update = update;
    this.client = client;
    this.cancel();
  }

  cancel() {
    this.filters = { action: '', admin: '', from: '', to: '', recordType: '', recordId: '', page: 0, size: 20 };
    this.data = null;
    this.loading = false;
    this.loaded = false;
    this.error = '';
    this.version = (this.version || 0) + 1;
  }

  async load() {
    const version = ++this.version;
    this.loaded = true;
    this.loading = true;
    this.error = '';
    this.update();
    try {
      const result = await this.client.get(`/api/admin/activity?${activityQuery(this.filters)}`);
      if (version === this.version) this.data = result;
    } catch (error) {
      if (version === this.version) { this.data = null; this.error = error.message; }
    } finally {
      if (version === this.version) { this.loading = false; this.update(); }
    }
  }

  setFilters(values) {
    this.filters = { ...this.filters, ...values, page: 0 };
    return this.load();
  }

  setPage(page) {
    if (page < 0 || page >= (this.data?.totalPages || 0)) return;
    this.filters.page = page;
    return this.load();
  }

  markup() {
    const f = this.filters;
    const rows = this.data?.items || [];
    const actionOptions = activityActions.map(([key, label]) =>
      `<option value="${key}" ${f.action === key ? 'selected' : ''}>${label}</option>`).join('');
    const typeOptions = recordTypes.map(([key, label]) =>
      `<option value="${key}" ${f.recordType === key ? 'selected' : ''}>${label}</option>`).join('');
    let body = '';
    if (this.loading) body = '<div class="admin-state" role="status"><span class="admin-spinner"></span><p>Fəaliyyətlər yüklənir...</p></div>';
    else if (this.error) body = `<div class="admin-state" role="alert"><h2>Tarixçəni yükləmək olmadı</h2><p>${escapeHtml(this.error)}</p><button type="button" id="activity-retry" class="admin-outline-button">Yenidən yoxla</button></div>`;
    else if (this.data && !rows.length) body = '<div class="admin-state"><h2>Fəaliyyət tapılmadı</h2><p>Filterləri dəyişib yenidən yoxlayın.</p></div>';
    else if (rows.length) body = `<p class="admin-table-caption">${this.data.total} fəaliyyət</p>
      <div class="admin-activity-list">${rows.map((row) => `<article class="admin-activity-row">
        <div><strong>${escapeHtml(actionLabel(row.action))}</strong><small>${escapeHtml(row.admin)}</small></div>
        <div>${row.recordType ? `${escapeHtml(recordLabel(row.recordType))}${row.recordId ? ` #${escapeHtml(row.recordId)}` : ''}` : '—'}${row.detail ? ` · ${escapeHtml(row.detail)}` : ''}</div>
        <time datetime="${escapeHtml(row.createdAt)}">${escapeHtml(date(row.createdAt))}</time>
      </article>`).join('')}</div>
      <div class="admin-app-pages"><button type="button" id="activity-prev" class="admin-outline-button" ${f.page === 0 ? 'disabled' : ''}>Əvvəlki</button>
      <span>${f.page + 1} / ${this.data.totalPages}</span>
      <button type="button" id="activity-next" class="admin-outline-button" ${f.page + 1 >= this.data.totalPages ? 'disabled' : ''}>Növbəti</button></div>`;
    return `<div class="admin-card admin-section-card"><form id="activity-filters" class="admin-activity-filters">
      <label>Əməliyyat<select name="action"><option value="">Hamısı</option>${actionOptions}</select></label>
      <label>Admin<input name="admin" maxlength="255" value="${escapeHtml(f.admin)}" placeholder="İstifadəçi adı"></label>
      <label>Başlanğıc<input name="from" type="date" value="${escapeHtml(f.from)}"></label>
      <label>Son<input name="to" type="date" value="${escapeHtml(f.to)}"></label>
      <label>Qeyd növü<select name="recordType"><option value="">Hamısı</option>${typeOptions}</select></label>
      <label>Qeyd ID<input name="recordId" type="number" min="1" value="${escapeHtml(f.recordId)}"></label>
      <button type="submit" class="admin-outline-button">Filterlə</button>
      <button type="button" id="activity-clear" class="admin-outline-button">Təmizlə</button>
    </form>${body}</div>`;
  }

  bind(root) {
    root.querySelector('#activity-filters')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      this.setFilters(Object.fromEntries(['action', 'admin', 'from', 'to', 'recordType', 'recordId']
        .map((key) => [key, form.elements.namedItem(key).value.trim()])));
    });
    root.querySelector('#activity-clear')?.addEventListener('click', () =>
      this.setFilters({ action: '', admin: '', from: '', to: '', recordType: '', recordId: '' }));
    root.querySelector('#activity-retry')?.addEventListener('click', () => this.load());
    root.querySelector('#activity-prev')?.addEventListener('click', () => this.setPage(this.filters.page - 1));
    root.querySelector('#activity-next')?.addEventListener('click', () => this.setPage(this.filters.page + 1));
  }
}
