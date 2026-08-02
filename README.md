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

## Project source of truth

This project is built spec-first: every feature is designed in [`/specs`](./specs) and approved before it's implemented. Start with [`specs/00-overview.md`](./specs/00-overview.md) for the full plan, stack decisions, and roadmap.

## Git hooks

Husky enforces quality gates automatically (installed via `pnpm install`, no extra setup needed):

- **pre-commit** — runs `lint-staged`: ESLint `--fix` and Prettier on staged files only. Fast, runs on every commit.
- **pre-push** — runs `typecheck`, `test`, and `build` in full. Slower, but only runs when code is about to leave your machine. A failure here blocks the push.

Bypassing either hook (`git commit --no-verify` / `git push --no-verify`) should be rare — only for genuine emergencies, since it skips the checks that keep `main` in a working state.
