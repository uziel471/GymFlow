export const PROGRAM_STATUSES = ["draft", "active", "archived"] as const;
export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

export const DAY_TYPES = ["training", "rest"] as const;
export type DayType = (typeof DAY_TYPES)[number];

export const ASSIGNMENT_STATUSES = [
  "active",
  "completed",
  "cancelled",
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];
