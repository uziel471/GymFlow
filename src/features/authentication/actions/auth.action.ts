"use server";

import { redirect } from "next/navigation";
import {
  loginSchema,
  registerCoachSchema,
  type LoginInput,
  type RegisterCoachInput,
} from "@/features/authentication/schemas/auth.schema";
import {
  registerCoach,
  verifyCoachCredentials,
} from "@/features/authentication/services/auth.service";
import {
  createSession,
  destroySession,
} from "@/features/authentication/services/session";
import { EmailAlreadyInUseError } from "@/features/authentication/services/auth.errors";
import {
  ROLE_HOME,
  LOGIN_PATH,
} from "@/features/authentication/constants/auth.constants";
import type { SessionUser } from "@/features/authentication/types/session.types";

export interface AuthActionError {
  error: string;
}

export async function loginAction(
  input: LoginInput,
): Promise<AuthActionError | void> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const user = await verifyCoachCredentials(parsed.data);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  await createSession(user);
  redirect(ROLE_HOME[user.role]);
}

export async function registerCoachAction(
  input: RegisterCoachInput,
): Promise<AuthActionError | void> {
  const parsed = registerCoachSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  let user: SessionUser;
  try {
    user = await registerCoach(parsed.data);
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return { error: "That email is already registered." };
    }
    throw error;
  }

  await createSession(user);
  redirect(ROLE_HOME[user.role]);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect(LOGIN_PATH);
}
