import { Schema, model, models } from "mongoose";
import type { Model, Types } from "mongoose";
import {
  COACH_STATUSES,
  SUBSCRIPTION_PLANS,
  type CoachStatus,
  type SubscriptionPlan,
} from "@/features/coaches/constants/coach.constants";

export interface CoachDocument {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subscription: SubscriptionPlan;
  status: CoachStatus;
  createdAt: Date;
  updatedAt: Date;
}

const coachSchema = new Schema<CoachDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Never returned by default; repositories must opt in explicitly.
    password: { type: String, required: true, select: false },
    subscription: {
      type: String,
      enum: [...SUBSCRIPTION_PLANS],
      default: "free",
    },
    status: { type: String, enum: [...COACH_STATUSES], default: "active" },
  },
  { timestamps: true },
);

export const CoachModel: Model<CoachDocument> =
  (models.Coach as Model<CoachDocument>) ??
  model<CoachDocument>("Coach", coachSchema);
