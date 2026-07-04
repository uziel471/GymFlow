import { z } from "zod";
import {
  MUSCLE_GROUPS,
  EQUIPMENT,
} from "@/features/exercises/constants/exercise.constants";

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^https?:\/\/.+/.test(value),
    "Enter a valid URL.",
  )
  .optional();

export const exerciseInputSchema = z.object({
  name: z.string().trim().min(2, "Name is too short."),
  description: z.string().trim().max(500).optional(),
  equipment: z.enum(EQUIPMENT),
  muscleGroups: z
    .array(z.enum(MUSCLE_GROUPS))
    .min(1, "Select at least one muscle group."),
  videoUrl: optionalUrl,
  imageUrl: optionalUrl,
});

export type ExerciseInput = z.infer<typeof exerciseInputSchema>;
