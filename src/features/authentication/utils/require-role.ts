import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/authentication/services/session";
import {
  LOGIN_PATH,
  ROLE_HOME,
} from "@/features/authentication/constants/auth.constants";
import type {
  SessionUser,
  UserRole,
} from "@/features/authentication/types/session.types";

/**
 * Server-side route guard. Redirects to login when unauthenticated and to the
 * user's own home when the role does not match. Returns the user otherwise.
 */
export async function requireRole(role: UserRole): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN_PATH);
  }

  if (user.role !== role) {
    redirect(ROLE_HOME[user.role]);
  }

  return user;
}
