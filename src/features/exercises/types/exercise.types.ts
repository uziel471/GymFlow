import type {
  MuscleGroup,
  Equipment,
  ExerciseStatus,
} from "@/features/exercises/constants/exercise.constants";

/** Serializable exercise shape exposed to the UI (no coachId). */
export interface ExerciseDTO {
  id: string;
  name: string;
  description: string | null;
  equipment: Equipment;
  muscleGroups: MuscleGroup[];
  videoUrl: string | null;
  imageUrl: string | null;
  status: ExerciseStatus;
  createdAt: string;
}
