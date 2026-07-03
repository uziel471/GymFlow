# Data Model

# GymFlow

Version: 1.1

Status: Draft

---

# Purpose

This document defines how the GymFlow domain is persisted in MongoDB using Mongoose.

The objective is to design a scalable persistence model while preserving the business rules defined in the Domain Model.

---

# Database

Engine

MongoDB

ODM

Mongoose

---

# Design Principles

The persistence layer follows these principles.

- Favor document embedding when data is written together, read together, and immutable.
- Use references between aggregates and for anything queried on its own.
- Avoid deep population chains.
- Preserve immutable history.
- Optimize for read performance.
- Never duplicate mutable data.
- Denormalized data is only allowed when it never changes.
- Store snapshots for historical records.

---

# Key Modeling Decisions

Two decisions shape the entire persistence layer and must be respected everywhere.

## Decision 1 — Embed vs. reference

The rule of thumb:

> Embed what is written together, read together, and immutable.
> Reference what is queried on its own.

Consequences:

- A `Program Version` is its own collection (referenced from `programs`), because assignments and workout sessions must resolve one specific version with a single indexed read.
- Weeks, days and exercises are **embedded inside** each program version, because they are created together, read together, immutable, and bounded in size.
- Exercise logs are **embedded inside** each workout session, for the same reasons.

## Decision 2 — Denormalized `coachId`

Every document carries its own `coachId`, down to the leaves (`programVersions`, `programAssignments`, `workoutSessions`).

Authorization ("no coach may access another coach's data") then becomes a single indexed field comparison instead of a six-level traversal.

This denormalization is safe because `coachId` never changes: an athlete belongs to exactly one coach and there is no athlete-transfer feature. An immutable denormalized field has no update anomaly.

---

# Collections

The application consists of the following collections.

coaches

athletes

exercises

programs

programVersions

programAssignments

workoutSessions

bodyMeasurements (future)

mealPlans (future)

subscriptions (future)

notifications (future)

---

# Coaches Collection

Stores platform users acting as coaches.

Fields

_id

firstName

lastName

email

password

subscription

status

createdAt

updatedAt

Indexes

email (unique)

---

# Athletes Collection

Stores athletes.

Each athlete belongs to one coach.

Fields

_id

coachId

firstName

lastName

email

phone

gender

birthDate

height

initialWeight

goal

status

createdAt

updatedAt

Indexes

coachId

email

status

{ coachId, status } (compound, for scoped listings)

Rules

Every athlete belongs to exactly one coach.

coachId is immutable.

Athletes are never physically deleted. Use status.

---

# Exercises Collection

Reusable exercises owned by a coach.

Fields

_id

coachId

name

description

equipment

muscleGroups

videoUrl

imageUrl

status

createdAt

updatedAt

Indexes

coachId

name

{ coachId, status } (compound)

Rules

Exercises may be archived, never physically deleted.

Historical workouts must never depend on the current exercise definition.

Workout history stores snapshots (see Workout Sessions).

---

# Programs Collection

A program is the reusable **template** metadata only.

It never stores training content directly. Content lives in program versions.

Fields

_id

coachId

name

description

status

currentVersionId

versionCount

createdAt

updatedAt

Indexes

coachId

{ coachId, status } (compound)

Rules

Programs are mutable only in metadata (name, description, status, currentVersionId).

Training content is never stored here.

Deleting a program never deletes its versions or any workout history.

---

# Program Versions Collection

One of the most important collections.

Every modification to a program's training content creates a **new document** here.

Documents in this collection are immutable once created.

Weeks, days and exercises are embedded, because they are immutable and bounded.

Structure

```
programVersions
  _id
  programId          (ref → programs)
  coachId            (denormalized)
  versionNumber
  weeks: [
    {
      weekNumber,
      days: [
        {
          name,                    // "Monday", "Push", ...
          type,                    // "training" | "rest"
          exercises: [
            {
              order,
              exerciseId,          (ref → exercises)
              exerciseNameSnapshot,
              sets,
              targetReps,
              suggestedWeight,
              restTime,
              tempo,
              coachNotes
            }
          ]
        }
      ]
    }
  ]
  createdAt
```

Indexes

programId

{ programId, versionNumber } (compound, unique)

coachId

Rules

A program version is never updated after creation.

Any change to content produces a new document with an incremented versionNumber.

`exerciseNameSnapshot` preserves faithful history; `exerciseId` enables future analytics. Store both.

A "rest" day has type = "rest" and an empty exercises array.

---

# Program Assignments Collection

Assigns one program version to one athlete.

Assignments always point to a version, never to a program directly.

Fields

_id

coachId (denormalized)

athleteId (ref → athletes)

programId (ref → programs, for convenience)

programVersionId (ref → programVersions)

startDate

endDate

status // "active" | "completed" | "cancelled"

createdAt

updatedAt

Indexes

athleteId

coachId

programVersionId

{ athleteId, status } (partial unique index where status = "active")

Rules

Assignments always reference a specific programVersionId.

Only one active assignment per athlete, enforced by a partial unique index and validated in the service layer within a transaction.

Historical assignments are never deleted.

---

# Workout Sessions Collection

Represents a workout performed by an athlete.

Exercise logs are embedded, because they are written together, read together, immutable, and bounded.

Structure

```
workoutSessions
  _id
  coachId            (denormalized)
  athleteId          (ref → athletes)
  assignmentId       (ref → programAssignments)
  programVersionId   (ref → programVersions)
  weekNumber
  dayName
  status             // "in_progress" | "completed"
  startedAt
  completedAt
  duration
  exerciseLogs: [
    {
      exerciseId,            (ref → exercises)
      exerciseNameSnapshot,
      order,
      targetReps,
      restTime,
      coachNotes,
      sets: [
        { setNumber, weight, reps, completed }
      ],
      athleteNotes,
      completedAt
    }
  ]
```

Indexes

athleteId

coachId

assignmentId

{ athleteId, completedAt } (compound, for history listings)

exerciseLogs.exerciseId (multikey, for Phase 2 progression analytics)

Rules

A session is mutable only while status = "in_progress".

Once status = "completed", the session and all its exercise logs are immutable forever.

Set-level data (weight, reps per set) lives in the embedded `sets` array.

Exercise logs store snapshots and never reference mutable program data.

---

# Immutability Summary

The following are never updated after creation:

- Program Versions (and their embedded weeks/days/exercises).
- Completed Workout Sessions (and their embedded exercise logs).

The following are never physically deleted; they are archived via status:

- Coaches, Athletes, Exercises, Programs, Assignments.

Deleting or archiving any entity must never corrupt or remove workout history.

---

# Units Convention

To keep historical comparisons valid, all physical quantities are persisted in canonical units:

- Weight: kilograms (kg)
- Height / body measurements: centimeters (cm)

Unit conversion for display happens only in the UI layer.

---

# Future Collections

The schema should accommodate future aggregates without restructuring existing collections.

bodyMeasurements

mealPlans

progressPhotos

subscriptions

notifications

organizations

Each future collection will carry its own `coachId` (and `athleteId` where relevant) to preserve the tenancy and authorization model described above.

---

# End of Document
