"use client";

import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { HistoryCard } from "@/components/history/history-card";
import { HistorySkeleton } from "@/components/history/history-skeleton";
import { EmptyHistory } from "@/components/history/empty-history";
import { useDeleteHistoryItem, useHistory } from "@/hooks/use-history";
import { getApiErrorMessage } from "@/lib/api-client";

export default function HistoryPage() {
  const { data, isLoading, isError, error, refetch } = useHistory();
  const deleteMutation = useDeleteHistoryItem();

  return (
    <>
      <PageHeader
        eyebrow="History"
        title="Your prediction history"
        description="Every scan you've analyzed, saved so you can revisit it later."
      />

      <section className="mx-auto max-w-2xl px-6 py-16">
        {isLoading && <HistorySkeleton />}

        {isError && (
          <div className="flex items-start gap-3 rounded-xl border border-[var(--color-rose)]/30 bg-[var(--color-rose)]/5 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-rose)]" />
            <div>
              <p className="text-sm font-medium text-[var(--color-rose)]">Couldn&apos;t load history</p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{getApiErrorMessage(error)}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-sm font-medium text-[var(--color-signal)] hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {data && data.items.length === 0 && <EmptyHistory />}

        {data && data.items.length > 0 && (
          <div className="space-y-3">
            {data.items.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === item.id}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
