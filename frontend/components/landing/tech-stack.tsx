const STACK = [
  { category: "Model", items: ["EfficientNet-B0", "TensorFlow", "Keras"] },
  { category: "Backend", items: ["FastAPI", "Pydantic", "SQLAlchemy", "Uvicorn"] },
  { category: "Frontend", items: ["Next.js 15", "React 19", "Tailwind CSS", "Framer Motion"] },
  { category: "Deployment", items: ["Vercel", "Hugging Face Spaces", "Docker"] },
] as const;

export function TechStack() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            The stack underneath
          </h2>
          <p className="mt-4 text-[var(--color-ink-muted)]">
            A conventional, well-supported stack — chosen so the project stays
            maintainable, not to chase novelty.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((group) => (
            <div key={group.category}>
              <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-ink-faint)]">
                {group.category}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-[var(--color-ink)] before:mr-2 before:content-['—'] before:text-[var(--color-ink-faint)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
