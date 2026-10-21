# İBİ AzMİU backend

Java 21 və Spring Boot 4.1.1 ilə hazırlanmış backend təməli. Spring Web MVC, Spring Data JPA, PostgreSQL driver, Flyway və Flyway PostgreSQL dəstəyi var. `V1` migration-ı məzmun və müraciətlər üçün 10 cədvəl yaradır. Hələ login, CRUD API və frontend-dən database-ə yazma yoxdur.

Windows-da global Maven lazım deyil; `mvnw.cmd` istifadə edin:

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
```

Başlamazdan əvvəl işlək PostgreSQL üçün `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` environment variable-larını təyin edin. Nümunə URL: `jdbc:postgresql://localhost:5432/ibi`. `.env` faylı avtomatik yüklənmir; real parolu heç vaxt repoya əlavə etməyin. Local quraşdırma addımları [setup sənədində](../docs/setup.md) verilib.

Server portu `8080`-dir. `GET http://localhost:8080/api/health` cavabı `{"status":"ok","service":"ibi-backend"}` olur. Tətbiq başlayanda Flyway migration-ı tətbiq edir və JPA sxemi yoxlayır; health endpoint özü ayrıca database sorğusu etmir.
