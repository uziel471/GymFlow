# Coding Standards

# GymFlow

Version: 1.0

Status: Active

---

# Purpose

This document defines the coding standards for the GymFlow project.

Every contributor and AI coding assistant must follow these standards to ensure consistency, maintainability, readability, and scalability.

These standards are mandatory.

---

# General Principles

The project should prioritize:

- Readability over cleverness.
- Simplicity over complexity.
- Reusability over duplication.
- Composition over inheritance.
- Explicit code over implicit behavior.
- Strong typing over flexibility.

Always write code as if another developer will maintain it years from now.

---

# TypeScript

TypeScript is mandatory.

Compiler configuration must enable:

- strict
- noImplicitAny
- strictNullChecks
- exactOptionalPropertyTypes
- noUncheckedIndexedAccess

Rules

- Never use `any`.
- Prefer `unknown` over `any`.
- Use `readonly` when values should not change.
- Prefer `type` unless an interface extension is required.
- Avoid duplicate type definitions.
- Prefer inferred types whenever possible.
- Always define return types for exported functions.
- Avoid unnecessary type assertions (`as`).

Example

Good

```ts
type CreateAthleteInput = {
  firstName: string;
  lastName: string;
};
```

Bad

```ts
const athlete: any = {};
```

---

# Validation

All external input must be validated.

Validation is always performed using Zod.

Rules

- One schema per feature.
- Reuse schemas.
- Infer types from schemas.
- Never duplicate validation logic.

Example

```ts
export const createAthleteSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export type CreateAthleteInput = z.infer<typeof createAthleteSchema>;
```

---

# Naming Conventions

Folders

Lowercase.

```
athletes
programs
workouts
```

Components

PascalCase.

```
AthleteCard.tsx
WorkoutTable.tsx
```

Hooks

```
useAthletes.ts
useWorkout.ts
```

Schemas

```
athlete.schema.ts
program.schema.ts
```

Repositories

```
athlete.repository.ts
```

Services

```
athlete.service.ts
```

Actions

```
create-athlete.action.ts
```

Types

```
athlete.types.ts
```

Constants

```
athlete.constants.ts
```

Utilities

```
date.utils.ts
```

---

# Imports

Always use path aliases.

Good

```ts
import { AthleteCard } from "@/features/athletes/components";
```

Bad

```ts
import AthleteCard from "../../../../components/AthleteCard";
```

Imports should be ordered:

1. React
2. External libraries
3. Shared modules
4. Feature modules
5. Relative imports
6. Styles

---

# Components

Components should:

- Have one responsibility.
- Be easy to test.
- Remain reusable.
- Receive typed props.
- Avoid unnecessary state.

Recommended size

Less than 200 lines.

Split large components.

---

# React

Prefer Server Components.

Use Client Components only when necessary.

Avoid unnecessary re-renders.

Memoization should only be used when profiling indicates a benefit.

Avoid prop drilling.

---

# Hooks

Hooks should encapsulate reusable logic.

Rules

- One responsibility.
- No JSX.
- No business logic.
- Return typed objects.

Good

```ts
const { athlete, isLoading } = useAthlete(id);
```

Bad

```ts
useEverything();
```

---

# Server Actions

All mutations should use Server Actions.

Responsibilities

- Validate input.
- Authorize user.
- Call service.
- Return typed result.

Server Actions should not access the database directly.

---

# Services

Services contain business logic.

Responsibilities

- Business rules.
- Domain validation.
- Orchestration.

Services must not:

- Render UI.
- Access request objects.
- Depend on React.

---

# Repositories

Repositories are responsible for persistence.

Responsibilities

- Query database.
- Persist entities.
- Update documents.
- Delete documents.

Repositories should not contain business rules.

---

# Database Models

Each collection has:

- Schema
- Model
- Types

Models should remain small.

Indexes must be explicitly defined.

---

# Error Handling

Throw meaningful errors.

Never expose internal errors.

Use custom error classes.

Example

```ts
throw new AthleteNotFoundError(id);
```

Avoid

```ts
throw new Error("Something went wrong");
```

---

# Logging

Avoid `console.log`.

Use a centralized logger.

Log only useful information.

Never log passwords or sensitive data.

---

# Async Code

Always use async/await.

Avoid promise chains.

Good

```ts
const athlete = await repository.findById(id);
```

Bad

```ts
repository.findById(id).then(...);
```

---

# Functions

Functions should:

- Do one thing.
- Be short.
- Have descriptive names.

Prefer early returns.

Good

```ts
if (!athlete) {
  return null;
}
```

Avoid deeply nested conditionals.

---

# Constants

Magic numbers are prohibited.

Good

```ts
const MAX_PROGRAM_WEEKS = 12;
```

Bad

```ts
if (weeks > 12)
```

---

# Comments

Comments should explain **why**, not **what**.

Avoid obvious comments.

Bad

```ts
// Increment i
i++;
```

Good

```ts
// Historical workouts must remain immutable.
```

---

# Styling

Use TailwindCSS.

Do not use inline styles.

Use `cn()` for conditional classes.

Prefer reusable UI components.

---

# Forms

Every form must use:

- React Hook Form
- Zod

Validation messages should be centralized.

---

# File Size

Recommended limits

Component

< 200 lines

Hook

< 150 lines

Service

< 250 lines

Repository

< 250 lines

If a file grows beyond these limits, consider refactoring.

---

# Folder Structure

Every feature should follow:

```
feature/

components/

actions/

hooks/

services/

repositories/

schemas/

types/

constants/

utils/
```

Avoid placing unrelated files together.

---

# Git

Commits should follow Conventional Commits.

Examples

```
feat(programs): add program versioning

fix(workouts): prevent duplicate sessions

refactor(athletes): simplify repository

docs: update architecture
```

---

# Pull Requests

Every PR should:

- Compile successfully.
- Pass lint.
- Pass type checking.
- Pass tests (when applicable).
- Respect architecture.
- Include meaningful description.

---

# Code Review Checklist

Before merging:

- No `any`.
- No duplicated code.
- Fully typed.
- Uses Zod validation.
- Uses Server Actions.
- No business logic in components.
- Repository only accesses database.
- Services contain business logic.
- Proper error handling.
- Follows naming conventions.

---

# AI Coding Assistant Rules

When generating code, the AI must:

- Read the project documentation before implementing features.
- Respect the Feature First architecture.
- Never introduce `any`.
- Reuse existing components whenever possible.
- Reuse schemas and types.
- Avoid duplicate logic.
- Prefer composition over inheritance.
- Keep functions small.
- Explain significant architectural decisions.
- Never modify unrelated files.
- Never change existing behavior without explicit instruction.

---

# End of Document
