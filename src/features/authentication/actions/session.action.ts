"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  LOGIN_PATH,
  ROLE_HOME,
} from "@/features/authentication/constants/auth.constants";
import type {
  SessionUser,
  UserRole,
} from "@/features/authentication/types/session.types";

/**
 * TEMPORARY mock sign-in. Sets a role cookie so the shell is navigable and
 * route protection can be demonstrated. Replace with Better Auth.
 */
async function signInAs(role: UserRole): Promise<void> {
  const user: SessionUser = {
    id: `mock-${role}`,
    name: role === "coach" ? "Coach Demo" : "Athlete Demo",
    role,
  };

  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect(ROLE_HOME[role]);
}

export async function signInAsCoach(): Promise<void> {
  await signInAs("coach");
}

export async function signInAsAthlete(): Promise<void> {
  await signInAs("athlete");
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect(LOGIN_PATH);
}
