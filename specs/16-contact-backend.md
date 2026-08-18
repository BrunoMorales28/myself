# 16 — Contact Backend

Status: Implemented
Depends on: [15-contact-form-ui](./15-contact-form-ui.md)

## Goal

Give `POST /api/contact` — the endpoint spec 15's form already calls and currently gets a real `404` from — an actual implementation: validate the submission server-side, persist it to Postgres, and return a response the form's existing success/error toast already knows how to handle. No email/WhatsApp notifications yet (spec 17); this spec is "the message safely lands in a database," not "Bruno finds out about it."

## Scope

- **Database**: Vercel Postgres (Neon under the hood, provisioned and linked via the Vercel dashboard — Bruno's action, not this spec's code) — a `contact_submissions` table: `id` (serial primary key), `name` (text), `email` (text), `message` (text), `created_at` (timestamp, default now). No IP address, user agent, or other metadata stored — keeps the schema minimal and avoids taking on privacy/retention questions this project doesn't otherwise need to answer.
- **Drizzle ORM**: `drizzle-orm` + `@neondatabase/serverless` (the current SDK for Vercel's Postgres-via-Neon integration — see Implementation notes for why not `@vercel/postgres`) for the query layer; `drizzle-kit` (dev dependency) for schema migrations.
  - `src/lib/db/schema.ts` — the `contactSubmissions` table definition (Drizzle's `pgTable`).
  - `src/lib/db/client.ts` — a lazily-constructed shared `db` instance (`drizzle(sql, { schema })` via `drizzle-orm/neon-http`, reading `POSTGRES_URL` from the environment — see Implementation notes for why construction is deferred).
  - `drizzle.config.ts` (repo root) — points `drizzle-kit` at the schema file and `POSTGRES_URL` for generating/applying migrations.
  - A generated SQL migration under `drizzle/` — generated as part of this spec's implementation, but actually _applying_ it against a real database is Bruno's step once he's linked a real Vercel Postgres instance (this sandboxed implementation environment has no live database to push to).
- **Shared validation schema**: the Yup schema currently inlined in spec 15's `ContactForm` moves to `src/lib/contactValidation.ts`, exported and imported by both the client form and this spec's API route — one schema, not two copies that can drift.
- **`src/app/api/contact/route.ts`**: `POST` handler —
  1. Parses the JSON body (`name`, `email`, `message`).
  2. Re-validates server-side with the shared Yup schema (never trust client-only validation — a request can always bypass the browser).
  3. On validation failure: `400` with a structured error body.
  4. On success: inserts a row via Drizzle, returns `200`/`201`.
  5. On a database error: `500`, logged server-side, generic message to the client (no internal error details leaked).
- **Env vars**: `POSTGRES_URL` (and whichever companion vars Vercel's Postgres integration injects, e.g. `POSTGRES_URL_NON_POOLING`) added to `.env.example` (names only, per spec 01's established pattern — no real values committed).
- **Tests**: Jest tests for the route handler (valid submission inserts and returns success; invalid body returns `400` with the right shape; a simulated DB failure returns `500`) with `src/lib/db/client.ts` mocked — no real Postgres instance in the test run. A Playwright e2e test replacing spec 15's "hits the missing route, shows an error toast" test with the new real behavior: a valid submission now shows the _success_ toast and resets the form; an invalid body still can't be submitted (client-side validation still blocks it before it reaches the network). The e2e test needs a real (or realistically faked) database to run against — see Decisions/Verification for how that's handled without a live Vercel Postgres instance in this environment.

## Out of scope

- Email/WhatsApp notifications on a new submission — spec 17.
- Any UI for Bruno to _view_ submitted messages (an admin view/dashboard) — not requested, not part of the v1 scope in spec 00.
- Rate limiting — see Decisions; may or may not land in this spec depending on Bruno's answer.
- Storing anything beyond name/email/message/timestamp.

## Backend concepts

- **Why re-validate server-side even though spec 15 already validates client-side**: client-side validation (Formik/Yup) is a UX convenience — it can always be bypassed by anyone sending a request directly (`curl`, a script, browser devtools), so the server is the actual trust boundary. This is the standard reason APIs never skip validation just because a form in front of them already has some.
- **Route Handlers and databases**: `src/app/api/contact/route.ts` is a Next.js Route Handler (same mechanism as spec 14's `cv.pdf` route, minus the locale segment — this one isn't localized) that runs server-side only, so it's safe to hold a database connection string and talk directly to Postgres; that code never ships to the browser.

## Decisions

1. **Vercel Postgres** as the provider — native integration with Bruno's existing Vercel deployment, env vars auto-injected once linked in the dashboard. Provisioning the actual instance and linking it is Bruno's action outside this spec's code.
2. **Drizzle ORM** (`drizzle-orm` + `@neondatabase/serverless` + `drizzle-kit`) over raw SQL — TypeScript-first schema, generates/tracks migrations, still just one table so it stays simple.
3. **No rate limiting** in this spec — the honeypot (spec 15) already filters naive bots; revisit only if real abuse shows up after launch. Avoids adding Vercel KV or another stateful dependency for a v1 personal site.
4. **No live database in this implementation environment** — this sandboxed dev environment has no real Vercel Postgres instance to connect to, so: Jest tests (with `src/lib/db/client.ts` mocked) are what actually exercises the success/validation/db-error logic paths during implementation; e2e coverage is limited to what doesn't require a live database (validation still blocking bad submissions client-side, and the API returning a safe generic `500` — not a crash or leaked internals — when a DB call fails, which it will in this environment since no real `POSTGRES_URL` is configured). Verifying the true end-to-end success path (a real row landing in a real database) is a manual step for Bruno once he's provisioned the database and has real credentials in `.env.local` — called out explicitly in Verification below rather than silently assumed to work.

## Implementation notes (deviations from plan)

- **`@vercel/postgres` is deprecated — swapped for `@neondatabase/serverless` before writing any code against it.** Vercel discontinued the Vercel Postgres product itself; its own deprecation notice points to Neon's native Vercel Marketplace integration and `@neondatabase/serverless` as the current SDK. This is still "Bruno's choice" from the decisions above (link a Postgres database through the Vercel dashboard, env vars auto-injected) — only the specific client package changed, since the one named in the original decision no longer exists as a going concern. Uses `drizzle-orm/neon-http` instead of the originally-implied `drizzle-orm/vercel-postgres` adapter.
- **`src/lib/db/client.ts` constructs the Neon client lazily (`getDb()`), not as a module-level constant.** `neon(connectionString)` throws _synchronously_, at call time, if the connection string is empty — confirmed directly (`No database connection string was provided to 'neon()'`). A module-level `export const db = drizzle(neon(process.env.POSTGRES_URL ?? ""), ...)` would have crashed on import in this environment (no real `POSTGRES_URL`), taking down even requests that never reach the database — like the validation-failure path, which is supposed to return a clean `400` regardless of whether a database is configured at all. Deferring construction to first use fixes this and is also just correct behavior generally: a request that fails validation shouldn't care whether the database is reachable.
- **A genuine Yup bug, caught in the Jest suite, not assumed away**: the shared-schema plan (spec 15/16's Decisions) called for the client to layer a localized `.email(message)` on top of a shared field schema that already had a bare `.email()` call. Confirmed empirically (both in a throwaway Node script and via the failing "invalid email" test) that Yup does not let a second `.email(customMessage)` call override the first `.email()` call's message — the original default message ("this must be a valid email") always wins, regardless of call order or whether the calls happen on the same schema reference or a derived one. Fixed by removing `.email()` from the shared `emailFieldSchema` entirely — each consumer (`contactSchema` server-side, `ContactForm` client-side) now makes its own single `.email(...)` call, so there's never a second one to lose.
- **`jest.mock()` needed a relative path (`../../../lib/db/client`), not the `@/` alias**: matches the existing pattern already used by `FeaturedSectionCard.test.tsx`/`Hero.test.tsx`/`ItemListSection.test.tsx` for the same reason (spec 07-era precedent) — `jest.mock("@/lib/db/client", ...)` failed to resolve even though the same alias resolves fine for ordinary `import` statements in this project's Jest setup.
- **Migration generated (`drizzle/0000_organic_human_robot.sql`), not applied here — applied successfully by Bruno post-implementation.** `drizzle-kit generate` only reads `schema.ts` to produce SQL — no live database needed — so that ran cleanly in this environment. Running it against the real database was Bruno's manual step; see below for what that actually required.
- **`drizzle-kit migrate` doesn't read `.env.local` — a real gap hit during Bruno's manual verification, not anticipated in the plan.** `drizzle-kit` is a standalone CLI, unrelated to Next.js's dev/build process, so it never picks up `.env.local` the way a Next.js page does — `drizzle.config.ts` reading `process.env.POSTGRES_URL` was always empty even with a correct `.env.local`, failing with `Please provide required params for Postgres driver: [x] url: ''`. Fixed by adding `dotenv` (devDependency) and explicitly loading `.env.local` at the top of `drizzle.config.ts` before the config object is read.
- **The "Vercel Postgres" product itself has been renamed/absorbed into a native Neon integration in the dashboard**, consistent with the `@vercel/postgres` package's own deprecation notice (see above) — Bruno created the database via **Storage → Create Database → Neon**, not a "Postgres" option, since that's what currently exists there.

## Verification

- **Automated, in this environment:**
  - Jest: `POST` handler with a valid body calls Drizzle's insert with the right values and returns a success response (DB call mocked).
  - Jest: an invalid body (missing/empty field, malformed email) returns `400` with a structured error body and never reaches the DB call.
  - Jest: a simulated DB failure returns a generic `500` with no internal details leaked.
  - e2e: spec 15's "invalid submission never reaches the network" behavior still holds (client-side validation still blocks it).
  - e2e: hitting `/api/contact` with a valid body in this environment (no real `POSTGRES_URL`) returns a safe `500`, not a crash, stack trace, or leaked connection info.
  - `pnpm test`, `pnpm test:e2e`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
- **Manual, done by Bruno with a real linked database — confirmed working:**
  - ✅ Linked a Neon database via Vercel's Storage tab, pulled/pasted `POSTGRES_URL` into `.env.local`.
  - ✅ Ran the generated migration against the real database (`pnpm exec drizzle-kit migrate`, after the `dotenv`-loading fix above).
  - ✅ Submitted the live contact form (`pnpm dev` → `/en/contact`) — success toast appeared, form reset, confirmed working end to end.
  - A hydration-mismatch console warning appeared during this manual test (`data-sharkid`/`shark-icon-container` attributes injected into the form inputs) — traced to a browser extension modifying the DOM before React hydrated, unrelated to this spec's code; not an app bug.
