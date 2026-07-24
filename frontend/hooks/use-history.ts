import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteHistoryItem, fetchHistory } from "@/lib/api-client";

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
  });
}

export function useDeleteHistoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHistoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
