# 10 — Accessibility & Semantics Audit (Pass 1)

Status: Implemented
Depends on: [05-base-layout](./05-base-layout.md), [07-landing-page](./07-landing-page.md), [08-studies-page](./08-studies-page.md), [09-experience-page](./09-experience-page.md)

## Goal

An interim WCAG 2.1 AA + semantic-HTML audit of everything shipped so far (base layout/nav, landing, studies, experience), done now rather than waiting for the end-of-project audit (spec 22, formerly numbered 21). Each earlier spec (05, 07, 08) was written before accessibility/semantics became an explicit, spelled-out requirement (that discipline starts with spec 09 — see spec 00's Workflow section) — this pass checks whether the actually-shipped code holds up to that same bar, retroactively, and fixes what doesn't. It exists so gaps get caught and fixed while the codebase is still small, instead of compounding across 10+ more pages/features and becoming a much bigger cleanup at spec 22.

## Scope

- **Automated tooling**: wire up `@axe-core/playwright` into the e2e suite now (originally planned for spec 22) — add an axe check to each existing e2e spec (`landing.spec.ts`, `studies.spec.ts`, `experience.spec.ts`) asserting zero violations at the default (WCAG 2.1 A+AA) rule set, for both `/en` and `/es` variants of each page.
- **Manual review checklist**, applied to base layout (header/nav/footer/language selector), landing, studies, and experience:
  - **Heading hierarchy**: exactly one `h1` per page, no skipped levels (`h1` → `h2` → `h3`, never `h1` → `h3`), section headings are real heading elements (not styled `Typography variant="h2"` used as visual-only text with no semantic tag — verify the underlying `component`/tag actually renders `<h2>` etc.).
  - **Landmarks**: `header`/`nav`/`main`/`footer` present and singular where expected (from spec 05's `PageShell`), not duplicated or missing on any page.
  - **Interactive elements**: every clickable thing that behaves like a button or link is a real `<button>`/`<a>` (via MUI `Button`/`IconButton`/`Link`/`CardActionArea`), not a `div`/`span` with an `onClick` — covers the mobile nav toggle, language selector, and all card headers (studies, experience).
  - **`aria-expanded`/`aria-current`/`aria-label` audit**: confirm every place spec 08/09 claimed one exists actually renders it correctly in the DOM (not just claimed in the spec text) — nav's active-page indicator, card expand toggles, the experience tags group label from spec 09.
  - **Focus management**: visible focus ring present (theme-provided, spec 04) on every interactive element via keyboard `Tab`; focus order follows visual/reading order; no focus traps.
  - **Images/logos**: every `Avatar`/logo has an equivalent accessible name whether the image loads or falls back to initials (spec 07's pattern) — spot-check a handful, not just take the spec's word for it.
  - **Color contrast**: run an automated contrast check (axe covers this, but also spot-check manually) across theme text/background combinations actually in use, including the experience page's de-emphasized "Otras experiencias" section (spec 09) and any muted/secondary text elsewhere (e.g. date ranges, teaser copy).
  - **Language attributes**: `<html lang="en">` / `<html lang="es">` set correctly per locale (from spec 05's i18n setup) — verify it actually reflects the active locale, not hardcoded.
- **Fix, don't just report**: this spec's implementation includes fixing whatever the audit finds, not just producing a findings list — findings become code changes in the same pass, scoped to the four already-shipped areas above.
- **Findings log**: a short summary of what was found and fixed lives in this spec's "Implementation notes" section once done (same convention other specs use for deviations), so spec 22's final pass has a record of what pass 1 already covered.

## Out of scope

- Pages not yet built (skills, about, contact, agent UI, etc.) — those get the explicit accessibility/semantics treatment as part of their own specs (11+), per spec 00's updated Workflow requirement, not audited here since they don't exist yet.
- i18n completeness (translation coverage, missing keys) — that's spec 23's job, distinct from accessibility.
- Introducing new visual designs/tokens to fix contrast issues — prefer adjusting existing token values/usage over adding new ones; if a genuinely new token is unavoidable, keep the change minimal and note it.
- Manual screen-reader testing (NVDA/VoiceOver walkthroughs) — automated (axe) + code-level manual review only for this pass; full manual AT testing is a spec 22 concern.

## Backend concepts

None — this is a frontend correctness/tooling pass.

## Decisions

1. This audit runs now (after spec 09) rather than waiting for spec 22, specifically because specs 05/07/08 predate the explicit accessibility-section requirement and shouldn't be allowed to drift further before a check-in.
2. `@axe-core/playwright` gets wired in now rather than at spec 22 — once it's in the e2e suite, every subsequent spec's e2e tests get axe coverage for free, catching regressions immediately instead of only at the final audit.
3. Findings get fixed as part of this spec, not just logged for later.
4. Scope is limited to what's already shipped (layout, landing, studies, experience) — not a preemptive audit of unbuilt pages.

## Implementation notes (findings log)

- **Heading hierarchy — real bug, fixed.** MUI's `Typography variant="subtitle1"` renders an actual `<h6>` element by default (its `defaultVariantMapping`). Four components used it with no `component` override for what are card/item _labels_, not document sections: `ExperienceCard`'s company name, `StudyCard`'s institution name, `ItemListSection`'s item title (landing page), and `FeaturedSectionCard`'s title (Skills/Contact teasers). This meant every page had a real `h1 → h2 → h6` skip (13 stray `h6`s on the Experience page alone), and in `StudyCard`/`ExperienceCard` the `<h6>` sat inside a `<button>`, which is invalid HTML — a heading element isn't permitted content inside `button` (phrasing-content-only). Fixed by giving all four an explicit `component="span"` + `sx={{ display: "block" }}` (span keeps them valid inside `button`'s phrasing-content model; the explicit block display preserves the existing stacked layout, since span is inline by default and nothing in the theme forces block on Typography). Header's own `variant="h6"` site name was checked and is fine — it already has `component={Link}`, which overrides the tag to `<a>`, not `<h6>`.
- **Missing nav landmark — real gap, fixed.** The header's nav links (desktop `Stack` of buttons, and the mobile `Drawer`'s `List`) weren't wrapped in a `<nav>` element, so screen reader users had no landmark to jump straight to site navigation. Wrapped both in `<nav aria-label="Main navigation">` (new `nav.mainNavigation` message key, EN/ES). Only one is ever exposed to the accessibility tree at a given viewport width (the other is `display: none`), so no duplicate-landmark conflict.
- **Color contrast — real bug, fixed.** `@axe-core/playwright` caught a genuine, if narrow, AA failure: the language switcher's unselected button ("EN"/"ES", whichever isn't active) used MUI's default unselected-`ToggleButton` gray (`#717171`) against the header's default AppBar background (`#f5f5f5`) — 4.48:1, just under the 4.5:1 body-text threshold. Fixed via a `MuiToggleButton` theme override reusing the existing `text.secondary` token (`#5A6472`, 5.50:1 against the same background) rather than introducing a new color.
- **Everything else on the manual checklist held up as claimed**: landmarks (`header`/`main`/`footer` singular and correctly typed — `AppBar` defaults to `<header>`, `Container component="main"`, `Footer`'s `component="footer"`), `aria-expanded` on all card toggles, the experience tags' `role="group"` + `aria-label`, `Avatar` fallback accessible names, focus rings (unmodified MUI/theme defaults, never suppressed), and `<html lang>` correctly reflecting the active locale via `getLocale()`. No changes needed for any of these.
- `@axe-core/playwright` is now wired into `landing.spec.ts`, `studies.spec.ts`, and `experience.spec.ts`, one test per page per locale (6 total), scoped to `wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa` tags per this spec's stated rule set. All 6 pass after the fixes above.

## Verification

- `@axe-core/playwright` is a project dependency and runs in `landing.spec.ts`, `studies.spec.ts`, `experience.spec.ts` (both locales), asserting zero violations.
- Manual checklist above completed for base layout, landing, studies, experience; any finding has a corresponding code fix in this spec's commit(s).
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass after fixes.
