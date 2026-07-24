import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Technology",
  description: "The model architecture, preprocessing pipeline, and stack behind the classifier.",
};

const SPECS = [
  { label: "Architecture", value: "EfficientNet-B0 (convolutional, compound-scaled)" },
  { label: "Input resolution", value: "350 × 350 × 3" },
  { label: "Output", value: "4-way softmax" },
  { label: "Classes", value: "Normal, Adenocarcinoma, Squamous Cell Carcinoma, Large Cell Carcinoma" },
  { label: "Preprocessing", value: "Resize → RGB conversion → scale to [0, 1]" },
  { label: "Serving", value: "FastAPI, model loaded once at startup and kept warm" },
] as const;

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Under the hood"
        title="The model and the pipeline around it"
        description="A compact CNN, a thin preprocessing layer, and a stateless inference API — nothing more than the task requires."
      />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
          Why EfficientNet-B0
        </h2>
        <p className="mt-4 leading-relaxed text-[var(--color-ink-muted)]">
          EfficientNet-B0 scales network depth, width, and resolution together
          using a fixed compound coefficient, rather than tuning each
          dimension by hand. For a four-class medical imaging task with a
          moderate-sized training set, it offers strong accuracy without the
          parameter count — and inference cost — of larger backbones like
          ResNet-152 or a full EfficientNet-B7.
        </p>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
          Model specification
        </h2>
        <div className="mt-6 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)]">
          {SPECS.map((spec) => (
            <div key={spec.label} className="grid gap-1 bg-[var(--color-surface)] px-6 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-[var(--color-ink-faint)]">{spec.label}</dt>
              <dd className="text-sm text-[var(--color-ink)] sm:col-span-2">{spec.value}</dd>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
          Inference pipeline
        </h2>
        <ol className="mt-6 space-y-4">
          {[
            "Client uploads a PNG/JPEG image via the Prediction page.",
            "FastAPI validates the file type and size before touching it.",
            "The image is decoded, converted to RGB, and resized to 350×350.",
            "Pixel values are scaled to the [0, 1] range the model was trained on.",
            "The EfficientNet-B0 model produces a 4-way softmax distribution.",
            "The API returns the top class, confidence, full probability breakdown, and a coarse risk band.",
          ].map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-signal)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
