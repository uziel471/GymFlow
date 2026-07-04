import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { AthleteDTO } from "@/features/athletes/types/athlete.types";
import { DeactivateAthleteButton } from "@/features/athletes/components/deactivate-athlete-button";

function StatusBadge({ status }: { status: AthleteDTO["status"] }) {
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

export function AthletesTable({ athletes }: { athletes: AthleteDTO[] }) {
  if (athletes.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
        No athletes yet. Create your first one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground border-b text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Goal</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">
                {athlete.firstName} {athlete.lastName}
              </td>
              <td className="text-muted-foreground px-4 py-3">
                {athlete.email}
              </td>
              <td className="text-muted-foreground px-4 py-3 capitalize">
                {athlete.goal.replace(/_/g, " ")}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={athlete.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/coach/athletes/${athlete.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                    )}
                  >
                    Edit
                  </Link>
                  {athlete.status === "active" ? (
                    <DeactivateAthleteButton
                      athleteId={athlete.id}
                      athleteName={`${athlete.firstName} ${athlete.lastName}`}
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
