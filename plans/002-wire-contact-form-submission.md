# Plan 002: Wire the contact form to a real submission endpoint

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report. When done, update this plan's row in `plans/README.md` unless a reviewer says they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3380d8b..HEAD -- src/components/contact-card.tsx src/app/api package.json README.md`
> If any in-scope file changed since this plan was written, compare current code against the excerpts below before proceeding. On mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `3380d8b`, 2026-06-13

## Why this matters

The landing page presents a contact form as the primary conversion path, but submitting it only waits 1.5 seconds, logs PII to the browser console, and resets the form. Real users can believe they contacted RantAI when no message was delivered. This plan adds a server-side endpoint and removes client-side PII logging.

## Current state

Relevant files:

- `src/components/contact-card.tsx` — client form using React Hook Form and Zod.
- `src/app/api` — existing API route location.
- `README.md` — environment variable documentation.

Current excerpt:

```ts
// src/components/contact-card.tsx:68-72
const onSubmit = async (data: ContactFormValues) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))
  console.log("Form submitted:", data)
  reset()
}
```

Existing conventions: API routes return `NextResponse.json(...)`; admin routes validate server-side before database writes. Use the same `@/` alias and TypeScript style.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0 |
| Tests | `npm test` | all tests pass |
| Lint | `npm run lint` | exit 0 if Plan 001 is done; otherwise no new errors in touched files |

## Scope

**In scope**:
- `src/components/contact-card.tsx`
- Create `src/app/api/contact/route.ts`
- `README.md` or `.env.local.example` only for documenting new env names if needed
- Optional focused tests under `__tests__/`

**Out of scope**:
- Adding a database-backed CRM/admin inbox.
- Adding a new email provider SDK dependency unless the operator explicitly picks one.
- Logging full contact submissions on client or server.

## Git workflow

- Branch: `codex/002-wire-contact-form-submission`
- Commit message: `feat: wire contact form submission`
- Do not push unless instructed.

## Steps

### Step 1: Add a server-side contact API

Create `src/app/api/contact/route.ts`.

Implement:
- `POST(req: NextRequest)`.
- Parse JSON safely.
- Validate with a Zod schema matching `ContactFormValues`: `name`, `email`, optional `organization`, `message`.
- If invalid, return `{ error: "Invalid contact submission" }` with status 400.
- If `CONTACT_WEBHOOK_URL` is missing, return `{ error: "Contact form is not configured" }` with status 503. Do not silently succeed.
- If configured, send a server-side `fetch` POST to `CONTACT_WEBHOOK_URL` with a JSON body containing the validated fields and a timestamp. Do not include secrets in the response.
- If the webhook fails, return status 502 with a generic error.
- On success, return `{ ok: true }`.

This uses a generic webhook because the repo has no email provider dependency today. If the operator wants Resend, SendGrid, Slack, or another provider, STOP and ask for provider-specific requirements instead of guessing.

**Verify**: `./node_modules/.bin/tsc --noEmit` exits 0.

### Step 2: Replace simulated client submission

In `src/components/contact-card.tsx`, replace the simulated `onSubmit` with a real `fetch("/api/contact", ...)`.

Required behavior:
- Send JSON with `Content-Type: application/json`.
- On success, reset the form.
- On failure, surface a user-visible error state. Use existing UI patterns; if no toast is imported in this component, a small inline error near the submit button is acceptable.
- Remove `console.log("Form submitted:", data)` entirely.

**Verify**: `rg -n "Form submitted|console\\.log\\(" src/components/contact-card.tsx src/app/api/contact/route.ts` returns no matches.

### Step 3: Document configuration

Document `CONTACT_WEBHOOK_URL` wherever env setup is documented. `README.md` currently lists `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, and `BLOB_READ_WRITE_TOKEN`.

If you update `.env.local.example`, note that `.gitignore` currently ignores `.env*`; do not force-add ignored files unless instructed.

**Verify**: `rg -n "CONTACT_WEBHOOK_URL" README.md .env.local.example` finds the documented variable.

### Step 4: Add focused tests if practical

If the existing Vitest setup can import the route without heavy Next mocking, add tests for:
- invalid payload returns 400,
- missing webhook env returns 503,
- successful webhook returns `{ ok: true }`.

If route testing requires substantial Next runtime mocking, STOP and report that a test harness plan is needed instead of building a fragile mock.

**Verify**: `npm test` exits 0.

## Test plan

Use existing tests under `__tests__/lib` as style examples: `describe`, `it`, `expect`. Prefer a pure exported schema/helper if route testing is awkward; keep the test focused on validation behavior.

## Done criteria

- [ ] Contact form no longer simulates success.
- [ ] No client-side logging of submitted PII remains.
- [ ] `/api/contact` validates input server-side.
- [ ] Missing delivery configuration fails clearly, not silently.
- [ ] `./node_modules/.bin/tsc --noEmit` passes.
- [ ] `npm test` passes.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- The operator expects a specific provider and has not supplied credentials/API shape.
- Route tests require broad Next.js mocking.
- The implementation would require adding a new package.

## Maintenance notes

Later, this can evolve into a DB-backed lead inbox or provider-specific integration. Reviewers should ensure no submitted message content is logged and that webhook failures are visible to the user.
