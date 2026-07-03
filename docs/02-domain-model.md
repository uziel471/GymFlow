# Domain Model

# GymFlow

Version: 1.0

Status: Draft

---

# Purpose

This document defines the business domain of GymFlow.

Its purpose is to describe the entities, relationships, business rules and lifecycle of the application independently from any technology.

Nothing in this document should depend on:

- MongoDB
- Mongoose
- React
- Next.js

This document represents the business model.

---

# Domain Overview

GymFlow is centered around one primary concept:

A coach creates training programs.

Athletes are assigned to those programs.

Athletes perform workouts.

Workouts generate immutable historical data.

Historical data is later used to generate analytics.

The domain can be represented as:

Coach

↓

Athlete

↓

Program

↓

Program Version

↓

Training Week

↓

Workout Day

↓

Workout Exercise

↓

Workout Session

↓

Exercise Log

---

# Ubiquitous Language

The following terms must always be used consistently.

Coach

The owner of one or more athletes.

Athlete

A person following a training program.

Program

A reusable training plan.

Program Version

An immutable version of a Program.

Training Week

One week inside a Program Version.

Workout Day

A day containing planned exercises.

Workout Exercise

An exercise planned for a Workout Day.

Workout Session

A workout performed by an athlete.

Exercise Log

The recorded execution of an exercise.

Snapshot

Immutable historical copy of a workout.

---

# Aggregate Overview

The domain is divided into the following aggregates.

Coach

Athlete

Exercise

Program

Workout Session

Each aggregate owns its own consistency rules.

---

# Coach Aggregate

## Responsibility

Represents the owner of the platform.

Every resource belongs to exactly one coach.

The coach owns:

- Athletes
- Programs
- Exercises
- Statistics

---

## Properties

Id

First Name

Last Name

Email

Password

Subscription

Status

Created At

Updated At

---

## Rules

A coach cannot access another coach's data.

Deleting a coach should never delete historical information.

The coach is the root aggregate for ownership.

---

# Athlete Aggregate

## Responsibility

Represents a client.

An athlete always belongs to one coach.

An athlete can have multiple historical program assignments.

Only one active assignment is allowed.

---

## Properties

Id

Coach Id

First Name

Last Name

Email

Phone

Gender

Birth Date

Height

Initial Weight

Goal

Status

Created At

Updated At

---

## Rules

Every athlete belongs to one coach.

Athletes cannot exist without a coach.

Historical assignments are never deleted.

---

# Exercise Aggregate

## Responsibility

Represents a reusable exercise.

Exercises should be reused across multiple programs.

---

## Properties

Id

Coach Id

Name

Description

Equipment

Muscle Groups

Video Url

Image Url

Status

---

## Rules

Exercises may be archived.

Historical workouts must never depend on the current exercise definition.

Workout history stores snapshots.

---

# Program Aggregate

Programs represent reusable templates.

Programs never store execution data.

Programs only represent planning.

---

## Properties

Id

Coach Id

Name

Description

Status

Created At

Updated At

---

## Rules

Programs are reusable.

Programs are immutable through versioning.

Programs cannot be directly modified after being assigned.

---

# Program Version

This is one of the most important entities.

Every modification creates a new version.

Nothing is ever overwritten.

---

## Contains

Weeks

Workout Days

Workout Exercises

Coach Notes

Metadata

---

## Example

Program

Push Pull Legs

↓

Version 1

Week 1

↓

Assigned to Athlete A

↓

Coach changes reps

↓

Version 2

↓

Assigned to Athlete B

Athlete A still references Version 1.

---

# Training Week

Represents one week inside a Program Version.

---

Contains

Workout Days.

---

Rules

Week numbers are sequential.

Weeks belong to one Program Version.

---

# Workout Day

Represents one planned training day.

Examples

Monday

Tuesday

Push

Legs

Upper

Lower

---

Contains

Workout Exercises.

---

Rules

Exercises must preserve order.

Workout Days are immutable once versioned.

---

# Workout Exercise

Represents one planned exercise.

---

Properties

Exercise

Sets

Target Repetitions

Suggested Weight

Rest Time

Tempo

Coach Notes

Order

---

Rules

Order is mandatory.

Exercises cannot be reordered without creating a new Program Version.

---

# Program Assignment

Represents the assignment of one Program Version to one athlete.

---

Properties

Athlete

Program Version

Start Date

End Date

Status

---

Rules

Assignments never point directly to Programs.

Assignments always point to Program Versions.

Only one active assignment per athlete.

Historical assignments remain forever.

---

# Workout Session

Represents a completed workout.

Workout Sessions are historical records.

---

Properties

Athlete

Assignment

Workout Day

Completion Date

Duration

Status

---

Rules

Workout Sessions are immutable.

Sessions cannot be edited after completion.

---

# Exercise Log

Represents the execution of one exercise.

---

Stores

Exercise Name

Sets

Target Reps

Completed Reps

Weight

Rest Time

Coach Notes

Athlete Notes

Completed At

---

Rules

Exercise Logs store snapshots.

Never references mutable Program data.

---

# Value Objects

The following concepts should be modeled as Value Objects whenever possible.

Email

Phone Number

Weight

Height

Repetition Range

Rest Time

Workout Duration

Goal

Equipment

Muscle Group

---

# Domain Events

Although not required in the MVP, the domain should be prepared for events.

Examples

CoachRegistered

AthleteCreated

ProgramCreated

ProgramVersionCreated

ProgramAssigned

WorkoutStarted

WorkoutCompleted

ExerciseCompleted

MeasurementRecorded

---

# Domain Rules

The following rules are immutable.

Programs are templates.

Program Versions are immutable.

Workout Sessions are immutable.

Exercise Logs are immutable.

Historical data is never edited.

Snapshots represent historical truth.

Every athlete belongs to one coach.

Every resource belongs to one coach.

Planning and execution are different concepts.

---

# Relationships

Coach

↓

Athletes

↓

Program Assignments

↓

Program Versions

↓

Training Weeks

↓

Workout Days

↓

Workout Exercises

↓

Workout Sessions

↓

Exercise Logs

---

# Future Aggregates

The architecture should support future aggregates.

Nutrition

Meal Plans

Measurements

Photos

Notifications

Subscriptions

Organizations

Teams

Payments

Messaging

Calendar

Goals

Assessments

Achievements

Reports

---

# Design Principles

The domain should remain independent from frameworks.

The domain should never depend on Mongoose.

The domain should never depend on React.

Business rules should exist only once.

Historical data should never be mutable.

Every entity should have one clear responsibility.

The domain should prioritize correctness over convenience.

---

# End of Document
