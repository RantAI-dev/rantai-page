# RantAI

Website dan CMS untuk [RantAI](https://www.rantai.dev): produk AI, layanan engineering, Academy, dan Insights, beserta dashboard admin untuk mengelola kontennya.

[![CI](https://github.com/RantAI-dev/rantai-page/actions/workflows/ci.yml/badge.svg)](https://github.com/RantAI-dev/rantai-page/actions/workflows/ci.yml)

**Live:** [www.rantai.dev](https://www.rantai.dev) · **Dibangun dengan:** Next.js 16, Neon PostgreSQL, Drizzle ORM, Tailwind CSS v4

## Fitur

- **Halaman publik:** Home, Products, Services, Academy, Insights (blog), dan Company, dengan animasi berbasis scroll yang tetap ringan dan stabil di HP.
- **CMS** di `/admin`:
  - artikel dengan editor Tiptap dan jadwal terbit
  - buku Academy
  - anggota tim
  - tag
  - pembuat thumbnail artikel
- **SEO dan preview share:**
  - gambar preview otomatis per halaman
  - `sitemap.xml`, `robots.txt`, dan `rss.xml`
  - URL kanonik dan data terstruktur (JSON-LD)
- **Keamanan:**
  - HTML artikel disanitasi
  - input admin divalidasi (zod)
  - login admin dengan batas percobaan
  - header keamanan (CSP, HSTS, dan lainnya)
- **Aksesibilitas:** diuji dengan axe-core (WCAG 2.1 AA).

## Halaman

| Route | Isi |
|---|---|
| `/` | Home |
| `/products` | Produk RantAI |
| `/services` | Layanan engineering |
| `/academy` | Library buku |
| `/blog`, `/blog/[slug]` | Insights: daftar artikel dan halaman baca |
| `/our-team` | Company (`/team` diarahkan ke sini) |
| `/admin` | CMS (perlu login) |

## Stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | Neon PostgreSQL + Drizzle ORM |
| UI | Tailwind CSS v4, shadcn/ui, Motion, Lenis |
| Editor | Tiptap |
| Auth | JWT (jose) + bcrypt |
| Storage | Vercel Blob |
| Test | Vitest |
| Hosting | Vercel (Analytics, Speed Insights, Cron) |

## Mulai

Butuh Node.js 22 atau lebih baru.

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya
npm run db:push              # buat tabel di database
npm run dev                  # http://localhost:3000
```

### Environment variables

Semua variabel dijelaskan di [`.env.example`](.env.example):

| Variabel | Untuk apa |
|---|---|
| `DATABASE_URL` | Koneksi Neon. Juga dibaca saat build, karena halaman di-render dari data CMS. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Login admin. Buat hash dengan `npm run db:generate-hash <password>`. |
| `JWT_SECRET` | Menandatangani sesi admin. **Wajib:** login menolak bekerja tanpanya. Pakai 32+ karakter acak, misalnya `openssl rand -base64 32`. |
| `BLOB_READ_WRITE_TOKEN` | Upload gambar dari admin. |
| `CRON_SECRET` | Mengamankan `/api/cron/*` (terbit terjadwal, bersih-bersih gambar). |

> Di file env yang dibaca shell, tulis setiap `$` di `ADMIN_PASSWORD_HASH` sebagai `\$`.

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm run start` | Build dan jalankan production |
| `npm run lint` | ESLint |
| `npm test` | Unit test (Vitest) |
| `npm run test:coverage` | Laporan coverage |
| `npm run db:push` | Sinkronkan schema ke database |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:generate-hash <password>` | Hash password admin |
| `npm run db:seed-tags` | Isi tag awal |

## Struktur

```
src/
  app/          route; komponen khusus satu halaman di app/<route>/_components
  components/   komponen bersama: layout, shared, blog, platform, effects, ui, admin
  hooks/        React hooks
  lib/          kode non-UI: blog, auth, db, data-table, seo, revalidate, ...
__tests__/      unit test, mengikuti struktur src/
```

Aturan lengkap letak kode ada di [AGENTS.md](AGENTS.md).

## Kontribusi

1. Buat branch dari `main`, lalu buka pull request. `main` dilindungi: tidak bisa di-push langsung.
2. PR baru bisa di-merge setelah dua check lolos:
   - **CI** (`.github/workflows/ci.yml`): lint, type check, unit test, dan audit dependency
   - **Vercel:** build dan preview deployment
3. Pesan commit memakai gaya Conventional Commits, misalnya `feat: …`, `fix: …`, `chore: …`.
4. Sertakan screenshot untuk perubahan tampilan, dan sebutkan dampak ke database, auth, environment, atau deployment kalau ada.

## Deployment

`main` otomatis ter-deploy ke Vercel; setiap PR mendapat preview deployment.

- Isi semua variabel dari `.env.example` di Vercel → Settings → Environment Variables.
- Cron (`vercel.json`) menjalankan terbit terjadwal dan bersih-bersih Blob setiap hari. Keduanya butuh `CRON_SECRET`.
- Header keamanan diatur di `next.config.ts`. CSP hanya aktif di production.
- Login admin dibatasi 5 percobaan gagal per IP per 15 menit, di memori tiap instance. Untuk batas yang pasti, tambahkan aturan rate limit `POST /api/auth/login` di Vercel Firewall.
