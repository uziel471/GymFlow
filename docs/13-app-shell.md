# App Shell & Route Protection

# GymFlow

Version: 1.0

Status: Active

Last Updated: July 2026

---

# Purpose

This document describes the base UI shell and role-based route protection. No business data is fetched yet — the shell is navigable using a temporary mock session.

---

# Routing Layout (App Router)

Roles get separate URL spaces, each with its own layout and sidebar:

```
app/
  page.tsx                 # redirects to the user's home or /login
  login/page.tsx           # mock sign-in (Coach / Athlete)
  coach/
    layout.tsx             # requireRole("coach") + Coach shell
    dashboard/page.tsx
    athletes/page.tsx
    programs/page.tsx
    exercises/page.tsx
  athlete/
    layout.tsx             # requireRole("athlete") + Athlete shell
    dashboard/page.tsx     # "Today"
    history/page.tsx
```

Each role area has an independent `layout.tsx`, so the Coach and Athlete shells (sidebars, nav, guards) are fully separated.

---

# Route Protection (two layers)

**1. Middleware (`src/middleware.ts`)** — coarse edge protection. Reads the session cookie and redirects unauthenticated requests on `/coach/*` and `/athlete/*` to `/login`, and redirects role mismatches to the correct home. Matcher scopes it to those paths only.

**2. Layout guard (`requireRole`)** — authoritative, role-aware check inside each area layout. Redirects to `/login` when unauthenticated, to the user's own home on role mismatch, and returns the `SessionUser` for the shell. This runs as a Server Component, so protection cannot be bypassed by client navigation.

Two layers give defense in depth: the middleware blocks early at the edge; the layout guard is the source of truth and also supplies the user object.

---

# Session (temporary mock)

There is no backend yet, so the session is a cookie-based stand-in that will be replaced by Better Auth without changing callers:

- `SESSION_COOKIE` (`gymflow_session`) stores `{ id, name, role }` as JSON, `httpOnly`.
- `getCurrentUser()` (`features/authentication/services/session.ts`) reads and validates it, returning `SessionUser | null`.
- `signInAsCoach` / `signInAsAthlete` / `signOut` (`.../actions/session.action.ts`) are Server Actions that set/clear the cookie and redirect.
- `requireRole(role)` (`.../utils/require-role.ts`) is the guard used by layouts.

When Better Auth lands, only these four files change; layouts, middleware, and the shell stay the same.

---

# UI Shell (shadcn design system, no Radix)

The shell uses shadcn's design tokens (already in `globals.css`), `cn()`, and `class-variance-authority`, with `lucide-react` icons — no `@radix-ui` packages were added, and no network `shadcn add` was needed.

- **`components/ui/button.tsx`** — shadcn-style `Button` (CVA variants: default / outline / ghost / secondary / destructive; sizes). Written without `@radix-ui/react-slot`, so no `asChild`.
- **`shared/components/app-shell.tsx`** — the responsive shell: fixed sidebar on desktop, slide-in with overlay on mobile (plain `useState` toggle). Feature-agnostic: takes `role`, `userName`, and a `footer` slot.
- **`shared/components/sidebar-nav.tsx`** — nav links with active-route highlighting via `usePathname`.
- **`shared/components/app-nav.ts`** — `getNavForRole` returns the Coach or Athlete nav items.
- **`shared/components/placeholder-page.tsx`** — simple titled placeholder used by every area page.
- **`features/authentication/components/sign-out-button.tsx`** — client button posting to the `signOut` action; passed into the shell as the `footer` slot so `shared/` never imports a feature.

## Nav items

- **Coach:** Dashboard, Athletes, Programs, Exercises.
- **Athlete:** Today, History.

---

# Client/Server Boundaries

- Layouts, pages, `getCurrentUser`, and `requireRole` are **server** (they use `next/headers` / `next/navigation`).
- `AppShell`, `SidebarNav`, and `SignOutButton` are **client** (`"use client"`).
- Client components import the `signOut` **action module directly**, never the auth barrel (which re-exports server-only `next/headers` code). This keeps server-only code out of the client bundle.

---

# Verification

`tsc --noEmit`, `eslint .`, `prettier --check`, and `next build` all pass. The build outputs `/`, `/login`, four `/coach/*` routes, two `/athlete/*` routes, and the middleware.

---

# Not Included

No backend, no data fetching, no forms, no real authentication. The mock cookie session exists only to make the shell navigable and to demonstrate role-based protection.

---

# End of Document
