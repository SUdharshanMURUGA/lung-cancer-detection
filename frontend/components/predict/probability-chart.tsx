"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ClassProbability } from "@/types/prediction";

const SHORT_LABELS: Record<string, string> = {
  Normal: "Normal",
  Adenocarcinoma: "Adeno.",
  "Squamous cell carcinoma": "Squamous",
  "Large cell carcinoma": "Large Cell",
};

interface ProbabilityChartProps {
  probabilities: ClassProbability[];
  topClass: string;
}

export function ProbabilityChart({ probabilities, topClass }: ProbabilityChartProps) {
  const data = [...probabilities]
    .sort((a, b) => b.probability - a.probability)
    .map((p) => ({
      name: SHORT_LABELS[p.class_name] ?? p.class_name,
      fullName: p.class_name,
      probability: p.probability,
    }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "var(--color-ink-faint)", fontSize: 11 }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
            unit="%"
          />
          <YAxis
            type="category"
            dataKey="name"
            width={72}
            tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-elevated)" }}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--color-ink)",
            }}
            formatter={(value, _name, item) => [
              `${Number(value).toFixed(2)}%`,
              item?.payload?.fullName ?? "",
            ]}
          />
          <Bar dataKey="probability" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {data.map((entry) => (
              <Cell
                key={entry.fullName}
                fill={entry.fullName === topClass ? "var(--color-signal)" : "var(--color-border-strong)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
