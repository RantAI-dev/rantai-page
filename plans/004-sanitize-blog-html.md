# Plan 004: Sanitize CMS blog HTML before public rendering

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report. When done, update this plan's row in `plans/README.md` unless a reviewer says they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3380d8b..HEAD -- src/components/blog-post-view.tsx src/lib/blog.ts src/lib/blog-input.ts src/components/tiptap src/app/api/admin/blog src/app/(admin-preview)/admin/blog/preview __tests__ package.json package-lock.json`
> If any in-scope file changed since this plan was written, compare current code against the excerpts below before proceeding. On mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `3380d8b`, 2026-06-13

## Why this matters

Blog posts are edited in the CMS and then rendered on public pages as raw HTML. Even if only admins can edit posts, a compromised admin session, pasted unsafe HTML, or a direct API call can persist markup that executes for public readers. Sanitization should preserve normal Tiptap article markup while stripping scripts, event handlers, and unsafe URLs.

## Current state

Relevant excerpts:

```tsx
// src/components/blog-post-view.tsx:168-170
<div
  className="prose ..."
  dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }}
/>
```

```ts
// src/lib/blog.ts:49
contentHtml: post.content,
```

```tsx
// src/components/admin/blog-form.tsx:58
body: JSON.stringify(normalizeBlogInput({ title, slug, content, excerpt, tag, author, thumbnail, published })),
```

Tiptap extensions currently include links, images, text styles, highlight, underline, headings, lists, code blocks, and alignment.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install if needed | `npm install <sanitizer-package>` | package.json and lockfile update |
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0 |
| Tests | `npm test` | all tests pass |
| Lint | `npm run lint` | exit 0 if Plan 001 is done; otherwise no new errors in touched files |

## Scope

**In scope**:
- `src/lib/blog-input.ts` or a new `src/lib/sanitize-html.ts`.
- `src/lib/blog.ts`.
- `src/app/api/admin/blog/route.ts` and `[id]/route.ts` if sanitizing on write.
- `src/components/blog-post-view.tsx` if sanitizing on read/render.
- Tests under `__tests__/lib`.
- `package.json` and `package-lock.json` only if adding a sanitizer dependency.

**Out of scope**:
- Replacing Tiptap.
- Rewriting stored post content wholesale without a migration plan.
- Sanitizing trusted static SVG decoration previews; this plan is only public blog content.

## Git workflow

- Branch: `codex/004-sanitize-blog-html`
- Commit message: `fix: sanitize blog html`
- Do not push unless instructed.

## Steps

### Step 1: Choose the sanitizer boundary

Prefer a small helper such as `sanitizeBlogHtml(html: string): string` in `src/lib/sanitize-html.ts` or `src/lib/blog-input.ts`.

Use a well-maintained sanitizer package if one is already available or acceptable to install. If adding a dependency, choose a server-compatible HTML sanitizer and update `package-lock.json` through `npm install <package>`, not by hand.

Sanitizer policy must:
- allow basic article tags emitted by Tiptap: paragraphs, headings, lists, blockquote, code/pre, strong/em/u/s, links, images, horizontal rules, spans for limited styles if needed;
- strip `<script>`, `<iframe>`, unknown interactive tags, and all `on*` event attributes;
- restrict `href` and `src` protocols to `https:`, `http:` where intentionally allowed, `mailto:` for links if desired, and relative paths where safe;
- strip `javascript:` and `data:` URLs.

**Verify**: `./node_modules/.bin/tsc --noEmit` exits 0.

### Step 2: Apply sanitization consistently

Choose one primary storage/display strategy:

- Preferred: sanitize on write in blog POST/PUT before saving, and also sanitize on read in `getPostBySlug` as a defense-in-depth fallback for existing rows.
- Acceptable: sanitize only on read/render if preserving raw editor output in the DB is required.

Do not leave public rendering dependent on unsanitized `post.content`.

**Verify**: `rg -n "dangerouslySetInnerHTML" src/components/blog-post-view.tsx` still finds the render point, but the value feeding it is sanitized by a named helper.

### Step 3: Add tests for unsafe HTML

Add `__tests__/lib/sanitize-html.test.ts` or extend an existing lib test.

Cover:
- removes `<script>`,
- removes event handler attributes such as `onerror`,
- removes or neutralizes `javascript:` links,
- preserves normal Tiptap output like `<p>`, `<h2>`, `<ul><li>`, `<strong>`, `<a href="https://...">`, and `<img src="https://...">`.

**Verify**: `npm test` exits 0 and includes sanitizer tests.

### Step 4: Check editor preview behavior

The admin preview route maps raw DB content to `BlogPostView`:

```ts
// src/app/(admin-preview)/admin/blog/preview/[slug]/page.tsx:19
contentHtml: post.content,
```

Ensure preview uses the same sanitized path or sanitized helper, so preview matches public safety behavior.

**Verify**: `./node_modules/.bin/tsc --noEmit` exits 0.

## Test plan

Unit tests are required for sanitizer behavior. Full browser XSS proofs are out of scope; do not include exploit strings in docs beyond minimal inert examples in tests.

## Done criteria

- [ ] Public blog HTML is sanitized before entering `dangerouslySetInnerHTML`.
- [ ] Admin preview uses the same safety policy.
- [ ] Sanitizer tests cover dangerous and allowed markup.
- [ ] `./node_modules/.bin/tsc --noEmit` passes.
- [ ] `npm test` passes.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- Sanitizer dependency choice is unclear or blocked by package policy.
- Normal existing Tiptap content is heavily broken by the sanitizer policy.
- A safe fix requires a DB migration of existing blog content.

## Maintenance notes

When adding new Tiptap extensions, update the sanitizer allowlist and tests in the same PR. Reviewers should compare rendered articles before/after to ensure formatting survives.
