import { ScanField } from "@/components/shared/scan-field";

export function AnalyzingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
      <ScanField className="h-32 w-full max-w-xs" sliceCount={10} />
      <p className="mt-6 font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
        Analyzing scan
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Running inference through EfficientNet-B0…
      </p>
    </div>
  );
}
