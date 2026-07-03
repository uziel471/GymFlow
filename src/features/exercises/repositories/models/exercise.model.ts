import { Schema, model, models } from "mongoose";
import type { Model, Types } from "mongoose";
import {
  MUSCLE_GROUPS,
  EQUIPMENT,
  EXERCISE_STATUSES,
  type MuscleGroup,
  type Equipment,
  type ExerciseStatus,
} from "@/features/exercises/constants/exercise.constants";

export interface ExerciseDocument {
  _id: Types.ObjectId;
  coachId: Types.ObjectId;
  name: string;
  description?: string;
  equipment: Equipment;
  muscleGroups: MuscleGroup[];
  videoUrl?: string;
  imageUrl?: string;
  status: ExerciseStatus;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<ExerciseDocument>(
  {
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    equipment: { type: String, enum: [...EQUIPMENT], required: true },
    muscleGroups: {
      type: [{ type: String, enum: [...MUSCLE_GROUPS] }],
      default: [],
    },
    videoUrl: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    status: { type: String, enum: [...EXERCISE_STATUSES], default: "active" },
  },
  { timestamps: true },
);

exerciseSchema.index({ coachId: 1, status: 1 });
exerciseSchema.index({ coachId: 1, name: 1 });

export const ExerciseModel: Model<ExerciseDocument> =
  (models.Exercise as Model<ExerciseDocument>) ??
  model<ExerciseDocument>("Exercise", exerciseSchema);
