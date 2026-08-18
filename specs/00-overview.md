# 00 — Overview

Status: Draft
Depends on: —

## Purpose

Personal website that also works as Bruno's resume and as his AI-agent-engineering portfolio piece. The site itself is the showcased project (his production work is on proprietary employer codebases that can't be shared), so it links to its own public GitHub repo as the "view source" proof point.

It needs to demonstrate two things at once:

- Frontend craft (Next.js, TypeScript, MUI theming, responsive design, full testing pyramid, accessibility).
- AI agent engineering skill (a Claude-powered chatbot that can talk about Bruno and use tools).

## Non-goals (v1)

- No separate "Projects/Portfolio" page — no other public projects exist to list.
- No CMS — content is structured data files in the repo.
- No custom domain yet — ships on the default Vercel subdomain.
- No blog.

## Stack

- **Framework**: Next.js (App Router), React, TypeScript.
- **UI**: Material UI (MUI) with a custom theme — sober/institutional visual identity, inspired by ucema.edu.ar's structure and tone (clear nav hierarchy, hero + featured-section landing layout, serious color palette). Fully responsive.
- **i18n**: Bilingual ES/EN with a language selector.
- **Accessibility**: WCAG 2.1 AA as an explicit, auditable requirement — real semantic HTML (labels, tables, ARIA where needed), not just visual compliance.
- **Testing**: Jest + React Testing Library (unit/component), Storybook (component catalog + interaction tests), MSW (API mocking), Playwright (e2e, including accessibility checks via axe).
- **Content**: Experience, studies, skills, about-me content as structured JSON/TS files in-repo — single source of truth consumed by the pages, the generated PDF, and the chatbot's search tool.
- **CV PDF**: Generated from the same content data (e.g. `@react-pdf/renderer`), so it never drifts from the site.
- **Chatbot / agent**: Claude API (Anthropic), tool-using agent. V1 tools: search CV/experience data, trigger the PDF download, take a contact form submission, navigate/link to a site section.
- **Persistence**: Postgres (Vercel Postgres / Neon) for contact submissions (and optionally chat history).
- **Contact notifications**: On a new contact submission — email via Resend, and WhatsApp via Twilio (reusing the approach from Bruno's separate WhatsApp agent project).
- **Analytics**: Vercel Analytics (traffic + Web Vitals).
- **Hosting**: Vercel, deployed from a public GitHub repo.
- **Git hooks**: pre-commit — lint + format; pre-push — typecheck, unit tests, production build.

## Sections (v1)

Landing, Studies, Work Experience, Skills/Tech Stack, About Me (hobbies, personal-but-safe), Contact.

## Workflow

Spec-driven. This document is the standing reference for the whole project and gets updated as scope evolves. Actual implementation happens through small numbered sub-specs (`specs/01-*.md`, `specs/02-*.md`, ...), each scoped to be reviewable in one sitting, each approved by Bruno before its code is written. Where a feature is too big for one sub-spec, it's split into several rather than written as one large document. Sub-specs include a "Backend concepts" section whenever they touch backend/infra territory that's new to Bruno.

Every sub-spec that introduces UI must call out accessibility/semantics decisions explicitly (heading hierarchy, ARIA labeling for grouped/non-obvious content, keyboard operability, and a contrast check for any non-default-contrast styling) rather than leaving them as an implicit "follow the pattern" assumption — spelled out in Scope/Decisions/Verification, not just inherited silently from an earlier spec. Starting with spec 09.

Bruno handles all git operations (commits, pushes, PRs) himself.

## Sub-spec roadmap

Numbering matches the actual filename under `/specs` — this list is kept in sync with what's really there, not aspirational. Status mirrors each spec's own `Status:` field (`Implemented` / `Draft`); items past 17 have no spec file yet (`Not started`) and are the current best plan for what comes next, not a contract.

| #   | Spec                                                                                                                | Status                            |
| --- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1   | [Project scaffold](./01-project-scaffold.md)                                                                        | ✅ Implemented                    |
| 2   | [Tooling: lint/format/hooks](./02-tooling-lint-hooks.md)                                                            | ✅ Implemented                    |
| 3   | [Tooling: test stack init](./03-tooling-test-stack.md) (Jest+RTL, Playwright, Storybook, MSW)                       | ✅ Implemented                    |
| 4   | [Theme & design tokens](./04-theme-design-tokens.md)                                                                | ✅ Implemented (superseded by 17) |
| 5   | [Base layout](./05-base-layout.md) (header/nav/language selector/footer)                                            | ✅ Implemented                    |
| 6   | [Content data model](./06-content-data-model.md)                                                                    | ✅ Implemented                    |
| 7   | [Landing page](./07-landing-page.md)                                                                                | ✅ Implemented                    |
| 8   | [Studies page](./08-studies-page.md)                                                                                | ✅ Implemented                    |
| 9   | [Work experience page](./09-experience-page.md)                                                                     | ✅ Implemented                    |
| 10  | [Accessibility & semantics audit — pass 1](./10-accessibility-audit-pass-1.md) (interim audit of specs 1–9)         | ✅ Implemented                    |
| 11  | [Skills/tech stack section](./11-skills-page.md)                                                                    | ✅ Implemented                    |
| 12  | [About me page](./12-about-page.md)                                                                                 | ✅ Implemented                    |
| 13  | [Support views](./13-support-views.md) (404 & error pages)                                                          | ✅ Implemented                    |
| 14  | [CV PDF generation](./14-cv-pdf-generation.md)                                                                      | ✅ Implemented                    |
| 15  | [Contact form UI](./15-contact-form-ui.md)                                                                          | ✅ Implemented                    |
| 16  | [Contact backend](./16-contact-backend.md) (Postgres + API route)                                                   | ✅ Implemented                    |
| 17  | [Visual restyle](./17-visual-restyle.md) (new theme, typography, full-bleed section backgrounds, mobile-first pass) | 📝 Draft — up next                |
| 18  | Contact notifications (Resend + Twilio WhatsApp)                                                                    | Not started                       |
| 19  | Agent core (Claude API + chat UI, no tools)                                                                         | Not started                       |
| 20  | Agent tool: CV search                                                                                               | Not started                       |
| 21  | Agent tool: PDF download trigger                                                                                    | Not started                       |
| 22  | Agent tool: contact form submission                                                                                 | Not started                       |
| 23  | Agent tool: site navigation                                                                                         | Not started                       |
| 24  | Accessibility audit pass — pass 2 (full site, final)                                                                | Not started                       |
| 25  | i18n completeness pass                                                                                              | Not started                       |
| 26  | Deployment & analytics                                                                                              | Not started                       |

## Definition of done (v1)

- Every page above exists, in ES and EN, responsive, WCAG 2.1 AA-clean.
- CV PDF downloadable and content-accurate.
- Contact form stores submissions and triggers both email and WhatsApp notifications.
- Chatbot holds a conversation about Bruno and successfully exercises all four tools.
- Site deployed on Vercel from the public GitHub repo, with Analytics wired up.
- Full test suite (Jest/RTL, Storybook, Playwright) green in CI-equivalent local run; git hooks enforce lint/format/typecheck/tests/build.
