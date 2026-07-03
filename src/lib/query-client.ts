import { QueryClient, isServer } from "@tanstack/react-query";

/**
 * Creates a QueryClient with shared defaults.
 * staleTime > 0 avoids immediate refetching after server-side hydration.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Server: always a fresh client per request.
 * Browser: a single reused client (kept across re-renders).
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
