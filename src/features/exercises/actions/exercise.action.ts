"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/authentication/services/session";
import { LOGIN_PATH } from "@/features/authentication/constants/auth.constants";
import { exerciseInputSchema } from "@/features/exercises/schemas/exercise.schema";
import type { ExerciseInput } from "@/features/exercises/schemas/exercise.schema";
import {
  createExercise,
  updateExercise,
  archiveExercise,
} from "@/features/exercises/services/exercise.service";
import { ExerciseNotFoundError } from "@/features/exercises/services/exercise.errors";

export interface ExerciseActionResult {
  ok: boolean;
  error?: string;
}

const EXERCISES_PATH = "/coach/exercises";

async function requireCoachId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user || user.role !== "coach") {
    redirect(LOGIN_PATH);
  }
  return user.id;
}

export async function createExerciseAction(
  input: ExerciseInput,
): Promise<ExerciseActionResult> {
  const parsed = exerciseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const coachId = await requireCoachId();
  await createExercise(coachId, parsed.data);

  revalidatePath(EXERCISES_PATH);
  return { ok: true };
}

export async function updateExerciseAction(
  id: string,
  input: ExerciseInput,
): Promise<ExerciseActionResult> {
  const parsed = exerciseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const coachId = await requireCoachId();
  try {
    await updateExercise(coachId, id, parsed.data);
  } catch (error) {
    if (error instanceof ExerciseNotFoundError) {
      return { ok: false, error: "Exercise not found." };
    }
    throw error;
  }

  revalidatePath(EXERCISES_PATH);
  return { ok: true };
}

export async function archiveExerciseAction(
  id: string,
): Promise<ExerciseActionResult> {
  const coachId = await requireCoachId();
  try {
    await archiveExercise(coachId, id);
  } catch (error) {
    if (error instanceof ExerciseNotFoundError) {
      return { ok: false, error: "Exercise not found." };
    }
    throw error;
  }

  revalidatePath(EXERCISES_PATH);
  return { ok: true };
}
