import { connectToDatabase } from "@/lib/db";
import {
  CoachModel,
  type CoachDocument,
} from "@/features/coaches/repositories/models/coach.model";

export interface CreateCoachInput {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

/**
 * Persistence for the Coach collection. The only place that touches the
 * Coach Mongoose model. Returns plain objects, never hydrated documents.
 */
export const coachRepository = {
  async existsByEmail(email: string): Promise<boolean> {
    await connectToDatabase();
    const found = await CoachModel.exists({ email });
    return found !== null;
  },

  async findByEmailWithPassword(email: string): Promise<CoachDocument | null> {
    await connectToDatabase();
    return CoachModel.findOne({ email })
      .select("+password")
      .lean<CoachDocument | null>();
  },

  async create(input: CreateCoachInput): Promise<CoachDocument> {
    await connectToDatabase();
    const created = await CoachModel.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.passwordHash,
    });
    return created.toObject() as CoachDocument;
  },
};
