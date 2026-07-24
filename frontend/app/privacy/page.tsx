import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What data this application collects, why, and how to remove it.",
};

const SECTIONS = [
  {
    title: "What we collect",
    body: "When you submit a CT image for prediction, the image is processed in memory to generate a classification. A compressed thumbnail of the image, the predicted class, the confidence score, and a timestamp are saved to your prediction history. The contact form collects the name, email, and message you provide.",
  },
  {
    title: "What we don't collect",
    body: "We do not require an account, do not use third-party advertising trackers, and do not sell or share your data with advertisers. See our product-wide policy: this application does not display ads and does not let advertisers influence its output.",
  },
  {
    title: "How prediction history is stored",
    body: "History entries are stored in a database on the backend service. You can view and permanently delete any entry from the History page at any time.",
  },
  {
    title: "Medical disclaimer",
    body: "This application is a research and educational demonstration. It is not a certified medical device, has not been evaluated by any regulatory authority, and must not be used as the sole basis for a medical decision. Always consult a licensed physician.",
  },
  {
    title: "Contact form data",
    body: "Messages submitted through the contact form are sent via email to the site operator and are not published or shared with third parties.",
  },
  {
    title: "Changes to this policy",
    body: "This policy may be updated as the application evolves. Material changes will be reflected on this page with an updated revision date.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Last updated: July 2026" />
      <section className="mx-auto max-w-3xl space-y-10 px-6 py-20">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
              {section.title}
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-ink-muted)]">{section.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
