import { notFound } from "next/navigation";
import { requireRole } from "@/features/authentication/utils/require-role";
import { getAthlete } from "@/features/athletes/services/athlete.service";
import { AthleteForm } from "@/features/athletes/components/athlete-form";
import type { AthleteInput } from "@/features/athletes/schemas/athlete.schema";

export default async function EditAthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("coach");
  const { id } = await params;
  const athlete = await getAthlete(user.id, id);

  if (!athlete) {
    notFound();
  }

  const defaultValues: AthleteInput = {
    firstName: athlete.firstName,
    lastName: athlete.lastName,
    email: athlete.email,
    phone: athlete.phone ?? "",
    gender: athlete.gender,
    birthDate: athlete.birthDate.slice(0, 10),
    height: String(athlete.height),
    initialWeight: String(athlete.initialWeight),
    goal: athlete.goal,
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit athlete</h1>
      <AthleteForm
        mode="edit"
        athleteId={athlete.id}
        defaultValues={defaultValues}
      />
    </div>
  );
}
