import type { LucideIcon } from "lucide-react";

export type AppRole = "coach" | "athlete";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}
