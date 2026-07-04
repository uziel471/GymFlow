"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/authentication/services/session";
import { LOGIN_PATH } from "@/features/authentication/constants/auth.constants";
import { athleteInputSchema } from "@/features/athletes/schemas/athlete.schema";
import type { AthleteInput } from "@/features/athletes/schemas/athlete.schema";
import {
  createAthlete,
  updateAthlete,
  deactivateAthlete,
} from "@/features/athletes/services/athlete.service";
import {
  AthleteEmailInUseError,
  AthleteNotFoundError,
} from "@/features/athletes/services/athlete.errors";

export interface AthleteActionResult {
  ok: boolean;
  error?: string;
}

const ATHLETES_PATH = "/coach/athletes";

async function requireCoachId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user || user.role !== "coach") {
    redirect(LOGIN_PATH);
  }
  return user.id;
}

export async function createAthleteAction(
  input: AthleteInput,
): Promise<AthleteActionResult> {
  const parsed = athleteInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const coachId = await requireCoachId();
  try {
    await createAthlete(coachId, parsed.data);
  } catch (error) {
    if (error instanceof AthleteEmailInUseError) {
      return { ok: false, error: "That email is already registered." };
    }
    throw error;
  }

  revalidatePath(ATHLETES_PATH);
  return { ok: true };
}

export async function updateAthleteAction(
  id: string,
  input: AthleteInput,
): Promise<AthleteActionResult> {
  const parsed = athleteInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const coachId = await requireCoachId();
  try {
    await updateAthlete(coachId, id, parsed.data);
  } catch (error) {
    if (error instanceof AthleteEmailInUseError) {
      return { ok: false, error: "That email is already registered." };
    }
    if (error instanceof AthleteNotFoundError) {
      return { ok: false, error: "Athlete not found." };
    }
    throw error;
  }

  revalidatePath(ATHLETES_PATH);
  return { ok: true };
}

export async function deactivateAthleteAction(
  id: string,
): Promise<AthleteActionResult> {
  const coachId = await requireCoachId();
  try {
    await deactivateAthlete(coachId, id);
  } catch (error) {
    if (error instanceof AthleteNotFoundError) {
      return { ok: false, error: "Athlete not found." };
    }
    throw error;
  }

  revalidatePath(ATHLETES_PATH);
  return { ok: true };
}
