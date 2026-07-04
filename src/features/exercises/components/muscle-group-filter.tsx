"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MUSCLE_GROUPS } from "@/features/exercises/constants/exercise.constants";

const selectClass =
  "flex h-9 w-56 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function MuscleGroupFilter({ current }: { current: string }) {
  const router = useRouter();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    router.push(
      value ? `/coach/exercises?muscleGroup=${value}` : "/coach/exercises",
    );
  }

  return (
    <select
      aria-label="Filter by muscle group"
      className={cn(selectClass)}
      value={current}
      onChange={onChange}
    >
      <option value="">All muscle groups</option>
      {MUSCLE_GROUPS.map((group) => (
        <option key={group} value={group}>
          {group}
        </option>
      ))}
    </select>
  );
}
