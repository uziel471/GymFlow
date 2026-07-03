import { coachRepository } from "@/features/coaches";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { SessionUser } from "@/features/authentication/types/session.types";
import type {
  LoginInput,
  RegisterCoachInput,
} from "@/features/authentication/schemas/auth.schema";
import { EmailAlreadyInUseError } from "@/features/authentication/services/auth.errors";

function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/** Registers a new coach and returns the session identity. */
export async function registerCoach(
  input: RegisterCoachInput,
): Promise<SessionUser> {
  const email = input.email.toLowerCase();

  if (await coachRepository.existsByEmail(email)) {
    throw new EmailAlreadyInUseError();
  }

  const passwordHash = await hashPassword(input.password);
  const coach = await coachRepository.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email,
    passwordHash,
  });

  return {
    id: coach._id.toString(),
    name: fullName(coach.firstName, coach.lastName),
    role: "coach",
  };
}

/** Validates coach credentials. Returns the session identity or null. */
export async function verifyCoachCredentials(
  input: LoginInput,
): Promise<SessionUser | null> {
  const coach = await coachRepository.findByEmailWithPassword(
    input.email.toLowerCase(),
  );
  if (!coach) {
    return null;
  }

  const valid = await verifyPassword(input.password, coach.password);
  if (!valid) {
    return null;
  }

  return {
    id: coach._id.toString(),
    name: fullName(coach.firstName, coach.lastName),
    role: "coach",
  };
}
