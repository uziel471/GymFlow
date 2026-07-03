import { Schema, model, models } from "mongoose";
import type { Model, Types } from "mongoose";
import {
  PROGRAM_STATUSES,
  type ProgramStatus,
} from "@/features/programs/constants/program.constants";

/**
 * A Program is the reusable template metadata only.
 * Training content lives in ProgramVersion documents.
 */
export interface ProgramDocument {
  _id: Types.ObjectId;
  coachId: Types.ObjectId;
  name: string;
  description?: string;
  status: ProgramStatus;
  currentVersionId?: Types.ObjectId;
  versionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<ProgramDocument>(
  {
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: [...PROGRAM_STATUSES], default: "draft" },
    currentVersionId: { type: Schema.Types.ObjectId, ref: "ProgramVersion" },
    versionCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

programSchema.index({ coachId: 1, status: 1 });

export const ProgramModel: Model<ProgramDocument> =
  (models.Program as Model<ProgramDocument>) ??
  model<ProgramDocument>("Program", programSchema);
