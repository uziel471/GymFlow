# Project Setup

# GymFlow

Version: 1.0

Status: Active

Last Updated: July 2026

---

# Purpose

This document records how the GymFlow project was initialized and every configuration decision made during setup. It is the reference for reproducing the environment and understanding the tooling.

No application libraries (React Query, Zod, Mongoose, Better Auth, etc.) were installed yet — only the framework and the required developer tooling.

---

# Stack Installed

| Tool              | Version                    | Notes                      |
| ----------------- | -------------------------- | -------------------------- |
| Next.js           | ^15.5.0 (resolved 15.5.20) | App Router                 |
| React / React DOM | ^19.0.0 (resolved 19.2.7)  | React 19                   |
| TypeScript        | ^5                         | strict mode enabled        |
| Tailwind CSS      | ^4                         | via `@tailwindcss/postcss` |
| ESLint            | ^9                         | flat config                |
| Prettier          | ^3.9.4                     | + Tailwind plugin          |
| Husky             | ^9.1.7                     | git hooks                  |
| lint-staged       | ^17.0.8                    | staged-file linting        |

---

# How It Was Created

The project was scaffolded with `create-next-app` using:

App Router, `src/` directory, TypeScript, Tailwind v4, ESLint, and the `@/*` import alias.

## Important correction: Next 16 → 15

`create-next-app@latest` currently installs **Next.js 16**. Because the project targets **Next.js 15**, the versions were pinned down in `package.json`:

- `next`: `^15.5.0`
- `eslint-config-next`: `^15.5.0`
- `react` / `react-dom`: `^19.0.0`

## ESLint config adjusted for Next 15

The scaffold generated a Next 16-style `eslint.config.mjs` (`import ... from "eslint-config-next/core-web-vitals"`), which is incompatible with `eslint-config-next@15`. It was rewritten to the Next 15 flat-config style using `FlatCompat` and extending `next/core-web-vitals` + `next/typescript`, then extended with `eslint-config-prettier`.

---

# Configuration Files

## `tsconfig.json` — Strict TypeScript

Beyond `strict: true`, the following flags were enabled to match the architecture standards (`03-software-architecture.md`):

```
strict
noImplicitAny
strictNullChecks
exactOptionalPropertyTypes
noUncheckedIndexedAccess
forceConsistentCasingInFileNames
```

Path alias configured:

```
"paths": { "@/*": ["./src/*"] }
```

## `eslint.config.mjs`

Flat config extending `next/core-web-vitals` and `next/typescript`, with `eslint-config-prettier` last to disable stylistic rules that conflict with Prettier. Ignores `.next/`, `out/`, `build/`, `next-env.d.ts`.

## `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

The Tailwind plugin auto-sorts class names.

## `.prettierignore`

Ignores `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`, `package-lock.json`, `public`.

## `.husky/pre-commit`

Runs `npx lint-staged` before every commit. Husky is activated by the `prepare` script (`husky`), which runs automatically after `npm install`.

## `lint-staged` (in `package.json`)

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,mjs}": ["prettier --write"]
}
```

---

# NPM Scripts

| Script         | Command              | Purpose                |
| -------------- | -------------------- | ---------------------- |
| `dev`          | `next dev`           | Start dev server       |
| `build`        | `next build`         | Production build       |
| `start`        | `next start`         | Serve production build |
| `lint`         | `eslint`             | Lint                   |
| `lint:fix`     | `eslint --fix .`     | Lint and auto-fix      |
| `type-check`   | `tsc --noEmit`       | Type check             |
| `format`       | `prettier --write .` | Format all files       |
| `format:check` | `prettier --check .` | Verify formatting      |
| `prepare`      | `husky`              | Install git hooks      |

---

# Getting Started

```bash
npm install     # installs dependencies and activates Husky hooks
npm run dev      # http://localhost:3000
```

Other commands: `npm run build`, `npm run type-check`, `npm run lint`, `npm run format`.

---

# Verification

The toolchain was validated end to end:

- `tsc --noEmit` passes with all strict flags enabled.
- `eslint .` passes with no errors.
- `prettier --check .` reports all files formatted.
- `next build` compiles and generates static pages successfully.
- Husky sets `core.hooksPath`; the pre-commit hook runs `lint-staged`.

---

# Notes

- **`node_modules` is not committed** (git-ignored) and must be generated with `npm install`. The `package-lock.json` is committed for reproducible installs.
- During setup, an interrupted install left a stale dependency folder that the sandbox filesystem could not remove; it was moved aside as `.node_modules_broken` (git-ignored). It is safe to delete manually: `rm -rf .node_modules_broken`.
- Fonts use `next/font/google` (Geist). The production build fetches them at build time and requires network access.
- No application dependencies were added yet — that begins with the first feature implementation, following `03-software-architecture.md`.

---

# End of Document
