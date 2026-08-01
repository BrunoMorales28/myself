# 01 — Project Scaffold

Status: Implemented
Depends on: [00-overview](./00-overview.md)

## Goal

Get an empty-but-running Next.js + TypeScript project in place, with the folder structure this whole project will grow into, and nothing else — no theming, no tests, no hooks yet (those are separate sub-specs). The only success criterion here is: `npm run dev` boots a default page, TypeScript is strict, and the repo shape makes sense for what's coming.

## Scope

- Initialize Next.js (App Router) with TypeScript, using `create-next-app` (or manual init — TBD, see open question).
- `tsconfig.json` with `strict: true`.
- Minimal folder structure (adjusted during implementation: `create-next-app --src-dir` puts routes under `src/app`, so everything lives under `src/` for consistency rather than mixing root-level `/app` with `/src/*`):
  ```
  /src/app              # Next.js App Router routes
  /src/components       # shared UI components
  /src/content           # structured CV/experience/studies/skills data (populated in spec 06)
  /src/lib               # non-UI utilities (agent, pdf, db clients — populated later)
  /public                # static assets
  /specs                 # this spec folder
  ```
- `package.json` scripts: `dev`, `build`, `start`, `lint` (placeholder until spec 02 wires real ESLint config).
- `.gitignore` covering `node_modules`, `.next`, `.env*.local`, etc.
- `.gitattributes` normalizing line endings (`* text=auto eol=lf`) so Git doesn't warn/convert LF↔CRLF on Windows and every contributor gets consistent line endings regardless of OS.
- `.env.example` file (empty/placeholder for now — real vars get added per later spec as needed) so secrets handling is established as a pattern from the start.
- README updated with: what the project is, how to run it locally, and a pointer to `/specs` as the source of truth for design decisions.

## Out of scope (handled in later sub-specs)

- ESLint/Prettier configuration, Husky hooks → spec 02.
- Jest/RTL, Playwright, Storybook, MSW → spec 03.
- MUI, theme, any real UI → spec 04+.
- Any content, pages beyond the Next.js default → spec 07+.

## Backend concepts

- **App Router vs Pages Router**: Next.js's newer routing model (`/app` directory) uses React Server Components by default — components run on the server unless marked `"use client"`. This matters for this project because the chatbot and contact form (later specs) will need client-side interactivity, while content pages can mostly stay server-rendered for better performance and SEO. We'll flag `"use client"` explicitly when a component needs it (hooks, event handlers, browser APIs).
- **Environment variables**: `.env.local` holds secrets/config that never get committed (already covered by `.gitignore`); `.env.example` documents *which* variables exist without their real values, so anyone (including you, on a new machine) knows what to set. On Vercel, the real values get set in the project's Environment Variables settings instead of a committed file.
- **Line endings (LF vs CRLF)**: Windows text editors traditionally use CRLF (`\r\n`) line endings, Unix/Mac/most tooling use LF (`\n`). When a Windows dev and Git's Unix-style internals disagree, Git tries to auto-convert on checkout/commit — that's the warning you saw. `.gitattributes` pins the repo's line-ending policy explicitly (LF everywhere) so it's the same for every contributor/OS instead of depending on each person's local `core.autocrlf` setting.

## Decisions

- Package manager: **pnpm**.
- Init method: **`create-next-app`**, then trim generated boilerplate (default icon, placeholder home content) to match the folder structure above.

## Verification

- `npm run dev` serves the default page at `localhost:3000` with no errors.
- `npm run build` completes successfully.
- `npx tsc --noEmit` passes with strict mode on.
- Folder structure matches the layout above.
