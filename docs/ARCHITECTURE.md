# Architecture overview

## Runtime stack

- **Next.js 16** (App Router, Turbopack in dev)
- **React 19** with **TypeScript**
- **Tailwind CSS 4** and **shadcn/ui** (Radix primitives)
- **Clerk** (`@clerk/nextjs`) for authentication UI and session handling
- **Prisma** as the ORM against **PostgreSQL**

## Request flow

1. **Middleware** (`src/middleware.ts`) runs Clerk’s `clerkMiddleware()` so sessions stay fresh across navigations.
2. **Root layout** (`src/app/layout.tsx`) wraps the tree in `ClerkProvider` and global styles/fonts.
3. The **home experience** is implemented as a large client component in `src/app/page.tsx` (shell curriculum, practice, quizzes). Consider splitting into smaller components and routes as the app grows.
4. **Auth pages** live at `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`, embedding Clerk’s `<SignIn />` and `<SignUp />` with path-based routing.
5. **Header actions** use `src/components/clerk-user-menu.tsx`, which relies on `useAuth()` (Clerk v7) for signed-in vs signed-out UI.

## Data layer

- `src/lib/db.ts` exports a singleton `PrismaClient` suitable for server-side usage.
- `prisma/schema.prisma` currently defines `User` and `Post` as starter models; they are not yet wired to Clerk webhooks or the main UI. You can extend models and add API routes or Server Actions when persisting learning progress or content.

## API

- `src/app/api/route.ts` exposes a minimal JSON example. Add route handlers under `src/app/api/...` as needed.

## Build configuration

- `next.config.ts` sets `output: "standalone"` for container-style deploys, and currently skips failing the build on TypeScript errors (`ignoreBuildErrors`). Tighten this when the codebase is ready for strict CI.
