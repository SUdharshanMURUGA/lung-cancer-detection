import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { ProbabilityChart } from "@/components/predict/probability-chart";
import type { PredictionResponse } from "@/types/prediction";

const RISK_STYLES: Record<string, { text: string; bg: string; icon: typeof CheckCircle2 }> = {
  Low: { text: "text-[var(--color-signal)]", bg: "bg-[var(--color-signal)]/10", icon: CheckCircle2 },
  Elevated: { text: "text-[var(--color-amber)]", bg: "bg-[var(--color-amber)]/10", icon: AlertTriangle },
  High: { text: "text-[var(--color-rose)]", bg: "bg-[var(--color-rose)]/10", icon: AlertTriangle },
  Uncertain: { text: "text-[var(--color-ink-muted)]", bg: "bg-[var(--color-elevated)]", icon: AlertTriangle },
};

export function ResultCard({ result }: { result: PredictionResponse }) {
  const riskStyle = RISK_STYLES[result.risk_level] ?? RISK_STYLES.Uncertain;
  const RiskIcon = riskStyle.icon;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-ink-faint)]">
            Prediction
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
            {result.class}
          </h2>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${riskStyle.bg} ${riskStyle.text}`}>
          <RiskIcon className="h-4 w-4" />
          {result.risk_level} risk
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricTile
          icon={TrendingUp}
          label="Confidence"
          value={`${result.confidence.toFixed(2)}%`}
        />
        <MetricTile icon={Clock} label="Inference time" value={result.prediction_time} />
      </div>

      <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {result.description}
      </p>

      <div className="mt-8">
        <p className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-ink)]">
          Full probability breakdown
        </p>
        <ProbabilityChart probabilities={result.probabilities} topClass={result.class} />
      </div>

      <p className="mt-6 border-t border-[var(--color-border)] pt-4 text-xs leading-relaxed text-[var(--color-ink-faint)]">
        This is an AI-generated estimate for research and educational purposes
        only. It is not a medical diagnosis — consult a licensed physician for
        any health concern.
      </p>
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-4">
      <Icon className="h-4 w-4 text-[var(--color-signal)]" />
      <p className="mt-2 font-[family-name:var(--font-mono)] text-lg font-semibold text-[var(--color-ink)]">
        {value}
      </p>
      <p className="text-xs text-[var(--color-ink-faint)]">{label}</p>
    </div>
  );
}
