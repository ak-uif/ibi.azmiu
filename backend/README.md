# İBİ AzMİU backend (Phase 3)

Bu qovluq Java 21 və Spring Boot 4.1.1 ilə hazırlanmış minimal backend təməlidir. Spring Web MVC və Spring Boot Test-dən başqa birbaşa dependency yoxdur. Hazırda database, login və real biznes API-si yoxdur.

## Windows-da işə salmaq

```powershell
cd backend
java -version
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
```

Global Maven quraşdırmaq lazım deyil: `mvnw.cmd` Maven 3.10.0 versiyasını ilk işə salınmada yükləyir. İlk build Spring dependency-lərini də Maven Central-dan yükləyir.

Server `http://localhost:8080` ünvanında işləyir. Yoxlama:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

`GET /api/health` cavabı: `{"status":"ok","service":"ibi-backend"}`. Bu endpoint yalnız tətbiqin işlədiyini bildirir; PostgreSQL yoxlamır.
