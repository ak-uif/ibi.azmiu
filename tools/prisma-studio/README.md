# Lokal Prisma Studio viewer

Bu alət yalnız lokal PostgreSQL `ibi` database-inə baxmaq üçündür. Java backend, Spring Data JPA və Flyway dəyişmir. Prisma migration əmrlərini işlətməyin və Studio-nu production-a deploy etməyin.

PostgreSQL-də `ibi_studio_ro` adlı hesab yalnız `CONNECT`, `USAGE` və mövcud 11 cədvələ `SELECT` hüququ ilə qurulub. Bu hesab məlumat əlavə edə, dəyişə və silə bilmir. Lokal başlanğıc skripti repo kökündəki ignore olunan `.env` faylından şifrəni götürür, `DATABASE_URL` dəyişənini yalnız proses üçün qurur; şifrə tracked fayllarda saxlanmır.

Repo kökündən Windows PowerShell-də:

```powershell
cd tools/prisma-studio
npm ci
.\start.ps1 -Pull
.\start.ps1
```

`-Pull` mövcud sxemi `prisma db pull` ilə oxuyub `prisma/schema.prisma` faylını yeniləyir; database-də migration və məlumat dəyişikliyi etmir. İkinci əmr Studio-nu `http://127.0.0.1:5555` ünvanında açır. Dayandırmaq üçün terminalda `Ctrl+C` basın.

Yeni Flyway cədvəlləri gələcəkdə əlavə olunarsa, read-only hesaba onların `SELECT` hüququ ayrıca verilməlidir. Bu viewer-də redaktə etməyə çalışmayın; database hüquqları bunu bloklayır.
