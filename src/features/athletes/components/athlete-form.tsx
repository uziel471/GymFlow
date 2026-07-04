"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  athleteInputSchema,
  type AthleteInput,
} from "@/features/athletes/schemas/athlete.schema";
import {
  GENDERS,
  ATHLETE_GOALS,
} from "@/features/athletes/constants/athlete.constants";
import {
  createAthleteAction,
  updateAthleteAction,
} from "@/features/athletes/actions/athlete.action";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const fieldError = "text-sm text-destructive";

interface AthleteFormProps {
  mode: "create" | "edit";
  athleteId?: string;
  defaultValues: AthleteInput;
}

export function AthleteForm({
  mode,
  athleteId,
  defaultValues,
}: AthleteFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AthleteInput>({
    resolver: zodResolver(athleteInputSchema),
    defaultValues,
  });

  async function onSubmit(values: AthleteInput) {
    setServerError(null);
    const result =
      mode === "edit" && athleteId
        ? await updateAthleteAction(athleteId, values)
        : await createAthleteAction(values);

    if (result.ok) {
      router.push("/coach/athletes");
      router.refresh();
      return;
    }
    setServerError(result.error ?? "Something went wrong.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className="text-sm font-medium">
            First name
          </label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName ? (
            <p className={fieldError}>{errors.firstName.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last name
          </label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName ? (
            <p className={fieldError}>{errors.lastName.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email ? (
            <p className={fieldError}>{errors.email.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone (optional)
          </label>
          <Input id="phone" {...register("phone")} />
          {errors.phone ? (
            <p className={fieldError}>{errors.phone.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            className={cn(selectClass)}
            {...register("gender")}
          >
            {GENDERS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="birthDate" className="text-sm font-medium">
            Birth date
          </label>
          <Input id="birthDate" type="date" {...register("birthDate")} />
          {errors.birthDate ? (
            <p className={fieldError}>{errors.birthDate.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="goal" className="text-sm font-medium">
            Goal
          </label>
          <select id="goal" className={cn(selectClass)} {...register("goal")}>
            {ATHLETE_GOALS.map((value) => (
              <option key={value} value={value}>
                {value.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="height" className="text-sm font-medium">
            Height (cm)
          </label>
          <Input id="height" inputMode="numeric" {...register("height")} />
          {errors.height ? (
            <p className={fieldError}>{errors.height.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="initialWeight" className="text-sm font-medium">
            Initial weight (kg)
          </label>
          <Input
            id="initialWeight"
            inputMode="numeric"
            {...register("initialWeight")}
          />
          {errors.initialWeight ? (
            <p className={fieldError}>{errors.initialWeight.message}</p>
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
              : "Create athlete"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/coach/athletes")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
