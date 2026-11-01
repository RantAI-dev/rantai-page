# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router project for the RantAI landing page and CMS. Database schema and helpers are under `src/lib/db`, with Drizzle configuration in `drizzle.config.ts`. Static assets belong in `public`. Unit tests live in `__tests__/`, mirroring `src` (for example `__tests__/lib/blog/date.test.ts` tests `src/lib/blog/date.ts`).

Where code goes:

```
src/
  app/                    routes only (URLs never depend on folder moves)
    page.tsx              home; its sections in app/_components/home/
    <route>/page.tsx      a public page
    <route>/_components/  components used by that page only
    admin/  api/  login/  CMS, route handlers, sign-in
  components/
    layout/    site chrome: navbar, footer, site-shell, section-nav, smooth-scroll
    shared/    building blocks used by several pages: page-hero, eyebrow, pill-link…
    blog/      article and post-card pieces used by more than one route
    platform/  the product reel, journey and demos (home + products)
    effects/   canvas/WebGL backgrounds: dot-grid, ghost-fibers, line-waves, ascii
    admin/  ui/ (shadcn)  tiptap/  data-table/
  hooks/       reusable React hooks
  lib/         non-UI code: auth, upload, utils, partners…
    blog/      posts queries, dates, slugs, publishing, article HTML, tag colours
    data-table/  table config, types, parsers, helpers
    db/        Drizzle schema and client
```

- Used by one page: put it in that route's `_components/`. Used by two or more: move it to `src/components/<role>/`.
- Import your own `_components` relatively (`./_components/x`); import everything else through `@/`. Pages never import another page's `_components`.
- File names are kebab-case (`team-grid.tsx`, `use-media-query.ts`).

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
