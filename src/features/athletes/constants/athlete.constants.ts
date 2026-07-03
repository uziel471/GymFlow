export const GENDERS = ["male", "female", "other"] as const;
export type Gender = (typeof GENDERS)[number];

export const ATHLETE_STATUSES = ["active", "inactive"] as const;
export type AthleteStatus = (typeof ATHLETE_STATUSES)[number];

export const ATHLETE_GOALS = [
  "weight_loss",
  "muscle_gain",
  "strength",
  "endurance",
  "general_fitness",
] as const;
export type AthleteGoal = (typeof ATHLETE_GOALS)[number];
