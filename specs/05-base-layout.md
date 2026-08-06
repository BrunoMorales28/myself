# 05 — Base Layout

Status: Implemented
Depends on: [04-theme-design-tokens](./04-theme-design-tokens.md)

## Goal

Build the page shell every section (landing, studies, experience, skills, about, contact) will render inside: a header with navigation and a working ES/EN language selector, a footer, and consistent content width/spacing. This is also where bilingual routing gets wired up for real, since the language selector needs an actual mechanism to switch locale, not just a visual toggle.

## Scope

- **i18n library**: `next-intl` — the most widely used App Router-compatible i18n library, with built-in locale routing, message files, and a `useTranslations` hook for client and server components alike.
- **Locale routing**: `src/app/[locale]/...` route structure (so every page lives under `/en/...` or `/es/...`), with middleware that detects the visitor's preferred language (via `Accept-Language`) and redirects `/` to `/en` or `/es` on first visit, then remembers the choice (cookie) after a manual switch.
- **Message files**: `messages/en.json` and `messages/es.json`, starting with just the strings this spec needs (nav labels, footer text) — each later spec adds its own section's strings to both files as it's built.
- **Header** (`src/components/layout/Header.tsx`):
  - Site name/logo (text-based for now, matches spec 07's landing branding).
  - Nav links: Studies, Experience, Skills, About, Contact (labels from message files).
  - Language selector: a small control (MUI `Select` or two-button toggle) that switches between `/es/...` and `/en/...` for the _current_ page (not just back to home) — swaps the locale segment of the current path.
  - Responsive: full nav on desktop, a collapsible menu (MUI `Drawer` triggered by an icon button) on mobile.
- **Footer** (`src/components/layout/Footer.tsx`): minimal — copyright line, maybe a repeat of the nav links or a link to the GitHub repo (ties into the "view source" portfolio angle from the overview spec).
- **Page shell** (`src/components/layout/PageShell.tsx` or via `src/app/[locale]/layout.tsx` directly): consistent max content width, responsive horizontal padding, Header + `{children}` + Footer composition.
- **Root layout split**: `src/app/layout.tsx` keeps only the truly global stuff (html/body, fonts, `ThemeRegistry`); `src/app/[locale]/layout.tsx` adds the `NextIntlClientProvider`, validates the `locale` param, and renders Header/Footer around `{children}`.
- Update the existing scaffold home page (`src/app/[locale]/page.tsx` after the move) to just render inside the new shell — the MUI smoke-test content from spec 04 can be trimmed down now that real layout exists.
- Update Playwright's e2e test (`tests-e2e/landing.spec.ts`) for the new `/en` (or locale-prefixed) URL.

## Out of scope

- Actual page content for each section → specs 07–11.
- Translating real content copy (this spec only needs nav/footer strings) → each content spec adds its own.
- A visible "current page" active-nav-state design polish — functional highlighting is enough, visual refinement can happen later if needed.

## Backend concepts

- **Next.js Middleware**: a function that runs on every matching request _before_ it reaches a route — used here to inspect the incoming request's `Accept-Language` header (or an existing locale cookie) and redirect to the right `/en` or `/es` path. It runs at the edge, before any page code, so it's the standard place for this kind of routing decision.
- **Dynamic route segments (`[locale]`)**: the `[locale]` folder name means Next.js treats that path segment as a variable — `/en/contact` and `/es/contact` both match the same `src/app/[locale]/contact/page.tsx` file, with `locale` available as a param. This is how one set of page components serves both languages instead of duplicating pages per locale.
- **Server vs Client translation access**: `next-intl` provides `getTranslations` for Server Components (async, no client JS shipped) and `useTranslations` for Client Components (needed inside interactive parts like the language switcher). Most of this site's content pages can use the server variant, which keeps translation strings out of the client JS bundle.

## Decisions

1. `next-intl` for i18n.
2. Locale persistence: cookie-based — a manual language switch is remembered for the visitor's next request.
3. Mobile nav: MUI `Drawer` (slide-in panel).

## Implementation notes (deviations from plan)

- **`src/proxy.ts`, not `src/middleware.ts`**: this Next.js version (16) deprecated the `middleware.ts` file convention in favor of `proxy.ts` (same API, `next-intl`'s `createMiddleware` export works unchanged) — build emits a deprecation warning otherwise.
- **MUI v9's `Stack` dropped `justifyContent`/`alignItems` as direct props** — they now only work inside `sx`. Both `Header.tsx` and `Footer.tsx` use `sx={{ justifyContent: ..., alignItems: ... }}` instead of the props directly, which is otherwise how older MUI docs/examples show it.

## Verification

- Visiting `/` redirects to `/en` (or `/es`, based on browser language) with the header/nav/footer visible.
- Clicking the language selector on any page switches to the equivalent path in the other locale (e.g. `/en/contact` → `/es/contact`), and the visible nav/footer text updates.
- Nav links route correctly (even though target pages don't exist yet — this can 404 gracefully or link to placeholder routes, whichever is less throwaway work).
- Header collapses into a mobile drawer below MUI's `sm` breakpoint; opening/closing it works via keyboard (tab + enter/escape) — an early, informal accessibility check ahead of the dedicated audit in spec 21.
- `pnpm test:e2e`, `pnpm test`, `pnpm test:storybook`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
