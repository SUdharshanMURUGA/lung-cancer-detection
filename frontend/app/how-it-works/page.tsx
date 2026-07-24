import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ScanField } from "@/components/shared/scan-field";

export const metadata: Metadata = {
  title: "How It Works",
  description: "A plain-language walkthrough of how the classifier reads a CT image.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plain-language explainer"
        title="How the model actually reads a scan"
      />

      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="space-y-5 text-[var(--color-ink-muted)]">
          <p className="leading-relaxed">
            A CT scan is, to a computer, just a grid of numbers — one value
            per pixel describing tissue density at that point. EfficientNet-B0
            was trained on thousands of these grids, each labeled by its
            diagnosis, and gradually learned which patterns of light and dark
            regions tend to co-occur with each class.
          </p>
          <p className="leading-relaxed">
            Early layers in the network detect simple patterns — edges,
            textures, density gradients. Deeper layers combine those into
            more abstract shapes: nodules, irregular masses, tissue
            boundaries. The final layer converts everything the network has
            noticed into four probabilities that sum to 100%.
          </p>
          <p className="leading-relaxed">
            The class with the highest probability becomes the prediction, and
            the probability itself becomes the confidence score you see on the
            results page. A close call — say, 55% vs. 40% — is shown plainly,
            not hidden behind a single &quot;answer.&quot;
          </p>
        </div>
        <ScanField className="aspect-[4/5] w-full" sliceCount={20} />
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            What the model is — and isn&apos;t — doing
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-signal)]">
                It is
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                <li>Pattern-matching against thousands of prior labeled scans</li>
                <li>A statistical estimate, expressed as a probability</li>
                <li>Consistent — the same image always yields the same result</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-amber)]">
                It isn&apos;t
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                <li>A clinical diagnosis or a replacement for a radiologist</li>
                <li>Aware of your medical history or other test results</li>
                <li>Certain — every prediction carries a margin of error</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
