# 09 — Experience Page

Status: Implemented
Depends on: [05-base-layout](./05-base-layout.md), [06-content-data-model](./06-content-data-model.md), [07-landing-page](./07-landing-page.md), [08-studies-page](./08-studies-page.md)

## Goal

Build `/[locale]/experience`, the second section page, following the expandable-detail-card + `?highlight=<id>` pattern spec 08 established for Studies. Experience needs more structure than Studies: entries split into `professional` and `early` (pre-dev career), and each entry carries `bullets` and `tags` that Studies' `StudyEntry` doesn't have.

## Scope

- **Route**: `src/app/[locale]/experience/page.tsx` (Server Component, `async`, using `getTranslations`/`getLocale` from `next-intl/server` — same reason as spec 08: an async Server Component can't call the `useTranslations`/`useLocale` hooks). Reads `searchParams` for `highlight`.
- **`ExperienceCard`** (`src/components/experience/ExperienceCard.tsx`): a new component — duplicates spec 08's `StudyCard` expand/collapse/`aria-expanded`/logo-fallback mechanics rather than sharing a component (per spec 08's decision 4: premature to abstract with only one prior instance). Same collapsed/expanded split as `StudyCard`:
  - Collapsed: logo/initials-`Avatar` fallback, company name, role, date range (`startDate`–`endDate` formatted per locale; `endDate: null` → "Present"/"Presente").
  - Expanded: adds `description`, then `bullets` as a real `<ul>`/`<li>` list, then `tags` as a row of MUI `Chip`s. If `tags` is empty (some early-career entries have none), that row simply doesn't render — no "no tags" placeholder.
  - Toggle via MUI `Collapse` behind a real button header, `aria-expanded` reflecting state — identical accessibility approach to `StudyCard`.
  - Used as-is for both `professional` and `early` entries — no separate simplified variant; an entry with empty `bullets`/`tags` just renders less.
- **`ExperienceList`** (`src/components/experience/ExperienceList.tsx`): renders two sub-sections, each its own heading + list of `ExperienceCard`s, most-recent-first within each:
  - "Professional Experience" / "Experiencia Profesional" — `section: "professional"` entries.
  - "Early Career" / "Otras experiencias" — `section: "early"` entries, visually de-emphasized (e.g. slightly muted heading/smaller card padding via the theme — no new design tokens, reuse existing typography variants).
  - `highlight` behavior: on mount, if `highlight` matches an entry's `id` (either section), that card starts expanded and scrolls into view (`scrollIntoView({ block: "center" })`, guarded with `?.` for jsdom per spec 08's precedent) — works whether the id is in `professional` or `early`. All other cards start collapsed.
  - Local expand/collapse state only, no URL sync beyond the initial `highlight` read (same as spec 08).
- **Page composition**: `PageShell` (spec 05) + `h1` heading ("Experience"/"Experiencia") + `ExperienceList`. No filtering/tag-search UI — full list, same scope level as Studies.
- **Heading hierarchy**: "Professional Experience"/"Experiencia Profesional" and "Otras experiencias"/"Early Career" render as real `h2` elements under the page's `h1` — not styled text pretending to be a heading. Each `ExperienceCard`'s company name is not a heading (it's inside a `button`); the section `h2` is the only new heading level this page introduces.
- **Tag group labeling**: the `Chip` row for `tags` is wrapped with an accessible group label — a visually-hidden (`sr-only`/MUI `visuallyHidden`) heading or `aria-label` (e.g. `aria-label="Technologies used"` / `"Tecnologías utilizadas"`) on the containing element — so a screen reader announces the chips as a labeled group of technologies, not a run of disconnected words.
- **Contrast on de-emphasized styling**: whatever visual treatment de-emphasizes "Otras experiencias" (muted color, smaller text, etc.) must still meet WCAG AA contrast (4.5:1 for body text, 3:1 for large text) against its background — checked with a contrast checker against the actual theme tokens used, not assumed from "it's a lighter shade of the same color."
- **Message files**: `messages/en.json` / `messages/es.json` get an `experience` namespace (page heading, "Professional Experience"/"Early Career" section headings, "Present"/"Presente" — reuse spec 08's existing string if already namespaced generically, otherwise duplicate under `experience`).
- **Tests**:
  - Jest+RTL for `ExperienceCard` (collapsed/expanded rendering, bullets list, tags chips present/absent, `aria-expanded` toggling, logo fallback) and `ExperienceList` (professional/early grouped correctly, highlight param expands the right card regardless of which section it's in, default state has none expanded).
  - Storybook stories for `ExperienceCard` (collapsed, expanded-with-tags, expanded-no-tags, logo-fallback states).
  - `tests-e2e/experience.spec.ts`: page renders both sections with correct entry counts, collapsed by default; `/en/experience?highlight=<id>` expands and scrolls to that card for an id in each section (one professional, one early); expand/collapse via click and keyboard both work; button queries scoped to `main button[aria-expanded]` (spec 08's precedent, avoids miscounting header buttons). No axe check yet — same deferral to spec 21 as spec 08.

## Out of scope

- About/Hobbies page (11) — gets its own spec since hobbies have icons instead of logos and a different content shape.
- Any change to the landing page's Experience listing — already correct per spec 07 (4 most recent professional entries + "View all" link, which now resolves to this page).
- Filtering/searching by tag — explicitly deferred, not part of this spec.
- New design tokens — reuses spec 04's theme; "de-emphasized" Early Career styling uses existing typography/spacing variants, not new ones.
- Sharing a component between `StudyCard` and `ExperienceCard` — deferred per spec 08's decision 4; revisit if a third instance (About/Hobbies, spec 11) makes the duplication clearly wasteful.

## Backend concepts

None new — same `searchParams`-as-initial-UI-state pattern as specs 07/08.

## Decisions

1. `ExperienceCard` duplicates `StudyCard`'s pattern rather than sharing a component, consistent with spec 08's decision to defer abstraction.
2. Professional and Early Career render as two separate headed sub-sections (not a single merged list, not a collapsed accordion) — Professional first, Early Career visually de-emphasized via existing typography.
3. Bullets and tags are expand-only content (same tier as `description`), not visible on the collapsed card — consistent with Studies' collapsed/expanded split.
4. Bullets render as a real `<ul>`/`<li>` list; tags render as MUI `Chip`s in their own row; an entry with no tags simply omits that row.
5. `ExperienceCard` is used unmodified for both sections — no simplified variant for Early Career; a sparser entry (no bullets/tags) naturally renders less.
6. No filtering/tag-search UI in this spec.
7. Section labels ("Professional Experience"/"Otras experiencias") are real `h2`s, not styled text — explicit heading hierarchy is now a spec requirement, not an implicit assumption.
8. The tags `Chip` row gets an explicit accessible group label (visually-hidden heading or `aria-label`) rather than being announced as an unlabeled sequence of chips.
9. De-emphasized styling for "Otras experiencias" is constrained by an explicit AA contrast check against the actual theme colors used, not just "make it lighter."

## Implementation notes (deviations from plan)

- **Expand/collapse state is a single shared `expandedId` across both sections**, not per-section — clicking a card in Early Career collapses whatever was expanded in Professional, same as Studies' single-card-open behavior. The spec didn't say this explicitly; it follows Studies' precedent since nothing called for independent per-section state.
- **Early Career de-emphasis uses `color: text.secondary` + a smaller responsive `fontSize`** on the `h2`, not a new token. `text.secondary` (`#5A6472`) against the page background (`#F7F8FA`/`#FFFFFF`) computes to ~6:1 contrast, comfortably above the 4.5:1 AA floor for body-sized text — satisfies decision 9 without introducing a new color.
- **The tags `Chip` row's accessible group label uses `role="group"` + `aria-label`** (not a visually-hidden heading) — simpler markup, same accessible-name-via-`aria-label` outcome, verified with RTL's `getByRole("group", { name: ... })` and Playwright's implicit accessibility tree.
- **e2e tests select cards by company name, not role**, e.g. `getByRole("button", { name: /Globant/ })` instead of `/React.js Developer/` — several entries share the same translated role string ("React.js Developer"), which made role-based queries ambiguous (Playwright strict-mode violation caught this immediately). Company names are unique per entry.

## Verification

- `/en/experience` and `/es/experience` render two headed sections (Professional, Early Career), each entry collapsed by default, most-recent-first within each section, logos/fallback correct, dates formatted per locale.
- `/en/experience?highlight=<id>` opens with that card expanded and scrolled into view, for an id in either section; all other cards stay collapsed.
- Expanding a card shows `description`, a bullet list, and (when non-empty) tag chips; an early-career entry with no tags renders without a tag row.
- `aria-expanded` toggles correctly on click and on Enter/Space when focused.
- Section headings ("Professional Experience", "Otras experiencias") are real `h2` elements (checked via accessibility tree / RTL `getByRole("heading", { level: 2 })`), sitting correctly under the page's `h1`.
- The tags `Chip` row has an accessible group label (spot-checked via RTL/axe query, e.g. `getByRole("group", { name: /technologies/i })` or equivalent).
- The de-emphasized "Otras experiencias" text meets 4.5:1 (body) / 3:1 (large text) contrast against its background, verified against the actual rendered theme colors.
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
