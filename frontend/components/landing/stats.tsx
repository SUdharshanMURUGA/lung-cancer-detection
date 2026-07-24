const STATS = [
  { value: "95.6%", label: "Full test-set accuracy (n=315)" },
  { value: "350×350", label: "Model input resolution" },
  { value: "4", label: "Diagnostic classes" },
  { value: "~200ms", label: "Mean inference time" },
] as const;

export function Stats() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center md:text-left">
            <p className="font-[family-name:var(--font-mono)] text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
