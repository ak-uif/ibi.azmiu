import '../style.css';
import './admin.css';
import { api } from './api.js';
import { contentConfig } from './content-config.js';
import { ContentPanel, escapeHtml } from './panel-content.js';

const app = document.querySelector('#admin-app');
let authState = 'unknown';
const sections = [
  { slug: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { slug: 'applications', label: 'Müraciətlər', icon: 'inbox' },
  { slug: 'programs', label: 'Proqramlar', icon: 'layers' },
  { slug: 'events', label: 'Tədbirlər', icon: 'calendar' },
  { slug: 'news', label: 'Xəbərlər', icon: 'file' },
  { slug: 'mentors', label: 'Mentorlar', icon: 'users' },
  { slug: 'startups', label: 'Startaplar', icon: 'rocket' },
  { slug: 'partners', label: 'Partnyorlar', icon: 'link' },
  { slug: 'activity', label: 'Fəaliyyət tarixçəsi', icon: 'clock' },
  { slug: 'settings', label: 'Ayarlar', icon: 'settings' }
];
const applicationTabs = ['Bütün müraciətlər', 'Proqramlar', 'Tədbirlər', 'Mentorlar', 'Startaplar'];
const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  inbox: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 13h5l2 3h4l2-3h5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  file: '<path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm9 0v5h4M8 13h8m-8 4h8"/>',
  users: '<path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-7.87a4 4 0 0 1 0 7.75"/>',
  rocket: '<path d="M4 13c-1 1-1 4-1 4l4-1 9-9-3-3-9 9Zm9-9c3-2 6-2 8-1 1 2 1 5-1 8l-4 4-7-7 4-4ZM5 19l-2 2m6-3 2 3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 4l-1.2 1.2M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20l1.2-1.2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  eyeOff: '<path d="m3 3 18 18M10 6.2A10.5 10.5 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3 3.5M6 8.2C3.4 9.9 2 12 2 12s3.5 6 10 6c1 0 2-.1 2.9-.4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  filter: '<path d="M4 7h16M7 12h10m-7 5h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>'
};
const icon = (name, size = 20) => `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;

const state = { tab: 0, menuOpen: false, dashboard: null, dashboardLoading: false, dashboardError: '' };
const contentPanel = new ContentPanel(() => { if (contentConfig[route()]) render(); });
const route = () => {
  const match = location.pathname.match(/^\/admin\/([^/]+)\/?$/);
  return match && sections.some((item) => item.slug === match[1]) ? match[1] : null;
};

async function verifySession() {
  try {
    await api.get('/api/auth/me');
    authState = 'authenticated';
  } catch {
    authState = 'guest';
  }
  render();
}

function brand() {
  return `<span class="admin-brand-mark">${icon('layers', 24)}</span><span class="admin-brand-copy"><strong>AzMİU <em>İBİ</em></strong><small>İnnovativ Biznes İnkubatoru</small></span>`;
}

function renderLogin() {
  document.title = 'Admin girişi — AzMİU İBİ';
  app.innerHTML = `
    <main class="admin-login-shell">
      <div class="admin-login-wrap">
        <div class="admin-login-brand">${brand()}</div>
        <section class="admin-login-card" aria-labelledby="login-title">
          <span class="admin-eyebrow">İDARƏETMƏ PANELİ</span>
          <h1 id="login-title">Admin girişi</h1>
          <p class="admin-muted">İBİ məzmununu və müraciətləri idarə etmək üçün panel görünüşü.</p>
          <div class="admin-demo-note" role="note">${icon('alert', 18)}<span>Giriş yalnız icazəli admin hesabı ilə mümkündür. Məzmun lokal backend-dən yüklənir.</span></div>
          <form id="login-form" novalidate>
            <label for="username">İstifadəçi adı</label>
            <input id="username" name="username" type="text" autocomplete="username" placeholder="İstifadəçi adını yazın" required />
            <label for="password">Şifrə</label>
            <div class="admin-password-wrap">
              <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Şifrəni yazın" required />
              <button id="toggle-password" type="button" aria-label="Şifrəni göstər" aria-pressed="false">${icon('eye')}</button>
            </div>
            <p id="login-error" class="admin-form-error" role="alert" aria-live="polite"></p>
            <button class="btn-primary admin-login-submit" type="submit">Daxil ol ${icon('arrow', 18)}</button>
          </form>
        </section>
        <p class="admin-login-foot">AzMİU İBİ · İdarəetmə paneli</p>
      </div>
    </main>`;
  document.querySelector('#toggle-password').addEventListener('click', (event) => {
    const input = document.querySelector('#password');
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    event.currentTarget.innerHTML = icon(visible ? 'eyeOff' : 'eye');
    event.currentTarget.setAttribute('aria-label', visible ? 'Şifrəni gizlət' : 'Şifrəni göstər');
    event.currentTarget.setAttribute('aria-pressed', String(visible));
  });
  document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value;
    if (!username || !password) {
      document.querySelector('#login-error').textContent = 'İstifadəçi adı və şifrəni doldurun.';
      (!username ? document.querySelector('#username') : document.querySelector('#password')).focus();
      return;
    }
    const error = document.querySelector('#login-error');
    const button = document.querySelector('.admin-login-submit');
    error.textContent = '';
    button.disabled = true;
    try {
      await api.mutate('/api/auth/login', 'POST', { username, password });
      authState = 'authenticated';
      state.dashboard = null;
      state.dashboardError = '';
      navigate('dashboard');
    } catch (failure) {
      error.textContent = failure.status === 401 ? 'İstifadəçi adı və ya şifrə yanlışdır.' : failure.message;
    } finally {
      button.disabled = false;
    }
  });
}

function dashboard() {
  if (state.dashboardLoading) return '<div class="admin-card admin-state" role="status"><span class="admin-spinner"></span><h2>Göstəricilər yüklənir</h2></div>';
  if (state.dashboardError) return `<div class="admin-card admin-state" role="alert"><h2>Göstəriciləri yükləmək olmadı</h2><p>${escapeHtml(state.dashboardError)}</p><button type="button" class="admin-outline-button" id="dashboard-retry">Yenidən yoxla</button></div>`;
  const data = state.dashboard;
  if (!data) return '';
  const stats = [
    ['Ümumi müraciətlər', '—', 'inbox', 'Müraciət API-si hələ qoşulmayıb'],
    ['Yeni müraciətlər', '—', 'file', 'Müraciət API-si hələ qoşulmayıb'],
    ['Aktiv proqramlar', data.programs.filter((item) => ['active', 'open'].includes(item.status)).length, 'layers', 'Database göstəricisi'],
    ['Dərc edilmiş tədbirlər', data.events.filter((item) => item.published).length, 'calendar', 'Database göstəricisi']
  ];
  return `<div class="admin-stats">${stats.map(([label, count, symbol, note]) => `<article class="admin-card admin-stat"><span class="admin-stat-icon">${icon(symbol)}</span><p>${label}</p><strong>${count}</strong><small>${note}</small></article>`).join('')}</div>
    <div class="admin-dashboard-grid"><section class="admin-card admin-list-card"><div class="admin-card-heading"><div><span class="admin-eyebrow">MƏZMUN</span><h2>Son proqramlar</h2></div><a href="/admin/programs" data-route="programs">Hamısına bax ${icon('arrow', 16)}</a></div>${data.programs.length ? data.programs.slice(-4).reverse().map((item) => `<div class="admin-list-row"><span class="admin-activity-icon">${icon('layers', 18)}</span><div><strong>${escapeHtml(item.titleAz)}</strong><small>${escapeHtml(item.status)}</small></div></div>`).join('') : '<p class="admin-empty-note">Hələ proqram yoxdur.</p>'}</section>
    <section class="admin-card admin-list-card"><div class="admin-card-heading"><div><span class="admin-eyebrow">MÜRACİƏTLƏR</span><h2>Son müraciətlər</h2></div></div><p class="admin-empty-note">Müraciət API-si hələ qoşulmayıb.</p></section>
    <section class="admin-card admin-list-card"><div class="admin-card-heading"><div><span class="admin-eyebrow">PANEL</span><h2>Son admin fəaliyyətləri</h2></div></div><p class="admin-empty-note">Fəaliyyət tarixçəsi API-si hələ yoxdur.</p></section></div>`;
}

async function loadDashboard() {
  state.dashboardLoading = true;
  state.dashboardError = '';
  render();
  try {
    const [programs, events] = await Promise.all([api.get('/api/admin/programs'), api.get('/api/admin/events')]);
    state.dashboard = { programs, events };
  } catch (error) { state.dashboardError = error.message; }
  finally { state.dashboardLoading = false; if (route() === 'dashboard') render(); }
}

function sectionContent(slug) {
  if (contentConfig[slug]) return contentPanel.markup(slug);
  return `${slug === 'applications' ? `<div class="admin-tabs" role="tablist" aria-label="Müraciət növü">${applicationTabs.map((tab, index) => `<button type="button" role="tab" aria-selected="${state.tab === index}" class="${state.tab === index ? 'active' : ''}" data-tab="${index}">${tab}</button>`).join('')}</div>` : ''}<div class="admin-card admin-section-card"><div class="admin-state"><h2>Bu bölmə hələ API-yə qoşulmayıb</h2><p>Məlumatlar hazır olduqda burada görünəcək.</p></div></div>`;
}

function renderPanel(slug) {
  const item = sections.find((section) => section.slug === slug);
  document.title = `${item.label} — AzMİU İBİ Admin`;
  app.innerHTML = `
    <div class="admin-panel">
      <div class="admin-mobile-overlay ${state.menuOpen ? 'visible' : ''}" data-close-menu></div>
      <aside class="admin-sidebar ${state.menuOpen ? 'open' : ''}" aria-label="Admin naviqasiyası">
        <div class="admin-sidebar-head"><div class="admin-login-brand">${brand()}</div><button class="admin-mobile-close" type="button" aria-label="Menyunu bağla" data-close-menu>${icon('close')}</button></div>
        <div class="admin-sidebar-label">İDARƏETMƏ</div>
        <nav class="admin-nav">${sections.map((section) => `<a href="/admin/${section.slug}" data-route="${section.slug}" class="${section.slug === slug ? 'active' : ''}" ${section.slug === slug ? 'aria-current="page"' : ''}>${icon(section.icon, 19)}<span>${section.label}</span></a>`).join('')}</nav>
        <div class="admin-sidebar-bottom"><div class="admin-demo-mini">Məzmun <span>Database</span></div><button type="button" id="logout-button">${icon('logout', 19)} Çıxış</button></div>
      </aside>
      <div class="admin-main">
        <header class="admin-topbar"><button class="admin-menu-button" type="button" id="menu-button" aria-label="Menyunu aç" aria-expanded="${state.menuOpen}">${icon('menu')}</button><div class="admin-breadcrumb">İdarəetmə paneli <span>/</span> <strong>${item.label}</strong></div><span class="admin-topbar-badge">ADMIN</span></header>
        <main class="admin-content"><div class="admin-page-head"><div><span class="admin-eyebrow">AZMİU İBİ / ADMIN</span><h1>${item.label}</h1><p>${slug === 'dashboard' ? 'İnkubatorun fəaliyyətinə ümumi baxış' : contentConfig[slug] ? 'Database qeydlərini idarə edin' : 'Bölmə görünüşü'}</p></div><span class="admin-page-label">${contentConfig[slug] || slug === 'dashboard' ? 'Lokal məlumatlar' : 'Hazırlanır'}</span></div>
          ${slug === 'dashboard' ? dashboard() : sectionContent(slug)}
        </main>
      </div>
    </div>`;
  document.querySelectorAll('[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    navigate(link.dataset.route);
  }));
  document.querySelector('#logout-button').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    try {
      await api.mutate('/api/auth/logout', 'POST');
      authState = 'guest';
      contentPanel.cancel();
      state.dashboard = null;
      state.dashboardError = '';
      state.menuOpen = false;
      history.pushState({}, '', '/admin');
      render();
    } catch {
      document.querySelector('.admin-topbar-badge').textContent = 'Çıxış alınmadı';
      event.currentTarget.disabled = false;
    }
  });
  document.querySelector('#menu-button').addEventListener('click', () => {
    state.menuOpen = true;
    render();
  });
  document.querySelectorAll('[data-close-menu]').forEach((element) => element.addEventListener('click', () => {
    state.menuOpen = false;
    render();
  }));
  if (contentConfig[slug]) contentPanel.bind(app);
  else if (slug === 'dashboard') {
    document.querySelector('#dashboard-retry')?.addEventListener('click', loadDashboard);
  } else {
    document.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
      state.tab = Number(tab.dataset.tab);
      render();
    }));
  }
}

function navigate(slug) {
  if (authState !== 'authenticated' || !sections.some((section) => section.slug === slug)) return;
  state.menuOpen = false;
  state.tab = 0;
  if (slug === 'dashboard') { state.dashboard = null; state.dashboardError = ''; }
  history.pushState({}, '', `/admin/${slug}`);
  render();
  window.scrollTo(0, 0);
}

function render() {
  const slug = route();
  if (authState === 'unknown') {
    app.innerHTML = '<main class="admin-login-shell"><p role="status">Giriş yoxlanılır...</p></main>';
    verifySession();
    return;
  }
  if (!slug || authState !== 'authenticated') {
    if (slug && authState !== 'authenticated') history.replaceState({}, '', '/admin');
    renderLogin();
  } else {
    renderPanel(slug);
    if (contentConfig[slug] && contentPanel.slug !== slug) contentPanel.load(slug, true);
    if (slug === 'dashboard' && !state.dashboard && !state.dashboardLoading && !state.dashboardError) loadDashboard();
  }
}

window.addEventListener('admin-session-expired', () => {
  if (authState === 'unknown') return;
  authState = 'guest';
  contentPanel.cancel();
  state.dashboard = null;
  state.dashboardError = '';
  history.replaceState({}, '', '/admin');
  render();
});
window.addEventListener('popstate', () => {
  if (route() === 'dashboard') { state.dashboard = null; state.dashboardError = ''; }
  render();
});
render();
