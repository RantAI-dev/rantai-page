# Plan 005: Remediate dependency advisories with controlled upgrades

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report. When done, update this plan's row in `plans/README.md` unless a reviewer says they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3380d8b..HEAD -- package.json package-lock.json drizzle.config.ts vitest.config.ts next.config.ts src`
> If any in-scope file changed since this plan was written, compare current package versions and audit output before proceeding. On mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/001-restore-lint-baseline.md recommended
- **Category**: migration
- **Planned at**: commit `3380d8b`, 2026-06-13

## Why this matters

`npm audit --audit-level=high` reports high-severity `esbuild` advisories through dev/build tooling and moderate `postcss` advisories through Next-related packages. These are mostly development/build exposure rather than direct public runtime code, so the right fix is controlled package upgrades and verification, not blind `npm audit fix --force`.

## Current state

Current package excerpts:

```json
// package.json:51-52
"drizzle-kit": "^0.31.10",
"drizzle-orm": "^0.45.2",
```

```json
// package.json:59,80,89
"next": "^16.2.3",
"@vitest/coverage-v8": "^4.1.5",
"vitest": "^4.1.5"
```

Audit observed on 2026-06-13:
- `esbuild <=0.28.0`, high severity, via `drizzle-kit`, `tsx`, and `vitest`.
- `postcss <8.5.10`, moderate severity, via `next`.
- `npm audit fix --force` suggested downgrades/breaking changes, so do not use it blindly.

Read-only npm metadata checked on 2026-06-13:
- `drizzle-kit`: latest `0.31.10` (already current).
- `tsx`: latest `4.22.4`.
- `vitest`: latest `4.1.8`.
- `next`: latest `16.2.9`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect tree | `npm ls esbuild postcss tsx vitest next drizzle-kit` | shows dependency paths |
| Upgrade | `npm install next@^16.2.9 vitest@^4.1.8 @vitest/coverage-v8@^4.1.8 tsx@^4.22.4` | package.json and lockfile update |
| Audit | `npm audit --audit-level=high` | exit 0 or only documented non-actionable advisories |
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0 |
| Tests | `npm test` | all tests pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `package.json`
- `package-lock.json`
- Minimal config/source changes required by patch/minor upgrades.

**Out of scope**:
- Downgrading major packages to satisfy audit.
- Large framework migrations.
- Replacing Drizzle, Next, or Vitest.
- Editing application code unless an upgraded package requires a small compatibility fix.

## Git workflow

- Branch: `codex/005-remediate-dependency-advisories`
- Commit message: `chore: remediate dependency advisories`
- Do not push unless instructed.

## Steps

### Step 1: Capture current dependency paths

Run:

```bash
npm ls esbuild postcss tsx vitest next drizzle-kit
npm audit --audit-level=high
```

Save the relevant package paths in your notes for the PR summary. Do not paste long audit output into source files.

**Verify**: Commands complete; `npm audit` may exit 1 before remediation.

### Step 2: Upgrade current patch/minor targets

Run:

```bash
npm install next@^16.2.9 vitest@^4.1.8 @vitest/coverage-v8@^4.1.8 tsx@^4.22.4
```

This should update `package.json` and `package-lock.json`. `drizzle-kit` is already at the latest published version observed during planning, so do not downgrade it.

**Verify**: `git diff -- package.json package-lock.json` shows only dependency/lockfile changes at this step.

### Step 3: Re-run verification

Run:

```bash
./node_modules/.bin/tsc --noEmit
npm test
npm run build
npm audit --audit-level=high
```

If `npm run lint` is already green from Plan 001, run it too. If Plan 001 has not landed, run `npm run lint` and ensure no new lint failures are attributable to this dependency plan.

**Verify**: Typecheck, tests, and build exit 0. Audit exits 0 or leaves only advisories that require upstream fixes unavailable through current package versions.

### Step 4: Handle remaining advisories conservatively

If high advisories remain:
- Check whether they are reachable only through `drizzle-kit` or another dev-only tool.
- Check `npm view <package> version` for current versions.
- If the direct package is already latest and the transitive vulnerability remains, document it in the plan/index or PR summary as an upstream waiting item.
- Do not apply `npm audit fix --force` if it proposes downgrades or major/breaking changes.

**Verify**: `npm audit --audit-level=high` result is understood and documented.

## Test plan

Use the full project verification suite because package upgrades affect build tooling:

- `./node_modules/.bin/tsc --noEmit`
- `npm test`
- `npm run build`
- `npm audit --audit-level=high`

## Done criteria

- [ ] Direct package updates are applied through `npm install`.
- [ ] `package-lock.json` is updated consistently.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Production build passes.
- [ ] High-severity audit is clean or remaining items are documented as upstream/unavailable.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- `npm install` wants to downgrade Next, Drizzle, or Vitest.
- `npm run build` fails due to framework behavior changes requiring application refactors.
- High advisories remain in direct runtime dependencies with no safe patch/minor upgrade path.

## Maintenance notes

Do not trust `npm audit fix --force` in this repo without reading the proposed diff. Reviewers should inspect package-lock changes and build output carefully.
