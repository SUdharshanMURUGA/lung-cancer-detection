"use client";

import * as React from "react";
import { AlertCircle, UploadCloud } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Dropzone } from "@/components/predict/dropzone";
import { ImagePreview } from "@/components/predict/image-preview";
import { AnalyzingState } from "@/components/predict/analyzing-state";
import { ResultCard } from "@/components/predict/result-card";
import { usePredict } from "@/hooks/use-predict";
import { getApiErrorMessage } from "@/lib/api-client";
import { predictImageSchema } from "@/lib/validations";

export default function PredictPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const { mutate, data: result, error, isPending, reset } = usePredict();

  function handleFileSelected(selected: File) {
    const parsed = predictImageSchema.safeParse(selected);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Invalid file.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setValidationError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    reset();
  }

  function handleReset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    reset();
  }

  function handleAnalyze() {
    if (!file) return;
    mutate(file);
  }

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Prediction"
        title="Upload a CT scan"
        description="Get an instant classification with a full confidence breakdown across all four classes."
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        {!previewUrl && <Dropzone onFileSelected={handleFileSelected} error={validationError} />}

        {previewUrl && file && (
          <div className="space-y-6">
            <ImagePreview imageUrl={previewUrl} fileName={file.name} onReset={handleReset} disabled={isPending} />

            {!result && !isPending && (
              <button
                type="button"
                onClick={handleAnalyze}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-signal)] px-6 py-3.5 text-sm font-semibold text-[var(--color-void)] transition-opacity hover:opacity-90"
              >
                <UploadCloud className="h-4 w-4" />
                Analyze scan
              </button>
            )}

            {isPending && <AnalyzingState />}

            {error !== null && !isPending && (
              <div className="flex items-start gap-3 rounded-xl border border-[var(--color-rose)]/30 bg-[var(--color-rose)]/5 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-rose)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-rose)]">Prediction failed</p>
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{getApiErrorMessage(error)}</p>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="mt-3 text-sm font-medium text-[var(--color-signal)] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <ResultCard result={result} />
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-signal)]"
                >
                  Upload another image
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
