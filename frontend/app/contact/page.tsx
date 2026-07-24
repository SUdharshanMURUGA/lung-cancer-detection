import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions, feedback, or collaboration inquiries — get in touch.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Get in touch" title="Questions or feedback?" />
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
            Let&apos;s talk
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Whether it&apos;s a bug report, a question about the model, or a
            collaboration idea, we read every message.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-[var(--color-signal)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">Email</p>
                <p className="text-sm text-[var(--color-ink-muted)]">Use the form — routed directly to our inbox</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[var(--color-signal)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">Availability</p>
                <p className="text-sm text-[var(--color-ink-muted)]">Typical response time: 1–2 business days</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:col-span-3">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
