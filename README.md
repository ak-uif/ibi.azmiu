# İBİ AzMİU

AzMİU İBİ layihəsinin public saytı, admin paneli və Spring Boot backend-i bu repozitoriyadadır. Backend-də PostgreSQL sxemi, Flyway migration-ları və session əsaslı admin authentication var. Public müraciət formaları hələ API-yə qoşulmayıb; frontend-dən göndərilən məlumat saxlanmır.

## Frontend-i yerli işə salmaq

Mənbə qovluğundakı `index.html` faylını VS Code **Live Server** ilə birbaşa açmayın: Tailwind stillərinin yığılması üçün Vite lazımdır.

```bash
npm ci
npm run dev
```

Terminalda görünən yerli ünvanı brauzerdə açın.

Admin giriş səhifəsi `/admin`, qorunan dashboard isə uğurlu girişdən sonra `/admin/dashboard` ünvanındadır. Lokal frontend `VITE_API_BASE_URL=http://localhost:8080` vasitəsilə backend-ə qoşulur; dashboard göstəriciləri hələ nümunədir.

## Backend-i yerli işə salmaq (Windows)

Java 21 tələb olunur. Global Maven quraşdırmaq lazım deyil; layihənin Maven Wrapper-i istifadə edilir:

Əvvəl PostgreSQL-də local database və `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` environment variable-larını hazırlayın. Təlimat: [local setup](docs/setup.md).

```powershell
cd backend
java -version
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Backend `http://localhost:8080` ünvanında işləyir. `GET /api/health` cavabı `{"status":"ok","service":"ibi-backend"}`-dir. Ətraflı məlumat və paketləmə əmri [backend README](backend/README.md) faylındadır.

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
- `admin/` və `admin.html` — demo admin paneli
- `backend/` — Java 21 və Spring Boot 4.1.1 backend təməli
- `vercel.json` — admin URL-ləri üçün rewrite qaydaları

Gələcək mərhələlərdə müraciət formaları real API-yə bağlanmalıdır. Lokal `localhost:8080` backend-i Vercel-dəki frontend üçün əlçatan deyil; canlı admin girişi üçün ayrıca backend yayımı tələb olunur. Bu repozitoriyaya real şifrə və `.env` faylı əlavə etməyin.
