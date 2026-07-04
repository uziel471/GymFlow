import { requireRole } from "@/features/authentication/utils/require-role";
import { AthleteForm } from "@/features/athletes/components/athlete-form";
import type { AthleteInput } from "@/features/athletes/schemas/athlete.schema";

const EMPTY_ATHLETE: AthleteInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "male",
  birthDate: "",
  height: "",
  initialWeight: "",
  goal: "muscle_gain",
};

export default async function NewAthletePage() {
  await requireRole("coach");

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New athlete</h1>
      <AthleteForm mode="create" defaultValues={EMPTY_ATHLETE} />
    </div>
  );
}
