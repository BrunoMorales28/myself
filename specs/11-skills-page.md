# 11 — Skills Page

Status: Approved
Depends on: [05-base-layout](./05-base-layout.md), [06-content-data-model](./06-content-data-model.md), [07-landing-page](./07-landing-page.md)

## Goal

Build `/[locale]/skills`: a full listing of every `SkillCategory` from `src/content/skills.ts`, rendered as a flowing list of headed sections (category name + its tech items). Unlike Studies (08) and Experience (09), Skills has no per-item detail/deep-link target (spec 07's decision 6), so this page needs no expand/collapse pattern, no `?highlight=` handling, and no client-side state — a plain Server Component listing everything at once.

## Scope

- **Route**: `src/app/[locale]/skills/page.tsx` (Server Component, no `searchParams` handling needed — nothing to highlight).
- **`SkillCategorySection`** (`src/components/skills/SkillCategorySection.tsx`): renders one category — a real `h2` heading (the category label) followed by a row of MUI `Chip`s, one per item (plain strings, not translated — same as Experience's tech tags). The Chip row is wrapped with `role="group"` + an `aria-label` naming the category (e.g. `aria-label="Frontend Core skills"`), mirroring spec 09's tags-group pattern.
- **Page composition**: page `h1` ("Skills"/"Habilidades") + all 7 `SkillCategorySection`s in the order declared in `src/content/skills.ts` (Frontend Core, Testing, Styling & UI, Forms/Dates & i18n, AI & Agents (emerging), Tooling & Workflow, Early Career: Java & Backend) — no reordering, no grouping/tiering beyond what the content file already expresses.
- **Layout**: single-column flow of headed sections via `Box`/`Stack`, no card boxes, no MUI `Grid` — consistent with the project's flexbox-first convention and the site's document-like tone.
- **No icons per category** — text-only `h2` headings.
- **Early Career and AI & Agents categories render identically to every other category** — no de-emphasis, no special emphasis; see Decisions.
- **Message files**: `messages/en.json` / `messages/es.json` get a new `skills` namespace: `heading` ("Skills"/"Habilidades"), `categoryItemsLabel` — a template string for each Chip-group's `aria-label` (e.g. `"{category} skills"` / `"Habilidades de {category}"`).
- **Landing page**: no changes needed. `FeaturedSectionCard`'s Skills teaser (spec 07) already links to `/skills` with no params — it now resolves to a real page instead of 404ing.

## Content model

No changes. `SkillCategory` (spec 06: `{ category: LocalizedText, items: string[] }`) already covers everything this page needs — no `id` field required, since Skills has no per-item highlight/deep-link target (spec 07 decision 6). First page in the roadmap that needs zero content-model additions.

## Accessibility / semantics

(Explicit per spec 00's Workflow requirement, mandatory from spec 09 onward.)

- **Heading hierarchy**: one real `h1` ("Skills"), followed by 7 real `h2`s (one per category, in document order), each rendered via `Typography variant="h2"` with no `component` override needed — unlike spec 10's finding on card-title `subtitle1`s, these genuinely are page sections, so being real headings is correct here, not a repeat of that bug.
- **Chip group labeling**: each category's `Chip` row gets `role="group"` + `aria-label` naming that category, so a screen reader announces it as a labeled group of skills rather than a run of disconnected words — same pattern spec 09 established for Experience's tags and spec 10 verified is rendering correctly.
- **Color contrast**: this is the first page where tag/skill `Chip`s render unconditionally visible (no `Collapse` wrapper around them, unlike Experience's tags which only exist in expanded — and likely axe-unevaluated — content). Real, direct axe coverage of `Chip` contrast, not a rehash of prior pages.
- **No new interactive elements** beyond nav-level ones already covered by spec 10's audit — no buttons, no expand/collapse, no focus-order or keyboard-trap risk introduced.
- `tests-e2e/skills.spec.ts` gets an axe check for both `/en/skills` and `/es/skills` from the start (same `wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa` tag scope spec 10 established), rather than retrofitted later.

## Tests

- Jest+RTL for `SkillCategorySection`: renders the heading text, renders every item as a `Chip`, and the Chip row's accessible group name matches the category.
- Storybook story for `SkillCategorySection` (a representative category with several items).
- `tests-e2e/skills.spec.ts`: page renders the `h1` and all 7 category `h2`s with their Chips, in both locales; axe check for both locales per above.

## Out of scope

- Any change to `SkillCategory`'s type or `src/content/skills.ts` data — reused as-is from spec 06.
- Any change to the landing page — already correct per spec 07.
- Proficiency levels / skill ratings — not part of the content model, not introduced here.
- Filtering or searching skills — not requested, no precedent from Studies/Experience either.

## Decisions

1. Layout is a flowing list of headed sections (`h2` + Chip row per category), not a card grid — matches the site's document-like tone and avoids a new card component built for a single page.
2. No icon per category — text-only headings; unlike Hobbies' 4 fixed personal items, 7 tech categories don't map to distinct icons without feeling arbitrary.
3. "Early Career: Java & Backend" renders identically to every other category — no de-emphasis styling, unlike spec 09's treatment of early-career _work experience_. These are current, real skills regardless of when they were learned.
4. "AI & Agents (emerging)" renders identically to every other category — no special visual emphasis; the "(emerging)" qualifier is already textual in the translated label.
5. No content-model changes — `SkillCategory` as shipped in spec 06 already covers this page's needs.
6. No client-side interactivity — Server Component throughout, no `?highlight=` support (per spec 07 decision 6: Skills has no per-item detail target).

## Verification

- `/en/skills` and `/es/skills` render one `h1` and 7 real `h2` category headings, each followed by its items as Chips, in the order declared in `src/content/skills.ts`.
- Each category's Chip row has an accessible group name distinguishing it from the others (spot-checked via RTL/Playwright `getByRole("group", { name: ... })`).
- Landing page's existing Skills teaser card navigates to `/skills` and now resolves instead of 404ing.
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e` (including the new axe checks), `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
