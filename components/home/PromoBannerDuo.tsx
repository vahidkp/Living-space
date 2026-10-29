import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

type DuoPanel = {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
};

/**
 * Two large lifestyle panels side by side, each with an overlay label and CTA
 * (PRD §8.1.7 — "The Finishing Touches" / "Made to Be Lived In").
 *
 * The whole panel is a link, and the visible button inside it is rendered as a
 * plain span rather than a nested anchor — an <a> inside an <a> is invalid HTML
 * and browsers recover from it unpredictably.
 */
export function PromoBannerDuo({ panels }: { panels: [DuoPanel, DuoPanel] }) {
  return (
    <section className="shell" data-reveal="pending">
      <h2 className="sr-only">Featured collections</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {panels.map((panel) => (
          <Link
            key={panel.title}
            href={panel.href}
            className="group/duo relative block overflow-hidden rounded-sm"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/2] md:aspect-[4/5] lg:aspect-[3/2]">
              <Image
                src={panel.image}
                alt={panel.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 ease-out group-hover/duo:scale-[1.04]"
              />
              <div className="scrim-bottom absolute inset-0" aria-hidden="true" />

              <div className="on-dark absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <p className="eyebrow text-ink-inverse/80">{panel.eyebrow}</p>
                <h3 className="display-caps mt-2.5 max-w-[18ch] text-lg text-ink-inverse sm:text-xl lg:text-2xl">
                  {panel.title}
                </h3>
                <span className="mt-5 inline-flex items-center justify-center rounded-sm border border-ink-inverse/70 px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] leading-none text-ink-inverse transition-colors duration-150 group-hover/duo:bg-ink-inverse group-hover/duo:text-ink">
                  {panel.linkLabel}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Full-bleed dark callout — the reference's VIP / design-service strip
 * (PRD §8.1.8). Copy on the left, a single image bleeding off the right edge.
 *
 * THE IMAGE MUST REACH THE VIEWPORT EDGE. Previously the whole section sat
 * inside `.shell`, so on a viewport wider than the 1440px max-width the image
 * stopped short and left a black band down the right-hand side — fine at 1440,
 * visibly unfinished at 1680+.
 *
 * The fix keeps the copy inside `.shell` (so it stays aligned with every other
 * section on the page) and positions the image absolutely from the section's
 * horizontal midpoint to its right edge. Because the section itself is
 * full-bleed, "right edge" is the viewport edge at any width. Section height is
 * then driven by the copy, which is why a min-height guards against a short
 * column leaving the image letterboxed.
 *
 * Below `lg` the image returns to normal flow and stacks above the copy.
 */
export function DarkPromoStrip({
  eyebrow,
  title,
  body,
  href,
  linkLabel,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section
      className="on-dark relative bg-surface-dark lg:min-h-[30rem]"
      data-reveal="pending"
    >
      {/* Image: in normal flow and stacked on top below lg; from the section's
          midpoint to the viewport's right edge from lg up. */}
      <div className="relative aspect-[4/3] lg:absolute lg:inset-y-0 lg:left-1/2 lg:right-0 lg:aspect-auto">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Copy stays inside the shell so its left edge lines up with every other
          section, and is capped at half-width so it never runs under the image. */}
      <div className="shell relative">
        <div className="flex flex-col justify-center py-12 lg:min-h-[30rem] lg:w-1/2 lg:py-20 lg:pr-16">
          <p className="eyebrow text-muted-inverse">{eyebrow}</p>
          <h2 className="mt-4 text-ink-inverse">{title}</h2>
          <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-muted-inverse">
            {body}
          </p>
          <ButtonLink
            href={href}
            variant="outline-inverse"
            size="lg"
            className="mt-8 w-fit"
          >
            {linkLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
