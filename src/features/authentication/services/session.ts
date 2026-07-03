import { cookies } from "next/headers";
import { signToken, verifyToken } from "@/lib/jwt";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/features/authentication/constants/auth.constants";
import type { SessionUser } from "@/features/authentication/types/session.types";

/** Reads and verifies the JWT session cookie. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return { id: payload.sub, name: payload.name, role: payload.role };
}

/** Signs a JWT for the user and stores it as an httpOnly cookie. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = signToken(
    { sub: user.id, role: user.role, name: user.name },
    SESSION_MAX_AGE,
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Clears the session cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
