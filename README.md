# myself

Bruno's personal website and resume — a Next.js + TypeScript + MUI web app with a Claude-powered chatbot, doubling as a portfolio piece for AI agent engineering.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js (App Router) · TypeScript · Material UI · Playwright · Storybook · MSW · Jest + React Testing Library

## Testing

| Command                | Runs                                                      |
| ---------------------- | --------------------------------------------------------- |
| `pnpm test`            | Jest + React Testing Library (unit/component)             |
| `pnpm test:watch`      | Jest in watch mode                                        |
| `pnpm storybook`       | Storybook dev server (component catalog)                  |
| `pnpm build-storybook` | Static Storybook build                                    |
| `pnpm test:storybook`  | Storybook interaction tests (via Vitest browser mode)     |
| `pnpm test:e2e`        | Playwright end-to-end tests (boots the app automatically) |

API mocking for tests uses [MSW](https://mswjs.io) — handlers live in `src/mocks/handlers.ts` and are shared between Jest and Storybook.

## Environment variables & database

Copy `.env.example` to `.env.local` and fill in real values (never commit `.env.local`). The contact form (spec 16) needs `POSTGRES_URL`, pointing at a Neon database linked via Vercel's **Storage** tab ("Vercel Postgres" is now a native Neon integration, not a separate product):

```bash
pnpm dlx vercel link              # first time only, links this folder to the Vercel project
pnpm dlx vercel env pull .env.local
```

If a var was added manually in the dashboard rather than pulled, paste it into `.env.local` directly.

| Command            | Runs                                                         |
| ------------------ | ------------------------------------------------------------ |
| `pnpm db:generate` | Generates a Drizzle migration from `src/lib/db/schema.ts`    |
| `pnpm db:migrate`  | Applies pending migrations to the database in `POSTGRES_URL` |

`drizzle-kit` is a standalone CLI — unlike Next.js, it does **not** read `.env.local` automatically. `drizzle.config.ts` loads it explicitly via `dotenv`, so these commands only need `.env.local` to exist with a valid `POSTGRES_URL`, no extra flags.

## Project source of truth

This project is built spec-first: every feature is designed in [`/specs`](./specs) and approved before it's implemented. Start with [`specs/00-overview.md`](./specs/00-overview.md) for the full plan, stack decisions, and roadmap.

## Git hooks

Husky enforces quality gates automatically (installed via `pnpm install`, no extra setup needed):

- **pre-commit** — runs `lint-staged`: ESLint `--fix` and Prettier on staged files only. Fast, runs on every commit.
- **pre-push** — runs `typecheck`, `test`, and `build` in full. Slower, but only runs when code is about to leave your machine. A failure here blocks the push.

Bypassing either hook (`git commit --no-verify` / `git push --no-verify`) should be rare — only for genuine emergencies, since it skips the checks that keep `main` in a working state.

## Project structure

A full snapshot of every tracked file and folder, kept current automatically: `scripts/update-readme-tree.mjs` regenerates it from `git ls-files` (so it always matches `.gitignore`), and a Claude Code hook runs that script after every new file is created. Don't hand-edit the tree below — it's overwritten on the next regeneration.

<!-- PROJECT-TREE:START -->

```
myself/
├── .claude/
│   └── settings.json
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
├── drizzle/
│   ├── meta/
│   │   ├── _journal.json
│   │   └── 0000_snapshot.json
│   └── 0000_organic_human_robot.sql
├── messages/
│   ├── en.json
│   └── es.json
├── public/
│   └── logos/
│       ├── accenture.svg
│       ├── centerplate.svg
│       ├── digital-house.svg
│       ├── focus.svg
│       ├── globant.svg
│       ├── hootsuite.svg
│       ├── iguanafix.svg
│       ├── indra.svg
│       ├── iunigo.svg
│       ├── mercado-libre.svg
│       ├── nerdwallet.svg
│       ├── ort.svg
│       ├── santander.svg
│       ├── ypf.png
│       └── zys-factors.svg
├── scripts/
│   └── update-readme-tree.mjs
├── specs/
│   ├── 00-overview.md
│   ├── 01-project-scaffold.md
│   ├── 02-tooling-lint-hooks.md
│   ├── 03-tooling-test-stack.md
│   ├── 04-theme-design-tokens.md
│   ├── 05-base-layout.md
│   ├── 06-content-data-model.md
│   ├── 07-landing-page.md
│   ├── 08-studies-page.md
│   ├── 09-experience-page.md
│   ├── 10-accessibility-audit-pass-1.md
│   ├── 11-skills-page.md
│   ├── 12-about-page.md
│   ├── 13-support-views.md
│   ├── 14-cv-pdf-generation.md
│   ├── 15-contact-form-ui.md
│   └── 16-contact-backend.md
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── [...rest]/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── cv.pdf/
│   │   │   │   └── route.tsx
│   │   │   ├── experience/
│   │   │   │   └── page.tsx
│   │   │   ├── studies/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── contact/
│   │   │       ├── route.test.ts
│   │   │       └── route.ts
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── about/
│   │   │   ├── HobbiesList.test.tsx
│   │   │   ├── HobbiesList.tsx
│   │   │   ├── HobbyCard.stories.tsx
│   │   │   ├── HobbyCard.test.tsx
│   │   │   └── HobbyCard.tsx
│   │   ├── contact/
│   │   │   ├── ContactForm.stories.tsx
│   │   │   ├── ContactForm.test.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── experience/
│   │   │   ├── ExperienceCard.stories.tsx
│   │   │   ├── ExperienceCard.test.tsx
│   │   │   ├── ExperienceCard.tsx
│   │   │   ├── ExperienceList.test.tsx
│   │   │   └── ExperienceList.tsx
│   │   ├── landing/
│   │   │   ├── FeaturedSectionCard.stories.tsx
│   │   │   ├── FeaturedSectionCard.test.tsx
│   │   │   ├── FeaturedSectionCard.tsx
│   │   │   ├── Hero.stories.tsx
│   │   │   ├── Hero.test.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ItemListSection.stories.tsx
│   │   │   ├── ItemListSection.test.tsx
│   │   │   └── ItemListSection.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── PageShell.tsx
│   │   ├── skills/
│   │   │   ├── SkillCategorySection.stories.tsx
│   │   │   ├── SkillCategorySection.test.tsx
│   │   │   └── SkillCategorySection.tsx
│   │   ├── studies/
│   │   │   ├── StudiesList.test.tsx
│   │   │   ├── StudiesList.tsx
│   │   │   ├── StudyCard.stories.tsx
│   │   │   ├── StudyCard.test.tsx
│   │   │   └── StudyCard.tsx
│   │   ├── Greeting.stories.tsx
│   │   ├── Greeting.test.tsx
│   │   ├── Greeting.tsx
│   │   └── ThemeRegistry.tsx
│   ├── content/
│   │   ├── about.ts
│   │   ├── contact.ts
│   │   ├── content.test.ts
│   │   ├── experience.ts
│   │   ├── index.ts
│   │   ├── skills.ts
│   │   ├── studies.ts
│   │   └── types.ts
│   ├── i18n/
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── lib/
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   └── schema.ts
│   │   ├── pdf/
│   │   │   └── CvDocument.tsx
│   │   ├── contactValidation.ts
│   │   ├── dateRange.ts
│   │   ├── initials.test.ts
│   │   ├── initials.ts
│   │   └── theme.ts
│   ├── mocks/
│   │   ├── browser.ts
│   │   ├── handlers.ts
│   │   └── server.ts
│   └── proxy.ts
├── tests-e2e/
│   ├── about.spec.ts
│   ├── contact.spec.ts
│   ├── cv-pdf.spec.ts
│   ├── experience.spec.ts
│   ├── landing.spec.ts
│   ├── not-found.spec.ts
│   └── studies.spec.ts
├── .env.example
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── drizzle.config.ts
├── eslint.config.mjs
├── jest.config.ts
├── jest.polyfills.js
├── jest.setup.ts
├── next.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tsconfig.json
├── vitest.config.ts
└── vitest.shims.d.ts
```

<!-- PROJECT-TREE:END -->
