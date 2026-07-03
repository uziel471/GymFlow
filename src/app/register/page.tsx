import Link from "next/link";
import { redirect } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { getCurrentUser } from "@/features/authentication/services/session";
import {
  ROLE_HOME,
  LOGIN_PATH,
} from "@/features/authentication/constants/auth.constants";
import { RegisterForm } from "@/features/authentication/components/register-form";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROLE_HOME[user.role]);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-xl border p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <Dumbbell className="size-6" />
          GymFlow
        </div>
        <h1 className="mb-1 text-xl font-semibold tracking-tight">
          Create your coach account
        </h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Set up your account to start managing athletes and programs.
        </p>
        <RegisterForm />
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href={LOGIN_PATH} className="font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
