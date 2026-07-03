# Software Architecture

# GymFlow

Version: 2.0

Status: Draft

Last Updated: July 2026

---

# Purpose

This document defines the complete software architecture of GymFlow.

It is the authoritative technical reference for how the application is structured, how data flows through it, and which conventions every contributor and AI assistant must follow.

The architecture must prioritize:

- Scalability
- Maintainability
- Readability
- Type safety
- Testability
- Separation of concerns

The project should be able to grow for years, across the ten roadmap phases, without requiring a rewrite.

This document assumes the decisions already made in the Domain Model (`02`) and Data Model (`04`): MongoDB + Mongoose, immutable program versioning, immutable workout history, and per-coach tenancy via a denormalized `coachId`.

---

# 1. General Architecture

GymFlow combines two organizing ideas:

**Feature-First (vertical).** Code is grouped by business capability (athletes, programs, workouts), not by technical type. Everything a feature needs lives together.

**Layered (horizontal).** Inside each feature, code is separated into strict layers with a one-directional dependency flow. UI never talks to the database; the database never knows about React.

The two combine like a grid: features are the columns, layers are the rows. A file's location answers two questions at once: _which capability_ it belongs to and _which responsibility_ it has.

Guiding principles:

- Feature-First organization
- Domain-Driven Design as guidance (not dogma)
- Clean Architecture dependency rule: dependencies point inward, toward business logic
- Server-first: render on the server by default
- Composition over inheritance
- Single Responsibility Principle
- Dependency Inversion: higher layers depend on abstractions, not on persistence details
- Strong typing everywhere

The architecture should stay as simple as the MVP allows while never blocking future growth.

---

# 2. Application Layers

Data and control flow through six layers. Each layer may only call the layer directly below it.

```
UI (Server & Client Components)
        ↓
Hooks (client-side interaction / server-state access)
        ↓
Actions (Server Actions — application use cases)
        ↓
Services (business logic & domain rules)
        ↓
Repositories (persistence access)
        ↓
Database (MongoDB via Mongoose models)
```

## UI

Responsible only for rendering and layout. Receives typed data and callbacks. Contains no business logic, no data fetching beyond calling a hook or a Server Component data-load, no authorization decisions.

## Hooks

Encapsulate reusable client interaction and server-state access (React Query). No JSX, no business rules. Return typed objects.

## Actions (Server Actions)

The application's use-case boundary. Each action: validates input with Zod, resolves and authorizes the current user, calls one or more services, and returns a typed result. Actions never touch the database directly.

## Services

Where business rules live. Enforce domain invariants (immutability, "one active assignment per athlete", versioning). Orchestrate repositories. Framework-agnostic: no React, no request objects, no HTTP. A service can be called from a Server Action today and from a mobile-facing API route in Phase 10 without change.

## Repositories

The only layer that talks to Mongoose. Read, write, update, archive. No business rules — a repository does exactly what it is told. Returns plain typed objects, not Mongoose documents (use `.lean()`), so the persistence tool never leaks upward.

## Database

MongoDB accessed through Mongoose models. Schemas, models, indexes. Defined once, imported only by repositories.

**The dependency rule:** each arrow points down and only down. A repository never imports a service; a service never imports an action; the UI never imports a repository.

---

# 3. Folder Structure

```
src/
  app/                  # Next.js App Router: routes, layouts, pages
  features/             # business modules (the heart of the app)
  components/           # global, app-agnostic UI primitives (if any live outside shared)
  shared/               # cross-feature reusable code
  lib/                  # framework integrations (db connection, auth, query client)
  providers/            # React context providers
  hooks/                # truly global hooks
  constants/            # global constants
  types/                # global/shared types
  utils/                # global pure utilities
  config/               # validated environment & app configuration
```

`app/` stays thin: pages compose features and pass data. Business logic never lives in `app/`.

---

# 4. Feature Separation

Every business module lives under `features/` and owns its full vertical slice.

```
features/
  authentication/
  coaches/
  athletes/
  dashboard/
  exercises/
  programs/
  workouts/
```

## Anatomy of a feature

```
features/athletes/
  components/           # feature-specific UI
  actions/              # Server Actions (use cases)
  services/             # business logic
  repositories/         # Mongoose access for this feature's collections
  schemas/              # Zod schemas + inferred types
  hooks/                # React Query hooks and interaction hooks
  types/                # feature types not derived from Zod
  constants/            # feature constants
  utils/                # feature-pure helpers
  index.ts              # public API (barrel) — the ONLY entry point
```

## Feature communication

Features are black boxes. A feature exposes a **public API** through its `index.ts` barrel; everything else is private.

- **Allowed:** import another feature's public exports, or call another feature's service.
- **Forbidden:** reaching into another feature's internal files (`features/programs/repositories/...` from inside `athletes`).

Good: `AssignmentService` calls `ProgramService.getVersion(id)`.
Bad: a `ProgramForm` component importing `WorkoutTable` internals.

When two features need to collaborate, they collaborate at the **service** layer, not the UI layer. This keeps the mobile backend (Phase 10) viable: services are the reusable core.

## Shared layer

```
shared/
  components/           # reusable UI (Button, Card, Dialog, Table, ...)
  hooks/
  schemas/              # reusable Zod primitives (email, pagination, ...)
  types/
  constants/
  utils/
```

`shared/` holds code reused by three or more features. **No business logic ever lives in `shared/`** — if it encodes a domain rule, it belongs to a feature's service.

---

# 5. Data Flow

There are two canonical flows: reads and writes.

## Read flow (server-rendered)

```
Server Component (page)
   ↓ calls
Service (read use case, applies authorization + tenancy)
   ↓ calls
Repository (.lean() query, scoped by coachId)
   ↓
MongoDB
   ↓ typed data back up
Server Component renders HTML
```

Server Components load data directly through services — no client fetch, no loading spinner for the initial paint.

## Read flow (client-interactive)

For data that changes after interaction (filters, pagination, live lists):

```
Client Component
   ↓ uses
React Query hook (useAthletes)
   ↓ calls
Server Action (read) OR route handler
   ↓ calls
Service → Repository → MongoDB
```

## Write flow (mutations)

```
Client Component (form via React Hook Form)
   ↓ submit
Server Action
   ↓ 1. validate input with Zod
   ↓ 2. resolve session + authorize (coach owns resource)
   ↓ 3. call Service
Service
   ↓ enforce business rules (immutability, invariants)
   ↓ call Repository
Repository
   ↓ persist
MongoDB
   ↓ typed result back up
Server Action returns typed result
   ↓
React Query invalidates affected queries → UI updates
```

**Validation happens at the boundary (the action), never trusting the client. Authorization happens before any service call. Business rules live in the service. Persistence lives in the repository.** Every write obeys this order.

---

# 6. Naming Conventions

| Artifact        | Convention                     | Example                    |
| --------------- | ------------------------------ | -------------------------- |
| Folders         | lowercase, plural for features | `athletes/`                |
| Components      | PascalCase                     | `AthleteCard.tsx`          |
| Hooks           | camelCase, `use` prefix        | `useAthletes.ts`           |
| Server Actions  | kebab + `.action.ts`           | `create-athlete.action.ts` |
| Services        | `.service.ts`                  | `athlete.service.ts`       |
| Repositories    | `.repository.ts`               | `athlete.repository.ts`    |
| Schemas (Zod)   | `.schema.ts`                   | `athlete.schema.ts`        |
| Mongoose models | `.model.ts`                    | `athlete.model.ts`         |
| Types           | `.types.ts`                    | `athlete.types.ts`         |
| Constants       | `.constants.ts`                | `athlete.constants.ts`     |
| Utilities       | `.utils.ts`                    | `date.utils.ts`            |

Booleans read as predicates (`isActive`, `hasHistory`). Async functions read as verbs (`createAthlete`, `assignProgram`). Barrel files are always `index.ts`.

Imports always use path aliases, ordered: React → external libs → shared → feature → relative → styles.

```
@/features/athletes
@/shared/components
@/lib
```

Deep relative imports (`../../../../`) are forbidden.

---

# 7. Typing Strategy

TypeScript strict mode is mandatory. `tsconfig` enables:

```
strict
noImplicitAny
strictNullChecks
exactOptionalPropertyTypes
noUncheckedIndexedAccess
```

Rules:

- **Never `any`.** Prefer `unknown` and narrow.
- Prefer `type` aliases; use `interface` only when extension is genuinely needed.
- Exported functions declare explicit return types.
- Avoid `as` assertions; if unavoidable, isolate and comment why.
- `readonly` for values that must not change.

## Three kinds of types, one source each

1. **Input/DTO types** — inferred from Zod schemas (`z.infer<...>`). Never hand-written when a schema exists.
2. **Domain types** — the shapes services and the UI work with. Plain, framework-free.
3. **Persistence types** — the Mongoose document shapes. Live with the models and never leak past repositories.

Repositories translate persistence types → domain types (via `.lean()` + mapping) so the rest of the app never depends on Mongoose types.

---

# 8. Validation Strategy

Every piece of external input is validated with **Zod**, at the boundary, before any business logic runs.

Validated inputs: Server Action arguments, route handler bodies, search params, and environment variables at startup.

```
Request / form data
   ↓
Zod schema (.parse / .safeParse)
   ↓
Validated, typed data
   ↓
Server Action → Service → Repository
```

Client-side validation (React Hook Form + Zod) exists only for UX. The server **never** trusts it and re-validates with the same schema.

---

# 9. Zod Conventions

- **One schema module per feature** (`athlete.schema.ts`), colocated in `schemas/`.
- Derive types from schemas with `z.infer`; never duplicate the shape as a separate interface.
- Compose from shared primitives (`emailSchema`, `paginationSchema`) instead of repeating rules.
- Separate schemas per use case when they differ: `createAthleteSchema`, `updateAthleteSchema`.
- Use `.safeParse` in actions to return typed validation errors; reserve `.parse` (throwing) for startup config where failure should crash.
- Keep messages centralized and user-friendly; they feed form errors directly.
- Schemas are the single source of truth shared between form (client) and action (server).

```
createAthleteSchema  →  z.infer  →  CreateAthleteInput
```

---

# 10. Error Handling

Errors are classified, never generic, never leaked raw to the user.

Taxonomy:

- **ValidationError** — input failed a schema.
- **AuthenticationError** — no valid session.
- **AuthorizationError** — session exists but lacks permission (e.g. another coach's data).
- **NotFoundError** — resource does not exist (`AthleteNotFoundError(id)`).
- **BusinessError** — a domain rule was violated (e.g. editing an immutable program).
- **UnexpectedError** — everything else.

Rules:

- Services throw **typed, custom error classes** carrying context.
- Actions catch domain errors and translate them into a **typed result** for the UI (`{ ok: false, error: { code, message } }`), never exposing stack traces or internal identifiers.
- Never `throw new Error("something went wrong")`.
- The UI maps error codes to friendly messages and field-level feedback.

```
throw new AthleteNotFoundError(id)   // service
   ↓ caught in action
return { ok: false, error: { code: "ATHLETE_NOT_FOUND" } }
```

---

# 11. Authentication & Authorization

Authentication uses **Better Auth**.

Requirements: secure sessions, password hashing, session refresh, protected routes, role-based authorization.

## Roles

- **Coach** — self-registers, owns all their data.
- **Athlete** — created by a coach; obtains access via invitation/credential; can only log in and act on their own data.

The athlete-identity mechanism (how a coach-created athlete becomes an auth user) is defined here as a first-class concern, not bolted on later.

## Authorization is a layer, not a sprinkle

- **Route protection** (middleware / layout guards) blocks unauthenticated access and gates coach-only vs athlete-only areas.
- **Resource authorization** happens in the **service layer**, on every request: the current `coachId` (or `athleteId`) must match the resource's denormalized owner field. Thanks to the denormalized `coachId` on every collection (Data Model, Decision 2), this is a single indexed comparison, not a traversal.

Rules:

- Passwords are always hashed (handled by Better Auth).
- No coach can read or write another coach's data.
- An athlete can only access their own assignments and history.
- Every Server Action authorizes before calling a service; every service re-checks ownership before persisting.

---

# 12. State Management

State is separated by nature; each kind has exactly one home.

| Kind                  | Tool                         | Example                               |
| --------------------- | ---------------------------- | ------------------------------------- |
| Server state          | TanStack Query (React Query) | athlete list, workout history         |
| Global client state   | Zustand                      | UI theme, active filters, wizard step |
| Form state            | React Hook Form              | create/edit forms                     |
| Local component state | `useState` / `useReducer`    | dialog open, hover                    |

**Server data never goes into Zustand.** Caching, invalidation, and refetching are React Query's job. Zustand holds only ephemeral client-only state.

---

# 13. Server Components vs Client Components

**Server Components are the default.** Every page is a Server Component unless it needs interactivity.

Server Components: dashboards, lists (athletes, programs, history), reports — anything that reads data and renders it.

Client Components (`"use client"`): only where the browser is required — forms, dialogs, dropdowns, drag-and-drop program builder, charts, interactive tables.

Rules:

- Never mark a whole page as client because one child needs interactivity. Push `"use client"` down to the smallest leaf.
- Server Components load data through services directly (no fetch waterfall).
- Client Components receive data as props or via React Query hooks.
- Keep the client bundle small: interactivity is the exception, not the default.

---

# 14. Server Actions Strategy

Server Actions are the primary mutation mechanism and the application's use-case boundary.

Each action follows the same skeleton:

1. **Validate** input with Zod (`safeParse`).
2. **Authenticate** — resolve the session.
3. **Authorize** — confirm the user owns/permits the operation.
4. **Delegate** — call one or more services.
5. **Return** a typed result (`{ ok: true, data }` | `{ ok: false, error }`).

Rules:

- Actions never access Mongoose directly.
- Actions contain no business rules — those live in services.
- Actions are thin: validation + auth + delegation + result shaping.
- After a successful mutation, the client invalidates the relevant React Query keys.
- Read-heavy interactive data may use actions or route handlers; mutations always use actions.

---

# 15. Reusable Component Organization

Two tiers of components:

- **Shared UI primitives** (`shared/components/`): app-agnostic, no business meaning — Button, Input, Textarea, Card, Dialog, Drawer, Table, Badge, Avatar, Select, Pagination, Breadcrumb, Tabs. Built on **shadcn/ui**, styled with Tailwind + CVA for variants.
- **Feature components** (`features/<x>/components/`): carry business meaning — `AthleteCard`, `ProgramBuilder`, `WorkoutLogRow`. May compose shared primitives but never leak into other features.

Rules:

- A component that encodes a domain concept belongs to a feature, not to `shared/`.
- Components stay small (target < 200 lines); split when they grow.
- Props are fully typed; prefer composition over configuration flags.
- No business logic and no data access inside components — they render and emit events.

---

# 16. Mongoose Conventions

Mongoose is the ODM. **Only repositories import models.**

- **One model per collection**, in `<feature>/repositories/models/` or colocated as `<entity>.model.ts`.
- Schemas define **explicit indexes** (matching the Data Model doc) and validation at the schema level as a safety net — Zod remains the primary validator.
- A single **connection singleton** lives in `lib/db` and is reused across requests (critical in serverless: cache the connection to avoid pool exhaustion).
- Repositories return **plain objects** via `.lean()` — never raw Mongoose documents — so persistence types never leak upward.
- Repositories contain **no business rules**; they read, write, update, and archive only.
- **Never physically delete** entities that participate in history; set `status` (archived) instead. Program versions and completed sessions are **immutable** — repositories expose no update path for them.
- Enforce invariants that the DB can back: the "one active assignment per athlete" partial unique index lives on the model; the service still validates within a transaction.
- Use transactions (sessions) for multi-document invariants (e.g. creating a new program version + updating `currentVersionId`).

---

# 17. React Query (TanStack) Conventions

- **Query keys are structured and centralized** per feature: `["athletes", "list", filters]`, `["athletes", "detail", id]`. No ad-hoc string keys scattered in components.
- Wrap all access in **feature hooks** (`useAthletes`, `useAthlete(id)`); components never call `useQuery` directly.
- Hooks return typed objects (`{ data, isLoading, error }`).
- **Mutations invalidate** the affected query keys on success; prefer targeted invalidation over blanket refetch.
- Use React Query only for **server state**. Never mirror it into Zustand.
- Configure sane defaults (stale time, retry) once on the `QueryClient` in `lib/`.
- For server-rendered pages, prefer loading in the Server Component; use React Query for data that changes through client interaction.

---

# 18. Tailwind Conventions

Styling uses **Tailwind CSS v4** with **shadcn/ui**.

- **Utility-first**; no inline `style` attributes.
- Conditional and merged classes go through a **`cn()`** helper (clsx + tailwind-merge).
- Component variants use **CVA** (class-variance-authority), not sprawling ternaries.
- Design tokens (colors, spacing, radius, typography) come from the Tailwind theme / CSS variables — no hard-coded hex values in components (aligns with the future `06-ui-ux-guidelines`).
- Reuse shared UI components instead of re-styling primitives per feature.
- Keep responsive and state variants readable; extract a component when class lists become unmanageable.

---

# 19. Cross-Cutting Concerns

## Configuration

Environment variables are validated with Zod at startup in `config/`. Invalid or missing configuration **prevents the app from booting** — fail fast, never at runtime deep in a request.

## Logging

Structured logging through a centralized logger (never `console.log`). Never log passwords, tokens, or PII. Prepared for future integration with Sentry / OpenTelemetry / Datadog.

## Performance

Server Components by default; minimal client JS; pagination and cursors on every large list (millions of workout logs projected); indexed queries only; lazy-load heavy client widgets (charts, builder); avoid unnecessary re-renders.

---

# 20. Testing Strategy

Business logic must be trivially testable because it lives in framework-free services.

- **Unit tests** — services and pure utilities (highest value; no DB, no React).
- **Integration tests** — repositories against a test database, and action → service → repository paths.
- **E2E tests** — critical user journeys (coach creates program → assigns → athlete logs workout → history persists).

The layered design is what makes this cheap: services can be tested without Next.js, repositories without the UI.

---

# 21. Code Review Checklist

Every pull request must satisfy:

- No `any`; fully typed; explicit return types on exports.
- Zod validation at every boundary.
- Authorization checked in the action and re-checked in the service.
- No business logic in components or actions; it lives in services.
- Repositories access only Mongoose; services never import Mongoose.
- No cross-feature internal imports; only public barrels/services consumed.
- No physical deletes of historical or ownership entities.
- Components small and single-purpose.
- Query keys structured; mutations invalidate correctly.
- Meaningful, classified errors — nothing generic leaked to the user.
- Conventional Commit message; lint, type-check, and tests pass.

---

# End of Document
