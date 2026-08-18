# 11 — Skills Section (within the Experience page)

Status: Implemented
Depends on: [05-base-layout](./05-base-layout.md), [06-content-data-model](./06-content-data-model.md), [07-landing-page](./07-landing-page.md), [09-experience-page](./09-experience-page.md)

## Revision note

This spec originally shipped as a standalone `/skills` page (v1): a flowing single-column list of category headings + chip rows. After seeing it rendered, Bruno found it visually too sparse — a single-column list of short chip rows in a 1200px-wide container leaves a lot of empty horizontal space, and as the _entire_ content of its own page, that emptiness dominated the experience.

After weighing three directions (redensify the standalone page, fold into the Experience page, promote to a full landing-page section), Bruno chose to fold Skills into the Experience page as a closing section. This document has been rewritten to describe that shipped design; v1's standalone-page approach is preserved here in this note for the record, but everything below describes v2, the current implementation.

## Goal

Present every `SkillCategory` from `src/content/skills.ts` as a section on `/[locale]/experience`, after the "Professional Experience" and "Other experiences" lists — a closing tech-stack summary, reusing the same `SkillCategorySection` component built for v1. No standalone route, no per-item detail/deep-link target (unchanged from v1's underlying reasoning — spec 07 decision 6), no client-side state.

## Scope

- **No separate route.** `src/app/[locale]/skills/page.tsx` (v1) is deleted. `src/app/[locale]/experience/page.tsx` (spec 09) gains a new block after `<ExperienceList />`: a `Box component="section" id="skills"` containing an `h2` ("Skills"/"Habilidades") and a flex-wrap grid of `SkillCategorySection`s.
- **`SkillCategorySection`** (`src/components/skills/SkillCategorySection.tsx`, unchanged from v1 except heading level — see Accessibility below): one category — a heading + a row of MUI `Chip`s, one per item, wrapped with `role="group"` + `aria-label` naming the category. Now also sizes itself as a flex item (`flex: "1 1 260px"`) so multiple categories sit side by side.
- **Layout — the actual fix for the "too empty" complaint**: the container around the `SkillCategorySection`s is `display: flex; flexWrap: wrap; gap: 3` — categories wrap into 2–4 columns depending on viewport width instead of stacking full-width in a single column, and collapse to one column on mobile.
- **Anchor link**: `id="skills"` on the section's container, so `/experience#skills` jumps straight to it via native browser/Next.js anchor behavior — no custom scroll code needed (unlike the `?highlight=` mechanism, which exists specifically to un-collapse and scroll to `MUI Collapse` content; Skills content is never collapsed).
- **Nav repointed**: `Header.tsx`'s "Skills" nav entry (desktop bar and mobile drawer) now resolves to `/experience#skills` instead of `/skills`, via a small `navHref()` helper — Skills stays a top-level, discoverable nav item even though it's no longer its own route.
- **Landing teaser repointed**: the landing page's Skills `FeaturedSectionCard` (spec 07) now links to `/experience#skills` instead of `/skills`. No other landing-page changes.
- **Message files**: no new keys. The `skills` namespace (`heading`, `categoryItemsLabel`) from v1 is reused as-is, now consumed from `experience/page.tsx` via a second `getTranslations("skills")` call alongside the page's existing `getTranslations("experience")` call.

## Content model

No changes (unchanged from v1). `SkillCategory` (spec 06: `{ category: LocalizedText, items: string[] }`) covers everything this section needs.

## Accessibility / semantics

- **Heading hierarchy fix, relative to v1**: v1 had `h1 → h2` (page → category) directly, which was correct standalone. Folded into Experience, categories now nest under a _new_ "Skills" `h2`, so each category label must drop to `h3` — otherwise "Skills" and "Frontend Core" would sit at the same heading level as siblings, which is wrong (Frontend Core is a subsection _of_ Skills). `SkillCategorySection`'s `Typography variant="h2"` became `variant="h3"`. Resulting hierarchy on `/experience`: `h1` ("Experience") → `h2` × 3 ("Professional Experience", "Other experiences", "Skills") → `h3` × 7 (category names, only under "Skills").
- **Chip group labeling**: unchanged from v1 — each category's `Chip` row keeps its `role="group"` + `aria-label`.
- **Color contrast**: unchanged from v1's finding — Skills' `Chip`s render unconditionally visible (no `Collapse` wrapper), so they get real, direct axe coverage rather than being buried in collapsed content. Confirmed zero violations post-fold.
- **No new interactive elements** beyond what spec 09/10 already covered.
- No dedicated `skills.spec.ts` anymore — its axe coverage is now provided by `experience.spec.ts`'s existing per-locale axe checks, which cover the same DOM content since Skills is now part of that page.

## Tests

- `SkillCategorySection.test.tsx` / `.stories.tsx`: updated heading-level assertions (`level: 2` → `level: 3`); everything else unchanged from v1.
- `tests-e2e/experience.spec.ts` gained two tests: Skills section renders (heading + a category's labeled Chip group + an item) after the experience lists; the header's "Skills" nav link navigates to `/experience#skills` and the Skills heading lands in viewport.
- `tests-e2e/skills.spec.ts` (v1) deleted — its assertions and axe checks are superseded by the additions to `experience.spec.ts` above.

## Out of scope

- Any change to `SkillCategory`'s type or `src/content/skills.ts` data.
- Any further landing-page changes beyond the one `href` update.
- Proficiency levels, filtering/searching skills — not requested, no precedent from Studies/Experience either.

## Decisions

1. Skills lives as a section on the Experience page, not its own route — job history stays the page's lead subject (its `h1`); Skills reads as a closing tech-stack summary.
2. Categories render in a wrapping multi-column flex grid, not a single-column stack — this is what actually fixes the visual sparseness, independent of where the content lives.
3. Category headings drop from `h3` (this doc's earlier `h2`) to sit correctly under the new "Skills" `h2`, avoiding a repeat of spec 10's heading-hierarchy class of bug in the opposite direction.
4. `/skills` and its `Status: Approved` v1 spec text are retired in favor of this rewritten document — the paper trail is kept via this Revision note rather than a silent rewrite, consistent with how specs 07–10 document deviations and decisions.
5. Nav and the landing teaser both repoint to `/experience#skills` rather than dropping Skills from top-level navigation — it's still one of spec 00's original six sections and stays discoverable.

## Verification

- `/en/experience` and `/es/experience` render `h1 → h2 × 3 → h3 × 7` in that nesting order, with the Skills grid wrapping into multiple columns on desktop and one column on mobile.
- `/skills` no longer exists (confirmed via `pnpm build`'s route list).
- Header's "Skills" nav link and the landing page's Skills teaser both navigate to `/experience#skills` and land on/scroll to the section.
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e` (including `experience.spec.ts`'s per-locale axe checks, zero violations), `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass.
