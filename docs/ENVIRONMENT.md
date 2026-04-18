# Environment and configuration

## Local `.env`

Copy `.env.example` to `.env` in the project root. The repository ignores `.env` and other `.env.*` files so secrets are not committed.

## Database (`DATABASE_URL`)

Prisma uses PostgreSQL. Typical setup:

1. Create a database (Neon, Supabase, local Postgres, etc.).
2. Copy the connection string into `DATABASE_URL`.
3. If the URL contains `&` (query parameters), wrap the whole value in double quotes in `.env`.

After changing the URL or schema:

```bash
npx prisma generate
npx prisma db push
```

Use `npm run db:migrate` when you want versioned migration files instead of `db push`.

## Clerk

1. Create an application in the [Clerk Dashboard](https://dashboard.clerk.com).
2. Under **API Keys**, copy the **Publishable key** and **Secret key** into `.env`.
3. Under **Paths**, ensure hosted sign-in/sign-up paths match the app (this project uses `/sign-in` and `/sign-up` with catch-all routes).
4. Add **Allowed origins** and redirect URLs for each environment, for example:
   - Development: `http://localhost:3000`
   - Production: your deployed origin (e.g. `https://your-domain.com`)

Optional variables (only if Clerk asks for explicit URLs):

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`

## Production builds

- Set the same variables in your host (Vercel, Docker, etc.); do not rely on a committed `.env`.
- Run `npm run build` in CI to catch build failures early.
