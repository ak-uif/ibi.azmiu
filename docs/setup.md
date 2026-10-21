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

Vite terminalda local ünvanı göstərir. `/admin` və `/admin/dashboard` hazırda yalnız demo görünüşüdür; formalar database-ə yazmır.

## Backend və database

PostgreSQL-də `ibi` adlı local database yaradın (əgər artıq varsa, onu silməyin). Repo kökündəki `.env.example`-i nümunə götürərək Git tərəfindən ignore olunan `.env` faylında `DB_URL`, `DB_USERNAME` və `DB_PASSWORD` dəyərlərini saxlayın. `DB_URL` nümunəsi: `jdbc:postgresql://localhost:5432/ibi`. Backend `.env` faylını avtomatik oxumur; işlədəcəyiniz terminalda bu üç dəyişəni environment variable kimi təyin edin.

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
Invoke-RestMethod http://localhost:8080/api/health
```

Backend başlananda Flyway `V1` migration-ını tətbiq edir; Hibernate entity-lərin sxemə uyğunluğunu yoxlayır. Məlumat bazası bağlantısı və sınaqlar üçün PostgreSQL serveri işləməli, göstərilən istifadəçinin database-də cədvəl yaratmaq icazəsi olmalıdır. Health cavabı `{"status":"ok","service":"ibi-backend"}`-dir.

Real şifrə, admin şifrəsi və digər secret-ləri `.env.example`-ə, sənədlərə və GitHub-a yazmayın. Admin authentication bu mərhələnin hissəsi deyil.
