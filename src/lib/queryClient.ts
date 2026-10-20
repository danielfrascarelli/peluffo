import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000, retry: 1 } } });
