"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-rose)]/10 text-[var(--color-rose)]">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        An unexpected error occurred while rendering this page. This has been
        logged — try again, or head back to the homepage.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 flex items-center gap-2 rounded-full bg-[var(--color-signal)] px-6 py-3 text-sm font-semibold text-[var(--color-void)] transition-opacity hover:opacity-90"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
