"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = React.useState<SubmitState>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Request failed");
      setState("success");
      reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-ink)]">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-signal)]"
          placeholder="Jane Doe"
        />
        {errors.name && <p className="mt-1.5 text-xs text-[var(--color-rose)]">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-signal)]"
          placeholder="jane@example.com"
        />
        {errors.email && <p className="mt-1.5 text-xs text-[var(--color-rose)]">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-[var(--color-ink)]">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="mt-2 w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-signal)]"
          placeholder="What would you like to ask?"
        />
        {errors.message && <p className="mt-1.5 text-xs text-[var(--color-rose)]">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-signal)] px-6 py-3 text-sm font-semibold text-[var(--color-void)] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {state === "submitting" ? "Sending..." : "Send message"}
      </button>

      {state === "success" && (
        <p className="flex items-center gap-2 text-sm text-[var(--color-signal)]">
          <CheckCircle2 className="h-4 w-4" /> Message sent. We&apos;ll get back to you soon.
        </p>
      )}
      {state === "error" && (
        <p className="flex items-center gap-2 text-sm text-[var(--color-rose)]">
          <AlertCircle className="h-4 w-4" /> Something went wrong. Please try again shortly.
        </p>
      )}
    </form>
  );
}
