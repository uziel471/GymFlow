import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  LOGIN_PATH,
  ROLE_HOME,
} from "@/features/authentication/constants/auth.constants";
import type { UserRole } from "@/features/authentication/types/session.types";

/**
 * Coarse route protection at the edge. The authoritative, role-aware check
 * also runs in each area's layout via requireRole().
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(SESSION_COOKIE)?.value;

  let role: UserRole | null = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { role?: string };
      if (parsed.role === "coach" || parsed.role === "athlete") {
        role = parsed.role;
      }
    } catch {
      role = null;
    }
  }

  if (!role) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (pathname.startsWith("/coach") && role !== "coach") {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (pathname.startsWith("/athlete") && role !== "athlete") {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/coach/:path*", "/athlete/:path*"],
};
