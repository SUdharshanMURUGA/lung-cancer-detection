import { Scan, Gauge, LineChart, History } from "lucide-react";

const FEATURES = [
  {
    icon: Scan,
    title: "Four-class classification",
    description:
      "Distinguishes Normal tissue from three non-small cell lung cancer subtypes: Adenocarcinoma, Squamous Cell Carcinoma, and Large Cell Carcinoma.",
  },
  {
    icon: Gauge,
    title: "Sub-second inference",
    description:
      "The model is loaded once and kept warm in memory, so predictions typically return in well under a second.",
  },
  {
    icon: LineChart,
    title: "Full probability breakdown",
    description:
      "See the confidence score for every class, not just the top prediction — useful when a scan sits close to a decision boundary.",
  },
  {
    icon: History,
    title: "Prediction history",
    description:
      "Every scan you analyze is saved to your history, so you can revisit or remove past predictions at any time.",
  },
] as const;

export function FeatureCards() {
  return (
    <section className="border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Built for a single job, done precisely
          </h2>
          <p className="mt-4 text-[var(--color-ink-muted)]">
            No dashboards to configure, no unrelated tooling — just a focused
            pipeline from CT image to classification.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-signal)]/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-signal)]/10 text-[var(--color-signal)]">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-ink)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
