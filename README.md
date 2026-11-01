# RantAI

The website and CMS for [RantAI](https://www.rantai.dev): AI products, engineering services, the Academy and Insights, plus an admin dashboard to manage the content.

[![CI](https://github.com/RantAI-dev/rantai-page/actions/workflows/ci.yml/badge.svg)](https://github.com/RantAI-dev/rantai-page/actions/workflows/ci.yml)

**Live:** [www.rantai.dev](https://www.rantai.dev) · **Built with:** Next.js 16, Neon PostgreSQL, Drizzle ORM, Tailwind CSS v4

## Features

- **Public pages:** Home, Products, Services, Academy, Insights (blog) and Company, with scroll-driven animation that stays light and stable on phones.
- **English and Indonesian:** English at `/`, Indonesian at `/id`, with a language switch and hreflang for search engines (next-intl).
- **CMS** at `/admin`:
  - posts with a Tiptap editor and scheduled publishing
  - Academy books
  - team members
  - tags
  - a thumbnail designer for posts
- **SEO and link previews:**
  - a generated preview image for every page
  - `sitemap.xml`, `robots.txt` and `rss.xml`
  - canonical URLs and structured data (JSON-LD)
- **Security:**
  - sanitized article HTML
  - validated admin input (zod)
  - rate-limited admin sign-in
  - security headers (CSP, HSTS and more)
- **Accessibility:** checked with axe-core (WCAG 2.1 AA).

## Pages

| Route | Content |
|---|---|
| `/` | Home |
| `/products` | RantAI products |
| `/services` | Engineering services |
| `/academy` | Book library |
| `/blog`, `/blog/[slug]` | Insights: post list and reading page |
| `/our-team` | Company (`/team` redirects here) |
| `/admin` | CMS (sign-in required) |

## Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| i18n | next-intl (English, Indonesian) |
| Database | Neon PostgreSQL + Drizzle ORM |
| UI | Tailwind CSS v4, shadcn/ui, Motion, Lenis |
| Editor | Tiptap |
| Auth | JWT (jose) + bcrypt |
| Storage | Vercel Blob |
| Tests | Vitest |
| Hosting | Vercel (Analytics, Speed Insights, Cron) |

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:push              # create the tables
npm run dev                  # http://localhost:3000
```

### Environment variables

Every variable is described in [`.env.example`](.env.example):

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Neon connection string. Also read at build time, because pages are prerendered from CMS data. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Admin sign-in. Create the hash with `npm run db:generate-hash <password>`. |
| `JWT_SECRET` | Signs admin sessions. **Required:** sign-in refuses to work without it. Use 32+ random characters, e.g. `openssl rand -base64 32`. |
| `BLOB_READ_WRITE_TOKEN` | Image uploads from the admin. |
| `CRON_SECRET` | Protects `/api/cron/*` (scheduled publishing, image clean-up). |

> In env files that a shell reads, write each `$` in `ADMIN_PASSWORD_HASH` as `\$`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm run start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run test:coverage` | Coverage report |
| `npm run db:push` | Sync the schema to the database |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:generate-hash <password>` | Hash the admin password |
| `npm run db:seed-tags` | Seed the initial tags |

## Project structure

```
src/
  app/          [locale]/ = public site (en at /, id at /id); (cms)/ = admin and login
  messages/     UI text per language: messages/<locale>/<namespace>.json
  components/   shared components: layout, shared, blog, platform, effects, ui, admin
  hooks/        React hooks
  lib/          non-UI code: blog, auth, db, data-table, seo, revalidate, ...
__tests__/      unit tests, mirroring src/
```

The full rules for where code goes are in [AGENTS.md](AGENTS.md).

## Contributing

1. Branch from `main` and open a pull request. `main` is protected and can't be pushed to directly.
2. A PR can merge once both checks pass:
   - **CI** (`.github/workflows/ci.yml`): lint, type check, unit tests and a dependency audit
   - **Vercel:** build and preview deployment
3. Commit messages follow Conventional Commits, e.g. `feat: …`, `fix: …`, `chore: …`. They also decide the next version: releases are cut automatically by release-please (see [AGENTS.md](AGENTS.md#releases--versioning) and the [releases page](https://github.com/RantAI-dev/rantai-page/releases)).
4. Include screenshots for visual changes, and call out any database, auth, environment or deployment impact.

## Deployment

`main` deploys to Vercel automatically, and every PR gets a preview deployment.

- Set every variable from `.env.example` in Vercel → Settings → Environment Variables.
- Cron jobs (`vercel.json`) run scheduled publishing and Blob clean-up daily. Both need `CRON_SECRET`.
- Security headers are set in `next.config.ts`. The CSP is only active in production.
- Admin sign-in allows 5 failed attempts per IP per 15 minutes, counted in each instance's memory. For a hard limit, add a rate-limit rule for `POST /api/auth/login` in the Vercel Firewall.
