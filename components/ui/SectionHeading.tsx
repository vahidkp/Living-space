import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section header used across the homepage and shop page.
 *
 * The two-tone title (`title` in ink, `titleMuted` continuing in a lighter
 * weight) reproduces the reference's "Shop by category. 40% off everything"
 * treatment — one sentence, two emphases, a single heading element.
 *
 * `as` exists so heading level follows document structure rather than font size:
 * an h2 inside a page that already has an h1, an h3 where nested. The
 * accessibility-audit skill requires no skipped levels.
 */
export function SectionHeading({
  eyebrow,
  title,
  titleMuted,
  href,
  linkLabel = "View all",
  actions,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  titleMuted?: string;
  href?: string;
  linkLabel?: string;
  actions?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-6 gap-y-3",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2.5 text-muted">{eyebrow}</p>}
        <Tag className="text-balance">
          {title}
          {titleMuted && <span className="text-muted"> {titleMuted}</span>}
        </Tag>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {href && (
          <Link
            href={href}
            // A standalone CTA, not a link inline in prose, so it needs a
            // 24×24 minimum target (WCAG 2.5.8) — py-1.5 gets it to 33px.
            className="block py-1.5 text-[0.8125rem] text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-ink"
          >
            {linkLabel}
          </Link>
        )}
        {actions}
      </div>
    </div>
  );
}
