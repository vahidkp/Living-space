import Link from "next/link";
import { FOOTER_COLUMNS, SHOWROOM, SITE, SOCIAL_LINKS } from "@/lib/site";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { InstagramIcon } from "@/components/ui/Icon";

/**
 * Dark footer: newsletter band → link columns (with the contact details in the
 * brand column) → legal bar.
 *
 * The service-promise row that used to sit between the newsletter and the link
 * columns now renders as `TrustBar`, on the tinted band immediately above this
 * footer.
 *
 * `.on-dark` switches the global focus ring to cream, since the olive ring only
 * reaches 3.17:1 against --color-surface-dark (see the note in globals.css).
 */
const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-surface-dark text-ink-inverse">
      {/* ── Newsletter ─────────────────────────────────────────────────── */}
      <div className="shell border-b border-line-dark py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            {/* Display serif, matching the hero, the section headings and the
                design-service strip. `h2` already carries the serif from the
                base layer, so this only needs the size and colour. */}
            <h2 className="text-2xl text-ink-inverse sm:text-3xl">
              Be the first to know
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-inverse">
              New designs, finished villa projects and the occasional note on
              furnishing a home that fits. No more than twice a month.
            </p>
          </div>
          <div className="lg:justify-self-end lg:pl-8">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* The service-promise row that used to sit here now renders as `TrustBar`
          on the tinted band immediately above this footer. */}

      {/* ── Link columns ───────────────────────────────────────────────── */}
      <div className="shell py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            {/* 44px tall → 238px wide at the lockup's 5.41:1, which still fits
                the narrowest two-column breakpoint (276px at 640). */}
            <Logo tone="inverse" className="h-11" sizes="238px" />
            <p className="mt-5 max-w-xs text-[0.8125rem] leading-relaxed text-muted-inverse">
              Custom-made furniture for villas, homes and projects — majlis,
              sofas, TV units and bed walls, built to your measurements and
              delivered door to door across the UAE.
            </p>

            {/* Contact details. A real <address> element, so assistive tech
                announces it as contact details; `not-italic` because browsers
                italicise it by default and that fights the rest of the footer. */}
            <div className="mt-6">
              <h3 className="eyebrow text-ink-inverse">{SHOWROOM.label}</h3>
              <address className="mt-2.5 text-[0.8125rem] not-italic leading-relaxed text-muted-inverse">
                {SHOWROOM.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                {/* A real tel: link — on a phone this is the difference between
                    a customer calling and a customer copying digits by hand.
                    py-1.5 gives it a 24px+ target (WCAG 2.5.8). */}
                <a
                  href={`tel:${SHOWROOM.phoneHref}`}
                  className="mt-1.5 block py-1.5 transition-colors duration-150 hover:text-ink-inverse"
                >
                  {SHOWROOM.phone}
                </a>
              </address>
            </div>
            {/* Real profiles now, so these are external <a>s with rel/target —
                not Next <Link>s, which are for in-app routes. */}
            <ul className="mt-6 flex items-center gap-1">
              {SOCIAL_LINKS.map(({ label, href }) => {
                const Icon = SOCIAL_ICONS[label];
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${SITE.shortName} on ${label} (opens in a new tab)`}
                      className="flex size-11 items-center justify-center text-muted-inverse transition-colors duration-150 hover:text-ink-inverse"
                    >
                      <Icon size={19} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="eyebrow text-ink-inverse">{column.heading}</h3>
              {/*
                Padding on the anchors rather than gaps between list items: these
                are stacked list links, not links inline in a sentence, so WCAG
                2.5.8's inline exception does not apply and each needs a target of
                at least 24×24. At 13px type the text box alone is 16px tall.
              */}
              <ul className="mt-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-1.5 text-[0.8125rem] text-muted-inverse transition-colors duration-150 hover:text-ink-inverse"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Legal bar ──────────────────────────────────────────────────── */}
      <div className="shell flex flex-col gap-4 border-t border-line-dark py-6 text-[0.75rem] text-muted-inverse sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE.name}. All rights reserved.
        </p>
        <ul className="flex flex-wrap items-center gap-x-6">
          {["Terms of Service", "Privacy Policy", "Refund Policy"].map((label) => (
            <li key={label}>
              <Link
                href="/shop"
                className="block py-1.5 transition-colors duration-150 hover:text-ink-inverse"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
