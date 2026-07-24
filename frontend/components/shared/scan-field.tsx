import { cn } from "@/lib/utils";

interface ScanFieldProps {
  className?: string;
  sliceCount?: number;
}

/**
 * The site's signature visual: a grid of horizontal "slice" lines with a
 * bright scan-band sweeping down through them, evoking a CT scanner
 * stepping through cross-sections. Pure CSS/SVG — no images required.
 * Reused in the hero and (Phase 4) the prediction loading state.
 */
export function ScanField({ className, sliceCount = 14 }: ScanFieldProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid-fade-mask">
        {Array.from({ length: sliceCount }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-[var(--color-border-strong)]"
            style={{ top: `${(i / sliceCount) * 100}%` }}
          />
        ))}
      </div>
      <div
        className="animate-scan-sweep absolute left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-signal) 22%, transparent) 45%, color-mix(in srgb, var(--color-signal) 40%, transparent) 50%, color-mix(in srgb, var(--color-signal) 22%, transparent) 55%, transparent)",
        }}
      />
      <div
        className="animate-scan-sweep absolute left-0 right-0 h-px bg-[var(--color-signal)]"
        style={{ boxShadow: "0 0 12px 1px var(--color-signal)" }}
      />
    </div>
  );
}
