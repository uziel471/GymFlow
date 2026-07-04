import { notFound } from "next/navigation";
import { requireRole } from "@/features/authentication/utils/require-role";
import { getExercise } from "@/features/exercises/services/exercise.service";
import { ExerciseForm } from "@/features/exercises/components/exercise-form";
import type { ExerciseInput } from "@/features/exercises/schemas/exercise.schema";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("coach");
  const { id } = await params;
  const exercise = await getExercise(user.id, id);

  if (!exercise) {
    notFound();
  }

  const defaultValues: ExerciseInput = {
    name: exercise.name,
    description: exercise.description ?? "",
    equipment: exercise.equipment,
    muscleGroups: exercise.muscleGroups,
    videoUrl: exercise.videoUrl ?? "",
    imageUrl: exercise.imageUrl ?? "",
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit exercise</h1>
      <ExerciseForm
        mode="edit"
        exerciseId={exercise.id}
        defaultValues={defaultValues}
      />
    </div>
  );
}
