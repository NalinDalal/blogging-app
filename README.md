Simple blog app where a user can sign up, sign in, and create blog posts with timestamps.

Local database setup:

```bash
docker compose up -d db
```

The app expects Postgres on `localhost:5433`, which matches the included `docker-compose.yml` and `.env`.

After the database starts, run the Prisma setup:

```bash
npx prisma migrate deploy
```

For local development, if you have not created migrations for your current schema yet, use:

```bash
npx prisma migrate dev
```

Then start the app:

```bash
npm run dev
```
