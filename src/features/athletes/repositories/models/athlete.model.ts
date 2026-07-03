import { Schema, model, models } from "mongoose";
import type { Model, Types } from "mongoose";
import {
  GENDERS,
  ATHLETE_STATUSES,
  ATHLETE_GOALS,
  type Gender,
  type AthleteStatus,
  type AthleteGoal,
} from "@/features/athletes/constants/athlete.constants";

export interface AthleteDocument {
  _id: Types.ObjectId;
  coachId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: Gender;
  birthDate: Date;
  height: number; // centimeters (canonical unit)
  initialWeight: number; // kilograms (canonical unit)
  goal: AthleteGoal;
  status: AthleteStatus;
  createdAt: Date;
  updatedAt: Date;
}

const athleteSchema = new Schema<AthleteDocument>(
  {
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    gender: { type: String, enum: [...GENDERS], required: true },
    birthDate: { type: Date, required: true },
    height: { type: Number, required: true, min: 0 },
    initialWeight: { type: Number, required: true, min: 0 },
    goal: { type: String, enum: [...ATHLETE_GOALS], required: true },
    status: { type: String, enum: [...ATHLETE_STATUSES], default: "active" },
  },
  { timestamps: true },
);

// Tenant-scoped listings (e.g. active athletes of a coach).
athleteSchema.index({ coachId: 1, status: 1 });

export const AthleteModel: Model<AthleteDocument> =
  (models.Athlete as Model<AthleteDocument>) ??
  model<AthleteDocument>("Athlete", athleteSchema);
