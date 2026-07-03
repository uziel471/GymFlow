export const SESSION_STATUSES = ["in_progress", "completed"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];
