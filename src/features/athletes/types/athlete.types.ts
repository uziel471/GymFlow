import type {
  Gender,
  AthleteGoal,
  AthleteStatus,
} from "@/features/athletes/constants/athlete.constants";

/**
 * Serializable athlete shape exposed to the UI. Never includes coachId
 * (tenancy stays internal to services/repositories).
 */
export interface AthleteDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  gender: Gender;
  birthDate: string; // ISO date
  height: number; // cm
  initialWeight: number; // kg
  goal: AthleteGoal;
  status: AthleteStatus;
  createdAt: string; // ISO date
}
