# İBİ AzMİU backend

Java 21 və Spring Boot 4.1.1 backend-i. Spring Web MVC, Spring Data JPA, PostgreSQL driver, Flyway və Spring Security var. `V1` 10 məzmun/müraciət cədvəlini, `V2` isə `admin_users` cədvəlini yaradır. Məzmun CRUD API-si və public formaların database bağlantısı hələ yoxdur.

Windows-da global Maven lazım deyil; `mvnw.cmd` istifadə edin:

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
```

Başlamazdan əvvəl `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `ADMIN_USERNAME` və ilk admin üçün `ADMIN_PASSWORD` environment variable-larını təyin edin. Nümunə URL: `jdbc:postgresql://localhost:5432/ibi`. İlk admin yalnız bir dəfə yaradılır; şifrə BCrypt hash kimi saxlanır. Mövcud admin yenidən yazılmır. `.env` avtomatik yüklənmir; real parolu repoya əlavə etməyin. Ətraflı [setup sənədinə](../docs/setup.md) baxın.

Server portu `8080`-dir. `GET http://localhost:8080/api/health` cavabı `{"status":"ok","service":"ibi-backend"}` olur. Tətbiq başlayanda Flyway migration-ı tətbiq edir və JPA sxemi yoxlayır; health endpoint özü ayrıca database sorğusu etmir.

Authentication API: `GET /api/auth/csrf`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`. Sessiya HttpOnly cookie ilə saxlanır, POST sorğuları CSRF token tələb edir. `GET /api/admin/ping` yalnız admin sessiyası ilə `200`, əks halda `401` qaytarır. Public admin qeydiyyatı yoxdur.
