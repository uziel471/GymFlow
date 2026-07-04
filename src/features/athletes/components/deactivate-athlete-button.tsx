"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deactivateAthleteAction } from "@/features/athletes/actions/athlete.action";

export function DeactivateAthleteButton({
  athleteId,
  athleteName,
}: {
  athleteId: string;
  athleteName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (!window.confirm(`Deactivate ${athleteName}?`)) {
      return;
    }
    startTransition(async () => {
      const result = await deactivateAthleteAction(athleteId);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={onClick}
      >
        {isPending ? "..." : "Deactivate"}
      </Button>
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
    </div>
  );
}
