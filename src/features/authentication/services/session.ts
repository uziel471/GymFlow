import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/features/authentication/constants/auth.constants";
import type { SessionUser } from "@/features/authentication/types/session.types";

/**
 * TEMPORARY mock session backed by a cookie.
 * Replace with Better Auth without changing callers (layouts, pages).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SessionUser>;

    if (
      typeof parsed.id === "string" &&
      typeof parsed.name === "string" &&
      (parsed.role === "coach" || parsed.role === "athlete")
    ) {
      return { id: parsed.id, name: parsed.name, role: parsed.role };
    }

    return null;
  } catch {
    return null;
  }
}
