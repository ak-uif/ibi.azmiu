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
npm run test:admin
npm run build
```

Vite terminalda local ünvanı göstərir. `/admin` real backend login-inə qoşulur. Admin panelində proqram, tədbir, xəbər, mentor, startap və partnyor qeydləri lokal backend API-sindən idarə olunur. Public sayt həmin altı bölməni `/api/public/*` ünvanlarından oxuyur. Proqramlarda `open`, `active`, `soon` statusları; qalan beş bölmədə yalnız `published=true` qeydləri görünür. `draft`, `archived` və yayımlanmamış qeydlər public API-yə düşmür. Müraciət formaları hələ database-ə qoşulmayıb.

Lokal frontend başlamazdan əvvəl eyni terminalda `$env:VITE_API_BASE_URL='http://localhost:8080'` təyin edin. Bu public URL-dir, şifrə deyil; alternativ olaraq ignore olunan `.env` faylında saxlayın. Backend 8080 portunda işləməlidir. API boşdursa, bölmələr boş vəziyyət göstərir; backend işləmirsə, xəta mesajı görünür. `npm run test:public` public UI-nin yüklənmə, boş və xəta vəziyyətlərini yoxlayır.

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

## Tək lokal nümunə proqram

Köhnə public frontend nümunələrindən yalnız **Startap Akademiyası: 0-dan MVP-yə** proqramı saxlanılıb. Onu yalnız öz lokal `ibi` database-inizə əl ilə əlavə etmək üçün repo kökündən, `.env` dəyişənlərini terminal prosesinə yüklədikdən sonra bu əmri bir dəfə çalışdırın:

```powershell
$env:PGPASSWORD = $env:DB_PASSWORD
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -p 5432 -U $env:DB_USERNAME -d ibi -v ON_ERROR_STOP=1 -f tools/dev/seed-one-program.sql
Remove-Item Env:PGPASSWORD
```

`psql.exe` yolu PostgreSQL versiyanıza görə fərqlənə bilər. Skript təkrar işləndikdə eyni başlıqlı ikinci proqramı yaratmır. Production-da bu skripti işlətməyin; tətbiq onu avtomatik icra etmir. Admin panelində test üçün qaralama proqram və `published=false` xəbər yaradıb `/api/public/programs` və `/api/public/news` cavablarında görünmədiyini yoxlayın. Admin panelində dəyişiklikləri geri qaytarın və ya test üçün ayrı database istifadə edin.

Real şifrə, admin şifrəsi və digər secret-ləri `.env.example`-ə, sənədlərə və GitHub-a yazmayın. Lokal backend (`localhost:8080`) Vercel-dəki public frontend üçün əlçatan deyil; canlı admin girişini işlətmək üçün backend ayrıca yerləşdirilməli və API/CORS ünvanları uyğun konfiqurasiya olunmalıdır.
