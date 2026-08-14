# 08 — Studies Page

Status: Implemented
Depends on: [05-base-layout](./05-base-layout.md), [06-content-data-model](./06-content-data-model.md), [07-landing-page](./07-landing-page.md)

## Goal

Build `/[locale]/studies`, the first real section page and the template the Experience (09) and About/Hobbies (11) pages will follow: a list of expandable detail cards, one per `StudyEntry`, that also honors the `?highlight=<id>` deep-link contract established in spec 07 — landing an item there scrolls to and pre-expands the matching card.

## Content model addition (amends spec 06/07)

`StudyEntry.description` (spec 06) is currently optional and unused — neither existing entry (`digital-house`, `escuelas-tecnicas-ort`) has one. This spec makes it required in practice:

- `description: LocalizedText` becomes **required** on `StudyEntry` in `src/content/types.ts` (drop the `?`).
- Bruno writes real 1–3 sentence descriptions (EN/ES) for both existing entries in `src/content/studies.ts` as part of implementing this spec — placeholder/draft copy is acceptable to unblock the build, same precedent as spec 07's hobby descriptions, but should be flagged for his review same as those were.
- `content.test.ts` gets extended to assert every `StudyEntry.description` is non-empty in both locales (mirrors the existing hobby-description assertion from spec 07).

## Scope

- **Route**: `src/app/[locale]/studies/page.tsx` (Server Component). Reads `searchParams` for `highlight`.
- **`StudyCard`** (`src/components/studies/StudyCard.tsx`): one card per entry —
  - Collapsed: logo/initials-`Avatar` (same fallback pattern as spec 07's `ItemListSection`), institution name, degree, date range (`startDate`–`endDate`, formatted per locale; `endDate: null` renders as "Present"/"Presente").
  - Expanded: adds `description`.
  - Toggle via MUI `Collapse` + a click/keyboard-accessible header (button semantics, not a bare `div` — `aria-expanded` reflects state, matches spec 00's real-semantic-HTML requirement).
- **`StudiesList`** (`src/components/studies/StudiesList.tsx`): renders all `StudyEntry` items most-recent-first (reuses spec 07's ordering), wires up the `highlight` behavior:
  - On mount, if `highlight` matches an entry's `id`, that card starts expanded and the page scrolls it into view (`scrollIntoView({ block: "center" })` in a `useEffect`, since this needs client-side DOM access — component is `"use client"`).
  - All other cards start collapsed.
  - Manages expand/collapse state locally (no URL sync beyond the initial `highlight` read — collapsing/expanding after the initial load doesn't rewrite the URL).
- **Page composition**: `PageShell` (spec 05) + heading ("Studies"/"Estudios") + `StudiesList`. No other content — Studies has just the two entries, no need for grouping/filtering UI.
- **Message files**: `messages/en.json` / `messages/es.json` get a `studies` namespace (page heading, "Present"/"Presente" label).
- **Tests**:
  - Jest+RTL for `StudyCard` (collapsed/expanded rendering, `aria-expanded` toggling, logo fallback) and `StudiesList` (highlight param expands + the right card, default state has none expanded).
  - Storybook stories for `StudyCard` (collapsed, expanded, logo-fallback states).
  - `content.test.ts` extended per the content-model addition above.
  - `tests-e2e/studies.spec.ts`: page renders both entries collapsed by default; visiting `/en/studies?highlight=digital-house` renders that card expanded and scrolled into view; expand/collapse via click and via keyboard (Enter/Space) both work. No axe check here — `@axe-core/playwright` isn't wired into the project yet (existing `landing.spec.ts` doesn't have one either); that lands with spec 21's accessibility audit pass, applied retroactively to all e2e specs.

## Out of scope

- Experience page (09) and About/Hobbies page (11) — this spec establishes the pattern; they each get their own spec since Experience has extra structure (the `professional`/`early` split, tags) that Studies doesn't.
- Any change to the landing page's Studies listing — already correct per spec 07.
- New design tokens — reuses spec 04's theme as-is.

## Decisions

1. `StudyEntry.description` becomes required; Bruno writes the real copy (draft acceptable to unblock, flagged for his review).
2. Expand/collapse is local component state seeded once from `?highlight=`, not synced back to the URL on further interaction — keeps the mental model simple ("the link got you here", not "the URL always mirrors what's open").
3. Card header is a real button (keyboard-operable, `aria-expanded`), not a clickable `div`.
4. This spec is the reusable template for 09/11 — `StudyCard`'s expand/collapse/highlight/scroll mechanics are expected to be copied (not abstracted into a shared component yet) since Experience's card has enough extra fields (tags, bullets, professional/early grouping) that a shared abstraction would be premature until we see the second real instance. Revisit after spec 09 if the duplication looks wasteful.

## Implementation notes (deviations from plan)

- **`src/app/[locale]/studies/page.tsx` uses `getTranslations`/`getLocale` from `next-intl/server`, not the `useTranslations`/`useLocale` hooks used by the landing page.** The page is `async` (it awaits the `searchParams` promise), and React Hooks can't be called inside an async function component — `eslint-plugin-react-hooks` catches this at lint time. The `next-intl/server` functions are the async-safe equivalents for this exact situation.
- **`StudiesList`'s scroll-into-view call is guarded with `highlightedRef.current?.scrollIntoView?.(...)`**, not a plain call — jsdom (used by the Jest/RTL unit tests) doesn't implement `scrollIntoView` at all, so an unguarded call throws in tests. The optional chaining is a no-op in that environment and behaves normally in real browsers/Playwright.
- **No test asserts that the collapsed card's description is absent from the DOM.** MUI's `Collapse` keeps the content mounted and animates height/overflow rather than unmounting or toggling `display: none`, so `queryByText(...).not.toBeInTheDocument()` doesn't hold even when visually collapsed. `aria-expanded` on the header button is the correctness signal instead (also what a screen reader relies on).
- **`tests-e2e/studies.spec.ts` scopes its button queries to `main button[aria-expanded]`**, not a bare `page.getByRole("button")` — the header (mobile menu toggle, language switcher) also renders buttons, some of which carry their own `aria-expanded`, and would otherwise be miscounted as study cards.
- **Logo asset sourcing**: 8 of the 15 `logoUrl` targets across `experience.ts`/`studies.ts` (Hootsuite, Accenture, Globant, YPF, NerdWallet, Mercado Libre, Santander, Indra) now point at real brand SVGs/PNG (from Simple Icons and Wikimedia Commons); the remaining 7 (Iúnigo, IguanaFix, ZyS Factors, Centerplate, Focus, Digital House, ORT — small/regional companies with no usable public assets found) are generated placeholder SVGs (theme-primary-colored square + initials), consumed via the existing `Avatar` fallback path from spec 07. `ypf`'s asset is `.png` (only format found), unlike every other entry's `.svg`.

## Backend concepts

None new — same `searchParams`-as-initial-UI-state pattern as spec 07's `?highlight=` producer side; this spec is the consumer side of that same contract.

## Verification

- `/en/studies` and `/es/studies` render both entries collapsed, most-recent-first, logo/fallback correct, dates formatted per locale.
- `/en/studies?highlight=escuelas-tecnicas-ort` opens with that card expanded and scrolled into view; the other card stays collapsed.
- Clicking a collapsed card's header expands it and shows `description`; clicking again collapses it. Same via Enter/Space when focused.
- `aria-expanded` on the card header toggles correctly.
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
