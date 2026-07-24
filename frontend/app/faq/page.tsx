import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Accordion } from "@/components/shared/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about accuracy, privacy, supported files, and clinical use.",
};

const FAQS = [
  {
    question: "Is this a certified medical device?",
    answer:
      "No. This is a research and educational demonstration of applied machine learning. It has not been reviewed or cleared by any regulatory body and must not be used as the basis for a medical decision.",
  },
  {
    question: "How accurate is the model?",
    answer:
      "On the full 315-image held-out test set, the model correctly classified 95.6% of images overall, with per-class recall ranging from 93% to 100%. Accuracy on any individual scan depends heavily on image quality and how closely it resembles the training distribution — always treat a single prediction as one data point, not a verdict.",
  },
  {
    question: "What image formats are supported?",
    answer: "PNG and JPEG images up to 10MB. The image should be a single-slice chest CT scan.",
  },
  {
    question: "What happens to images I upload?",
    answer:
      "Your image is processed in memory to produce a prediction. A small thumbnail and the result are saved to your prediction history so you can review it later; see the Privacy Policy for full details.",
  },
  {
    question: "Why four classes instead of a simple yes/no?",
    answer:
      "Adenocarcinoma, Squamous Cell Carcinoma, and Large Cell Carcinoma are the three most common non-small cell lung cancer subtypes, and they can call for different follow-up. A binary cancer/no-cancer output would throw away information a clinician would actually want.",
  },
  {
    question: "Can I delete a prediction from my history?",
    answer: "Yes. Open the History page and remove any entry individually — the deletion is immediate and permanent.",
  },
  {
    question: "What should I do if I get a high-risk result?",
    answer:
      "Talk to a licensed physician and bring the original scan with you. This tool is meant to inform a conversation with a clinician, not to replace one.",
  },
] as const;

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="Questions" title="Frequently asked questions" />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Accordion items={[...FAQS]} />
      </section>
    </>
  );
}
