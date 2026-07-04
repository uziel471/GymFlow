import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/features/authentication/utils/require-role";
import { listAthletes } from "@/features/athletes/services/athlete.service";
import { AthletesTable } from "@/features/athletes/components/athletes-table";

export default async function CoachAthletesPage() {
  const user = await requireRole("coach");
  const athletes = await listAthletes(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Athletes</h1>
        <Link href="/coach/athletes/new" className={cn(buttonVariants())}>
          New athlete
        </Link>
      </div>
      <AthletesTable athletes={athletes} />
    </div>
  );
}
