import { Schema, model, models } from "mongoose";
import type { Model, Types } from "mongoose";
import {
  ASSIGNMENT_STATUSES,
  type AssignmentStatus,
} from "@/features/programs/constants/program.constants";

/**
 * Links one athlete to one specific ProgramVersion.
 * Assignments always point to a version, never to a Program directly.
 */
export interface ProgramAssignmentDocument {
  _id: Types.ObjectId;
  coachId: Types.ObjectId;
  athleteId: Types.ObjectId;
  programId: Types.ObjectId;
  programVersionId: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const programAssignmentSchema = new Schema<ProgramAssignmentDocument>(
  {
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
      index: true,
    },
    athleteId: {
      type: Schema.Types.ObjectId,
      ref: "Athlete",
      required: true,
      index: true,
    },
    programId: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    programVersionId: {
      type: Schema.Types.ObjectId,
      ref: "ProgramVersion",
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: [...ASSIGNMENT_STATUSES],
      default: "active",
    },
  },
  { timestamps: true },
);

// Enforces at the database level: at most one ACTIVE assignment per athlete.
programAssignmentSchema.index(
  { athleteId: 1 },
  { unique: true, partialFilterExpression: { status: "active" } },
);

export const ProgramAssignmentModel: Model<ProgramAssignmentDocument> =
  (models.ProgramAssignment as Model<ProgramAssignmentDocument>) ??
  model<ProgramAssignmentDocument>(
    "ProgramAssignment",
    programAssignmentSchema,
  );
