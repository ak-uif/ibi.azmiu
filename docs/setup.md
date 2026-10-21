# Local development setup

Bu sənəd 1-ci mərhələdəki frontend repo hazırlığı üçündür. Bu mərhələdə Spring Boot backend, database modeli və PostgreSQL schema yaradılmır.

## Mühiti yoxlamaq

PowerShell-də aşağıdakı əmrlərlə əsas alətlərin vəziyyətini yoxlayın:

```powershell
java -version
node --version
npm --version
git --version
```

Java 21 gözlənilir. Bu mərhələnin frontend build-i üçün Node.js, npm və Git kifayətdir.

Maven ayrıca quraşdırılmayıbsa, gələcək Spring Boot mərhələsində Maven Wrapper (`mvnw.cmd`) istifadə olunmalıdır. Hazırkı frontend repo-da Maven layihəsi yoxdur.

## Frontend-i işə salmaq

Repo qovluğunda:

```powershell
npm ci
npm run dev
```

Terminalda göstərilən `http://localhost:5173` ünvanını brauzerdə açın. Production build-i yoxlamaq üçün:

```powershell
npm run build
```

Build nəticəsi `dist/` qovluğunda yaranır. `dist/` və `node_modules/` Git-ə göndərilmir.

## PostgreSQL serverini yoxlamaq

Windows xidmətlərinin içində PostgreSQL xidmətini axtarın:

```powershell
Get-Service -Name '*postgres*'
```

Xidmət tapıldıqda statusu `Running` olmalıdır. PostgreSQL client aləti PATH-dədirsə, əlavə yoxlama:

```powershell
psql --version
psql -h localhost -U postgres -d postgres
```

Parol soruşularsa, yalnız local PostgreSQL quraşdırılarkən təyin etdiyiniz paroldan istifadə edin. Parolu repoya, `.env.example`-ə və ya commit mesajına yazmayın. Bu mərhələdə PostgreSQL schema-sı dəyişdirilmir.

pgAdmin quraşdırılıbsa, onu açıb serverin `localhost` bağlantısının statusunu yoxlamaq olar. pgAdmin yalnız idarəetmə interfeysidir; PostgreSQL server xidmətinin özünün işləməsi də lazımdır.

## Gələcək database bağlantısı üçün dəyişənlər

Gələcək Spring Boot backend üçün local mühitdə aşağıdakı dəyişənlər lazım olacaq:

- `DB_URL` — PostgreSQL JDBC bağlantısı, məsələn `jdbc:postgresql://localhost:5432/ibi`
- `DB_USERNAME` — local database istifadəçisi
- `DB_PASSWORD` — həmin istifadəçinin local parolu
- `ADMIN_USERNAME` — ilkin admin hesabının username-i
- `ADMIN_PASSWORD` — ilkin admin hesabının parolu
- `CORS_ALLOWED_ORIGINS` — local frontend ünvanı, məsələn `http://localhost:5173`

`.env.example` yalnız adları və nümunə dəyərləri göstərir. Local real dəyərlər üçün `.env` istifadə edin; `.env` və `.env.*` Git-ə göndərilmir. Real şifrə, token və database credential-i GitHub-a yazmayın.
