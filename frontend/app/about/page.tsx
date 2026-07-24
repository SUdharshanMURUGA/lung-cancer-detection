import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ShieldAlert, Target, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why this project exists, what problem it addresses, and the limits of what it can responsibly claim.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the project"
        title="A focused tool for a specific question"
        description="Not a diagnostic platform — a demonstration of how a trained classifier can turn a CT image into a clear, explainable second opinion."
      />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="space-y-6 text-[var(--color-ink-muted)]">
          <p className="leading-relaxed">
            Lung cancer is most treatable when caught early, but reading chest
            CT scans for early indicators takes trained radiologists time that
            is often in short supply. This project explores whether a
            convolutional model, trained on labeled CT images, can flag the
            four most common categories — Normal tissue, Adenocarcinoma,
            Squamous Cell Carcinoma, and Large Cell Carcinoma — quickly enough
            to be useful as a triage aid.
          </p>
          <p className="leading-relaxed">
            The model itself is a fine-tuned EfficientNet-B0, a compact
            convolutional architecture chosen for a good balance between
            accuracy and inference speed. It was trained separately from this
            application; the web app you&apos;re using performs inference only.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <InfoCard
            icon={Target}
            title="Purpose"
            body="Give a fast, explainable second read on a CT image — never a final answer on its own."
          />
          <InfoCard
            icon={Users}
            title="Audience"
            body="Built as a portfolio-grade demonstration for reviewers, students, and clinicians curious about applied ML."
          />
          <InfoCard
            icon={ShieldAlert}
            title="Limits"
            body="Not FDA-cleared, not validated for clinical use, and not a substitute for a radiologist or biopsy."
          />
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <Icon className="h-5 w-5 text-[var(--color-signal)]" />
      <h3 className="mt-4 font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
    </div>
  );
}
