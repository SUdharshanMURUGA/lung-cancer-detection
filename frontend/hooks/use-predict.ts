import { useMutation, useQueryClient } from "@tanstack/react-query";
import { predictImage } from "@/lib/api-client";
import type { PredictionResponse } from "@/types/prediction";

export function usePredict() {
  const queryClient = useQueryClient();

  return useMutation<PredictionResponse, unknown, File>({
    mutationFn: predictImage,
    onSuccess: () => {
      // A new prediction was saved to history server-side — invalidate
      // so the History page reflects it without a manual refresh.
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
