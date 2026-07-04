"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  exerciseInputSchema,
  type ExerciseInput,
} from "@/features/exercises/schemas/exercise.schema";
import {
  MUSCLE_GROUPS,
  EQUIPMENT,
} from "@/features/exercises/constants/exercise.constants";
import {
  createExerciseAction,
  updateExerciseAction,
} from "@/features/exercises/actions/exercise.action";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
const fieldError = "text-sm text-destructive";

interface ExerciseFormProps {
  mode: "create" | "edit";
  exerciseId?: string;
  defaultValues: ExerciseInput;
}

export function ExerciseForm({
  mode,
  exerciseId,
  defaultValues,
}: ExerciseFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseInput>({
    resolver: zodResolver(exerciseInputSchema),
    defaultValues,
  });

  async function onSubmit(values: ExerciseInput) {
    setServerError(null);
    const result =
      mode === "edit" && exerciseId
        ? await updateExerciseAction(exerciseId, values)
        : await createExerciseAction(values);

    if (result.ok) {
      router.push("/coach/exercises");
      router.refresh();
      return;
    }
    setServerError(result.error ?? "Something went wrong.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input id="name" {...register("name")} />
        {errors.name ? (
          <p className={fieldError}>{errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description (optional)
        </label>
        <Textarea id="description" {...register("description")} />
        {errors.description ? (
          <p className={fieldError}>{errors.description.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="equipment" className="text-sm font-medium">
          Equipment
        </label>
        <select
          id="equipment"
          className={cn(selectClass)}
          {...register("equipment")}
        >
          {EQUIPMENT.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Muscle groups</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MUSCLE_GROUPS.map((group) => (
            <label key={group} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={group}
                {...register("muscleGroups")}
              />
              {group}
            </label>
          ))}
        </div>
        {errors.muscleGroups ? (
          <p className={fieldError}>{errors.muscleGroups.message}</p>
        ) : null}
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="videoUrl" className="text-sm font-medium">
            Video URL (optional)
          </label>
          <Input id="videoUrl" {...register("videoUrl")} />
          {errors.videoUrl ? (
            <p className={fieldError}>{errors.videoUrl.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="imageUrl" className="text-sm font-medium">
            Image URL (optional)
          </label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl ? (
            <p className={fieldError}>{errors.imageUrl.message}</p>
          ) : null}
        </div>
      </div>

      {serverError ? <p className={fieldError}>{serverError}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
              ? "Save changes"
              : "Create exercise"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/coach/exercises")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
