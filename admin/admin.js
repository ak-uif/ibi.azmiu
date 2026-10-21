import '../style.css';
import './admin.css';

const app = document.querySelector('#admin-app');
const demoKey = 'ibi-admin-phase2-demo';
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

const examples = {
  applications: [
    ['Aysel Məmmədova', 'Proqram', 'İnkubasiya proqramı', 'Yeni'],
    ['Murad Əliyev', 'Tədbir', 'Startap görüşü', 'Baxılır'],
    ['Nərmin Həsənova', 'Mentor', 'Mentor müraciəti', 'Yeni'],
    ['Elvin Quliyev', 'Startap', 'İdeya müraciəti', 'Yeni']
  ],
  programs: [['İnkubasiya proqramı', 'Qəbul', '12 həftə', 'Aktiv'], ['Startap məktəbi', 'Təlim', '6 həftə', 'Planlaşdırılır']],
  events: [['Startap görüşü', 'Tədbir', 'Tarix təyin edilməyib', 'Planlaşdırılır']],
  news: [['İnnovasiya xəbəri', 'Xəbər', 'Qaralama', 'Hazırlanır']],
  mentors: [['Nümunə mentor', 'Mentor', 'Texnologiya', 'Aktiv']],
  startups: [['Nümunə startap', 'Startap', 'İdeya', 'Aktiv']],
  partners: [['Nümunə tərəfdaş', 'Partnyor', 'Əməkdaşlıq', 'Aktiv']],
  activity: [['Admin', 'Nümunə əməliyyat', 'Bu gün', 'Demo']],
  settings: [['Panel görünüşü', 'Ayar', 'Frontend nümunəsi', 'Demo']]
};
const state = { tab: 0, view: 'data', query: '', filterOpen: false, menuOpen: false };
const route = () => {
  const match = location.pathname.match(/^\/admin\/([^/]+)\/?$/);
  return match && sections.some((item) => item.slug === match[1]) ? match[1] : null;
};
const isDemo = () => sessionStorage.getItem(demoKey) === 'true';

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
          <div class="admin-demo-note" role="note">${icon('alert', 18)}<span>Bu, yalnız frontend demosudur. Hər hansı doldurulmuş istifadəçi adı və şifrə ilə daxil ola bilərsiniz. Real giriş qoruması yoxdur.</span></div>
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
        <p class="admin-login-foot">AzMİU İBİ · Phase 2 demo görünüşü</p>
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
  document.querySelector('#login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    if (!username || !password) {
      document.querySelector('#login-error').textContent = 'İstifadəçi adı və şifrəni doldurun.';
      (!username ? document.querySelector('#username') : document.querySelector('#password')).focus();
      return;
    }
    sessionStorage.setItem(demoKey, 'true');
    navigate('dashboard');
  });
}

function dashboard() {
  const stats = [
    ['Ümumi müraciətlər', '128', 'inbox'],
    ['Yeni müraciətlər', '12', 'file'],
    ['Aktiv proqramlar', '4', 'layers'],
    ['Yaxın tədbirlər', '3', 'calendar']
  ];
  return `
    <div class="admin-stats">${stats.map(([label, number, symbol]) => `<article class="admin-card admin-stat"><span class="admin-stat-icon">${icon(symbol)}</span><p>${label}</p><strong>${number}</strong><small>Nümunə göstərici</small></article>`).join('')}</div>
    <div class="admin-dashboard-grid">
      <section class="admin-card admin-list-card" aria-labelledby="recent-applications"><div class="admin-card-heading"><div><span class="admin-eyebrow">MÜRACİƏTLƏR</span><h2 id="recent-applications">Son müraciətlər</h2></div><a href="/admin/applications" data-route="applications">Hamısına bax ${icon('arrow', 16)}</a></div>
        <div class="admin-list-row"><span class="admin-avatar">AM</span><div><strong>Aysel Məmmədova</strong><small>İnkubasiya proqramı · nümunə</small></div><span class="admin-pill">Yeni</span></div>
        <div class="admin-list-row"><span class="admin-avatar">MƏ</span><div><strong>Murad Əliyev</strong><small>Tədbir qeydiyyatı · nümunə</small></div><span class="admin-pill admin-pill-neutral">Baxılır</span></div>
        <div class="admin-list-row"><span class="admin-avatar">NH</span><div><strong>Nərmin Həsənova</strong><small>Mentor müraciəti · nümunə</small></div><span class="admin-pill">Yeni</span></div>
      </section>
      <section class="admin-card admin-list-card" aria-labelledby="recent-activity"><div class="admin-card-heading"><div><span class="admin-eyebrow">PANEL</span><h2 id="recent-activity">Son admin fəaliyyətləri</h2></div></div>
        <div class="admin-list-row"><span class="admin-activity-icon">${icon('file', 18)}</span><div><strong>Xəbər yeniləndi</strong><small>Nümunə fəaliyyət · 10:42</small></div></div>
        <div class="admin-list-row"><span class="admin-activity-icon">${icon('calendar', 18)}</span><div><strong>Tədbir əlavə edildi</strong><small>Nümunə fəaliyyət · dünən</small></div></div>
        <div class="admin-list-row"><span class="admin-activity-icon">${icon('inbox', 18)}</span><div><strong>Müraciətə baxıldı</strong><small>Nümunə fəaliyyət · dünən</small></div></div>
      </section>
    </div>`;
}

function sectionContent(slug) {
  const item = sections.find((section) => section.slug === slug);
  const rows = slug === 'applications' && state.tab > 0
    ? examples.applications.filter((row) => row[1] === applicationTabs[state.tab].slice(0, -3))
    : examples[slug] || [];
  const visibleRows = rows.filter((row) => row.join(' ').toLocaleLowerCase('az').includes(state.query.toLocaleLowerCase('az')));
  let body = '';
  if (state.view === 'loading') body = `<div class="admin-state" role="status"><span class="admin-spinner"></span><h2>Məlumatlar yüklənir</h2><p>Bu, yüklənmə görünüşünün nümunəsidir.</p></div>`;
  else if (state.view === 'error') body = `<div class="admin-state" role="alert"><span class="admin-state-icon">${icon('alert', 26)}</span><h2>Məlumatları göstərmək mümkün olmadı</h2><p>Bu, xəta görünüşünün nümunəsidir. Yenidən baxmaq üçün nümunə cədvəli seçin.</p><button class="admin-outline-button" data-view="data">Nümunə cədvələ qayıt</button></div>`;
  else if (state.view === 'empty' || visibleRows.length === 0) body = `<div class="admin-state"><span class="admin-state-icon">${icon(slug === 'applications' ? 'inbox' : item.icon, 26)}</span><h2>Hələ məlumat yoxdur</h2><p>${state.query ? 'Axtarışınıza uyğun nümunə məlumat tapılmadı.' : 'Bu bölmə real məlumat qoşulduqda burada dolacaq.'}</p></div>`;
  else body = `<div class="admin-table-scroll"><table><thead><tr><th>Ad / başlıq</th><th>Növ</th><th>Ətraflı</th><th>Status</th></tr></thead><tbody>${visibleRows.map((row) => `<tr><td><strong>${row[0]}</strong></td><td>${row[1]}</td><td>${row[2]}</td><td><span class="admin-pill admin-pill-neutral">${row[3]}</span></td></tr>`).join('')}</tbody></table></div>`;
  return `
    ${slug === 'applications' ? `<div class="admin-tabs" role="tablist" aria-label="Müraciət növü">${applicationTabs.map((tab, index) => `<button type="button" role="tab" aria-selected="${state.tab === index}" class="${state.tab === index ? 'active' : ''}" data-tab="${index}">${tab}</button>`).join('')}</div>` : ''}
    <div class="admin-card admin-section-card">
      <div class="admin-toolbar"><form id="search-form" class="admin-search"><label class="admin-sr-only" for="section-search">Axtarış</label>${icon('search', 18)}<input id="section-search" type="search" placeholder="${item.label} üzrə axtarış" value="${state.query.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')}" /><button class="admin-sr-only" type="submit">Axtar</button></form>
        <div class="admin-toolbar-actions"><div class="admin-filter-wrap"><button class="admin-outline-button" type="button" id="filter-button" aria-expanded="${state.filterOpen}">${icon('filter', 18)} Filter</button>
          ${state.filterOpen ? `<div class="admin-filter-menu"><label for="view-select">Görünüş nümunəsi</label><select id="view-select"><option value="data" ${state.view === 'data' ? 'selected' : ''}>Nümunə cədvəl</option><option value="empty" ${state.view === 'empty' ? 'selected' : ''}>Boş vəziyyət</option><option value="loading" ${state.view === 'loading' ? 'selected' : ''}>Yüklənmə</option><option value="error" ${state.view === 'error' ? 'selected' : ''}>Xəta</option></select></div>` : ''}</div>
          <button class="btn-primary admin-add-button" type="button" disabled title="Əlavə etmə funksiyası sonrakı mərhələdə hazırlanacaq">${icon('plus', 18)} Əlavə et</button></div>
      </div>
      <div class="admin-table-caption"><span>${state.view === 'data' ? `${visibleRows.length} nümunə qeyd` : 'Görünüş nümunəsi'}</span><span>Frontend demo · real məlumat deyil</span></div>
      ${body}
    </div>`;
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
        <div class="admin-sidebar-bottom"><div class="admin-demo-mini">Demo rejimi <span>Phase 2</span></div><button type="button" id="logout-button">${icon('logout', 19)} Çıxış</button></div>
      </aside>
      <div class="admin-main">
        <header class="admin-topbar"><button class="admin-menu-button" type="button" id="menu-button" aria-label="Menyunu aç" aria-expanded="${state.menuOpen}">${icon('menu')}</button><div class="admin-breadcrumb">İdarəetmə paneli <span>/</span> <strong>${item.label}</strong></div><span class="admin-topbar-badge">DEMO</span></header>
        <main class="admin-content"><div class="admin-page-head"><div><span class="admin-eyebrow">AZMİU İBİ / ADMIN</span><h1>${item.label}</h1><p>${slug === 'dashboard' ? 'İnkubatorun fəaliyyətinə ümumi baxış' : `${item.label} bölməsinin frontend görünüşü`}</p></div><span class="admin-page-label">Nümunə məlumatlar</span></div>
          ${slug === 'dashboard' ? dashboard() : sectionContent(slug)}
        </main>
      </div>
    </div>`;
  document.querySelectorAll('[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    navigate(link.dataset.route);
  }));
  document.querySelector('#logout-button').addEventListener('click', () => {
    sessionStorage.removeItem(demoKey);
    state.menuOpen = false;
    history.pushState({}, '', '/admin');
    render();
  });
  document.querySelector('#menu-button').addEventListener('click', () => {
    state.menuOpen = true;
    render();
  });
  document.querySelectorAll('[data-close-menu]').forEach((element) => element.addEventListener('click', () => {
    state.menuOpen = false;
    render();
  }));
  if (slug !== 'dashboard') {
    document.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
      state.tab = Number(tab.dataset.tab);
      state.query = '';
      render();
    }));
    document.querySelector('#search-form').addEventListener('submit', (event) => {
      event.preventDefault();
      state.query = document.querySelector('#section-search').value.trim();
      render();
    });
    document.querySelector('#filter-button').addEventListener('click', () => {
      state.filterOpen = !state.filterOpen;
      render();
    });
    document.querySelector('#view-select')?.addEventListener('change', (event) => {
      state.view = event.target.value;
      state.filterOpen = false;
      render();
    });
    document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => {
      state.view = button.dataset.view;
      render();
    }));
  }
}

function navigate(slug) {
  if (!sections.some((section) => section.slug === slug)) return;
  state.menuOpen = false;
  state.filterOpen = false;
  state.query = '';
  state.view = 'data';
  state.tab = 0;
  history.pushState({}, '', `/admin/${slug}`);
  render();
  window.scrollTo(0, 0);
}

function render() {
  const slug = route();
  if (!slug || !isDemo()) {
    if (slug && !isDemo()) history.replaceState({}, '', '/admin');
    renderLogin();
  } else renderPanel(slug);
}

window.addEventListener('popstate', render);
render();
