# Athletes Module

# GymFlow

Version: 1.0

Status: Active

Last Updated: July 2026

---

# Purpose

Full CRUD-style management of athletes for a coach: list, create, edit, and deactivate — implemented across every architecture layer and strictly scoped to the signed-in coach.

---

# Layers

```
UI (pages + components)
   → Server Action (auth + Zod validation)
      → Service (business rules + DTO mapping)
         → Repository (coachId-scoped Mongoose access)
            → Athlete model
```

| Layer        | File(s)                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------ |
| Schema (Zod) | `features/athletes/schemas/athlete.schema.ts`                                              |
| Types (DTO)  | `features/athletes/types/athlete.types.ts`                                                 |
| Repository   | `features/athletes/repositories/athlete.repository.ts`                                     |
| Service      | `features/athletes/services/athlete.service.ts` (+ `athlete.errors.ts`)                    |
| Actions      | `features/athletes/actions/athlete.action.ts`                                              |
| Components   | `features/athletes/components/{athlete-form,athletes-table,deactivate-athlete-button}.tsx` |
| Routes       | `app/coach/athletes/{page,new/page,[id]/edit/page}.tsx`                                    |

---

# Tenancy — every athlete belongs to one coach, no cross-coach access

Enforced at multiple layers so it cannot be bypassed:

- **Repository:** every method takes `coachId` and filters by it — `listByCoach`, `findByIdForCoach({ _id, coachId })`, `updateForCoach`, `setStatusForCoach`. A query for another coach's athlete simply returns nothing.
- **Service:** receives `coachId` from the session; `updateAthlete`/`deactivateAthlete` operate through the scoped repository and throw `AthleteNotFoundError` when the athlete is not owned by that coach (so coach A editing coach B's athlete looks like "not found").
- **Action:** resolves `coachId` from the JWT session (`getCurrentUser`); redirects to login if not a coach. The UI never provides `coachId`.
- **DTO:** `AthleteDTO` deliberately omits `coachId`; tenancy stays server-side.

---

# Validation (Zod, mandatory)

`athleteInputSchema` is the single source of truth, used by:

- the client form (React Hook Form + `zodResolver`) for UX, and
- every Server Action via `safeParse` as the authoritative check.

Numeric fields (`height`, `initialWeight`) are validated as positive-number strings and converted in the service; `birthDate` (from a date input) becomes a `Date`. Canonical units are cm/kg.

---

# UI

- **List** — `/coach/athletes` (Server Component) loads via `listAthletes(coachId)` and renders `AthletesTable` (name, email, goal, status badge, Edit link, Deactivate button). Empty state included.
- **Create** — `/coach/athletes/new` renders `AthleteForm` in create mode.
- **Edit** — `/coach/athletes/[id]/edit` loads the athlete (coach-scoped; `notFound()` otherwise) and renders `AthleteForm` prefilled.
- **Deactivate** — `DeactivateAthleteButton` (client) confirms, calls the action, and refreshes. Only shown for active athletes; sets status to `inactive` (no physical delete, per the immutability policy).

Mutations use Server Actions with `revalidatePath("/coach/athletes")`; the form calls `router.refresh()` after success.

---

# Rules Satisfied

- **Each athlete belongs to a coach** — `coachId` required on the model and set from the session on create.
- **No cross-coach access** — enforced in repository, service, and action.
- **Zod validation mandatory** — client and server, one schema.
- **No `any`** — full strict TypeScript; DTOs and typed inputs throughout.
- **Feature-first** — everything lives under `features/athletes/`; the Athlete model is reused from its own feature; cross-feature use (session) goes through published APIs.

---

# Notes

- Athlete email is globally unique (login identity); duplicates return a friendly error.
- Clearing an existing phone via edit is not yet supported (empty phone is simply not written); reactivation of a deactivated athlete is a future addition.

---

# Verification

`tsc --noEmit`, `eslint .`, `prettier --check`, and `next build` all pass. Build outputs `/coach/athletes`, `/coach/athletes/new`, and `/coach/athletes/[id]/edit`.

---

# End of Document
