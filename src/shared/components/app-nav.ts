import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Dumbbell,
  CalendarDays,
  History,
} from "lucide-react";
import type { AppRole, NavItem } from "@/shared/types/navigation.types";

const COACH_NAV: NavItem[] = [
  { href: "/coach/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/coach/athletes", label: "Athletes", icon: Users },
  { href: "/coach/programs", label: "Programs", icon: ClipboardList },
  { href: "/coach/exercises", label: "Exercises", icon: Dumbbell },
];

const ATHLETE_NAV: NavItem[] = [
  { href: "/athlete/dashboard", label: "Today", icon: CalendarDays },
  { href: "/athlete/history", label: "History", icon: History },
];

export function getNavForRole(role: AppRole): NavItem[] {
  return role === "coach" ? COACH_NAV : ATHLETE_NAV;
}
