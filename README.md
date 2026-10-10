# İBİ frontend

AzMİU İBİ saytının yalnız frontend hissəsi. Bu repozitoriyada backend və məlumat bazası yoxdur. Müraciət formaları hazırda nümayiş rejimindədir; göndərilən məlumat saxlanmır.

## Yerli işə salmaq

Mənbə qovluğundakı `index.html` faylını VS Code **Live Server** ilə birbaşa açmayın: Tailwind stillərinin yığılması üçün Vite lazımdır.

```bash
npm ci
npm run dev
```

Terminalda görünən yerli ünvanı brauzerdə açın.

## Yayım üçün yığmaq

```bash
npm run build
```

Hazır sayt `dist/` qovluğunda yaranır. Vercel-də framework kimi **Vite**, build əmri kimi `npm run build`, output directory kimi `dist` seçilə bilər.

Live Server istifadə etmək istəyirsinizsə, əvvəl `npm run build` işlədin, sonra **`dist/index.html`** faylını Live Server ilə açın. `dist` qovluğundakı `assets` qovluğu da yanında qalmalıdır.

## Əsas fayllar

- `index.html` — səhifənin quruluşu
- `style.css` — Tailwind və əlavə görünüş qaydaları
- `script.js` — dil dəyişmə, filtr, şablon məlumatlar və formaların frontend davranışı
- `vite.config.js` — yığma ayarı

Gələcəkdə backend qoşulanda formaların `handleModalSubmit` funksiyası real API-yə bağlanmalıdır.
