# 17 — Visual Restyle

Status: Implemented
Depends on: [04-theme-design-tokens](./04-theme-design-tokens.md), [05-base-layout](./05-base-layout.md)

## Goal

Replace the site's current "sober/institutional" visual identity (spec 04's navy palette, single-font typography) with a new one — settled visually in a design-canvas exploration outside the spec process — while keeping every page's existing HTML structure, component composition, and content untouched. This is a restyle, not a re-layout: no new sections, no removed sections, no changed information architecture.

Direction settled on (four options were explored; this is the one chosen, with a follow-up palette swap and a mobile pass):

- **Typography**: a display/body pairing — `Bricolage Grotesque` (headings, nav wordmark, avatars' initials) + `Karla` (body text, buttons, labels) — replacing spec 04's single-sans-serif decision.
- **Palette**: green primary (`#1F8A5F` in the mockup) instead of navy, with light green-tinted section backgrounds instead of a flat `background.default` everywhere.
- **Header**: `AppBar` background switches from `color="default"` (transparent/paper) to the primary color, with light-tinted nav link text for contrast.
- **Cards**: `Card`-based components (`ItemListSection` entries, `FeaturedSectionCard`, `ExperienceCard`, `StudyCard`) get noticeably taller internal padding than today's compact rows.
- **Section backgrounds**: each page section alternates between 2–3 very light tints of the primary hue (not a single flat background across the whole page) — e.g. landing's Hero/Studies white, Experience/Hobbies pale green, Skills/Contact a slightly deeper pale green.
- **Mobile-first**: per standing project preference (see project memory), the MUI `sx` breakpoint overrides for this restyle are authored base-first (mobile styles as the unprefixed value, `sm`/`md`-and-up overrides layered on top) rather than designed desktop-first and collapsed down.

## Scope

- **`src/lib/theme.ts`**: new `palette.primary`/`secondary` green triad, `background.default`/`paper`, a new token (or MUI palette augmentation) for the section-tint backgrounds so pages don't hardcode hex values inline, updated `typography.fontFamily` for a heading/body pairing, and a larger `shape.borderRadius` to match the mockup's rounder cards (mockup used 10–16px depending on element).
- **Fonts**: `Bricolage Grotesque` + `Karla` loaded via `next/font/google` (self-hosted at build time), consistent with spec 04's existing rationale (no third-party runtime font requests) — not the `<link>`-to-Google-Fonts approach the design-canvas mockup used, since that mechanism doesn't apply to the real Next.js app.
- **`Header.tsx`**: `AppBar` `color` prop (or explicit `sx`) switches to the primary color; nav `Button`/`Link` text colors adjusted for contrast against it; mobile `Drawer` unaffected in structure, restyled to match the new palette.
- **`PageShell.tsx` restructure (full-bleed sections)**: today every page renders inside one `Container maxWidth="lg"`, so nothing can have its own edge-to-edge background — that's a structural gap the mockup didn't have to deal with (it authored raw HTML `<section>`s with no shared shell). `PageShell` changes so `Header`/`Footer` stay as they are, but the `<main>` area no longer wraps everything in a single `Container`: each page becomes a stack of full-width section `Box`es (each carrying its own background color from the new theme tokens), with the `maxWidth="lg"` constraint moved _inside_ each section (a `Container`/inner wrapper per section) instead of wrapping the whole page once. This is the same full-bleed-band-with-constrained-inner-content pattern the design-canvas mockup used (`<section style="background:…"><div class="wrap">…</div></section>`), translated into MUI. Every page (`page.tsx` for Landing/Studies/Experience/About/Contact) needs its top-level markup adjusted to this section-based shape, not just a style tweak.
- **Per-page section breakdown** (what "alternating tints" maps to on pages that aren't Landing, since none of them have Landing's five distinct card-grid sections):
  - **Studies** (`studies/page.tsx`): two zones — heading + intro, and the studies list (`StudiesList`) — alternating tint.
  - **Experience** (`experience/page.tsx`): three zones — heading, the experience list (`ExperienceList`, professional + early), and the Skills block (`#skills`) — alternating tint across the three.
  - **About** (`about/page.tsx`): two zones — heading + bio, and the hobbies list (`HobbiesList`) — alternating tint.
  - **Contact** (`contact/page.tsx`): two zones — heading + intro + the email/LinkedIn/GitHub links `Stack`, and the `ContactForm` itself — alternating tint.
  - Landing (`page.tsx`) keeps its existing five-zone breakdown from the mockup (Hero, Experience, Studies, Hobbies, Skills/Contact).
- **Card padding**: `ExperienceCard`, `StudyCard`, `ItemListSection`'s card, and `FeaturedSectionCard` all get increased internal padding (mockup used roughly +10–14px over today's `p: 2`).
- **Mobile-first pass**: for every touched component, verify/rewrite responsive `sx` so the base (no-breakpoint-prefix) values already match the mobile mockup, with `sm`/`md` overrides layered on top for larger viewports — this is a real review pass, not just "it still looks fine on mobile."

## Out of scope

- Any change to page structure, section order, routing, or content (copy, data model) — pure restyle.
- Dark mode — still not part of v1 (per spec 04).
- Logo/illustration work — avatars keep using real company/institution logos where available (`logoUrl`), falling back to initials exactly as today; the mockup's flat-color initial circles were a placeholder for logo-less mockup content, not a design decision to stop using real logos.
- Chatbot UI — doesn't exist yet (specs 18+ in the original roadmap).

## Backend concepts

None — this is a frontend-only styling change; no new server code, routes, or data. The one new frontend _concept_, though: **full-bleed sections inside a constrained layout**. Right now `PageShell`'s single `Container maxWidth="lg"` both centers the content _and_ caps how wide anything can visually stretch — there's no way for one section to have a background that reaches the browser's edges while another doesn't, because everything shares that one wrapper. The fix is to stop constraining width at the page level and instead constrain it _inside_ each section: a full-width `Box` provides the background color and spans edge to edge, and a `Container`/max-width wrapper nested inside it centers just the content. Every section on every page repeats that same two-layer pattern (outer = color + full width, inner = centered content), which is what makes the alternating-band look possible at all.

## Decisions

1. **Font pairing over single sans-serif** — supersedes spec 04's decision 1. Confirmed by seeing it rendered in the design canvas across all four explored directions and picking the pairing option.
2. **Green over navy** — confirmed after seeing both an indigo and a green pass of the same "Confident Minimal" layout; green picked as the final palette.
3. **Section-tinted backgrounds are site-wide, not landing-only** — the mockup only built the landing page, but a restyle that only reskins one page while every other page keeps the old flat institutional background would look unfinished/inconsistent. Applying the same alternating-tint pattern to every page's sections is the only way this doesn't read as half-done.
4. **Section backgrounds go full-bleed (edge-to-edge), not contained within the existing max-width `Container`** — matches the mockup exactly and reads as a real "banded" page rather than a colored panel floating inside whitespace. Costs a real structural change to `PageShell` and every page's top-level markup (see Backend concepts and the per-page breakdown above), not just new `sx` colors — accepted as worth it for the visual payoff.
5. **Taller cards apply to every `Card`-based component site-wide**, not just the ones shown in the landing mockup (`ItemListSection`) — same reasoning as decision 3: `ExperienceCard` and `StudyCard` use the same visual card language and would look inconsistent left at the old padding.

## Verification

- `pnpm dev` — every page (Landing, Studies, Experience, About, Contact) reflects the new palette, typography, section backgrounds, and card sizing, at both a mobile viewport (~390px) and desktop; section backgrounds visibly reach the browser's edges (full-bleed), not just the old `Container`'s width.
- `pnpm storybook` — affected component stories (`ExperienceCard`, `StudyCard`, `FeaturedSectionCard`, `ItemListSection`, `Hero`) render themed with the new tokens.
- Contrast check: header nav text against the new primary-color `AppBar` background, and body text against every new section-tint background, meet WCAG 2.1 AA (4.5:1 normal text / 3:1 large text) — called out explicitly since this touches color choices across the whole site, per spec 00's standing accessibility rule.
- `pnpm test`, `pnpm test:storybook`, `pnpm test:e2e`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass — no existing test should need behavior changes since this is styling-only, but snapshot-sensitive assertions (if any) get updated.

## Implementation notes (deviations from plan)

- **Primary green darkened from the mockup's `#1F8A5F` to `#1B7C55`.** The mockup hex clears only ~4.33:1 against white in both directions (white text on the green header/buttons, and green text/links on white) — just under the 4.5:1 AA floor for normal text, confirmed by Playwright/axe failures on the header nav, language switcher, and the footer's "View source" link. `#1B7C55` is visually near-identical but clears ~5.2:1 both ways. `sectionTint.light`/`.deep` are derived from this value via `alpha()`, per the "alpha-derived" decision, and still closely match the mockup's `#F1FAF4`/`#E6F6EC` swatches.
- **Header nav text uses `primary.contrastText` (white) rather than the mockup's light-green tints (`#D7F0E1`/`#C3E8D3`).** Those tints also failed AA (~4.3:1 max) against the header background at any shade of green tested; white clears the same threshold comfortably (~5.2:1) with no visible loss versus the mockup's intent.
- **Language switcher selected-state contrast**: on the header (`onDark` prop), the selected locale renders as a solid white pill with dark-green text instead of MUI's default translucent overlay, which composited to unreadable dark-on-green. Off the header, the switcher keeps its existing default styling.
- **Avatar shape stayed circular** (MUI `Avatar` default), not the mockup's rounded-square (`border-radius: 12px`) treatment — the written spec's Scope/Decisions never called out an avatar shape change, only the logo-vs-initials fallback behavior, so the existing shape was left alone to avoid an undiscussed visual change.
- **Card padding/radius**, taken directly from the design-canvas mockup's `OptionD.dc.html`/`Mobile.dc.html` artboards rather than re-derived: list-item cards (`ItemListSection`, `ExperienceCard`, `StudyCard`) use `py: 2.75/px: 2.25` (mobile) → `py: 3.75/px: 2.5` (`sm`+) with a 14px card radius; `FeaturedSectionCard` uses `py: 3.25/px: 2.5` → `py: 4.25/px: 3.25` with a 16px radius; buttons/base shape radius is 10px.
