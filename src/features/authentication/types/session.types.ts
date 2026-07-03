export type UserRole = "coach" | "athlete";

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
}
