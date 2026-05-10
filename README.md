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
| `/` | Landing page |
| `/blog` | Daftar artikel |
| `/blog/[slug]` | Detail artikel |
| `/academy` | Library buku |
| `/team` | Halaman tim |
| `/admin` | CMS dashboard (protected) |
| `/admin/blog` | Kelola artikel |
| `/admin/books` | Kelola buku |
| `/admin/team` | Kelola anggota tim |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Buat file `.env.local`:

```env
DATABASE_URL=          # Neon connection string
ADMIN_EMAIL=           # Email login CMS
ADMIN_PASSWORD_HASH=   # bcrypt hash dari password (lihat db:generate-hash)
JWT_SECRET=            # Random string panjang untuk sign JWT
BLOB_READ_WRITE_TOKEN= # Vercel Blob token
```

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

```
__tests__/
  lib/
    auth.test.ts    # hashPassword, verifyPassword, createToken, verifyToken
    utils.test.ts   # cn() class merger
    slug.test.ts    # generateSlug()
```

```bash
npm test
```

## Deployment

Deploy ke [Vercel](https://vercel.com). Pastikan environment variables sudah di-set di Vercel project settings, termasuk `DATABASE_URL` dari Neon dan `BLOB_READ_WRITE_TOKEN` dari Vercel Blob.
