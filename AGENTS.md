# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router project for the RantAI landing page and CMS. Application routes live in `src/app`, shared UI components in `src/components`, reusable hooks in `src/hooks` and `src/lib/hooks`, and shared utilities/config in `src/lib`. Database schema and helpers are under `src/lib/db`, with Drizzle configuration in `drizzle.config.ts`. Static assets belong in `public`. Unit tests live in `__tests__/`, currently organized by domain such as `__tests__/lib`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js dev server at `http://localhost:3000`.
- `npm run build`: create a production build.
- `npm run start`: run the production server after building.
- `npm run lint`: run ESLint with Next.js Core Web Vitals and TypeScript rules.
- `npm test`: run the Vitest suite once.
- `npm run test:watch`: run Vitest in watch mode.
- `npm run test:coverage`: generate coverage with the V8 provider.
- `npm run db:push`: push the Drizzle schema to Neon PostgreSQL.
- `npm run db:studio`: open Drizzle Studio.
- `npm run db:generate-hash <password>`: generate the admin password hash.

## Coding Style & Naming Conventions

Use TypeScript and React functional components. Prefer the `@/` alias for imports from `src`. Keep component filenames kebab-case or clearly established local names, for example `blog-form.tsx`, `theme-toggle.tsx`, and `ColorBends.tsx`. Use Tailwind CSS v4 utilities and existing shadcn/ui patterns from `src/components/ui`. Run `npm run lint` before submitting changes. Prettier and `prettier-plugin-tailwindcss` are available; keep formatting consistent with the existing codebase.

## Testing Guidelines

Tests use Vitest in a Node environment with shared setup in `vitest.setup.ts`. Add tests under `__tests__/` using `*.test.ts` or `*.test.tsx` naming. Keep unit tests focused on public behavior, especially utilities, auth helpers, validation, and content normalization. Run `npm test` for routine checks and `npm run test:coverage` when touching shared library code or security-sensitive paths.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style prefixes such as `feat:` and `chore:`. Follow that pattern, for example `feat: add blog preview route` or `chore: update thumbnail copy`. Pull requests should include a short summary, testing performed, linked issue or context when available, and screenshots for visible UI changes. Call out database, auth, environment, or deployment impacts explicitly.

## Security & Configuration Tips

Create `.env.local` from the README variables: `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, and `BLOB_READ_WRITE_TOKEN`. Never commit secrets. Escape `$` characters in bcrypt hashes as `\$` in shell-loaded env files.
