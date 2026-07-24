"use client";

import * as React from "react";
import { UploadCloud, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validations";

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  error?: string | null;
}

export function Dropzone({ onFileSelected, disabled, error }: DropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function validateAndEmit(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      onFileSelected(file); // let the parent surface the validation error via zod
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      onFileSelected(file);
      return;
    }
    onFileSelected(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndEmit(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a CT scan image"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors",
          isDragging
            ? "border-[var(--color-signal)] bg-[var(--color-signal)]/5"
            : "border-[var(--color-border-strong)] bg-[var(--color-surface)]",
          disabled && "cursor-not-allowed opacity-60",
          error && "border-[var(--color-rose)]"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => validateAndEmit(e.target.files?.[0])}
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-[var(--color-signal)]">
          {isDragging ? <ImageIcon className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
        </div>
        <p className="mt-4 font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
          Drag and drop a CT scan image
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          or click to browse — PNG or JPEG, up to 10MB
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-[var(--color-rose)]">{error}</p>}
    </div>
  );
}
