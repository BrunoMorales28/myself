# 07 — Landing Page

Status: Implemented
Depends on: [05-base-layout](./05-base-layout.md), [06-content-data-model](./06-content-data-model.md)

## Goal

Replace the MUI smoke-test content on `/[locale]` (from spec 04) with the real landing page: a hero, plus compact item listings (icon + title) for Experience, Studies, and Hobbies, and single teaser cards for Skills and Contact. Clicking an Experience/Studies/Hobbies item navigates to that item's full section page (specs 09/08/11) with the matching card focused and pre-expanded — the landing page is a scannable index into the detail pages, not a place that itself shows full entry detail. This is the first page to consume `src/content/` for real copy instead of placeholders, and it requires a small additive change to spec 06's content model (below).

## Content model additions (amends spec 06)

Spec 06 shipped without the fields this page needs. These are additive-only (no existing field changes shape), applied to `src/content/types.ts` and the data files as part of this spec's implementation, not a new numbered spec:

- **`id: string`** added to `ExperienceEntry` and `StudyEntry` — a stable slug (e.g. `"globant-sportian"`, `"digital-house"`), used as the deep-link target between the landing listing and the section page's focus/expand behavior. Not translated, not shown in the UI directly.
- **`logoUrl: string`** added to `ExperienceEntry` (company logo) and `StudyEntry` (institution logo) — path to a static asset under `public/logos/`. Bruno needs to source/add the actual logo image files (SVG preferred, PNG fallback) as part of implementing this spec; the spec itself only defines the field and the fallback behavior below.
- **`AboutContent.hobbies`** changes shape from `LocalizedText[]` to an array of `{ id: string; label: LocalizedText; description: LocalizedText; icon: HobbyIconKey }`:
  - `description`: 1–2 sentence expansion shown on the About page when a hobby card is expanded (currently doesn't exist — Bruno writes real short blurbs for the 4 existing hobbies as part of this spec).
  - `icon`: a MUI icon, chosen per hobby rather than a real-world "logo" (hobbies aren't organizations) — `HobbyIconKey` is a small string union (e.g. `"videogames" | "tabletop" | "combat" | "reading"`) mapped to an actual `@mui/icons-material` component in a lookup table in `src/content/index.ts` (keeps `src/content/` free of JSX/component imports, consistent with it being plain data).
- **Fallback when a logo is missing/fails to load**: an `Avatar` with the company/institution's initials (MUI `Avatar` with `children` text), so a missing asset degrades gracefully instead of a broken image icon.
- `src/content/content.test.ts` (spec 06) gets extended to assert every `ExperienceEntry`/`StudyEntry` has a non-empty, unique `id`, and every hobby has a non-empty `description` in both locales.

## Scope

- **Route**: `src/app/[locale]/page.tsx` — same file, new content, smoke-test `Stack`/`Button` demo removed.
- **Hero section** (`src/components/landing/Hero.tsx`):
  - Name + title line: "Bruno Morales — Web Developer".
  - One or two sentences framing the site as Bruno's résumé/CV and portfolio — no mention of the chatbot/AI agent until spec 16 actually ships it; copy gets revisited then.
  - Primary CTA button(s): "Download CV" (links to the PDF — spec 12, not built yet) and "Contact" (links to `/contact` — spec 13, not built yet). Since neither target exists yet, these render as real `Link`/`Button` components pointed at their eventual routes/actions (matches spec 05's precedent of nav links pointing at not-yet-built pages).
- **Item listings** (`src/components/landing/ItemListSection.tsx`, reused for Experience/Studies/Hobbies): a titled sub-section ("Experience", "Studies", "Hobbies") containing a compact row/list of items — each item is just a logo/icon (`Avatar`) + title text (role for Experience, degree for Studies, label for Hobbies), no description, no expand affordance on the landing page itself.
  - **Data source**: reads directly from `src/content/` (`experience`, `studies`, `about.hobbies`), most-recent-first for Experience/Studies (reuses existing date ordering), declared order for Hobbies.
  - **Experience**: shows `section: "professional"` entries only — early/pre-dev entries stay out of the landing listing (still viewable on the full Experience page). Capped to the **4 most recent** — two rows of two cards — followed by a "View all experience" link (no `highlight` param) to the full Experience page. Studies (2 entries) and Hobbies (4 entries) show all, no cap.
  - **Click behavior**: each item is a `Link` to its section page with a `?highlight=<id>` query param, e.g. `/en/experience?highlight=globant-sportian`. This spec defines and produces that link; the receiving page reading `highlight` and scrolling-to/expanding the matching card is built in specs 08 (Studies), 09 (Experience), 11 (About) — this spec only establishes the query param contract those specs must honor.
  - **Accessibility**: logo images use `next/image` with a descriptive `alt` (e.g. `alt="Globant logo"`, `alt="ORT logo"`); the initials-`Avatar` fallback carries the same accessible name via `aria-label` so screen readers get equivalent information whether the logo loads or not. Each item is a real link (keyboard-focusable, visible focus ring from the theme), not a `div` with an `onClick`.
- **Featured section cards** (`src/components/landing/FeaturedSectionCard.tsx`): single teaser card each for Skills and Contact (not item listings — Skills' categories and Contact have no per-item detail page to deep-link into). Skills teaser shows a couple of top category names via `getLocalizedText`; Contact uses a short static line. Both link to their section page (no `highlight` param).
- **Layout**: hero, then Experience listing, Studies listing, Hobbies listing, then Skills/Contact cards — all composed with flexbox (`Box`/`Stack` + `sx={{ display: 'flex', flexWrap: 'wrap', gap }}`), not MUI's `Grid` component, consistent with the flexbox-first approach already used in `Header`/`Footer` (spec 05) and Bruno's preference. Stacks to single-column on mobile.
- **Message files**: `messages/en.json` / `messages/es.json` get a `landing` namespace (hero tagline, CTA labels, section titles, Skills/Contact teaser copy) replacing the placeholder `home` namespace used by the smoke test.
- **Tests**: Jest+RTL unit tests for `ItemListSection` (renders the right number of items, correct `href` with `?highlight=<id>`, Avatar fallback when `logoUrl` fails) and `Hero`; a Storybook story each for `Hero`, `ItemListSection`, and `FeaturedSectionCard` (covering the logo-present and fallback-Avatar states); `tests-e2e/landing.spec.ts` updated to assert the new hero/listing content instead of the old smoke-test markup.

## Out of scope

- The actual Studies/Experience/About/Skills/Contact pages, and the focus+expand behavior that reads `?highlight=` → specs 08, 09, 11, 10, 13 respectively.
- CV PDF generation/download wiring → spec 12 (CTA button exists and points at the route, but the route itself 404s until then).
- Sourcing/designing the actual logo image files → Bruno, as a content task alongside this spec's implementation (not a coding task).
- Chatbot / hero mention of the AI agent as a working feature — stays unmentioned until spec 16 ships it.
- Visual polish beyond what the theme (spec 04) already provides — no new design tokens introduced here.

## Backend concepts

- **Query params as UI state, not "backend" state**: `?highlight=<id>` isn't persisted anywhere — it's read once by the receiving page (`useSearchParams` in a Client Component, or `searchParams` prop in a Server Component page) to decide initial scroll/expand state. This is the standard Next.js pattern for "link to a specific piece of a page" without needing hash-anchor scrolling or global state.

## Decisions

1. Hero stays silent about the chatbot/AI agent until spec 16 actually ships it.
2. Hero title line: "Bruno Morales — Web Developer".
3. Company/institution icons are real logo images (`logoUrl` field, `public/logos/`), with an initials-`Avatar` fallback if missing. Bruno sources the actual image files.
4. Landing shows per-item listings (icon + title only, no description) for Experience and Studies; the full expandable detail card lives on each section's own page (specs 08/09/11), reached via `?highlight=<id>` from the landing item.
5. The same item-listing + deep-link pattern applies to Hobbies (About page), which required adding `description` and `icon` to each hobby in the content model.
6. Skills and Contact are **not** item-listed — they stay as single teaser cards, since Skills' categories and Contact don't have a matching detail page to deep-link into.
7. Hobby icons are MUI icons (not photos/logos, since hobbies aren't organizations) chosen per hobby and mapped via a lookup table in `src/content/index.ts`.
8. Featured/listing layout uses flexbox (`Box`/`Stack` + `sx`), not MUI's `Grid` component.
9. Experience listing on landing is capped to the 4 most recent professional entries (two rows of two cards) + a "View all" link; Studies/Hobbies show all entries (short lists, no cap needed).

## Implementation notes (deviations from plan)

- **Logo fallback uses MUI `Avatar`'s built-in behavior, not `next/image` + manual `aria-label`**: MUI's `Avatar` already renders `children` automatically when its `src` image fails to load, and the fallback's accessible name comes from the visible initials text itself (no separate `aria-label` needed). This covers the same requirement as originally planned with less code — `next/image` was dropped in favor of `Avatar`'s plain `<img src>`.
- **`ItemListSection` takes a generic `avatar: ReactNode` per item, not `logoUrl`/`icon` fields**: the page (`page.tsx`) composes the right `Avatar` (image+initials for Experience/Studies, MUI icon for Hobbies) and passes the finished node down. Keeps `ItemListSection` reusable for both patterns without an internal "is this a logo or an icon" branch.
- **`Hero`/`ItemListSection`/`FeaturedSectionCard` take already-translated strings as props** rather than calling `useTranslations` internally — `page.tsx` (Server Component) resolves all copy via `useTranslations`/`getLocalizedText` and passes plain strings down. Keeps these components trivially testable in Jest/RTL and Storybook without needing message files wired into every test.
- **`src/i18n/navigation.ts` now starts with `"use client"`**: without it, passing next-intl's `Link` as `component={Link}` from a Server Component (`Hero`, `ItemListSection`, `FeaturedSectionCard`) into an MUI Client Component (`Button`, `CardActionArea`) crashed at runtime with an RSC serialization error ("Functions cannot be passed directly to Client Components"). `Header.tsx` never hit this because it's already `"use client"` itself. `pnpm build` alone didn't catch it, because `/[locale]` is a dynamic route (not statically prerendered) — the crash only surfaced when the page was actually requested (caught via `pnpm test:e2e`).
- **`.storybook/preview.tsx` now wraps every story in `NextIntlClientProvider`** (with `messages/en.json`): needed because `ItemListSection`/`Hero`/`FeaturedSectionCard` render next-intl's `Link` internally. Benefits any future story for a component that touches `next-intl`.
- **Hero's `h1` needed a responsive `fontSize` override**: MUI's default `h1` size overflowed on a 400px-wide viewport (a mobile screenshot check caught this — not something the automated test suite would have flagged). Fixed with `fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" }`.
- **CV download button points at `/cv.pdf`** (a static, non-locale-prefixed asset path) as a placeholder target — spec 12 (CV PDF generation) still needs to confirm/fulfill this exact route.
- **Hobby descriptions are draft copy** written during implementation to satisfy the content model/tests — Bruno should personalize the wording in `src/content/about.ts` before shipping.

## Verification

- `/en` and `/es` render the real hero, Experience/Studies/Hobbies item listings, and Skills/Contact teaser cards — no leftover smoke-test `Stack`/`Button` demo.
- Each Experience/Studies/Hobbies item shows its logo/icon (or initials-`Avatar` fallback) and title, sourced from `src/content/`, and switches correctly between `/en` and `/es`.
- Clicking an item navigates to `/{locale}/{section}?highlight={id}` with the correct id — verified even though the receiving page doesn't yet act on it (specs 08/09/11 land after this one).
- `pnpm test` covers the extended `content.test.ts` (`id` present/unique, hobby `description` non-empty in both locales) and the new `ItemListSection`/`Hero` unit tests.
- Experience listing shows exactly 4 items (two rows of two) + a "View all" link; Studies shows 2, Hobbies shows 4.
- A logo `Avatar` fallback renders with an equivalent accessible name when `logoUrl` is broken/missing (spot-checked via one deliberately-bad path in a test).
- Layout is responsive: single-column stacked on mobile, wraps into multiple columns on desktop.
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
