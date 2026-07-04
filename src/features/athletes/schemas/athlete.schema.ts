import { z } from "zod";
import {
  GENDERS,
  ATHLETE_GOALS,
} from "@/features/athletes/constants/athlete.constants";

const positiveNumberString = (message: string) =>
  z.string().refine((value) => {
    const parsed = Number(value);
    return value.trim() !== "" && Number.isFinite(parsed) && parsed > 0;
  }, message);

export const athleteInputSchema = z.object({
  firstName: z.string().trim().min(2, "First name is too short."),
  lastName: z.string().trim().min(2, "Last name is too short."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(30).optional(),
  gender: z.enum(GENDERS),
  birthDate: z.string().min(1, "Birth date is required."),
  height: positiveNumberString("Enter a valid height in cm."),
  initialWeight: positiveNumberString("Enter a valid weight in kg."),
  goal: z.enum(ATHLETE_GOALS),
});

export type AthleteInput = z.infer<typeof athleteInputSchema>;
