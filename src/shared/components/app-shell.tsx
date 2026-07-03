"use client";

import { useState, type ReactNode } from "react";
import { Menu, X, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/shared/components/sidebar-nav";
import { getNavForRole } from "@/shared/components/app-nav";
import type { AppRole } from "@/shared/types/navigation.types";

interface AppShellProps {
  role: AppRole;
  userName: string;
  /** Rendered at the bottom of the sidebar (e.g. a sign-out control). */
  footer?: ReactNode;
  children: ReactNode;
}

export function AppShell({ role, userName, footer, children }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const nav = getNavForRole(role);
  const roleLabel = role === "coach" ? "Coach" : "Athlete";

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "border-sidebar-border bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center gap-2 px-4 text-base font-semibold">
          <Dumbbell className="size-5" />
          GymFlow
        </div>
        <div className="text-sidebar-foreground/50 px-4 pb-2 text-xs tracking-wide uppercase">
          {roleLabel}
        </div>
        <SidebarNav items={nav} onNavigate={() => setOpen(false)} />
        <div className="border-sidebar-border mt-auto border-t p-3">
          <div className="mb-2 px-1 text-sm font-medium">{userName}</div>
          {footer}
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
          <span className="font-medium">{roleLabel} area</span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
