import { connectToDatabase } from "@/lib/db";
import {
  AthleteModel,
  type AthleteDocument,
} from "@/features/athletes/repositories/models/athlete.model";
import type {
  Gender,
  AthleteGoal,
  AthleteStatus,
} from "@/features/athletes/constants/athlete.constants";

export interface AthletePersistenceInput {
  coachId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: Gender;
  birthDate: Date;
  height: number;
  initialWeight: number;
  goal: AthleteGoal;
}

export type AthleteUpdateInput = Omit<AthletePersistenceInput, "coachId">;

/**
 * Persistence for the Athlete collection. Every query is scoped by coachId,
 * so a coach can never read or write another coach's athletes. Returns plain
 * objects, never hydrated documents.
 */
export const athleteRepository = {
  async listByCoach(coachId: string): Promise<AthleteDocument[]> {
    await connectToDatabase();
    return AthleteModel.find({ coachId })
      .sort({ createdAt: -1 })
      .lean<AthleteDocument[]>();
  },

  async findByIdForCoach(
    coachId: string,
    id: string,
  ): Promise<AthleteDocument | null> {
    await connectToDatabase();
    return AthleteModel.findOne({
      _id: id,
      coachId,
    }).lean<AthleteDocument | null>();
  },

  async existsByEmail(email: string): Promise<boolean> {
    await connectToDatabase();
    const found = await AthleteModel.exists({ email });
    return found !== null;
  },

  async create(input: AthletePersistenceInput): Promise<AthleteDocument> {
    await connectToDatabase();
    const created = await AthleteModel.create(input);
    return created.toObject() as AthleteDocument;
  },

  async updateForCoach(
    coachId: string,
    id: string,
    input: AthleteUpdateInput,
  ): Promise<AthleteDocument | null> {
    await connectToDatabase();
    return AthleteModel.findOneAndUpdate({ _id: id, coachId }, input, {
      new: true,
    }).lean<AthleteDocument | null>();
  },

  async setStatusForCoach(
    coachId: string,
    id: string,
    status: AthleteStatus,
  ): Promise<AthleteDocument | null> {
    await connectToDatabase();
    return AthleteModel.findOneAndUpdate(
      { _id: id, coachId },
      { status },
      { new: true },
    ).lean<AthleteDocument | null>();
  },
};
