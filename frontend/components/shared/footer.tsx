import Link from "next/link";
import { Activity, Github, Mail } from "lucide-react";
import { FOOTER_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-signal)]/10 text-[var(--color-signal)]">
                <Activity className="h-4 w-4" />
              </span>
              {SITE.name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {SITE.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="/contact"
                aria-label="Contact"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="Product" links={FOOTER_LINKS.product} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--color-border)] pt-8 text-xs text-[var(--color-ink-faint)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. For research and educational demonstration only — not a certified medical device.</p>
          <p>Built with Next.js &amp; FastAPI</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-ink)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-signal)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
