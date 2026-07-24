"use client";

import { WifiOff } from "lucide-react";
import { useApiStatus } from "@/hooks/use-api-status";

export function ApiStatusBanner() {
  const { data: isHealthy, isLoading } = useApiStatus();

  if (isLoading || isHealthy !== false) return null;

  return (
    <div className="flex items-center justify-center gap-2 border-b border-[var(--color-amber)]/30 bg-[var(--color-amber)]/10 px-4 py-2 text-xs font-medium text-[var(--color-amber)]">
      <WifiOff className="h-3.5 w-3.5" />
      The prediction service is temporarily unreachable — predictions and history may not load.
    </div>
  );
}
