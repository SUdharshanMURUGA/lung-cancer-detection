interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-signal)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
