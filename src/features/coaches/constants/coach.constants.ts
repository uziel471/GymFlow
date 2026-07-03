export const COACH_STATUSES = ["active", "inactive"] as const;
export type CoachStatus = (typeof COACH_STATUSES)[number];

export const SUBSCRIPTION_PLANS = [
  "free",
  "professional",
  "enterprise",
] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];
