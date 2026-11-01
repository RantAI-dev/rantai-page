# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router project for the RantAI landing page and CMS. Database schema and helpers are under `src/lib/db`, with Drizzle configuration in `drizzle.config.ts`. Static assets belong in `public`. Unit tests live in `__tests__/`, mirroring `src` (for example `__tests__/lib/blog/date.test.ts` tests `src/lib/blog/date.ts`).

Where code goes:

```
src/
  app/                    routes only (URLs never depend on folder moves)
    [locale]/             the public site, once per language (see Internationalization)
      layout.tsx          root layout: <html lang>, messages
      page.tsx            home; its sections in [locale]/_components/home/
      <route>/page.tsx    a public page
      <route>/_components/  components used by that page only
    (cms)/                admin, login and previews: own root layout, English only
    api/                  route handlers
    sitemap.ts robots.ts rss.xml/
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
  i18n/        next-intl setup: routing, navigation, request config, paths
  messages/    UI text: messages/<locale>/<namespace>.json
```

- Used by one page: put it in that route's `_components/`. Used by two or more: move it to `src/components/<role>/`.
- Import your own `_components` relatively (`./_components/x`); import everything else through `@/`. Pages never import another page's `_components`.
- File names are kebab-case (`team-grid.tsx`, `use-media-query.ts`).

## Internationalization

The public site is in English and Indonesian, with [next-intl](https://next-intl.dev). English lives at the root (`/products`), Indonesian under `/id` (`/id/products`). The CMS (`app/(cms)`) is English only.

- **No hard-coded UI text in public pages.** Put it in `src/messages/en/<namespace>.json` and the same key in `src/messages/id/<namespace>.json`; both files must have the same keys. Namespaces: `common` (navbar, footer, shell), `metadata` (titles, descriptions, preview cards), one per page area (`home`, `platform`, `products`, `services`, `academy`, `blog`, `company`, `notFound`). A new namespace must also be added to the list in `src/i18n/request.ts`.
- **Reading text.** Server components: `await getTranslations("ns")` from `next-intl/server`. Client components: `useTranslations("ns")` from `next-intl`. Keep icons, colours, ids and links in code, and only text in messages (`t.raw` for arrays).
- **New public page.** Create it under `app/[locale]/`, call `setRequestLocale(locale)` at the top of the page (keeps it static), export `generateMetadata` using `pageMetadata({ locale, page, path })` from `@/lib/seo`, and add its title and description to `metadata.json` in both languages. Add it to `src/app/sitemap.ts`.
- **Links.** Use `Link`, `redirect`, `usePathname` and `useRouter` from `@/i18n/navigation`, not `next/link` or `next/navigation`, so links keep the visitor's language.
- **Not translated.** Brand and product names (RantAI, RantAI Agents/Claw/LLMOps/Lakehouse, Academy, Insights) and CMS content from the database (posts, books, team names and roles). Articles are English for now, so `/id/blog/...` sets its canonical URL to the English page.
- **Indonesian style.** Professional and concise, natural rather than literal, and the reader is "Anda". Keep tech terms Indonesians use in English (AI, deploy, workflow, dashboard). Write it as if the page were made for Indonesian readers: the same information as the English, not a word-for-word translation. Indonesian runs longer, so shorten or rephrase until headings and descriptions stay within two lines on desktop and phone, and no more lines than the English.
- **Language choice.** Visitors are never redirected by browser language. An Indonesian browser on the English site sees a small "Tersedia dalam Bahasa Indonesia" offer (`components/layout/language-suggestion.tsx`); the navbar has an EN · ID switch.

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

## Releases & Versioning

Releases are automated with [release-please](https://github.com/googleapis/release-please) (`.github/workflows/release-please.yml`). Versions follow semantic versioning and are tagged `vX.Y.Z`; `v2.0.0` is the revamped site.

- Every merge to `main` updates an open **release PR** that bumps the version and adds the merged changes to `CHANGELOG.md`. Merging that PR creates the tag and the GitHub release. Merge it whenever a set of changes is worth a release; it does not need to happen on every PR.
- The version is decided by commit messages, so they must follow Conventional Commits:
  - `fix:` → patch (2.0.0 → 2.0.1)
  - `feat:` → minor (2.0.0 → 2.1.0)
  - `feat!:` or a `BREAKING CHANGE:` footer → major (2.0.0 → 3.0.0)
  - `perf:` → patch; `docs:`, `chore:`, `refactor:`, `ci:`, `test:` don't trigger a release on their own
- PRs are merged with rebase or merge commits, so every commit message on `main` counts. Keep each commit's prefix accurate. With squash merges, the PR title is what counts.
- Don't create tags or GitHub releases by hand, and don't edit `CHANGELOG.md`, `.release-please-manifest.json` or the `version` in `package.json` directly; release-please owns them.
- The workflow needs a `RELEASE_PLEASE_TOKEN` repository secret: a fine-grained personal access token for this repository with **Contents** and **Pull requests** set to read and write. Release PRs opened with the default `GITHUB_TOKEN` would not trigger CI, which `main` requires. Until the secret exists the workflow is skipped.

## Security & Configuration Tips

Create `.env.local` from the README variables: `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, and `BLOB_READ_WRITE_TOKEN`. Never commit secrets. Escape `$` characters in bcrypt hashes as `\$` in shell-loaded env files.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
