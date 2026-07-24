import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ScanField } from "@/components/shared/scan-field";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-muted)]">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[var(--color-signal)]" />
            EfficientNet-B0 · 4-class inference
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
            Read the scan
            <br />
            <span className="gradient-signal-text">before the biopsy.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-ink-muted)]">
            Upload a chest CT image and get an instant, explainable classification
            across four categories — Normal, Adenocarcinoma, Squamous Cell
            Carcinoma, and Large Cell Carcinoma — powered by a fine-tuned
            EfficientNet-B0 model.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/predict"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-signal)] px-6 py-3 text-sm font-semibold text-[var(--color-void)] transition-transform hover:-translate-y-0.5"
            >
              Run a Prediction
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-signal)]"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs text-[var(--color-ink-faint)]">
            <ShieldCheck className="h-4 w-4" />
            Research &amp; educational demonstration — not a certified diagnostic device.
          </div>
        </div>

        <div className="relative">
          <ScanField className="aspect-square w-full" sliceCount={16} />
          <div className="glass-panel absolute -bottom-6 -left-6 hidden rounded-xl px-4 py-3 sm:block">
            <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-ink-faint)]">
              prediction_time
            </p>
            <p className="font-[family-name:var(--font-mono)] text-lg font-semibold text-[var(--color-signal)]">
              0.24s
            </p>
          </div>
          <div className="glass-panel absolute -right-4 -top-4 hidden rounded-xl px-4 py-3 sm:block">
            <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-ink-faint)]">
              confidence
            </p>
            <p className="font-[family-name:var(--font-mono)] text-lg font-semibold text-[var(--color-ink)]">
              98.45%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
