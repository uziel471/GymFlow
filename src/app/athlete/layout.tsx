import type { ReactNode } from "react";
import { requireRole } from "@/features/authentication/utils/require-role";
import { SignOutButton } from "@/features/authentication/components/sign-out-button";
import { AppShell } from "@/shared/components/app-shell";

export default async function AthleteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole("athlete");

  return (
    <AppShell role={user.role} userName={user.name} footer={<SignOutButton />}>
      {children}
    </AppShell>
  );
}
