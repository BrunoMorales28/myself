# 12 — About Page

Status: Implemented
Depends on: [05-base-layout](./05-base-layout.md), [06-content-data-model](./06-content-data-model.md), [07-landing-page](./07-landing-page.md), [08-studies-page](./08-studies-page.md), [09-experience-page](./09-experience-page.md)

## Goal

Build `/[locale]/about`, the third and last expandable-card section page (after Studies and Experience), and the one Header/landing already point at: `Header.tsx`'s "about" nav key resolves to `/about`, and the landing page's Hobbies listing already links to `/about?highlight=<id>` (spec 07). Both currently 404. This page shows Bruno's bio as static intro copy, then the four `Hobby` entries as expandable cards, honoring the same `?highlight=` deep-link contract as Studies/Experience.

## Scope

- **Route**: `src/app/[locale]/about/page.tsx` (Server Component, `async`, `getTranslations`/`getLocale` from `next-intl/server` — same reason as specs 08/09: hooks can't be called in an async component). Reads `searchParams` for `highlight`.
- **Bio**: `about.bio` rendered as static, non-collapsible body copy directly under the page heading — no card, no expand/collapse, it's the page's lead content rather than a list item.
- **`HobbyCard`** (`src/components/about/HobbyCard.tsx`): duplicates `StudyCard`'s expand/collapse/`aria-expanded`/ref-forwarding shape (per spec 08 decision 4 — same call spec 09 already made for `ExperienceCard`; About is the third instance, still following the established pattern rather than abstracting). One difference from `StudyCard`/`ExperienceCard`: the leading visual is always a MUI icon (`hobbyIcons[hobby.icon]`, from `src/content/index.ts`), not an `Avatar`/`logoUrl` — hobbies aren't organizations, so there's no logo-vs-initials-fallback branch to handle at all.
  - Collapsed: icon, `label`.
  - Expanded: `description`.
  - Toggle via MUI `Collapse` behind a real `ButtonBase` header, `aria-expanded` reflecting state, `aria-controls` pointing at the details region id — identical accessibility approach to `StudyCard`/`ExperienceCard`.
- **`HobbiesList`** (`src/components/about/HobbiesList.tsx`): renders all four `Hobby` entries in declared order (no date-based sort — hobbies aren't chronological), wires up `highlight`:
  - On mount, if `highlight` matches a hobby's `id`, that card starts expanded and scrolls into view (`scrollIntoView({ block: "center" })`, guarded with `?.` for jsdom, per spec 08's precedent).
  - All other cards start collapsed.
  - Local `expandedId` state only (single card open at a time, same as Studies/Experience), no URL sync beyond the initial `highlight` read.
- **Page composition**: `PageShell` (spec 05) + `h1` heading ("About"/"Sobre mí") + bio paragraph + `h2` ("Hobbies", same in both locales — it's already a loanword in Argentine Spanish and spec 06/07 never introduced a translated label for it) + `HobbiesList`.
- **Message files**: `messages/en.json` / `messages/es.json` get an `about` namespace (page heading, hobbies section heading).
- **Tests**:
  - Jest+RTL for `HobbyCard` (collapsed/expanded rendering, `aria-expanded` toggling, icon renders) and `HobbiesList` (highlight param expands the right card, default state has none expanded, declared order preserved).
  - Storybook stories for `HobbyCard` (collapsed, expanded, one per icon key to spot-check all four render).
  - `tests-e2e/about.spec.ts` (new file, following `studies.spec.ts`'s shape): page renders bio + all four hobbies collapsed by default; `/en/about?highlight=reading` renders that card expanded and scrolled into view; expand/collapse via click and keyboard (Enter/Space) both work; button queries scoped to `main button[aria-expanded]` (spec 08/09 precedent); axe check for both locales (per-page axe coverage is now standard since spec 10 wired `@axe-core/playwright` into the suite — About gets it from day one rather than needing a retrofit).

## Out of scope

- Changes to `Hobby`/`AboutContent` content model — spec 06/07 already shipped everything this page needs (`id`, `label`, `description`, `icon`).
- Any change to the landing page's Hobbies listing or Header's nav — both already point at the right URL (spec 07, spec 11's `navHref` helper), this spec just makes that URL resolve instead of 404ing.
- Expanding the bio beyond the single paragraph already in `src/content/about.ts` — spec 06 explicitly deferred this, still not requested.
- Sharing a component between `StudyCard`/`ExperienceCard`/`HobbyCard` — three instances now exist, which is the point spec 08 flagged as worth revisiting ("revisit after spec 09 if the duplication looks wasteful"). Noted as a candidate follow-up below, not done as part of this spec — pulling out a shared component is a refactor with no user-visible change and deserves its own review rather than riding along here.
- New design tokens — reuses spec 04's theme.

## Backend concepts

None new — same `searchParams`-as-initial-UI-state pattern as specs 07/08/09.

## Decisions

1. Bio renders as static copy, not a card — it's the page's lead content, not a list item alongside hobbies.
2. `HobbyCard` duplicates the `StudyCard`/`ExperienceCard` expand/collapse pattern rather than sharing a component, consistent with spec 08/09's precedent; a shared-component refactor is flagged as a follow-up candidate now that three instances exist, not done here.
3. Hobbies render in declared content-array order (not sorted) — they have no natural date ordering the way Experience/Studies do.
4. "Hobbies" section heading is untranslated (same string in `en.json`/`es.json`) — it's a common loanword in Argentine Spanish and no prior spec introduced a translated alternative.
5. Leading visual is always the MUI icon from `hobbyIcons` — no `Avatar`/logo/initials-fallback branch, since hobbies were already established (spec 07) as icon-based rather than logo-based.

## Implementation notes (deviations from plan)

- **`HobbyCard`'s `icon` prop is typed `typeof SvgIcon`** (from `@mui/material/SvgIcon`), not `SvgIconComponent` — `@mui/icons-material`'s type declarations define `SvgIconComponent` internally but don't export it, so importing it fails at typecheck. `src/content/index.ts`'s `hobbyIcons` lookup already used the equivalent `typeof SportsEsportsIcon` pattern for the same reason; `HobbyCard` follows suit.

## Verification

- `/en/about` and `/es/about` render the bio paragraph, then a "Hobbies" heading, then all four hobby cards collapsed by default in declared order.
- `/en/about?highlight=reading` opens with that card expanded and scrolled into view; the other three stay collapsed.
- Clicking a collapsed card's header expands it and shows `description`; clicking again collapses it. Same via Enter/Space when focused.
- `aria-expanded` on the card header toggles correctly.
- Header's "About" nav link and the landing page's Hobbies items both resolve to real content instead of 404ing.
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e` (including `about.spec.ts`'s per-locale axe checks, zero violations), `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
