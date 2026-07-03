import { Schema, model, models } from "mongoose";
import type { Model, Types } from "mongoose";
import {
  SESSION_STATUSES,
  type SessionStatus,
} from "@/features/workouts/constants/workout.constants";

/**
 * A WorkoutSession is the athlete's execution record.
 * Exercise logs and their sets are embedded (written and read together).
 * The session is mutable while "in_progress" and becomes IMMUTABLE once
 * "completed".
 */

export interface SetLog {
  setNumber: number;
  weight: number; // kilograms
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: Types.ObjectId;
  exerciseNameSnapshot: string;
  order: number;
  targetReps: string;
  restTime?: number; // seconds
  coachNotes?: string;
  sets: SetLog[];
  athleteNotes?: string;
  completedAt?: Date;
}

export interface WorkoutSessionDocument {
  _id: Types.ObjectId;
  coachId: Types.ObjectId;
  athleteId: Types.ObjectId;
  assignmentId: Types.ObjectId;
  programVersionId: Types.ObjectId;
  weekNumber: number;
  dayName: string;
  status: SessionStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // seconds
  exerciseLogs: ExerciseLog[];
  createdAt: Date;
  updatedAt: Date;
}

const setLogSchema = new Schema<SetLog>(
  {
    setNumber: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 0 },
    reps: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false },
  },
  { _id: false },
);

const exerciseLogSchema = new Schema<ExerciseLog>(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    exerciseNameSnapshot: { type: String, required: true },
    order: { type: Number, required: true, min: 0 },
    targetReps: { type: String, required: true },
    restTime: { type: Number, min: 0 },
    coachNotes: { type: String },
    sets: { type: [setLogSchema], default: [] },
    athleteNotes: { type: String },
    completedAt: { type: Date },
  },
  { _id: false },
);

const workoutSessionSchema = new Schema<WorkoutSessionDocument>(
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
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "ProgramAssignment",
      required: true,
      index: true,
    },
    programVersionId: {
      type: Schema.Types.ObjectId,
      ref: "ProgramVersion",
      required: true,
    },
    weekNumber: { type: Number, required: true, min: 1 },
    dayName: { type: String, required: true },
    status: {
      type: String,
      enum: [...SESSION_STATUSES],
      default: "in_progress",
    },
    startedAt: { type: Date, required: true, default: () => new Date() },
    completedAt: { type: Date },
    duration: { type: Number, min: 0 },
    exerciseLogs: { type: [exerciseLogSchema], default: [] },
  },
  { timestamps: true },
);

// History listing for an athlete, most-recent first.
workoutSessionSchema.index({ athleteId: 1, completedAt: -1 });
// Progression analytics: find all logs of a given exercise (Phase 2).
workoutSessionSchema.index({ "exerciseLogs.exerciseId": 1 });

// --- Immutability once completed ---

// Remember the persisted status when a document is loaded from the database.
workoutSessionSchema.post("init", function () {
  this.$locals.originalStatus = this.status;
});

// Allow the in_progress -> completed transition, block any later edit.
workoutSessionSchema.pre("save", function () {
  if (!this.isNew && this.$locals.originalStatus === "completed") {
    throw new Error("Completed workout sessions are immutable.");
  }
});

export const WorkoutSessionModel: Model<WorkoutSessionDocument> =
  (models.WorkoutSession as Model<WorkoutSessionDocument>) ??
  model<WorkoutSessionDocument>("WorkoutSession", workoutSessionSchema);
