# Dependencies & Configuration

# GymFlow

Version: 1.0

Status: Active

Last Updated: July 2026

---

# Purpose

This document records the application dependencies installed after project initialization and how each one is configured. No business logic was written — only setup.

---

# Installed Dependencies

| Category | Package                  | Version                 | Configured in                                                 |
| -------- | ------------------------ | ----------------------- | ------------------------------------------------------------- |
| UI       | shadcn/ui                | (CLI / generated files) | `components.json`, `src/lib/utils.ts`, `src/app/globals.css`  |
| UI       | lucide-react             | ^1.23.0                 | icon library (via `components.json`)                          |
| Forms    | react-hook-form          | ^7.80.0                 | used per feature                                              |
| Forms    | zod                      | ^4.4.3                  | used per feature                                              |
| Forms    | @hookform/resolvers      | ^5.4.0                  | bridges Zod ↔ RHF                                             |
| State    | @tanstack/react-query    | ^5.101.2                | `src/lib/query-client.ts`, `src/providers/query-provider.tsx` |
| State    | zustand                  | ^5.0.14                 | used per feature                                              |
| Database | mongoose                 | ^9.7.3                  | `src/lib/db.ts`                                               |
| Utils    | clsx                     | ^2.1.1                  | `cn()` in `src/lib/utils.ts`                                  |
| Utils    | tailwind-merge           | ^3.6.0                  | `cn()` in `src/lib/utils.ts`                                  |
| Utils    | class-variance-authority | ^0.7.1                  | component variants                                            |

Version note: `mongoose@9`, `lucide-react@1`, `zod@4`, `@hookform/resolvers@5`, and `tailwind-merge@3` are the current major lines as of installation. Ranges use caret (`^`) so patch/minor updates are allowed.

---

# shadcn/ui

## How it was configured

`shadcn init` could not run in this environment because it requires network access to `ui.shadcn.com`. The canonical files it generates were created manually instead:

- **`components.json`** — style `new-york`, base color `neutral`, `rsc: true`, `tsx: true`, icon library `lucide`, aliases pointing at `@/components`, `@/lib`, `@/components/ui`, `@/hooks`.
- **`src/lib/utils.ts`** — the `cn()` helper.
- **`src/app/globals.css`** — full design-token set (background, foreground, primary, muted, accent, destructive, border, input, ring, chart, sidebar) as CSS variables in `:root` and `.dark`, wired into Tailwind v4 through `@theme inline`.

## Decisions

- **Dark mode is class-based** (`@custom-variant dark (&:is(.dark *))`) rather than `prefers-color-scheme`, so a future theme toggle can force light/dark.
- **`tw-animate-css` was intentionally NOT installed.** shadcn's Tailwind v4 setup normally adds it for component animations, but it is outside the requested dependency list. When a component that needs animations is added later, install `tw-animate-css` and add `@import "tw-animate-css";` to `globals.css`.
- **Component style is `new-york`.** In this environment the CLI default appeared as a newer style (`nova`); if `npx shadcn add <component>` fails on the style, update the `style` field in `components.json`.

## Adding components later

```bash
npx shadcn@latest add button
```

Components land in `src/components/ui`, styled with the tokens above and merged with `cn()`.

---

# clsx + tailwind-merge → `cn()`

`src/lib/utils.ts` exposes:

```ts
cn(...inputs: ClassValue[]): string
```

`clsx` resolves conditional classes; `tailwind-merge` removes conflicting Tailwind utilities (e.g. `px-2 px-4` → `px-4`). Every UI component uses `cn()`. `class-variance-authority` builds typed variant maps on top of the same class strings.

---

# React Query (@tanstack/react-query)

## Files

- **`src/lib/query-client.ts`** — `getQueryClient()` factory.
- **`src/providers/query-provider.tsx`** — client `QueryClientProvider`.
- **`src/providers/index.tsx`** — `AppProviders`, composing all client providers.
- Wired into **`src/app/layout.tsx`**, wrapping `children`.

## Decisions

- **Server/browser client split.** On the server a fresh `QueryClient` is created per request; in the browser a single client is reused. This is the official App Router pattern and prevents state leaking between requests.
- **`staleTime: 60s`** avoids an immediate refetch right after server hydration; **`refetchOnWindowFocus: false`** keeps behavior predictable. Tune per query later.
- **`AppProviders` is the single composition point** — future client providers (theme, etc.) are added there, keeping `layout.tsx` clean and mostly server-rendered.

---

# Zustand

Installed with no global configuration required. Stores will be created per feature (`features/<x>/store` or hooks) for **client-only** state. Per the architecture, server data stays in React Query and is never mirrored into Zustand.

---

# Mongoose

## File

**`src/lib/db.ts`** exposes `connectToDatabase()`.

## Decisions

- **Cached singleton connection.** The connection (and its in-flight promise) is stored on `globalThis` so it survives dev hot-reloads and serverless invocations, preventing connection-pool exhaustion. This is the standard Next.js + Mongoose pattern.
- **`bufferCommands: false`** — queries fail fast instead of silently buffering when there is no connection.
- **Fail-fast env check.** The module throws immediately if `MONGODB_URI` is missing. The guard is written so it also satisfies TypeScript strict mode (`exactOptionalPropertyTypes`), narrowing the env var to a non-optional `string`.
- **Only repositories may import this.** Per the architecture, `connectToDatabase()` is called from the repository layer only — never from UI, actions, or services directly.

## Environment

`.env.example` documents the required variable:

```
MONGODB_URI="mongodb://localhost:27017/gymflow"
```

Copy it to `.env.local` and set a real connection string. `.env.example` is committed (an exception was added to `.gitignore`); real `.env*` files are not.

---

# react-hook-form + zod + @hookform/resolvers

Installed, no global setup needed. The intended per-feature pattern:

- Define a Zod schema in `features/<x>/schemas`.
- Infer the type with `z.infer`.
- Wire the form with `useForm({ resolver: zodResolver(schema) })`.

The same schema validates on the client (UX) and is re-used server-side in Server Actions (source of truth). No forms were built yet.

---

# Verification

With all dependencies installed and configured:

- `tsc --noEmit` passes under full strict mode.
- `eslint .` passes.
- `prettier --check` reports all files formatted.
- `next build` compiles successfully, including the provider tree and the shadcn design tokens.

---

# Not Included

Per instructions, only the listed dependencies were installed. No business logic, models, forms, stores, or UI components were created. Notably deferred: authentication (Better Auth), and `tw-animate-css` (see shadcn section).

---

# End of Document
