# Authentication

# GymFlow

Version: 1.0

Status: Active

Last Updated: July 2026

---

# Purpose

Real credential authentication integrated with the existing system: login, coach registration, session handling, and role-based routing — built on the Mongoose `Coach` model and the existing layer architecture. It replaces the temporary mock cookie session.

---

# Approach

Credentials + stateless JWT, with **no new dependencies** — hashing and token signing use Node's built-in `node:crypto`.

- **Password hashing** — `scrypt` with a random per-password salt, stored as `scrypt$salt$hash`; verified in constant time (`timingSafeEqual`). File: `src/lib/password.ts`.
- **Session token** — a hand-rolled HS256 JWT (HMAC-SHA256) signed with `AUTH_SECRET`, carrying `{ sub, role, name }` plus `iat`/`exp`. File: `src/lib/jwt.ts`.
- The JWT is stored in an `httpOnly`, `sameSite=lax` cookie (`gymflow_session`), 7-day lifetime.

`AUTH_SECRET` is a required environment variable (see `.env.example`); `jwt.ts` fails fast if it is missing.

---

# Data Ownership (respecting the architecture)

Coach persistence stays in the `coaches` feature; the `authentication` feature orchestrates.

- **`features/coaches/repositories/coach.repository.ts`** — `coachRepository` (`existsByEmail`, `findByEmailWithPassword`, `create`). The only code that touches the `Coach` model; returns plain objects. Exposed via the coaches public API.
- **`features/authentication/services/auth.service.ts`** — `registerCoach`, `verifyCoachCredentials`. Uses `coachRepository` + `lib/password`. Throws `EmailAlreadyInUseError` on duplicates.
- **`features/authentication/services/session.ts`** — `getCurrentUser`, `createSession`, `destroySession` (JWT ↔ cookie).
- **`features/authentication/actions/auth.action.ts`** — `loginAction`, `registerCoachAction`, `logoutAction` (Server Actions). Validate with Zod, call the service, set/clear the session, and `redirect` by role.

This keeps the flow UI → Action → Service → Repository → Model, with features collaborating through published APIs.

---

# Flows

**Register (coach):** `RegisterForm` (RHF + Zod) → `registerCoachAction` → validate → `registerCoach` (hash + create) → `createSession` → redirect to `/coach/dashboard`. Duplicate email returns a friendly error.

**Login:** `LoginForm` → `loginAction` → validate → `verifyCoachCredentials` → `createSession` → redirect by role. Invalid credentials return a generic error.

**Logout:** `SignOutButton` → `logoutAction` → clear cookie → redirect to `/login`.

Validation schemas (`schemas/auth.schema.ts`) are shared: the client form validates for UX and the Server Action re-validates as the source of truth.

---

# Role-Based Routing

Two layers, unchanged in shape from the shell:

- **Middleware (`src/middleware.ts`)** — coarse: redirects to `/login` when the session cookie is absent on `/coach/*` or `/athlete/*`. It only checks presence, because the edge runtime lacks `node:crypto` to verify the JWT.
- **Layout guard (`requireRole`)** — authoritative: runs in the Node.js runtime, verifies the JWT via `getCurrentUser`, redirects on missing session or role mismatch, and returns the user to the shell.

---

# Forms & UI

- `src/components/ui/input.tsx` — shadcn-style `Input` (no Radix).
- `features/authentication/components/login-form.tsx` and `register-form.tsx` — client forms using React Hook Form + `zodResolver`, showing field and server errors.
- Routes: `/login` and `/register` (public; redirect to the role home if already signed in).

---

# Notes & Next Steps

- Only **coaches** self-register. Athletes are created by coaches (future) and will authenticate through the same session/JWT mechanism by extending `auth.service`.
- The mock `session.action.ts` is now empty (superseded); it could not be deleted in this environment.
- Possible hardening later: token rotation/refresh, rate limiting on login, and moving JWT verification to the edge via Web Crypto if middleware needs role awareness.

---

# Verification

`tsc --noEmit`, `eslint .`, `prettier --check`, and `next build` all pass (with `AUTH_SECRET` and `MONGODB_URI` set). Build outputs `/login`, `/register`, the protected `/coach/*` and `/athlete/*` areas, and the middleware.

---

# End of Document
