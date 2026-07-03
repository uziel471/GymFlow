import { redirect } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/authentication/services/session";
import { ROLE_HOME } from "@/features/authentication/constants/auth.constants";
import {
  signInAsCoach,
  signInAsAthlete,
} from "@/features/authentication/actions/session.action";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROLE_HOME[user.role]);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="bg-card text-card-foreground w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <Dumbbell className="size-6" />
          GymFlow
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Choose a role to preview the app shell. Mock sign-in, no backend yet.
        </p>
        <div className="flex flex-col gap-3">
          <form action={signInAsCoach}>
            <Button type="submit" className="w-full">
              Enter as Coach
            </Button>
          </form>
          <form action={signInAsAthlete}>
            <Button type="submit" variant="outline" className="w-full">
              Enter as Athlete
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
