"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/authentication/actions/session.action";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" size="sm" className="w-full">
        <LogOut />
        Sign out
      </Button>
    </form>
  );
}
