# 14 — CV PDF Generation

Status: Implemented
Depends on: [06-content-data-model](./06-content-data-model.md), [07-landing-page](./07-landing-page.md)

## Goal

The landing page's "Download CV" button (spec 07) already links to `/cv.pdf`, which 404s — nothing generates it yet. This spec builds a downloadable PDF résumé generated from the same `src/content/` data every page already reads, per spec 00's single-source-of-truth principle: update an experience entry once, and the site, the PDF, and (later) the chatbot's answers all stay in sync.

## Content model addition (amends spec 06)

No content file currently has Bruno's contact details (email, location, LinkedIn/GitHub profile) — nothing needed them until now. Adding:

- **`src/content/contact.ts`**: a new `ContactInfo` object — `email: string`, `location: string` (city/country, plain string, not `LocalizedText` — a place name), `linkedinUrl: string`, `githubUrl: string` (personal profile, distinct from the footer's existing "View source" link to the site's own repo). All plain strings, not translated (same reasoning as spec 06's non-prose fields: proper nouns/URLs don't need an `es` variant).
- This becomes the second consumer (besides the PDF) that spec 15 (Contact page) will also need — introduced here as content, not re-invented there.
- Bruno supplies the real values as part of implementing this spec.

## Scope

- **Dependency**: `@react-pdf/renderer` — renders a PDF from React-like component primitives (`Document`, `Page`, `View`, `Text`, `Link`, `StyleSheet`) server-side, via `renderToBuffer`. Doesn't consume MUI's `theme` object directly (different rendering target), so the PDF's own minimal style sheet re-declares the relevant palette/type values as plain hex/pt constants — kept in one small module so they're easy to keep visually aligned with the site if the theme changes later.
- **`src/lib/pdf/CvDocument.tsx`**: the PDF's component tree — header (name, title, contact line: email/LinkedIn/GitHub as real links), then Professional Experience (`section: "professional"` entries only — see decision 2; company, role, dates, description, bullets — no tags/chips, PDFs don't need interactive chrome), then Studies, then Skills (categories as `label: item, item, item` lines, no chip styling). Takes `locale` as a prop and reads `getLocalizedText(..., locale)` throughout, same helper every page already uses.
- **Route**: `src/app/[locale]/cv.pdf/route.ts` — a Next.js Route Handler (not a static file), so `/en/cv.pdf` and `/es/cv.pdf` each render the correctly localized document on request via `renderToBuffer(<CvDocument locale={locale} />)`, returned with `Content-Type: application/pdf` and `Content-Disposition: inline; filename="bruno-morales-cv-{locale}.pdf"` — opens in the browser's PDF viewer first (decision 3 below), filename still applies if/when the visitor saves it from there.
- **Hero wiring**: `src/app/[locale]/page.tsx`'s `downloadCvHref` changes from the hardcoded `/cv.pdf` (spec 07's placeholder) to `` `/${locale}/cv.pdf` `` — locale-aware like every other internal link.
- **Tests**: a Playwright e2e test (`tests-e2e/cv-pdf.spec.ts`) that requests `/en/cv.pdf` and `/es/cv.pdf`, asserting `200`, `Content-Type: application/pdf`, the PDF magic bytes, a non-trivial body size, and the correct per-locale `Content-Disposition` filename — see Implementation notes for why this ended up e2e-only rather than also having a Jest unit test.

## Out of scope

- Any change to the Hero's visible copy/CTA label — spec 07 already has "Download CV"/"Descargar CV".
- A print stylesheet / "print this page" browser feature for the HTML pages themselves — unrelated, not requested.
- Caching/pre-generating the PDF at build time — generated on request; revisit only if response time turns out to matter (content is tiny, `renderToBuffer` is fast).
- Any UI on the Contact page — spec 15's job; this spec only creates the `ContactInfo` content the PDF (and later spec 15) both read.

## Backend concepts

- **Next.js Route Handlers (`route.ts`)**: unlike `page.tsx` (which renders HTML for the App Router), a `route.ts` file in the same folder structure handles the HTTP request directly and returns any response type — here, a binary PDF with custom headers instead of a rendered page. A folder named `cv.pdf` is just a literal path segment (Next.js doesn't treat the dot specially), so the resulting URL is exactly `/en/cv.pdf`, indistinguishable from a real static file to the browser/user even though it's generated per request.
- **Why `@react-pdf/renderer` instead of printing the HTML page**: printing a styled MUI page to PDF (e.g. via a headless browser) is heavier (needs a browser runtime) and harder to control precisely (page breaks, margins); `@react-pdf/renderer` builds the PDF's layout tree directly from a small set of primitives purpose-built for print output, which is simpler to run in a serverless route handler and easier to keep visually stable.

## Decisions

1. Contact line shows email, LinkedIn, and GitHub — no location. Real values: `morales.bruno.95@gmail.com`, `https://www.linkedin.com/in/bruno-morales-5a702656/`, `https://github.com/BrunoMorales28`.
2. "Early Career" (pre-dev) entries are omitted from the PDF entirely — it stays focused on the professional dev career; the full timeline (including early roles) remains on the site's Experience page.
3. `Content-Disposition: inline`, not `attachment` — clicking "Download CV" opens the PDF in the browser's viewer/new tab first, where the visitor can then save it, rather than forcing an immediate file save.

## Implementation notes (deviations from plan)

- **No Jest unit test for `CvDocument`/`renderToBuffer` — dropped mid-implementation, coverage moved entirely to Playwright e2e.** `@react-pdf/renderer@4.x` is ESM-only with no CJS build, same category of problem spec 03 hit with MSW. Unlike MSW, pinning to an older version wasn't viable here: `@react-pdf/renderer@3.x` does ship a real CJS build, but its bundled `react-reconciler` predates React 19's internals and crashes at render time (`Cannot read properties of undefined (reading 'hasOwnProperty')` inside `ReactFiberReconciler`) — confirmed by actually installing and running it. Chasing `next.config.ts`'s `transpilePackages` for the ESM chain instead (the mechanism next/jest's SWC transform keys off) got 5 packages deep (`@react-pdf/renderer` → `@react-pdf/render` → `color-string` → `color-name` → `@react-pdf/layout` → `yoga-layout`, a WASM-loading package) before hitting a WASM ESM loader that isn't worth fighting Jest's CJS test runtime over. Since Next.js's own bundler (Turbopack, used by both `pnpm dev` and `pnpm build`) already handles this dependency tree natively with no special config — confirmed by fetching real, correctly-sized, distinct-per-locale PDFs from a running dev server — the actual behavior is fully covered by `tests-e2e/cv-pdf.spec.ts` instead.
- **Route Handlers don't get a locale from `next-intl/server`'s `getLocale()` — this was a real, caught bug, not a hypothetical.** `getLocale()` relies on `setRequestLocale()` having run earlier in the request, which only happens inside `[locale]/layout.tsx`'s Server Component tree — a `route.tsx` handler sits outside that tree entirely. The first implementation used `getLocale()` and silently served the _English_ PDF at `/es/cv.pdf` (wrong content, but a `200` with a plausible-looking response, not an error) — caught by the e2e test asserting the `Content-Disposition` filename, not by manual spot-checking (which had confirmed EN and ES bodies merely _differed_, without checking _which_ was which). Fixed by reading `locale` directly from the route's own `params` argument and passing it explicitly into `getTranslations({ locale, namespace })`, instead of relying on ambient request state.
- **`tests-e2e/not-found.spec.ts`'s axe checks needed a `waitFor` added, unrelated to this spec's own scope but surfaced while re-running the full e2e suite here.** The catch-all route added in spec 13 streams its `notFound()` boundary in via Suspense; under a cold dev-server compile, `AxeBuilder` could occasionally run against Next's transient `<html id="__next_error__">` placeholder shell (no `lang` attribute yet) before the real localized content finished streaming in — an intermittent false failure, not a real accessibility regression in spec 13's work. Fixed by waiting for the page's `h1` to be visible before invoking axe, matching what every other page's axe check implicitly gets for free by not going through a Suspense boundary first. Confirmed stable across repeated runs.
- **Route filename is `route.tsx`, not `route.ts`** — rendering `<CvDocument ... />` as JSX (rather than calling `CvDocument({...})` as a plain function) needed a `.tsx` extension; Next.js Route Handlers support either extension for the same file convention.
- **The PDF's header is a single combined line (`headerLine`, e.g. "Bruno Morales — Web Developer") reusing `landing.heroTitle` verbatim**, rather than a separate translated `name`/`title`. The site's own hero already renders this exact string identically in both `en.json` and `es.json` (a deliberate existing choice, not an oversight introduced here) — matching it exactly keeps the PDF and the site consistent instead of introducing a second, only-slightly-different translation of the same header.

## Verification

- `/en/cv.pdf` and `/es/cv.pdf` return a real, well-formed PDF (not a 404) with locale-correct content — experience/studies/skills sections match `src/content/`, contact details present and correct, confirmed distinct between locales.
- Landing page's "Download CV" button resolves to the current locale's PDF instead of the old placeholder path.
- `tests-e2e/cv-pdf.spec.ts` confirms both PDF routes return `200`, `application/pdf`, a well-formed PDF body (`%PDF-` magic bytes, non-trivial size), and the correct per-locale `Content-Disposition` filename; a third test confirms the Hero's download link targets the current locale's PDF.
- `pnpm test`, `pnpm test:e2e`, `pnpm test:storybook`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
