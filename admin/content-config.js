const field = (key, label, type = 'text', required = false) => ({ key, label, type, required });
const bilingual = (az, en, label, type = 'text', required = false) => [
  field(az, `${label} (AZ)`, type, required), field(en, `${label} (EN)`, type)
];

export const contentConfig = {
  programs: {
    label: 'Proqramlar', title: 'titleAz', subtitle: 'category', status: 'status',
    fields: [field('category', 'Kateqoriya'), field('status', 'Status', 'program-status', true),
      ...bilingual('titleAz', 'titleEn', 'Başlıq', 'text', true),
      ...bilingual('descriptionAz', 'descriptionEn', 'Təsvir', 'textarea', true),
      ...bilingual('detailsAz', 'detailsEn', 'Ətraflı', 'textarea'),
      ...bilingual('durationAz', 'durationEn', 'Müddət'),
      ...bilingual('audienceAz', 'audienceEn', 'Auditoriya'),
      ...bilingual('deadlineAz', 'deadlineEn', 'Son tarix'),
      ...bilingual('periodAz', 'periodEn', 'Dövr'), field('icon', 'İkon')]
  },
  events: {
    label: 'Tədbirlər', title: 'titleAz', subtitle: 'locationAz', status: 'published',
    fields: [...bilingual('titleAz', 'titleEn', 'Başlıq', 'text', true),
      ...bilingual('descriptionAz', 'descriptionEn', 'Təsvir', 'textarea', true),
      ...bilingual('detailsAz', 'detailsEn', 'Ətraflı', 'textarea'),
      field('dayLabel', 'Gün'), ...bilingual('monthAz', 'monthEn', 'Ay'),
      ...bilingual('locationAz', 'locationEn', 'Məkan'),
      ...bilingual('timeAz', 'timeEn', 'Saat'), field('attendees', 'İştirakçı sayı'),
      ...bilingual('speakerAz', 'speakerEn', 'Çıxışçı'), field('published', 'Dərc olunub', 'checkbox')]
  },
  news: {
    label: 'Xəbərlər', title: 'titleAz', subtitle: 'categoryAz', status: 'published',
    fields: [...bilingual('titleAz', 'titleEn', 'Başlıq', 'text', true),
      ...bilingual('categoryAz', 'categoryEn', 'Kateqoriya'),
      ...bilingual('dateAz', 'dateEn', 'Tarix'),
      ...bilingual('summaryAz', 'summaryEn', 'Xülasə', 'textarea'),
      ...bilingual('fullTextAz', 'fullTextEn', 'Mətn', 'textarea'),
      field('imageUrl', 'Şəkil URL'), field('published', 'Dərc olunub', 'checkbox')]
  },
  mentors: {
    label: 'Mentorlar', title: 'name', subtitle: 'roleAz', status: 'published',
    fields: [field('name', 'Ad', 'text', true), ...bilingual('roleAz', 'roleEn', 'Rol'),
      field('category', 'Kateqoriya'), field('skills', 'Bacarıqlar (vergüllə ayırın)', 'list'),
      field('avatarUrl', 'Avatar URL'), field('linkedinUrl', 'LinkedIn URL'),
      field('githubUrl', 'GitHub URL'), field('published', 'Dərc olunub', 'checkbox')]
  },
  startups: {
    label: 'Startaplar', title: 'name', subtitle: 'stageAz', status: 'published',
    fields: [field('name', 'Ad', 'text', true), field('logoText', 'Loqo mətni'),
      field('logoColor', 'Loqo rəngi'), ...bilingual('taglineAz', 'taglineEn', 'Şüar'),
      ...bilingual('stageAz', 'stageEn', 'Mərhələ'), field('members', 'Üzv sayı', 'number'),
      ...bilingual('descriptionAz', 'descriptionEn', 'Təsvir', 'textarea', true),
      field('founders', 'Təsisçilər (JSON siyahısı)', 'json'),
      field('techStack', 'Texnologiyalar (vergüllə ayırın)', 'list'),
      ...bilingual('tractionAz', 'tractionEn', 'Nəticələr', 'textarea'),
      field('website', 'Vebsayt'), field('published', 'Dərc olunub', 'checkbox')]
  },
  partners: {
    label: 'Partnyorlar', title: 'name', subtitle: 'icon', status: 'published',
    fields: [field('name', 'Ad', 'text', true), field('icon', 'İkon'),
      field('published', 'Dərc olunub', 'checkbox')]
  }
};

export function payloadFromForm(form, config) {
  const result = {};
  for (const descriptor of config.fields) {
    const input = form.elements.namedItem(descriptor.key);
    if (descriptor.type === 'checkbox') result[descriptor.key] = input.checked;
    else if (descriptor.type === 'number') result[descriptor.key] = input.value ? Number(input.value) : null;
    else if (descriptor.type === 'list') result[descriptor.key] = input.value.split(',').map((item) => item.trim()).filter(Boolean);
    else if (descriptor.type === 'json') {
      const parsed = JSON.parse(input.value || '[]');
      if (!Array.isArray(parsed) || parsed.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
        throw new Error('Təsisçilər JSON obyektlərindən ibarət siyahı olmalıdır.');
      }
      result[descriptor.key] = parsed;
    } else result[descriptor.key] = input.value.trim() || null;
  }
  return result;
}
