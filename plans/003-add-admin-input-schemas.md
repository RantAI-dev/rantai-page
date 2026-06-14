# Plan 003: Add server-side schemas for books and team admin input

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report. When done, update this plan's row in `plans/README.md` unless a reviewer says they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3380d8b..HEAD -- src/app/api/admin/books/route.ts src/app/api/admin/books/[id]/route.ts src/app/api/admin/team/route.ts src/app/api/admin/team/[id]/route.ts src/components/admin/book-form.tsx src/components/admin/team-form.tsx src/features/book-library/book-library.tsx src/app/our-team/_components/team-grid.tsx src/app/team/page.tsx src/lib`
> If any in-scope file changed since this plan was written, compare current code against the excerpts below before proceeding. On mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW-MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `3380d8b`, 2026-06-13

## Why this matters

Books and team admin APIs currently destructure raw JSON and write it directly to public-facing database fields. Those fields later become image URLs and outbound links in public pages. Server-side schemas will prevent invalid payloads, unsafe link protocols, and inconsistent null/default handling.

## Current state

Relevant excerpts:

```ts
// src/app/api/admin/books/route.ts:20-29
const body = await req.json();
const { code, name, category, imageUrl, url, orderIndex } = body;
if (!code || !name || !category || !imageUrl) {
  return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
}
```

```ts
// src/app/api/admin/team/route.ts:20-29
const body = await req.json();
const { name, role, bio, imageUrl, linkedin, github, orderIndex } = body;
```

Public rendering:

- `src/features/book-library/book-library.tsx:141-143` renders `book.url` as an external `<a href>`.
- `src/app/our-team/_components/team-grid.tsx:83-95` renders `member.github` and `member.linkedin`.
- `src/app/team/page.tsx:71-76` renders the same team links on the legacy team route.

Existing validation pattern:

- `src/lib/blog-input.ts` normalizes blog payloads and returns stable error strings.
- `zod` is already installed in `package.json`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0 |
| Tests | `npm test` | all tests pass |
| Lint | `npm run lint` | exit 0 if Plan 001 is done; otherwise no new errors in touched files |

## Scope

**In scope**:
- Create `src/lib/admin-input.ts` or similar.
- Update books/team admin API route handlers.
- Add unit tests under `__tests__/lib/admin-input.test.ts`.
- Small client form alignment only if needed.

**Out of scope**:
- Changing database schema.
- Changing public page designs.
- Adding URL preview/fetching.
- Reworking blog validation, except matching its conventions.

## Git workflow

- Branch: `codex/003-add-admin-input-schemas`
- Commit message: `feat: validate admin cms input`
- Do not push unless instructed.

## Steps

### Step 1: Create shared input schemas

Create `src/lib/admin-input.ts` using Zod.

Implement normalizers for:
- Book input: `code`, `name`, `category`, `imageUrl`, optional `url`, optional `orderIndex`.
- Team input: `name`, `role`, optional `bio`, `imageUrl`, `linkedin`, `github`, optional `orderIndex`.

Rules:
- Required strings trim and must be non-empty.
- Optional strings trim and become `null` if empty.
- `orderIndex` must be a finite integer; default to `0` on create if missing.
- URLs used as external links must use `https:`. Allow `imageUrl` from Vercel Blob HTTPS URLs and existing HTTPS image URLs. If local image paths are intentionally supported, allow strings starting with `/`.
- Reject `javascript:`, `data:`, and other non-HTTPS link protocols.
- Return stable error messages like `"Missing required fields"` or `"Invalid URL"`; do not leak raw parser details.

**Verify**: `./node_modules/.bin/tsc --noEmit` exits 0.

### Step 2: Update book routes

In `src/app/api/admin/books/route.ts`:
- Replace raw destructuring with the shared book normalizer.
- Return 400 on validation error.
- Insert only normalized values.

In `src/app/api/admin/books/[id]/route.ts`:
- Validate PUT body with the same schema.
- Preserve existing 404 behavior.
- Consider wrapping unique constraint/database errors in a generic JSON 500/409 instead of throwing raw route errors.

**Verify**: `./node_modules/.bin/tsc --noEmit` exits 0.

### Step 3: Update team routes

In `src/app/api/admin/team/route.ts` and `src/app/api/admin/team/[id]/route.ts`:
- Replace raw destructuring with shared team normalizer.
- Return 400 on validation error.
- Preserve revalidation for `/our-team` and `/team`.

**Verify**: `./node_modules/.bin/tsc --noEmit` exits 0.

### Step 4: Add unit tests

Create `__tests__/lib/admin-input.test.ts`, modeled after `__tests__/lib/slug.test.ts`.

Cover:
- trims valid book/team values,
- converts empty optional values to `null`,
- defaults missing `orderIndex` to `0`,
- rejects missing required fields,
- rejects non-HTTPS external links for `url`, `linkedin`, and `github`,
- accepts HTTPS links and local image paths if allowed.

**Verify**: `npm test` exits 0 and includes the new test file.

## Test plan

Primary coverage is unit-level normalization tests. No database integration tests are required for this plan.

## Done criteria

- [ ] Books and team routes no longer write raw request body fields directly.
- [ ] Shared schemas/normalizers exist and are tested.
- [ ] Unsafe external link protocols are rejected.
- [ ] `./node_modules/.bin/tsc --noEmit` passes.
- [ ] `npm test` passes.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- Product requirements need non-HTTPS external links.
- Existing production data uses `data:` image URLs or non-HTTPS links that would be rejected.
- Validation requires a database migration.

## Maintenance notes

When adding new CMS entities, reuse this validation pattern instead of ad hoc route destructuring. Reviewers should check that public link fields cannot store executable protocols.
