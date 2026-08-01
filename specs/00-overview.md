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

Bruno handles all git operations (commits, pushes, PRs) himself.

## Sub-spec roadmap

1. Project scaffold
2. Tooling: lint/format/hooks
3. Tooling: test stack init (Jest+RTL, Playwright, Storybook, MSW)
4. Theme & design tokens
5. Base layout (header/nav/language selector/footer)
6. Content data model
7. Landing page
8. Studies page
9. Work experience page
10. Skills/tech stack page
11. About me page
12. CV PDF generation
13. Contact form UI
14. Contact backend (Postgres + API route)
15. Contact notifications (Resend + Twilio WhatsApp)
16. Agent core (Claude API + chat UI, no tools)
17. Agent tool: CV search
18. Agent tool: PDF download trigger
19. Agent tool: contact form submission
20. Agent tool: site navigation
21. Accessibility audit pass
22. i18n completeness pass
23. Deployment & analytics

Numbering/order may shift as we learn more; this list is the current best plan, not a contract.

## Definition of done (v1)

- Every page above exists, in ES and EN, responsive, WCAG 2.1 AA-clean.
- CV PDF downloadable and content-accurate.
- Contact form stores submissions and triggers both email and WhatsApp notifications.
- Chatbot holds a conversation about Bruno and successfully exercises all four tools.
- Site deployed on Vercel from the public GitHub repo, with Analytics wired up.
- Full test suite (Jest/RTL, Storybook, Playwright) green in CI-equivalent local run; git hooks enforce lint/format/typecheck/tests/build.
