const STEPS = [
  {
    number: "01",
    title: "Upload",
    description: "Drag in a chest CT image (PNG or JPEG). It's validated and previewed instantly.",
  },
  {
    number: "02",
    title: "Preprocess",
    description: "The image is resized to 350×350 and normalized to match the model's training pipeline.",
  },
  {
    number: "03",
    title: "Classify",
    description: "EfficientNet-B0 runs inference and produces a softmax probability across all four classes.",
  },
  {
    number: "04",
    title: "Review",
    description: "You get the top prediction, full confidence breakdown, risk band, and a plain-language explanation.",
  },
] as const;

export function Workflow() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            From image to answer, in four steps
          </h2>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="bg-[var(--color-void)] p-8">
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-signal)]">
                {step.number}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
