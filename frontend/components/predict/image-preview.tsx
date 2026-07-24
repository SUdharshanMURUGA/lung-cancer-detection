"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  fileName: string;
  onReset: () => void;
  disabled?: boolean;
}

export function ImagePreview({ imageUrl, fileName, onReset, disabled }: ImagePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="relative aspect-square w-full">
        <Image
          src={imageUrl}
          alt={`Preview of uploaded scan: ${fileName}`}
          fill
          unoptimized
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3">
        <p className="truncate text-xs text-[var(--color-ink-faint)]">{fileName}</p>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-signal)] disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}
