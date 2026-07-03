# GymFlow

> A modern platform for personal trainers to manage athletes, training programs, and performance tracking.

---

# Overview

GymFlow is a web application built for personal trainers (coaches) to efficiently manage their athletes, create structured training programs, monitor progress, and provide a better coaching experience.

Unlike generic workout applications, GymFlow focuses on helping coaches organize and evolve training plans while keeping a complete and immutable history of every workout performed.

The project is designed with scalability in mind and will eventually evolve into a complete coaching platform including:

- Training Programs
- Progress Analytics
- Nutrition Plans
- Body Measurements
- Progress Photos
- Messaging
- Subscriptions
- Mobile Application

The first version (MVP) will only focus on training management and workout tracking.

---

# Product Goals

The primary objective of GymFlow is to replace spreadsheets, notebooks and messaging apps with a modern platform where coaches can manage all their athletes from one place.

The platform should:

- Make it easy for coaches to create structured training programs.
- Keep a complete history of every workout.
- Allow athletes to record their performance.
- Help coaches adjust training based on historical data.
- Scale to support thousands of coaches.

---

# MVP Scope

The initial version will include only the essential features.

## Coach

- Register account
- Login
- Manage profile
- Create athletes
- Edit athletes
- Disable athletes
- Create exercises
- Create training programs
- Create weekly plans
- Assign programs
- Review athlete history

## Athlete

- Login
- View assigned training
- Record weight used
- Record repetitions
- Complete workouts
- View workout history

---

# Documentation

Project documentation is organized inside the `docs` directory.

```
docs/

README.md

01-product-requirements.md

02-domain-model.md

03-software-architecture.md

04-database-design.md

05-coding-standards.md

06-ui-ux-guidelines.md

07-roadmap.md

08-claude-rules.md

09-api-conventions.md
```

Each document has a specific responsibility.

---

# Documentation Guide

## 01 - Product Requirements

Contains:

- Product vision
- Functional requirements
- User stories
- MVP scope
- Roadmap
- Business rules

---

## 02 - Domain Model

Defines:

- Entities
- Aggregates
- Relationships
- Business rules
- Versioning strategy
- Immutable history

---

## 03 - Software Architecture

Defines:

- Project architecture
- Folder structure
- Layers
- Services
- Repositories
- Providers
- React architecture

---

## 04 - Database Design

Contains:

- Mongoose models
- MongoDB collections
- Relationships
- Indexes
- Versioning
- Snapshots

---

## 05 - Coding Standards

Defines coding conventions.

Examples:

- TypeScript strict
- No any
- Naming conventions
- File organization
- Component rules

---

## 06 - UI Guidelines

Defines:

- Colors
- Typography
- Components
- Layout
- Responsive behavior
- Design principles

---

## 07 - Roadmap

Project evolution.

MVP

↓

Statistics

↓

Nutrition

↓

Subscriptions

↓

Mobile App

---

## 08 - Claude Rules

Instructions that Claude Code must always follow before generating code.

---

## 09 - API Conventions

Defines:

- API standards
- Error handling
- Validation
- Pagination
- Naming

---

# Technology Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

## Backend

- Next.js Route Handlers
- Server Actions

## Database

- MongoDB

## ODM

- Mongoose

## Validation

- Zod

## Forms

- React Hook Form

## Data Fetching

- TanStack Query

## Global State

- Zustand

## Charts

- Recharts

## Icons

- Lucide React

---

# Core Design Principles

The application should always follow these principles.

## Simple MVP

Build only what is necessary.

Avoid unnecessary complexity.

---

## Feature First

Organize code by features instead of technical layers.

---

## Strong Typing

Everything must be typed.

No `any`.

Prefer inferred types from Zod schemas.

---

## Separation of Responsibilities

Business logic should never live inside React components.

UI should remain as simple as possible.

---

## Immutable History

Historical workout data must never be modified.

Every completed workout becomes a permanent snapshot.

---

## Program Versioning

Training programs are immutable.

Whenever a coach changes:

- exercises
- sets
- reps
- notes
- rest time

A new version of the program must be created.

Historical versions remain available forever.

---

## Scalability

The architecture must support:

- Thousands of coaches
- Hundreds of thousands of athletes
- Millions of workout logs

without major architectural changes.

---

# Project Status

Current phase:

✅ Planning

Next milestone:

- Product Requirements
- Domain Model
- Software Architecture
- Database Design
- Project Initialization

---

# Long-Term Vision

GymFlow aims to become an all-in-one coaching platform.

Future modules include:

- Nutrition
- Progress Analytics
- Body Measurements
- Progress Photos
- Messaging
- Notifications
- Calendar
- Assessments
- Payments
- Subscriptions
- Mobile Applications

---

# Contributing

Before implementing any feature:

1. Read the documentation.
2. Understand the domain.
3. Respect the architecture.
4. Follow coding standards.
5. Never break existing functionality.

---

# License

Private project.

All rights reserved.

---

# Author

Created by Uziel Estrada.

GymFlow © 2026
