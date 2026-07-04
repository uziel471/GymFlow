import { connectToDatabase } from "@/lib/db";
import {
  ExerciseModel,
  type ExerciseDocument,
} from "@/features/exercises/repositories/models/exercise.model";
import type {
  MuscleGroup,
  Equipment,
  ExerciseStatus,
} from "@/features/exercises/constants/exercise.constants";

export interface ExerciseWriteInput {
  name: string;
  description?: string;
  equipment: Equipment;
  muscleGroups: MuscleGroup[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface ExerciseListFilters {
  muscleGroup?: MuscleGroup;
  status?: ExerciseStatus;
}

/**
 * Persistence for the Exercise collection. Every query is scoped by coachId.
 * Returns plain objects, never hydrated documents.
 */
export const exerciseRepository = {
  async listByCoach(
    coachId: string,
    filters: ExerciseListFilters = {},
  ): Promise<ExerciseDocument[]> {
    await connectToDatabase();
    const query: {
      coachId: string;
      muscleGroups?: MuscleGroup;
      status?: ExerciseStatus;
    } = { coachId };
    if (filters.muscleGroup) {
      query.muscleGroups = filters.muscleGroup;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    return ExerciseModel.find(query)
      .sort({ createdAt: -1 })
      .lean<ExerciseDocument[]>();
  },

  async findByIdForCoach(
    coachId: string,
    id: string,
  ): Promise<ExerciseDocument | null> {
    await connectToDatabase();
    return ExerciseModel.findOne({
      _id: id,
      coachId,
    }).lean<ExerciseDocument | null>();
  },

  async create(
    input: ExerciseWriteInput & { coachId: string },
  ): Promise<ExerciseDocument> {
    await connectToDatabase();
    const created = await ExerciseModel.create(input);
    return created.toObject() as ExerciseDocument;
  },

  async updateForCoach(
    coachId: string,
    id: string,
    input: ExerciseWriteInput,
  ): Promise<ExerciseDocument | null> {
    await connectToDatabase();
    return ExerciseModel.findOneAndUpdate({ _id: id, coachId }, input, {
      new: true,
    }).lean<ExerciseDocument | null>();
  },

  async setStatusForCoach(
    coachId: string,
    id: string,
    status: ExerciseStatus,
  ): Promise<ExerciseDocument | null> {
    await connectToDatabase();
    return ExerciseModel.findOneAndUpdate(
      { _id: id, coachId },
      { status },
      { new: true },
    ).lean<ExerciseDocument | null>();
  },
};
