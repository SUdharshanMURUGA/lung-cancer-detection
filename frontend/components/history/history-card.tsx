"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { HistoryItem } from "@/types/prediction";

const RISK_TEXT: Record<string, string> = {
  Low: "text-[var(--color-signal)]",
  Elevated: "text-[var(--color-amber)]",
  High: "text-[var(--color-rose)]",
  Uncertain: "text-[var(--color-ink-muted)]",
};

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function HistoryCard({ item, onDelete, isDeleting }: HistoryCardProps) {
  const date = new Date(item.created_at);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-elevated)]">
        <Image src={item.image_data_url} alt={item.filename} fill unoptimized className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
          {item.class_name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-ink-faint)]">
          <span className="font-[family-name:var(--font-mono)]">{item.confidence.toFixed(2)}%</span>
          <span className={RISK_TEXT[item.risk_level] ?? RISK_TEXT.Uncertain}>{item.risk_level} risk</span>
          <span>{date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        disabled={isDeleting}
        aria-label={`Delete prediction for ${item.filename}`}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-rose)] hover:text-[var(--color-rose)] disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
