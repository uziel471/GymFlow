import { requireRole } from "@/features/authentication/utils/require-role";
import { ExerciseForm } from "@/features/exercises/components/exercise-form";
import type { ExerciseInput } from "@/features/exercises/schemas/exercise.schema";

const EMPTY_EXERCISE: ExerciseInput = {
  name: "",
  description: "",
  equipment: "barbell",
  muscleGroups: [],
  videoUrl: "",
  imageUrl: "",
};

export default async function NewExercisePage() {
  await requireRole("coach");

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New exercise</h1>
      <ExerciseForm mode="create" defaultValues={EMPTY_EXERCISE} />
    </div>
  );
}
