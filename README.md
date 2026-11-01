# RantAI Landing Page

Landing page dan CMS untuk [RantAI](https://rantai.dev) — dibangun dengan Next.js 16, Neon PostgreSQL, dan shadcn/ui.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: Custom JWT (jose) + bcrypt
- **UI**: shadcn/ui + Tailwind CSS v4
- **Editor**: Tiptap WYSIWYG
- **Storage**: Vercel Blob (thumbnail upload)
- **Testing**: Vitest

## Struktur Halaman

| Route | Keterangan |
|---|---|
| `/` | Home |
| `/products` | Produk RantAI |
| `/services` | Layanan engineering |
| `/academy` | Library buku |
| `/blog` | Insights: daftar artikel |
| `/blog/[slug]` | Halaman baca artikel |
| `/our-team` | Company: tim (`/team` mengarah ke sini) |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | Untuk mesin pencari dan pembaca RSS |
| `/admin` | CMS dashboard (protected) |
| `/admin/blog` | Kelola artikel |
| `/admin/books` | Kelola buku |
| `/admin/team` | Kelola anggota tim |

Letak kode (komponen per halaman, komponen bersama, `lib/`) dijelaskan di [AGENTS.md](AGENTS.md).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Salin `.env.example` menjadi `.env.local`, lalu isi nilainya:

```bash
cp .env.example .env.local
```

`JWT_SECRET` wajib diisi (login admin menolak bekerja tanpanya); pakai 32+ karakter acak, misalnya dari `openssl rand -base64 32`.

> **Penting:** Escape semua `$` dalam `ADMIN_PASSWORD_HASH` dengan `\$` agar tidak di-expand oleh shell.
> Contoh: `ADMIN_PASSWORD_HASH=\$2b\$12\$...`

Generate password hash:

```bash
npm run db:generate-hash <password>
```

### 3. Setup database

```bash
npm run db:push   # Push schema ke Neon
```

### 4. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Keterangan |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Run unit tests (vitest) |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run db:push` | Sinkronisasi schema ke database |
| `npm run db:studio` | Drizzle Studio (GUI database) |
| `npm run db:generate-hash` | Generate bcrypt hash untuk password |

## Testing

Unit test ada di `__tests__/`:

Struktur `__tests__/` mengikuti `src/` (misalnya `__tests__/lib/blog/sanitize.test.ts` menguji `src/lib/blog/sanitize.ts`). Yang dicakup antara lain: auth, sanitasi HTML artikel, validasi input admin, rate limit login, slug, tanggal, dan pemrosesan HTML artikel.

```bash
npm test
```

## CI

`.github/workflows/ci.yml` berjalan di setiap pull request dan push ke `main`: lint, type check, unit test, dan `npm audit` (high/critical di dependency production). Build ikut berjalan bila secret `DATABASE_URL` diisi di **Settings → Secrets and variables → Actions** (role database read-only sudah cukup); tanpa secret itu, langkah build dilewati.

## Deployment

Deploy ke [Vercel](https://vercel.com). Set semua variabel dari `.env.example` di Vercel project settings.

- Header keamanan (CSP, HSTS, X-Frame-Options, dll.) diatur di `next.config.ts`; CSP hanya aktif di production.
- Login admin dibatasi 5 percobaan gagal per IP per 15 menit, di memori tiap instance. Untuk batas yang pasti di semua instance, tambahkan aturan rate limit untuk `POST /api/auth/login` di Vercel Firewall.
