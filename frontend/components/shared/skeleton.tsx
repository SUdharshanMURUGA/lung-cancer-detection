import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse-slow rounded-lg bg-[var(--color-elevated)]", className)}
      aria-hidden="true"
    />
  );
}
