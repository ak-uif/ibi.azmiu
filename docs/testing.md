# Local regression tests

Backend integration tests use the PostgreSQL schema `ibi_phase14_test` inside the existing `ibi` database. The test profile sets the connection search path, Flyway schema, and Hibernate default schema to this isolated schema. Tests must not run against `public`.

Before the first run, create an **empty** `ibi_phase14_test` schema in pgAdmin with the local `DB_USERNAME` account as its owner. The account needs permission to create tables in that schema. Keep database credentials in the ignored local `.env` and load them into the terminal environment as described in [setup.md](setup.md). Do not put credentials in test files.

From `backend/`:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

The first backend run applies all Flyway migrations to the empty test schema and checks the resulting tables and JPA entities. Tests that create records use transaction rollback. Test CV files use a dedicated temporary directory. The test schema remains available for later runs; do not use Flyway `clean` on the development database.

From the repository root:

```powershell
npm run test:admin
npm run test:public
npm run build
```

The frontend tests use Node's built-in test runner. No browser automation framework is installed, so browser-level end-to-end tests are not part of this suite.
