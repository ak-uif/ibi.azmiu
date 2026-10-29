const safe = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const localized = (row, field) => ({ az: safe(row[`${field}Az`]), en: safe(row[`${field}En`] || row[`${field}Az`]) });
const icon = (value) => /^[a-z0-9-]{1,40}$/.test(value || '') ? value : 'circle';
const url = (value) => {
  try {
    const parsed = new URL(value);
    return ['https:', 'http:'].includes(parsed.protocol) ? safe(parsed.href) : '';
  } catch { return ''; }
};

export const contentTypes = ['programs', 'events', 'news', 'mentors', 'startups', 'partners'];
const stateLabels = {
  az: { loading: 'Məlumatlar yüklənir…', empty: 'Hələlik məlumat yoxdur.', error: 'Məlumatları yükləmək mümkün olmadı. Bir az sonra yenidən cəhd edin.' },
  en: { loading: 'Loading content…', empty: 'No content yet.', error: 'Could not load content. Please try again later.' }
};

export function contentStateMarkup(status, language) {
  const label = stateLabels[language]?.[status];
  if (!label) throw new Error('Unknown content state');
  return `<div class="public-content-state col-span-full" role="status">${label}</div>`;
}

export function splitPrograms(rows) {
  return {
    current: rows.filter((item) => !item.period.az && !item.period.en),
    past: rows.filter((item) => Boolean(item.period.az || item.period.en))
  };
}

export function mapContent(type, row) {
  const id = Number(row.id);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid content ID');
  switch (type) {
    case 'programs': {
      const status = String(row.status || '').toLowerCase();
      return { id, category: safe(row.category), status, title: localized(row, 'title'),
        description: localized(row, 'description'), details: localized(row, 'details'),
        duration: localized(row, 'duration'), audience: localized(row, 'audience'),
        deadline: localized(row, 'deadline'), period: localized(row, 'period'), icon: icon(row.icon) };
    }
    case 'events': return { id, day: safe(row.dayLabel), month: localized(row, 'month'),
      title: localized(row, 'title'), location: localized(row, 'location'),
      time: localized(row, 'time'), attendees: safe(row.attendees), speaker: localized(row, 'speaker'),
      description: localized(row, 'description'), details: localized(row, 'details') };
    case 'news': return { id, category: localized(row, 'category'), date: localized(row, 'date'),
      title: localized(row, 'title'), summary: localized(row, 'summary'),
      fullText: localized(row, 'fullText'), image: url(row.imageUrl) };
    case 'mentors': return { id, name: safe(row.name), role: localized(row, 'role'),
      category: safe(row.category), skills: (row.skills || []).map(safe), avatar: url(row.avatarUrl),
      socials: { linkedin: url(row.linkedinUrl), github: url(row.githubUrl) } };
    case 'startups': return { id, name: safe(row.name), logoText: safe(row.logoText),
      logoColor: /^[a-z0-9- ]{1,80}$/.test(row.logoColor || '') ? row.logoColor : 'from-cyan-500 to-blue-600',
      tagline: localized(row, 'tagline'), stage: localized(row, 'stage'),
      members: Number.isFinite(row.members) ? row.members : '', description: localized(row, 'description'),
      founders: (row.founders || []).map((founder) => ({ name: safe(founder.name), role: {
        az: safe(founder.roleAz || founder.role?.az), en: safe(founder.roleEn || founder.role?.en || founder.roleAz || founder.role?.az)
      } })), techStack: (row.techStack || []).map(safe), traction: localized(row, 'traction'), website: url(row.website) };
    case 'partners': return { id, name: safe(row.name), icon: icon(row.icon) };
    default: throw new Error('Unknown content type');
  }
}

export function createContentStore(baseUrl = 'http://localhost:8080', fetcher = fetch) {
  const state = Object.fromEntries(contentTypes.map((type) => [type, { status: 'loading', rows: [] }]));
  const base = baseUrl.replace(/\/+$/, '');
  return {
    state,
    async load(type) {
      if (!contentTypes.includes(type)) throw new Error('Unknown content type');
      state[type] = { status: 'loading', rows: [] };
      try {
        const response = await fetcher(`${base}/api/public/${type}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid API response');
        state[type] = { status: 'ready', rows: data.map((row) => mapContent(type, row)) };
      } catch {
        state[type] = { status: 'error', rows: [] };
      }
      return state[type];
    }
  };
}
