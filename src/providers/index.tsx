import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";

/**
 * Composes all application-level providers.
 * Add future client providers (theme, etc.) here.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
