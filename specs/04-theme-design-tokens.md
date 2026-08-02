# 04 — Theme & Design Tokens

Status: Implemented
Depends on: [01-project-scaffold](./01-project-scaffold.md)

## Goal

Define the MUI theme — palette, typography, spacing, shape — that gives the whole site its sober/institutional identity (an institutional blue, UCEMA-inspired), and wire it into the app via `ThemeProvider`. No real pages/components consume it yet beyond a visual smoke test; that starts with spec 05 (base layout).

## Scope

- **MUI setup**: install `@mui/material`, `@emotion/react`, `@emotion/styled` (MUI's default styling engine), `@mui/icons-material` (for nav/UI icons used in later specs).
- **Theme file** at `src/lib/theme.ts` — a single `createTheme()` call, typed, exported for use both by the app's `ThemeProvider` and by Storybook's preview (so every story renders themed).
- **Palette** — institutional blue as primary, sober neutrals for backgrounds/text, restrained accent use. Proposed starting values (open to adjustment once seen rendered):
  - `primary`: a deep/navy institutional blue (`#0B3D66`-ish range) with a lighter `main`/`dark`/`light` triad MUI can derive or we specify explicitly.
  - `secondary`: a muted neutral (slate gray) for supporting UI, not a second bright color — keeps the "serious" tone rather than looking like a startup landing page.
  - `background.default` / `background.paper`: off-white / white, not pure white, for a slightly warmer institutional feel.
  - `text.primary` / `text.secondary`: near-black / mid-gray, high contrast for WCAG AA.
  - `error`/`warning`/`success`/`info`: MUI defaults, only overridden if they clash with the primary blue.
- **Typography** — a single clean sans-serif family for both headings and body text (weight/size/spacing carry the hierarchy, not a font pairing), loaded via `next/font` (self-hosted, no external font requests — better performance and no third-party network calls). Type scale follows MUI's default variant set (`h1`–`h6`, `body1`/`body2`, `button`, etc.) with sizes tuned for a content-heavy, readable site rather than a marketing landing page.
- **Shape & spacing**: modest border radius (sharper/more institutional than MUI's rounded default — e.g. `shape.borderRadius: 4`), MUI's default 8px spacing unit (no need to override).
- **`ThemeProvider` wiring**: `src/app/layout.tsx` wraps children in MUI's `ThemeProvider` + `CssBaseline`; since MUI v6/v7 needs an Emotion cache configured correctly for Next.js App Router (server components), add the documented `ThemeRegistry`/Emotion cache client component pattern.
- **Storybook integration**: `.storybook/preview.tsx` wraps every story in the same `ThemeProvider` + `CssBaseline`, so components are previewed themed exactly as they render in the app.
- **Smoke-test page**: temporarily render a few MUI components (`Typography` variants, a `Button` in each color) on the existing scaffold home page so the theme is visually verifiable before real pages exist. This gets replaced by real content in spec 07 (landing page).

## Out of scope

- Dark mode / theme switching — not part of the v1 decisions; can be added later as its own spec if wanted.
- Any real layout components (header, nav, footer) → spec 05.
- Actual page content → spec 07+.

## Backend concepts

- **Emotion cache + Next.js App Router**: MUI's `styled()`/`sx` API generates CSS at runtime via Emotion. In App Router, pages render on the server by default, and without extra wiring, server-rendered styles and client-rendered styles can get inserted in the wrong order or duplicated (a flash of unstyled content, or hydration mismatches). MUI's documented fix is a small `ThemeRegistry` client component that sets up a shared Emotion cache and flushes server-generated styles into the initial HTML `<head>` correctly. This is boilerplate to add once, not something to hand-tune per page.
- **Why the theme can't just be a prop from `layout.tsx`**: `RootLayout` is a Server Component by default. The `theme` object from `createTheme()` contains functions (e.g. `breakpoints.up()`), and React Server Components can only pass serializable data as props into Client Components — passing the theme object itself across that boundary fails the build (`Functions cannot be passed directly to Client Components`). The fix is for `ThemeRegistry` (a `"use client"` component) to import and construct the theme itself internally, so it never has to cross the server→client prop boundary.
- **`next/font`**: Next.js downloads and self-hosts the font files at build time instead of the browser fetching them from Google Fonts (or wherever) at runtime — faster page loads, no layout shift from late-loading fonts, and no external request that could be blocked or slow in some networks.

## Decisions

1. Typography: sans-serif everywhere (headings and body) — weight/size/spacing carry the visual hierarchy instead of a serif/sans pairing.
2. Primary blue: no specific reference color — a sober navy gets proposed directly in the theme file, adjusted after Bruno sees it rendered.

## Verification

- `pnpm dev` shows the smoke-test home page with MUI `Typography` variants and colored `Button`s rendering in the chosen palette.
- `pnpm storybook` shows the existing `Greeting` story rendered with the theme applied (e.g. inherited typography).
- `pnpm build` succeeds with no hydration warnings in the server logs.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` all still pass.
