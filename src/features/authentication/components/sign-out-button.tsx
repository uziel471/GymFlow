"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/authentication/actions/auth.action";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm" className="w-full">
        <LogOut />
        Sign out
      </Button>
    </form>
  );
}
