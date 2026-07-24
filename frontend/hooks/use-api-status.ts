import { useQuery } from "@tanstack/react-query";
import { checkApiHealth } from "@/lib/api-client";

/**
 * Polls the backend's /health endpoint so the UI can surface a clear
 * "the prediction service is unreachable" state instead of letting every
 * individual request fail with a generic network error.
 */
export function useApiStatus() {
  return useQuery({
    queryKey: ["api-status"],
    queryFn: checkApiHealth,
    refetchInterval: 60_000,
    retry: false,
    staleTime: 30_000,
  });
}
