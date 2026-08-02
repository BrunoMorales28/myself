# 03 — Tooling: Test Stack Init

Status: Implemented
Depends on: [02-tooling-lint-hooks](./02-tooling-lint-hooks.md)

## Goal

Install and wire up the full testing stack — Jest + React Testing Library, Playwright, Storybook, MSW — with one trivial passing example of each, so the scaffolding exists before any real feature code is written. No real component/page tests yet (those land with each feature's own sub-spec); this spec only proves the plumbing works end to end.

Once this lands, `pnpm test` in the pre-push hook (currently a no-op placeholder from spec 02) gets replaced with the real Jest run.

## Scope

- **Jest + React Testing Library**:
  - `jest.config.ts` using `next/jest` (Next.js's official Jest preset — handles SWC transforms, CSS/module mocking, `next.config.ts` env, path aliases automatically).
  - `jest.setup.ts` importing `@testing-library/jest-dom` matchers.
  - `pnpm test` → `jest`; add `pnpm test:watch` → `jest --watch`.
  - One trivial example: a `<Greeting />` component in `src/components` + an RTL test rendering it and asserting text content, to prove the pipeline works — this component gets deleted once spec 05 (base layout) or later specs add the first real component.
- **MSW**:
  - `src/mocks/handlers.ts` (empty array placeholder, real handlers added per feature that needs API mocking — e.g. contact form, chatbot).
  - `src/mocks/server.ts` (Node server for Jest) and `src/mocks/browser.ts` (worker for Storybook/dev, if needed) using `msw/node` and `msw` browser APIs respectively.
  - Wire `server.ts` into `jest.setup.ts` (`beforeAll(() => server.listen())`, `afterEach(() => server.resetHandlers())`, `afterAll(() => server.close())`).
- **Storybook**:
  - Init via `storybook init` targeting Next.js + Vite/Webpack builder (whichever the CLI recommends for this Next.js version) with TypeScript support.
  - One trivial story for the same `<Greeting />` component, including a basic interaction test (`play` function) using `@storybook/test`, to prove interaction testing works.
  - `pnpm storybook` (dev) / `pnpm build-storybook` scripts (added automatically by the init).
- **Playwright**:
  - `pnpm exec playwright install` (browsers) + `playwright.config.ts` targeting `http://localhost:3000`, with a `webServer` block that boots `pnpm dev` (or `pnpm build && pnpm start` for CI-like runs) automatically before tests.
  - `tests-e2e/` directory (kept separate from `src/` and Jest's default test discovery) with one trivial e2e test: load `/`, assert the page renders (e.g. checks for the `<h1>` from the scaffold's default page).
  - `pnpm test:e2e` script → `playwright test`.
- Update `pre-push` hook (spec 02) to run the real `pnpm test` (Jest) instead of the placeholder. Playwright e2e tests are **not** added to the git hook (too slow for every push) — they'll run manually and, if a CI pipeline gets added later, there.
- Update README's "Getting started"/testing section listing all test commands.

## Out of scope

- Any real feature tests — written alongside each feature's own sub-spec (landing page, contact form, chatbot, etc.), not here.
- CI pipeline — still not decided (see spec 02); Playwright stays a manual/local run for now.
- Accessibility-specific Playwright checks (axe integration) — deferred to spec 21 (Accessibility audit pass), though the Playwright plumbing installed here is what that spec builds on.

## Backend concepts

- **Why Jest and Playwright both exist**: Jest+RTL test components/units in isolation (fast, no real browser, good for logic and rendering correctness); Playwright drives a real browser against the real running app (slower, but catches integration issues — routing, layout, actual user flows — that unit tests can't see). Different layers of the testing pyramid, not redundant with each other.
- **MSW (Mock Service Worker)**: intercepts network requests at the network layer (real `fetch`/`XHR` calls get intercepted before they leave the process) rather than mocking the functions that make them — so components and tests exercise the same request/response code paths they would in production, just against fake data. Same handler definitions can be reused in Jest tests, Storybook, and local dev.
- **Storybook interaction tests (`play` function)**: a function attached to a story that simulates user interaction (clicks, typing) and asserts on the result, run automatically by Storybook's test runner — lets you test a component's behavior in the same isolated environment where you visually develop it, without a separate test file.
- **Playwright's `webServer` config**: tells Playwright how to boot the app under test automatically before running e2e tests (and tear it down after), so `pnpm test:e2e` is a single self-contained command instead of requiring `pnpm dev` running in another terminal first.

## Decisions

1. Storybook builder: take the `storybook init` CLI's default framework detection (`@storybook/nextjs`) rather than forcing a specific builder.
2. Playwright `webServer`: reuse an already-running `pnpm dev` locally (`reuseExistingServer: !process.env.CI`), always start fresh when `CI` is set.

## Implementation notes (deviations from plan)

- **MSW pinned to `2.4.9`**, not latest (`2.15.x`). The newest MSW pulls in a chain of ESM-only transitive dependencies (`@mswjs/interceptors`, `rettime`, etc.) that Next's Jest preset won't transform out of pnpm's nested `node_modules/.pnpm` store without endless `transpilePackages` whack-a-mole. `2.4.9` is a well-documented, fully-CJS-compatible version for Jest setups and avoids the issue entirely. Worth revisiting if a future MSW upgrade is needed for a specific feature.
- **`jest.polyfills.js` is plain JS, not TS**: MSW's Node interceptor needs `fetch`/`Request`/`Response`/etc. polyfilled onto `globalThis` from `undici` before jsdom (Jest's test environment) initializes — `undici` itself was also pinned to `5.x` (fewer globals required than `8.x`). Declaring these on `globalThis` conflicts with TypeScript's own DOM lib types, so the file is kept out of the TS project (`tsconfig.json`'s `include` only picks up `.ts`/`.tsx`/`.mts`, not `.js`) rather than fighting `tsc` with suppressions.
- Storybook's `nextjs-vite` framework brought in Vitest + `@vitest/browser-playwright` as part of its own interaction-testing setup (`addon-vitest`) — `pnpm test:storybook` runs those via `vitest run`, separate from Jest.

## Verification

- `pnpm test` runs the Jest suite, `<Greeting />` test passes.
- `pnpm storybook` boots, the `<Greeting />` story renders, and its interaction test passes in the Storybook UI / test runner.
- `pnpm test:e2e` runs Playwright, which boots the app itself and the trivial e2e test passes.
- `pnpm build` still succeeds (Storybook/test config doesn't leak into the production build).
- Pre-push hook now runs the real Jest suite instead of the spec-02 placeholder.
