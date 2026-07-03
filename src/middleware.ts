import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  LOGIN_PATH,
} from "@/features/authentication/constants/auth.constants";

/**
 * Coarse edge protection: redirect to login when the session cookie is absent.
 * The JWT is verified (and the role enforced) in each area's layout via
 * requireRole(), which runs in the Node.js runtime where node:crypto exists.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/coach/:path*", "/athlete/:path*"],
};
