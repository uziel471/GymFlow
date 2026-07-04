import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/features/authentication/utils/require-role";
import { listExercises } from "@/features/exercises/services/exercise.service";
import { ExercisesTable } from "@/features/exercises/components/exercises-table";
import { MuscleGroupFilter } from "@/features/exercises/components/muscle-group-filter";
import {
  MUSCLE_GROUPS,
  type MuscleGroup,
} from "@/features/exercises/constants/exercise.constants";

function parseMuscleGroup(
  value: string | string[] | undefined,
): MuscleGroup | undefined {
  if (
    typeof value === "string" &&
    (MUSCLE_GROUPS as readonly string[]).includes(value)
  ) {
    return value as MuscleGroup;
  }
  return undefined;
}

export default async function CoachExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ muscleGroup?: string | string[] }>;
}) {
  const user = await requireRole("coach");
  const { muscleGroup } = await searchParams;
  const selected = parseMuscleGroup(muscleGroup);

  const exercises = await listExercises(
    user.id,
    selected ? { muscleGroup: selected } : {},
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Exercises</h1>
        <Link href="/coach/exercises/new" className={cn(buttonVariants())}>
          New exercise
        </Link>
      </div>
      <MuscleGroupFilter current={selected ?? ""} />
      <ExercisesTable exercises={exercises} />
    </div>
  );
}
