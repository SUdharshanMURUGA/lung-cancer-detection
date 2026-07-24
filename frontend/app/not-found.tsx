import Link from "next/link";
import { ScanField } from "@/components/shared/scan-field";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <ScanField className="mb-10 h-40 w-full max-w-sm" sliceCount={10} />
      <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-signal)]">404</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
        No match found for this scan
      </h1>
      <p className="mt-4 max-w-md text-[var(--color-ink-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to solid ground.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[var(--color-signal)] px-6 py-3 text-sm font-semibold text-[var(--color-void)] transition-opacity hover:opacity-90"
      >
        Return home
      </Link>
    </section>
  );
}
