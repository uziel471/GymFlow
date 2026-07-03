import { createHmac, timingSafeEqual } from "node:crypto";
import type { UserRole } from "@/features/authentication/types/session.types";

const secret = process.env.AUTH_SECRET;
if (!secret) {
  throw new Error("Missing environment variable: AUTH_SECRET");
}
const AUTH_SECRET: string = secret;

export interface JwtPayload {
  sub: string;
  role: UserRole;
  name: string;
}

interface SignedPayload extends JwtPayload {
  iat: number;
  exp: number;
}

function encode(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(data: string): string {
  return createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
}

/** Sign a stateless HS256 token with an expiry (seconds from now). */
export function signToken(payload: JwtPayload, maxAgeSeconds: number): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const body: SignedPayload = {
    ...payload,
    iat: issuedAt,
    exp: issuedAt + maxAgeSeconds,
  };
  const data = `${encode({ alg: "HS256", typ: "JWT" })}.${encode(body)}`;
  return `${data}.${sign(data)}`;
}

/** Verify signature + expiry. Returns the payload or null when invalid. */
export function verifyToken(token: string): JwtPayload | null {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) {
    return null;
  }

  const expected = sign(`${header}.${body}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString(),
    ) as Partial<SignedPayload>;

    const now = Math.floor(Date.now() / 1000);
    if (typeof parsed.exp !== "number" || parsed.exp < now) {
      return null;
    }
    if (
      typeof parsed.sub !== "string" ||
      typeof parsed.name !== "string" ||
      (parsed.role !== "coach" && parsed.role !== "athlete")
    ) {
      return null;
    }

    return { sub: parsed.sub, name: parsed.name, role: parsed.role };
  } catch {
    return null;
  }
}
