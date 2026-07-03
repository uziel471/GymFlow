export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "core",
  "cardio",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EQUIPMENT = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "kettlebell",
  "band",
  "other",
] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export const EXERCISE_STATUSES = ["active", "archived"] as const;
export type ExerciseStatus = (typeof EXERCISE_STATUSES)[number];
