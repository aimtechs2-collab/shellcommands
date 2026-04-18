# Learning Space

Interactive shell and Linux command learning app built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. It includes **Clerk** authentication and **Prisma** with **PostgreSQL** (tested with Neon) for future data features.

## Features

- Browse commands by category, search, and difficulty
- Learning paths, practice mode, quizzes, and resource links
- Sign in / sign up via Clerk (`/sign-in`, `/sign-up`) and account menu in the header
- Prisma ORM ready for users and posts (extend the schema as you add features)

## Requirements

- Node.js 20+ (recommended)
- npm
- A [Clerk](https://clerk.com) application (publishable + secret keys)
- A PostgreSQL database URL (e.g. [Neon](https://neon.tech))

## Quick start

```bash
git clone https://github.com/aimtechs2-collab/shellcommands.git
cd shellcommands
npm install
cp .env.example .env
```

Edit `.env` with your `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`.

Sync the database schema and run the dev server:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|------------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (client-safe) |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (server only) |

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for Clerk dashboard settings and database notes.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server on port 3000 |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to the database (no migration files) |
| `npm run db:migrate` | Create and apply a migration (development) |
| `npm run db:reset` | Reset database (destructive) |

## Project layout

```
src/
  app/                 # App Router: pages, layout, API routes
  components/          # UI (shadcn) and ClerkUserMenu
  lib/                 # Shared utilities and Prisma client (db.ts)
  middleware.ts        # Clerk session middleware
prisma/
  schema.prisma        # Data models
docs/                  # Additional documentation
```

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Documentation

- [Environment and secrets](docs/ENVIRONMENT.md)
- [Architecture overview](docs/ARCHITECTURE.md)

## License

Private project (`private: true` in `package.json`). Add a license file if you intend to open-source the repository.
