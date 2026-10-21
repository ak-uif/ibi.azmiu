# Local development

Java 21, Node.js/npm və PostgreSQL serveri tələb olunur. Global Maven lazım deyil; backend-də Maven Wrapper var.

## Yoxlama

```powershell
java -version
node --version
npm --version
Get-Service -Name '*postgres*'
```

PostgreSQL xidməti `Running` olmalıdır. Server portu `5432`, backend portu `8080`, pgAdmin portu `8081` olaraq saxlanılır. pgAdmin PostgreSQL serverinin əvəzi deyil.

## Frontend

Repo kökündə:

```powershell
npm ci
npm run dev
npm run build
```

Vite terminalda local ünvanı göstərir. `/admin` real backend login-inə qoşulur; dashboard-dakı məzmun hələ nümunədir və public formalar database-ə yazmır. Frontend üçün `VITE_API_BASE_URL=http://localhost:8080` təyin edin. Bu dəyişən public URL-dir, şifrə deyil.

## Backend və database

PostgreSQL-də mövcud `ibi` database-indən istifadə edin. Repo kökündəki `.env.example`-i nümunə götürərək Git tərəfindən ignore olunan `.env` faylında `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `ADMIN_USERNAME=admin` və güclü `ADMIN_PASSWORD` saxlayın. `DB_URL` nümunəsi: `jdbc:postgresql://localhost:5432/ibi`. Backend `.env` faylını avtomatik oxumur; işlədəcəyiniz terminalda bu dəyişənləri environment variable kimi təyin edin. Admin şifrəsi yalnız ilk yaradılış üçün lazımdır və sonradan avtomatik dəyişdirilmir.

```powershell
cd backend
Get-Content ..\.env | ForEach-Object {
    if ($_ -match '^([A-Z_][A-Z0-9_]*)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
Invoke-RestMethod http://localhost:8080/api/health
```

Backend başlananda Flyway `V1` və `V2` migration-larını tətbiq edir; Hibernate entity-lərin sxemə uyğunluğunu yoxlayır. PostgreSQL serveri işləməli, göstərilən istifadəçinin database-də cədvəl yaratmaq icazəsi olmalıdır. Health cavabı `{"status":"ok","service":"ibi-backend"}`-dir. Local frontend origin-i dəyişərsə, `CORS_ALLOWED_ORIGINS` dəyişəninə onu ayrıca əlavə edin.

Real şifrə, admin şifrəsi və digər secret-ləri `.env.example`-ə, sənədlərə və GitHub-a yazmayın. Lokal backend (`localhost:8080`) Vercel-dəki public frontend üçün əlçatan deyil; canlı admin girişini işlətmək üçün backend ayrıca yerləşdirilməli və API/CORS ünvanları uyğun konfiqurasiya olunmalıdır.
