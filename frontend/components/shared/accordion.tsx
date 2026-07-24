"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemData {
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="bg-[var(--color-surface)]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-[var(--color-ink)]">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-[var(--color-ink-faint)] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
