# Exercise Library Module

# GymFlow

Version: 1.0

Status: Active

Last Updated: July 2026

---

# Purpose

A reusable, coach-owned exercise library: create, list (with muscle-group filtering), edit, and archive exercises. Built on the same layered, feature-first pattern as the Athletes module, and it publishes the list programs will reuse.

---

# Layers

```
UI (pages + components)
   → Server Action (auth + Zod validation)
      → Service (business rules + DTO mapping)
         → Repository (coachId-scoped Mongoose access)
            → Exercise model
```

| Layer        | File(s)                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Schema (Zod) | `features/exercises/schemas/exercise.schema.ts`                                                                 |
| Types (DTO)  | `features/exercises/types/exercise.types.ts`                                                                    |
| Repository   | `features/exercises/repositories/exercise.repository.ts`                                                        |
| Service      | `features/exercises/services/exercise.service.ts` (+ `exercise.errors.ts`)                                      |
| Actions      | `features/exercises/actions/exercise.action.ts`                                                                 |
| Components   | `features/exercises/components/{exercise-form,exercises-table,archive-exercise-button,muscle-group-filter}.tsx` |
| Routes       | `app/coach/exercises/{page,new/page,[id]/edit/page}.tsx`                                                        |

---

# CRUD & Tenancy

Same guarantees as Athletes: every repository method is scoped by `coachId` (`listByCoach`, `findByIdForCoach`, `updateForCoach`, `setStatusForCoach`); the service enforces ownership (`ExerciseNotFoundError`); actions resolve `coachId` from the JWT session; the DTO omits `coachId`.

- **Create / Edit** — full form (name, description, equipment, muscle groups, video/image URLs). `muscleGroups` is a multi-select (checkbox group) validated to require at least one.
- **Archive** — sets `status = "archived"` (never a physical delete), so historical workout snapshots that referenced the exercise stay intact. Only active exercises show the Archive button.

---

# Filter by Muscle Group

The list route reads a `?muscleGroup=` search param, validates it against `MUSCLE_GROUPS`, and passes it to `listExercises(coachId, { muscleGroup })`, which adds `{ muscleGroups: <group> }` to the query (Mongoose matches the array). `MuscleGroupFilter` (client) navigates to the filtered URL, so filtering stays server-rendered and shareable.

---

# Reuse in Programs

`listActiveExercises(coachId)` is exported from the exercises feature's public API (`@/features/exercises`). When the programs feature is built, it will call this service to present the coach's active exercises for selection. At program-version creation each pick is snapshotted (`exerciseId` + `exerciseNameSnapshot`), so:

- one exercise can be reused across many programs, and
- archiving or editing an exercise later never alters existing program versions or workout history.

This is the feature-first collaboration boundary: programs consumes a published exercises service, not its internals.

---

# Rules / Constraints

- Zod validation is mandatory and shared between the client form and the Server Actions.
- No `any`; full strict TypeScript with typed DTOs and inputs.
- Feature-first: everything under `features/exercises/`, reusing the existing Exercise model.

---

# Verification

`tsc --noEmit`, `eslint .`, `prettier --check`, and `next build` all pass. Build outputs `/coach/exercises`, `/coach/exercises/new`, and `/coach/exercises/[id]/edit`.

---

# End of Document
