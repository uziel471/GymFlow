import { Schema, model, models } from "mongoose";
import type { Model, Types } from "mongoose";
import {
  DAY_TYPES,
  type DayType,
} from "@/features/programs/constants/program.constants";

/**
 * ProgramVersion is an IMMUTABLE snapshot. Its whole tree
 * (weeks -> days -> exercises) is embedded because it is written once,
 * read together, and never mutated. Any change creates a NEW version.
 */

export interface PlannedExerciseSnapshot {
  order: number;
  exerciseId: Types.ObjectId;
  exerciseNameSnapshot: string;
  sets: number;
  targetReps: string; // string allows ranges like "8-12"
  suggestedWeight?: number; // kilograms
  restTime?: number; // seconds
  tempo?: string;
  coachNotes?: string;
}

export interface WorkoutDaySnapshot {
  name: string; // "Monday", "Push", ...
  type: DayType;
  exercises: PlannedExerciseSnapshot[];
}

export interface TrainingWeekSnapshot {
  weekNumber: number;
  days: WorkoutDaySnapshot[];
}

export interface ProgramVersionDocument {
  _id: Types.ObjectId;
  programId: Types.ObjectId;
  coachId: Types.ObjectId;
  versionNumber: number;
  weeks: TrainingWeekSnapshot[];
  createdAt: Date;
}

const plannedExerciseSchema = new Schema<PlannedExerciseSnapshot>(
  {
    order: { type: Number, required: true, min: 0 },
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    exerciseNameSnapshot: { type: String, required: true },
    sets: { type: Number, required: true, min: 0 },
    targetReps: { type: String, required: true },
    suggestedWeight: { type: Number, min: 0 },
    restTime: { type: Number, min: 0 },
    tempo: { type: String },
    coachNotes: { type: String },
  },
  { _id: false },
);

const workoutDaySchema = new Schema<WorkoutDaySnapshot>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: [...DAY_TYPES], default: "training" },
    exercises: { type: [plannedExerciseSchema], default: [] },
  },
  { _id: false },
);

const trainingWeekSchema = new Schema<TrainingWeekSnapshot>(
  {
    weekNumber: { type: Number, required: true, min: 1 },
    days: { type: [workoutDaySchema], default: [] },
  },
  { _id: false },
);

const programVersionSchema = new Schema<ProgramVersionDocument>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
      index: true,
    },
    versionNumber: { type: Number, required: true, min: 1 },
    weeks: { type: [trainingWeekSchema], default: [] },
  },
  // Immutable history: only creation is timestamped.
  { timestamps: { createdAt: true, updatedAt: false } },
);

// A program cannot have two versions with the same number.
programVersionSchema.index(
  { programId: 1, versionNumber: 1 },
  { unique: true },
);

// --- Immutability enforcement (write-once) ---

programVersionSchema.pre("save", function () {
  if (!this.isNew) {
    throw new Error("ProgramVersion is immutable and cannot be modified.");
  }
});

const IMMUTABLE_UPDATE_MESSAGE =
  "ProgramVersion is immutable and cannot be updated.";

function throwImmutable(): never {
  throw new Error(IMMUTABLE_UPDATE_MESSAGE);
}

programVersionSchema.pre("findOneAndUpdate", throwImmutable);
programVersionSchema.pre("updateOne", throwImmutable);
programVersionSchema.pre("updateMany", throwImmutable);
programVersionSchema.pre("replaceOne", throwImmutable);
programVersionSchema.pre("findOneAndReplace", throwImmutable);

export const ProgramVersionModel: Model<ProgramVersionDocument> =
  (models.ProgramVersion as Model<ProgramVersionDocument>) ??
  model<ProgramVersionDocument>("ProgramVersion", programVersionSchema);
