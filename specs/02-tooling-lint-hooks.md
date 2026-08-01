# 02 — Tooling: Lint, Format, Git Hooks

Status: Approved
Depends on: [01-project-scaffold](./01-project-scaffold.md)

## Goal

Lock in code style and quality gates before any real feature code gets written: ESLint (already partially set up by `create-next-app`), Prettier, and Husky-driven git hooks (pre-commit lint+format, pre-push typecheck+tests+build). No test framework wiring yet — that's spec 03 — but the pre-push hook already references `pnpm test`/`pnpm build`, which must both succeed (a trivial passing test suite comes from spec 03; until then the hook's test step is a no-op or skipped).

## Scope

- **ESLint**: extend the existing `eslint-config-next` setup (`core-web-vitals` + `typescript`, already in `eslint.config.mjs` from scaffold) with Prettier compatibility (`eslint-config-prettier`, to disable any ESLint rules that conflict with Prettier formatting) — no separate style rules duplicated in ESLint.
- **Prettier**: `.prettierrc` (or `prettier.config.mjs`) with the project's formatting rules (semi, quotes, trailing commas, etc. — reasonable defaults unless Bruno has preferences), plus `.prettierignore` (mirrors `.gitignore` essentials: `node_modules`, `.next`, `pnpm-lock.yaml`).
- **package.json scripts**:
  - `lint` — `next lint` (or `eslint .`)
  - `format` — `prettier --write .`
  - `format:check` — `prettier --check .`
  - `typecheck` — `tsc --noEmit`
- **Husky + lint-staged**:
  - `pre-commit` — runs `lint-staged`, which runs ESLint --fix and Prettier --write only on staged files (fast, incremental).
  - `pre-push` — runs `typecheck`, `test` (once spec 03 lands; treated as a no-op/skip until then, revisited then), and `build` in sequence — the full, slower gate, since it only runs before code leaves the machine.
- Document the hook behavior in the README (what runs when, how to bypass in a real emergency — `--no-verify` — and why that should be rare).

## Out of scope

- Actual test suite (Jest/RTL/Playwright/Storybook/MSW) → spec 03. The pre-push hook's test step will be filled in properly then.
- CI pipeline (GitHub Actions) — not decided yet; hooks are the only gate for now since Bruno runs deploys through Vercel's git integration. Revisit later if wanted.

## Backend concepts

- **Git hooks**: scripts Git runs automatically at certain points (`pre-commit` before a commit is created, `pre-push` before commits leave your machine for a remote). Husky is a thin wrapper that installs these scripts into `.git/hooks` (which isn't versioned) based on files you _do_ version under `.husky/`, so every clone of the repo gets the same hooks automatically after `pnpm install`.
- **lint-staged**: runs linters only against files that are staged for commit, instead of the whole repo — keeps `pre-commit` fast even as the codebase grows, since it only checks what you're about to commit.
- **Why split checks between pre-commit and pre-push**: fast checks (lint/format on changed files) run on every commit so feedback is immediate; slow checks (typecheck across the whole project, tests, a full build) run on push, since pushing is rarer and you're about to share the code — worth the wait there, not on every local commit.

## Decisions

1. Prettier: common defaults — double quotes, semicolons, trailing commas `all`, 2-space indent.
2. `pre-push` blocks the push on any failure (typecheck, test, or build) — no warn-only mode.

## Verification

- `pnpm lint` and `pnpm format:check` run clean on the current codebase.
- Staging a deliberately malformatted file and committing triggers lint-staged to auto-fix it.
- Attempting to push with a deliberately broken type error is blocked by the pre-push hook; fixing it unblocks the push.
- `pnpm build` still succeeds after all tooling is added.
