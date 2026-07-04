import {
  exerciseRepository,
  type ExerciseWriteInput,
  type ExerciseListFilters,
} from "@/features/exercises/repositories/exercise.repository";
import type { ExerciseDocument } from "@/features/exercises/repositories/models/exercise.model";
import type { ExerciseInput } from "@/features/exercises/schemas/exercise.schema";
import type { ExerciseDTO } from "@/features/exercises/types/exercise.types";
import { ExerciseNotFoundError } from "@/features/exercises/services/exercise.errors";

function toDTO(doc: ExerciseDocument): ExerciseDTO {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description ?? null,
    equipment: doc.equipment,
    muscleGroups: doc.muscleGroups,
    videoUrl: doc.videoUrl ?? null,
    imageUrl: doc.imageUrl ?? null,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  };
}

function toPersistence(input: ExerciseInput): ExerciseWriteInput {
  const description = input.description?.trim();
  const videoUrl = input.videoUrl?.trim();
  const imageUrl = input.imageUrl?.trim();
  return {
    name: input.name.trim(),
    equipment: input.equipment,
    muscleGroups: input.muscleGroups,
    ...(description ? { description } : {}),
    ...(videoUrl ? { videoUrl } : {}),
    ...(imageUrl ? { imageUrl } : {}),
  };
}

export async function listExercises(
  coachId: string,
  filters: ExerciseListFilters = {},
): Promise<ExerciseDTO[]> {
  const docs = await exerciseRepository.listByCoach(coachId, filters);
  return docs.map(toDTO);
}

/**
 * Active exercises a coach can reuse when building programs.
 * Published for the programs feature to consume.
 */
export async function listActiveExercises(
  coachId: string,
): Promise<ExerciseDTO[]> {
  return listExercises(coachId, { status: "active" });
}

export async function getExercise(
  coachId: string,
  id: string,
): Promise<ExerciseDTO | null> {
  const doc = await exerciseRepository.findByIdForCoach(coachId, id);
  return doc ? toDTO(doc) : null;
}

export async function createExercise(
  coachId: string,
  input: ExerciseInput,
): Promise<ExerciseDTO> {
  const doc = await exerciseRepository.create({
    ...toPersistence(input),
    coachId,
  });
  return toDTO(doc);
}

export async function updateExercise(
  coachId: string,
  id: string,
  input: ExerciseInput,
): Promise<ExerciseDTO> {
  const current = await exerciseRepository.findByIdForCoach(coachId, id);
  if (!current) {
    throw new ExerciseNotFoundError();
  }

  const updated = await exerciseRepository.updateForCoach(
    coachId,
    id,
    toPersistence(input),
  );
  if (!updated) {
    throw new ExerciseNotFoundError();
  }
  return toDTO(updated);
}

export async function archiveExercise(
  coachId: string,
  id: string,
): Promise<ExerciseDTO> {
  const updated = await exerciseRepository.setStatusForCoach(
    coachId,
    id,
    "archived",
  );
  if (!updated) {
    throw new ExerciseNotFoundError();
  }
  return toDTO(updated);
}
