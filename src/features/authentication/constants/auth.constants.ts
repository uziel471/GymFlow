import type { UserRole } from "@/features/authentication/types/session.types";

export const SESSION_COOKIE = "gymflow_session";
export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";

/** JWT / cookie lifetime in seconds (7 days). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const ROLE_HOME: Record<UserRole, string> = {
  coach: "/coach/dashboard",
  athlete: "/athlete/dashboard",
};
