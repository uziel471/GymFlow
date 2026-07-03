# Project Structure

# GymFlow

Version: 1.0

Status: Active

Last Updated: July 2026

---

# Purpose

This document reflects the actual base structure scaffolded in `src/`. It contains folders, base files, and barrel exports only — no business logic. It implements the Feature-First + layered design defined in `03-software-architecture.md`.

---

# Top-Level Layout

```
src/
  app/            # Next.js App Router: routes, layouts, pages
  features/       # business modules (vertical slices)
  shared/         # cross-feature reusable code (no business logic)
  components/     # global, app-agnostic components
  lib/            # framework integrations (db, query client, cn)
  providers/      # React context providers (AppProviders)
  hooks/          # global hooks
  types/          # global shared types
  constants/      # global constants
  utils/          # global pure utilities
  config/         # validated environment & app configuration
```

`lib/` and `providers/` already contain real setup (`db.ts`, `query-client.ts`, `utils.ts`, `AppProviders`). Every other folder holds a barrel `index.ts` ready to receive exports.

---

# Feature Anatomy

Each feature under `features/` owns its full vertical slice with the same nine layers:

```
features/<feature>/
  components/       # feature UI
  actions/          # Server Actions (use cases)
  hooks/            # React Query / interaction hooks
  services/         # business logic
  repositories/     # Mongoose data access
  schemas/          # Zod schemas + inferred types
  types/            # feature types
  constants/        # feature constants
  utils/            # feature pure helpers
  index.ts          # PUBLIC API — the only entry point for other features
```

Features scaffolded: `authentication`, `athletes`, `coaches`, `dashboard`, `exercises`, `programs`, `workouts`.

## Import rule

Other features and the app import **only** from a feature's root `index.ts`. Reaching into internal folders (e.g. `@/features/programs/repositories`) from another feature is forbidden. Cross-feature collaboration happens at the service layer.

---

# Shared Layer

```
shared/
  components/   # reusable UI primitives
  hooks/
  schemas/      # reusable Zod primitives
  types/
  constants/
  utils/
```

`shared/` is for code reused by multiple features. Business logic never lives here — if it encodes a domain rule, it belongs to a feature service.

---

# Barrel Files

Every folder exposes an `index.ts` barrel. They currently export nothing:

```ts
// <folder> — <responsibility>. No exports yet.
export {};
```

`export {};` keeps each file a valid ES module under `isolatedModules`. As code is added, each barrel re-exports its folder's public members, and the feature root `index.ts` re-exports the feature's public API.

---

# What Was Not Added

- No components, actions, services, repositories, schemas, stores, or models.
- No routes beyond the default `app/` starter.
- No business logic of any kind.

The structure is ready for feature development to begin, one feature at a time, following the architecture and coding-standards documents.

---

# Verification

After scaffolding, `tsc --noEmit`, `eslint .`, and `next build` all pass.

---

# End of Document
