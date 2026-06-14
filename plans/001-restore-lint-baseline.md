# Plan 001: Restore the lint baseline

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report. When done, update this plan's row in `plans/README.md` unless a reviewer says they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3380d8b..HEAD -- src/components/ColorBends.tsx src/components/GlassSurface.tsx src/components/LogoLoop.tsx src/components/ui/particles.tsx src/components/ui/carousel.tsx src/hooks/use-mobile.ts src/app/services/page.tsx src/components/admin/delete-button.tsx src/components/admin/thumbnail/decorations.ts src/components/contact-card.tsx src/components/motion.tsx src/features/book-library/book-library.tsx src/features/book-library/use-book-filter.ts src/proxy.ts`
> If any in-scope file changed since this plan was written, compare the current code against the excerpts below before proceeding. On mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `3380d8b`, 2026-06-13

## Why this matters

`npm run lint` is currently not a usable quality gate: it exits 1 with 27 errors and 27 warnings. That makes future work harder to review and lets real React hook, type, and rendering regressions blend into known noise. This plan restores a clean lint baseline without changing product behavior.

## Current state

Repo conventions: TypeScript, React functional components, `@/` imports, shadcn/ui, Tailwind v4. Match existing component style and avoid broad rewrites.

Important current excerpts:

- `package.json:9`: `"lint": "eslint"`
- `src/components/ColorBends.tsx:183`: `(renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace;`
- `src/components/GlassSurface.tsx:165-168`: an effect calls `supportsSVGFilters()` and `supportsBackdropFilter()` before those const functions are declared.
- `src/components/LogoLoop.tsx:336-375`: repeated `(item as any)` casts drive many `no-explicit-any` lint failures.
- `src/components/ui/particles.tsx:103-140`: effects call `initCanvas`, `animate`, and `onMouseMove` before those const functions are declared.
- `src/hooks/use-mobile.ts:8-15`: effect synchronously calls `setIsMobile(...)`.

Verification already observed: `npm test` passes, `./node_modules/.bin/tsc --noEmit` passes, `npm run lint` fails.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0, no errors |
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0 |
| Tests | `npm test` | 3 files and 24+ tests pass |

## Scope

**In scope**:
- Files listed in the drift check.
- Small type/helper changes inside those files only.

**Out of scope**:
- Changing UI behavior, animation design, routes, database code, or package versions.
- Disabling lint rules globally.
- Adding broad `eslint-disable` or `@ts-nocheck` comments.

## Git workflow

- Branch: `codex/001-restore-lint-baseline`
- Commit message example from history: `chore: restore lint baseline`
- Do not push unless instructed.

## Steps

### Step 1: Fix unused variables/imports

Remove or use unused symbols reported by lint:
- `src/app/services/page.tsx`: remove unused `cols` and `rows`.
- `src/components/admin/delete-button.tsx`: either use `redirectTo` after successful delete with `router.push(redirectTo)` if that matches existing callers, or remove the prop from the component and all callers.
- `src/components/contact-card.tsx`: remove the unused `GlassSurface` import while leaving the commented JSX alone only if desired.
- `src/components/motion.tsx`, `src/features/book-library/book-library.tsx`, `src/features/book-library/use-book-filter.ts`, `src/proxy.ts`: remove unused imports/variables.

**Verify**: `npm run lint` should show fewer `no-unused-vars` messages. It may still fail on other errors.

### Step 2: Replace avoidable `any` casts

For `ColorBends`, use the current Three.js types directly. `THREE.SRGBColorSpace` exists in the installed version, so the assignment should be typed without casting.

For `LogoLoop`, define explicit union types for node-backed and image-backed logo items near the existing item type definitions. Use a type guard around `'node' in item` and access typed properties instead of `(item as any)`.

For `blogColumns` and `DataTable`, only keep an `any` if TanStack's generic truly requires it; prefer `ColumnDef<BlogPost, unknown>[]` or a local generic type that typechecks.

**Verify**: `./node_modules/.bin/tsc --noEmit` exits 0; `npm run lint` has no `no-explicit-any` errors from these files.

### Step 3: Fix React hook compiler errors

For `GlassSurface`, move helper functions above effects or convert them to `useCallback` before first use. Avoid synchronous `setState` in effects where lint flags it; initialize state from a lazy initializer when safe, or set state inside a subscription/change callback pattern.

For `particles`, declare `initCanvas`, `animate`, and `onMouseMove` before effects, and wrap them in `useCallback` with correct dependencies if effects depend on them.

For `use-mobile`, initialize state lazily when `window` exists and keep the effect for subscription updates.

For `carousel`, adjust the selection initialization so the effect subscribes to Embla events without tripping `set-state-in-effect`; if the upstream shadcn pattern conflicts with the current React Compiler lint, isolate the initialization in a callback/event path rather than disabling the rule.

**Verify**: `npm run lint` exits 0 or only reports warnings that will be handled in Step 4.

### Step 4: Resolve remaining warnings

Handle warnings surfaced by `npm run lint`, including missing dependency arrays and `<img>` warnings. If an `<img>` is required for editor/node-view behavior, add a narrow inline explanation and disable only that line.

**Verify**: `npm run lint` exits 0.

## Test plan

No new tests are required unless behavior changes. If you change `DeleteButton` navigation behavior, add or manually verify affected admin pages. Final verification:

- `npm run lint` exits 0.
- `./node_modules/.bin/tsc --noEmit` exits 0.
- `npm test` exits 0.

## Done criteria

- [ ] `npm run lint` exits 0.
- [ ] `./node_modules/.bin/tsc --noEmit` exits 0.
- [ ] `npm test` exits 0.
- [ ] No new broad lint disables or `@ts-nocheck` comments were added.
- [ ] Only in-scope files changed.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- Fixing a lint error requires changing product behavior beyond a small bug-compatible cleanup.
- React Compiler warnings require a large redesign of animation components.
- The live lint output differs substantially from this plan's files and counts.
- Any verification command fails twice after reasonable fixes.

## Maintenance notes

Once this lands, keep `npm run lint` green before starting larger security or validation work. Reviewers should scrutinize hook dependency changes for stale closure bugs in animation components.
