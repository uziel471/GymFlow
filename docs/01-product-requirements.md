# Product Requirements Document (PRD)

# GymFlow

Version: 1.0

Status: Draft

Last Updated: July 2026

---

# 1. Product Vision

## Overview

GymFlow is a modern SaaS platform designed for personal trainers to manage athletes, create structured training programs, monitor progress, and centralize all coaching activities in a single application.

The platform focuses on replacing spreadsheets, messaging applications, notebooks and generic workout apps with a purpose-built coaching solution.

Unlike traditional workout trackers, GymFlow is designed around the coach's workflow.

Every feature should help coaches spend less time organizing information and more time coaching their athletes.

The MVP intentionally focuses on solving one problem extremely well:

> Creating training programs and tracking athlete progress.

Future versions will expand into nutrition, body measurements, progress analytics, communication, subscriptions and mobile applications.

---

# 2. Problem Statement

Most personal trainers currently manage athletes using combinations of:

- Excel spreadsheets
- Google Sheets
- WhatsApp
- Notes
- PDF routines
- Images
- Multiple unrelated applications

This creates several problems:

- Information is scattered.
- Workout history is difficult to maintain.
- Previous routines are lost.
- Progress is hard to visualize.
- Coaches spend unnecessary administrative time.
- Athletes cannot easily register their performance.

GymFlow aims to solve these problems by providing a centralized platform specifically designed for coaching.

---

# 3. Product Goals

The primary goals of GymFlow are:

### Goal 1

Provide coaches with a centralized system to manage athletes.

---

### Goal 2

Allow coaches to create reusable and versioned training programs.

---

### Goal 3

Allow athletes to register every completed workout.

---

### Goal 4

Maintain a complete immutable history of every workout.

---

### Goal 5

Generate reliable historical data that can later be used for analytics.

---

### Goal 6

Design an architecture capable of supporting future modules without major refactoring.

---

# 4. Target Users

GymFlow currently targets two user types.

## Coach

A coach is responsible for creating and managing training plans for multiple athletes.

Typical responsibilities:

- Creating athletes
- Planning workouts
- Tracking progress
- Adjusting programs
- Monitoring adherence

A coach owns all information related to their athletes.

No coach should ever have access to another coach's data.

---

## Athlete

An athlete receives a training plan from a coach.

Their responsibilities are intentionally simple.

They only need to:

- View assigned workouts.
- Register completed exercises.
- Record weights.
- Record repetitions.
- Review previous workouts.

Athletes cannot modify training plans.

---

# 5. MVP Scope

The MVP intentionally includes only the minimum features required to validate the product.

The objective is to release quickly while establishing a solid architectural foundation.

Everything else should wait until historical workout tracking works correctly.

---

# 6. Features Included in MVP

## Authentication

Coach

- Register account
- Login
- Logout
- Reset password

Athlete

- Login
- Logout
- Reset password

---

## Coach Dashboard

The coach dashboard should provide a quick overview of the business.

Initial metrics:

- Total athletes
- Active athletes
- Programs assigned
- Workouts completed this week

Recent activity:

- Recently created athletes
- Recently assigned programs

Future analytics are outside the MVP.

---

## Athlete Management

Coaches can create unlimited athletes.

Each athlete contains:

Personal Information

- First Name
- Last Name
- Email
- Phone (optional)
- Birth Date
- Gender

Fitness Information

- Height
- Initial Weight
- Goal

Administrative Information

- Status
- Registration Date
- Coach

Future versions will include:

- Emergency contact
- Medical conditions
- Injuries
- Allergies

---

## Exercise Library

The application will include a reusable exercise library.

Each exercise contains:

Basic Information

- Name
- Description

Classification

- Muscle Group
- Equipment

Media

- Video URL
- Image URL (optional)

Difficulty (future)

Instructions (future)

---

## Muscle Groups

Initial categories:

- Chest
- Back
- Shoulders
- Biceps
- Triceps
- Quadriceps
- Hamstrings
- Glutes
- Calves
- Core
- Cardio

Future versions may support multiple muscle groups per exercise.

---

## Training Programs

Training should not be modeled as simple routines.

Instead, the system uses Programs.

A Program represents a complete training plan.

Examples:

- Push Pull Legs
- Upper Lower
- Strength Block
- Hypertrophy Program
- Powerlifting Prep

Programs are reusable.

Programs are versioned.

Programs are immutable.

These concepts are fundamental to the entire platform.

---

## Program Versions

Programs themselves are never edited.

Whenever a coach changes:

- exercises
- sets
- repetitions
- order
- notes
- rest time

a new Program Version is automatically created.

Example

Program

Hypertrophy July

↓

Version 1

Week 1

↓

Version 2

Week 2

↓

Version 3

Week 3

Each athlete is assigned to a specific Program Version.

Historical versions are never modified.

This guarantees historical consistency.

---

## Training Weeks

Each Program Version contains one or more weeks.

Example

Program

↓

Week 1

↓

Monday

Tuesday

Wednesday

Thursday

Friday

Weeks may differ from one another.

This allows progressive overload planning.

---

## Workout Days

Each week contains workout days.

Example

Monday

Chest

Tuesday

Back

Wednesday

Legs

Thursday

Rest

Friday

Push

Each workout day contains ordered exercises.

---

## Workout Exercises

Each workout exercise contains:

- Exercise
- Order
- Target Sets
- Target Repetitions
- Suggested Weight (optional)
- Rest Time
- Coach Notes

Exercises are displayed exactly in the configured order.

---

## Assigned Programs

Coaches assign Program Versions to athletes.

Assignments contain:

- Athlete
- Program Version
- Start Date
- End Date (optional)
- Status

Programs should never be shared by reference alone.

Assignments always point to a specific version.

---

## Workout Tracking

Athletes complete workouts by recording performance.

For every exercise they should record:

For each set

- Weight Used
- Repetitions Completed

Additionally

- Exercise Completed
- Personal Notes (future)

Every completed workout generates a permanent historical record.

No historical workout should ever be modified.

---

## Workout History

Every workout performed must remain available forever.

History allows:

- Progress tracking
- Future analytics
- Personal records
- Volume calculations
- Coach review

Historical data must never change.

Ever.

---

# 7. User Stories

## Coach

As a coach, I want to create athletes so that I can manage all my clients in one place.

As a coach, I want to organize my athletes into structured training programs.

As a coach, I want to duplicate existing programs so I don't need to recreate them.

As a coach, I want to update a program without affecting athletes who already completed previous weeks.

As a coach, I want to review every completed workout of an athlete.

As a coach, I want to compare previous workouts to adjust future training.

As a coach, I want to know which athletes are actively training.

---

## Athlete

As an athlete, I want to see today's workout.

As an athlete, I want to record the weight used in every exercise.

As an athlete, I want to record how many repetitions I completed.

As an athlete, I want to review my previous workouts.

As an athlete, I want to progressively increase my performance over time.

---

# 8. Functional Requirements

## Authentication

The platform shall allow coaches to register.

The platform shall allow athletes to login.

The platform shall authenticate users securely.

The platform shall support password recovery.

---

## Athlete Management

The platform shall allow coaches to:

- Create athletes.
- Update athlete information.
- Disable athletes.
- Search athletes.
- Filter athletes.

Athletes cannot create or edit themselves.

---

## Exercise Management

The platform shall allow coaches to create custom exercises.

Exercises shall include:

- Name
- Description
- Muscle Group
- Equipment
- Video URL
- Optional image

Exercises may be reused across multiple programs.

Deleting an exercise should never remove historical workout data.

---

## Program Management

The platform shall allow coaches to:

Create Programs.

Create Program Versions.

Duplicate Programs.

Archive Programs.

Assign Programs.

Programs must support multiple weeks.

Each week must support multiple workout days.

Each workout day must support multiple exercises.

---

## Workout Tracking

Athletes shall record:

Weight used.

Completed repetitions.

Completed sets.

Workout completion.

The platform shall save all workout information permanently.

---

## History

The platform shall provide complete historical records.

Historical records shall never be edited.

Historical records shall never be deleted.

---

# 9. Non Functional Requirements

## Performance

The application should feel responsive.

Dashboard pages should load quickly.

Pagination should be implemented where appropriate.

Large datasets should not be loaded entirely.

---

## Scalability

The architecture must support:

Thousands of coaches.

Hundreds of thousands of athletes.

Millions of workout records.

Without redesigning the domain.

---

## Security

Passwords must always be hashed.

Authorization must prevent access to another coach's data.

Athletes must only access their own information.

Input validation is mandatory.

---

## Reliability

Historical data must never become inconsistent.

Program assignments must remain valid even if newer versions exist.

Deleting entities should never corrupt workout history.

---

## Maintainability

Every module should have a single responsibility.

Features should remain isolated.

Business logic should remain independent from UI.

Validation should be centralized.

---

# 10. Business Rules

The following business rules are mandatory.

These rules should never be violated.

---

## Rule 1

Every athlete belongs to exactly one coach.

---

## Rule 2

Every coach owns only their own data.

---

## Rule 3

Programs are immutable.

Programs cannot be edited after being assigned.

---

## Rule 4

Any modification creates a new Program Version.

No exceptions.

---

## Rule 5

Workout history is immutable.

Completed workouts can never be modified.

---

## Rule 6

Deleting a program shall never delete workout history.

---

## Rule 7

Deleting an exercise shall never affect previous workouts.

Workout history stores snapshots.

---

## Rule 8

Workout logs represent reality.

Programs represent planning.

Planning and execution are different concepts.

---

## Rule 9

Athletes cannot edit planned workouts.

Only coaches define training.

---

## Rule 10

Every completed workout becomes permanent historical data.

---

# 11. Program Versioning

Program versioning is one of the most important concepts in GymFlow.

Programs should be treated as templates.

Program Versions represent immutable snapshots.

Example

Program

Hypertrophy

↓

Version 1

Week 1

↓

Assigned to Athlete A

↓

Coach modifies Week 2

↓

Version 2

↓

Assigned to Athlete B

Athlete A continues using Version 1.

Athlete B receives Version 2.

Neither athlete affects the other's history.

---

# 12. Historical Data

Historical data must always be stored as snapshots.

Example

Workout Log

Exercise Name

Bench Press

Sets

4

Target Reps

10

Completed Reps

10

Weight

80 kg

Coach Notes

Slow eccentric.

Even if the coach later changes the program to:

Bench Press

5 sets

6 reps

the historical workout remains unchanged.

---

# 13. Permissions

## Coach

Can create athletes.

Can create programs.

Can assign programs.

Can review history.

Can manage exercises.

Cannot access another coach's data.

---

## Athlete

Can login.

Can view assigned workouts.

Can register workout results.

Can review personal history.

Cannot edit programs.

Cannot create athletes.

Cannot access another athlete's information.

---

# 14. Constraints

The MVP intentionally excludes:

Nutrition.

Progress photos.

Messaging.

Push notifications.

Subscriptions.

Payments.

Mobile applications.

AI recommendations.

Calendar.

Social features.

These features belong to future versions.

The first release must focus entirely on providing a robust workout management experience.

---

# 15. Success Metrics

The MVP will be considered successful if:

A coach can register.

A coach can create athletes.

A coach can create a complete training program.

A coach can assign that program.

An athlete can complete workouts.

Historical workouts remain immutable.

Programs support versioning correctly.

The application architecture allows future expansion without breaking existing functionality.

---

# 16. Product Roadmap

The development of GymFlow will follow an incremental approach.

Each phase should provide value while maintaining backward compatibility.

---

## Phase 1 — MVP

Focus:

Workout management.

Features:

- Authentication
- Coach dashboard
- Athlete management
- Exercise library
- Training programs
- Program versioning
- Program assignments
- Workout tracking
- Workout history

Goal:

Allow a coach to completely replace spreadsheets for workout planning.

---

## Phase 2 — Progress Analytics

Introduce analytics generated from workout history.

Features:

- Personal records
- Total training volume
- Weekly volume
- Monthly volume
- Exercise progression
- Workout consistency
- Streak tracking
- Dashboard charts

Goal:

Help coaches make better training decisions.

---

## Phase 3 — Body Measurements

Allow coaches to register body measurements.

Measurements:

- Body weight
- Body fat percentage
- Chest
- Waist
- Arms
- Legs
- Hips
- Neck

Future charts:

- Weight evolution
- Body fat evolution
- Measurement comparison

---

## Phase 4 — Progress Photos

Allow athletes to upload progress photos.

Categories:

- Front
- Side
- Back

Features:

- Timeline
- Before / After comparison

---

## Phase 5 — Nutrition

Introduce nutrition planning.

Features:

- Meal plans
- Foods
- Daily calories
- Macronutrients
- Water intake
- Supplements

Athletes will be able to mark meals as completed.

---

## Phase 6 — Assessments

Performance evaluations.

Examples:

- 1RM calculations
- Mobility tests
- Strength tests
- Endurance tests
- VO2 estimation

---

## Phase 7 — Communication

Coach ↔ Athlete communication.

Features:

- Internal messaging
- Workout feedback
- Notes
- Notifications

---

## Phase 8 — Calendar

Centralized planning.

Calendar should display:

- Planned workouts
- Completed workouts
- Measurements
- Assessments
- Nutrition events

---

## Phase 9 — Subscriptions

GymFlow becomes a SaaS.

Plans:

Free

Professional

Enterprise

Possible limitations:

- Athlete count
- Analytics
- Nutrition
- Storage
- Team members

---

## Phase 10 — Mobile Application

Native mobile applications.

Platforms:

- iOS
- Android

The backend should already support mobile clients.

---

# 17. Future Features

The following ideas are intentionally postponed.

These should not influence MVP development.

- Smart recommendations
- AI-generated programs
- Wearable integration
- Apple Health
- Google Fit
- Garmin
- Strava
- Smartwatches
- QR exercise scanner
- Public athlete profiles
- Coach marketplace
- Online payments
- Appointment scheduling
- Team management
- Gym management
- Multiple coaches per organization
- Video calls
- Live coaching

---

# 18. Risks

## Scope Creep

The biggest project risk is adding too many features before the MVP is complete.

Mitigation:

Only implement features explicitly included in the MVP.

---

## Historical Data Corruption

Improper updates could invalidate workout history.

Mitigation:

Use immutable snapshots.

Never update historical records.

---

## Poor Architecture

A tightly coupled architecture will make future modules difficult to implement.

Mitigation:

Adopt a feature-based architecture with clear separation of concerns.

---

## Performance

Workout history will continuously grow.

Mitigation:

Design indexes carefully.

Paginate large datasets.

Optimize database queries.

---

# 19. Assumptions

The following assumptions guide development.

- Every athlete has exactly one coach.
- Programs are created by coaches.
- Athletes never modify training plans.
- Workout history always exists after a workout is completed.
- Historical data is more important than convenience.
- The MVP prioritizes correctness over feature quantity.

---

# 20. Acceptance Criteria

The MVP is complete when the following scenarios work correctly.

---

## Coach Registration

A new coach can create an account.

The coach can log in.

The coach receives an empty dashboard.

---

## Athlete Management

A coach can:

Create athletes.

Update athlete information.

Disable athletes.

Search athletes.

---

## Exercise Library

A coach can:

Create exercises.

Edit exercises.

Reuse exercises.

Exercises appear in multiple programs.

---

## Program Creation

A coach can:

Create a Program.

Create Weeks.

Create Workout Days.

Add Exercises.

Define Sets.

Define Repetitions.

Define Rest Time.

Save Program.

---

## Program Assignment

A coach can assign a Program Version to an athlete.

The athlete immediately sees the assigned training.

---

## Workout Tracking

An athlete can:

Open today's workout.

Record every set.

Record weight.

Record repetitions.

Complete the workout.

Save results.

---

## Workout History

Completed workouts remain permanently available.

Historical records never change.

Historical data survives future Program modifications.

---

# 21. Success Criteria

The MVP will be considered successful if:

- Coaches stop relying on spreadsheets.
- Athletes consistently record workouts.
- Historical data remains accurate.
- Programs can evolve through versioning.
- The architecture supports future expansion.

---

# 22. Product Principles

Every future feature must respect the following principles.

## Coach First

Every decision should improve the coach's workflow.

---

## Simplicity

The simplest solution should always be preferred.

Avoid unnecessary complexity.

---

## Scalability

Design for long-term growth.

Avoid solutions that only work for the MVP.

---

## Consistency

Every module should follow the same architecture.

Naming conventions should remain consistent.

User experience should remain consistent.

---

## Strong Typing

Every piece of data should be strongly typed.

Validation must happen before persistence.

---

## Immutable History

Historical information represents facts.

Facts should never change.

---

## Reusability

Programs should be reusable.

Exercises should be reusable.

Components should be reusable.

Business logic should be reusable.

---

## Separation of Concerns

UI should not contain business logic.

Validation should be centralized.

Database access should be isolated.

---

# 23. Glossary

## Coach

The administrator responsible for managing athletes.

---

## Athlete

The person following a training program.

---

## Program

A reusable training plan.

---

## Program Version

An immutable version of a Program.

---

## Week

A collection of workout days within a Program Version.

---

## Workout Day

A scheduled training session.

---

## Workout Exercise

A planned exercise inside a Workout Day.

---

## Workout Session

A workout performed by an athlete.

---

## Exercise Log

The actual performance recorded for one exercise during a Workout Session.

---

## Snapshot

An immutable historical copy of planned and executed workout data.

---

# End of Document
