# 06 — Content Data Model

Status: Implemented
Depends on: [05-base-layout](./05-base-layout.md)

## Goal

Define the typed, structured data (experience, studies, skills, about-me) that every later consumer — the content pages (specs 07–11), the CV PDF (spec 12), and the agent's CV-search tool (spec 17) — reads from. This spec only creates the data and its types, plus a way to load it; no page renders it yet.

## Scope

- **Location**: `src/content/` — one file per section: `experience.ts`, `studies.ts`, `skills.ts`, `about.ts`.
- **Types**: `src/content/types.ts` defines a shared `LocalizedText` type (`{ en: string; es: string }`) and one interface per section (`ExperienceEntry`, `StudyEntry`, `SkillCategory`, `AboutContent`).
- **Bilingual strategy**: translatable prose fields (titles, descriptions, summaries) are `LocalizedText` objects inline on each entry; non-prose fields (dates, company/institution names, tech tags, URLs) are plain strings shared across locales — proper nouns and tech names (`"React"`, `"PostgreSQL"`) don't need translation, and duplicating them per locale would just invite drift. This keeps one array per section instead of duplicating entire files per language.
- **Content shape**:
  - `ExperienceEntry`: company (client-facing name, e.g. "Hootsuite" rather than the staffing employer), role (`LocalizedText`), start/end dates (`string`, `YYYY-MM`; `endDate: string | null`, `null` = present), section (`"professional" | "early"`), description (`LocalizedText`), bullet points (`LocalizedText[]`), tech tags (`string[]`).
  - `StudyEntry`: institution, degree/title (`LocalizedText`), start/end dates, description (`LocalizedText`, optional).
  - `SkillCategory`: category label (`LocalizedText`, e.g. "Frontend Core", "AI & Agents"), items (`string[]` — tech names, not translated).
  - `AboutContent`: a small set of sections (bio, hobbies) each with `LocalizedText` bodies — the real hobbies list already exists (from the CV) but Bruno wants to hold off on expanding it; ships with that minimal version, extended later if wanted.
- **Loader helpers**: `src/content/index.ts` re-exports the raw arrays and adds a couple of small helpers used later — e.g. `getLocalizedText(value: LocalizedText, locale: Locale): string` — so pages/PDF/agent don't repeat the `value[locale]` lookup pattern everywhere.
- **Real content from day one**: this ships with Bruno's actual experience/studies/skills, reconstructed from his CV + LinkedIn export (see Decisions below for the specifics), not placeholder data — specs 07–11 render real content immediately instead of needing a later content pass.
  - **Experience, `section: "professional"`** (most recent first): Globant (client Sportian, Nov 2025–Jun 2026), YPF "Y-Tracker" (via GlobalLogic, ~Jun–Nov 2025), Hootsuite (via GlobalLogic, Nov 2023–~Jun 2025), Nerdwallet (via Solvd, Inc., Oct 2021–Feb 2023), Mercado Libre (Dec 2020–Sep 2021), Santander Tecnología (Sep–Dec 2020), Iúnigo (May 2019–Sep 2020), IguanaFix (Nov 2018–Apr 2019), Accenture (Jun 2017–Nov 2018, Java).
  - **Experience, `section: "early"`** (pre-dev career, shown separately/de-emphasized): Indra (tester, Aug 2016–May 2017), ZyS Factors S.A. (internal technical assistant, Mar–Jul 2016), Centerplate (ski resort general worker, Work & Travel, Dec 2014–Mar 2015), Focus (digital illustrator, Sep–Nov 2014).
  - **Studies**: Digital House (Native Android Development, 03/2016–09/2016), Escuelas Técnicas ORT (Technical Baccalaureate, 2009–2013). UCES (Economics, paused) intentionally excluded for now — Bruno may resume it at a different university later.
  - **Skills, by category**: Frontend Core (React.js, TypeScript, JavaScript ES6+, Redux, Next.js); Testing (Jest, React Testing Library, Playwright, MSW, Storybook); Styling & UI (Material UI, styled-components, Sass, Bootstrap, Tailwind CSS); Forms, Dates & i18n (Formik, Yup, Moment.js, date-fns, Day.js, next-intl); AI & Agents — _emerging_ (Claude API, AI-assisted development, agentic tool use); Tooling & Workflow (Git, npm/yarn/pnpm, Agile); Early Career — Java/Backend (Java, PostgreSQL, SQL Server, MongoDB, Maven, JBoss).
- **Validation test**: a Jest unit test (`src/content/content.test.ts`) that walks every entry in every section and asserts each `LocalizedText` has non-empty `en` and `es` strings — catches "forgot to translate this field" mistakes early, before they reach a page.

## Out of scope

- Rendering this data on any page → specs 08–11.
- CV PDF generation → spec 12.
- Expanding the About Me hobbies/bio content beyond what's already in the CV — Bruno's explicitly deferring this.

## Backend concepts

- **Why TypeScript files instead of JSON**: JSON can't express types or catch mistakes at compile time (e.g. a typo'd field name, a missing `es` translation) — TS content files get full type-checking from `tsconfig`'s `strict` mode, and IDE autocomplete when adding new entries. The "data" is still plain, easily-readable objects; the only difference from JSON is that TypeScript verifies its shape.
- **Single source of truth pattern**: this is why spec 12 (PDF) and spec 17 (agent's CV-search tool) don't get their own copies of this content — they both import from `src/content/`. If Bruno updates a job title here, the website, the PDF, and the chatbot's answers all stay in sync automatically, instead of three places to remember to update.

## Decisions

1. Content shape as described above (four interfaces, `section` field added to `ExperienceEntry` to separate professional vs. early/pre-dev career).
2. Real content goes in now, sourced from Bruno's CV + LinkedIn export (see the specific lists above), not placeholder data.
3. Santander Tecnología and IguanaFix (short stints, absent from the curated printed CV) are included in professional experience.
4. Pre-2017 non-dev roles (Indra, ZyS Factors, Centerplate, Focus) are included as a separate, de-emphasized "early experience" section rather than left out entirely.
5. Skills are grouped by category (see list above) rather than a single flat list.

## Verification

- `pnpm test` runs the new content validation test; it passes for the shipped placeholder (or real) data.
- `pnpm typecheck` passes — content files conform to their declared interfaces.
- A throwaway script or test confirms `getLocalizedText(entry.role, "es")` and `("en")` both resolve correctly for a sample entry.
