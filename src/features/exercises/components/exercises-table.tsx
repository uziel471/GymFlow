import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { ExerciseDTO } from "@/features/exercises/types/exercise.types";
import { ArchiveExerciseButton } from "@/features/exercises/components/archive-exercise-button";

function StatusBadge({ status }: { status: ExerciseDTO["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        status === "active"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function ExercisesTable({ exercises }: { exercises: ExerciseDTO[] }) {
  if (exercises.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
        No exercises match. Create one or clear the filter.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground border-b text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Muscle groups</th>
            <th className="px-4 py-2 font-medium">Equipment</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">{exercise.name}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.map((group) => (
                    <span
                      key={group}
                      className="bg-muted text-muted-foreground inline-flex rounded-full px-2 py-0.5 text-xs"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </td>
              <td className="text-muted-foreground px-4 py-3 capitalize">
                {exercise.equipment}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={exercise.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/coach/exercises/${exercise.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                    )}
                  >
                    Edit
                  </Link>
                  {exercise.status === "active" ? (
                    <ArchiveExerciseButton
                      exerciseId={exercise.id}
                      exerciseName={exercise.name}
                    />
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
