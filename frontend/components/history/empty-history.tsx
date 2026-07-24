import Link from "next/link";
import { History } from "lucide-react";

export function EmptyHistory() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--color-border-strong)] px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-[var(--color-signal)]">
        <History className="h-6 w-6" />
      </div>
      <p className="mt-4 font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
        No predictions yet
      </p>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-ink-muted)]">
        Run your first prediction and it will show up here.
      </p>
      <Link
        href="/predict"
        className="mt-6 rounded-full bg-[var(--color-signal)] px-5 py-2.5 text-sm font-semibold text-[var(--color-void)] transition-opacity hover:opacity-90"
      >
        Run a prediction
      </Link>
    </div>
  );
}
