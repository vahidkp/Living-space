import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Half image, half copy (PRD §8.1.5). `reverse` flips the image to the right so
 * consecutive uses of this component alternate down the page.
 *
 * On mobile it stacks image-above-text. `order` classes rather than
 * `flex-direction` keep the DOM order constant, so the reading order for
 * assistive tech is the same at every breakpoint.
 */
export function PromoBannerSplit({
  eyebrow,
  title,
  body,
  href,
  linkLabel,
  image,
  imageAlt,
  reverse = false,
  tinted = true,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  tinted?: boolean;
}) {
  return (
    <section className="shell" data-reveal="pending">
      <div
        className={cn(
          "grid overflow-hidden rounded-sm lg:grid-cols-2",
          tinted && "bg-bg-alt",
        )}
      >
        <div className={cn("relative aspect-[4/3] lg:aspect-auto lg:min-h-[30rem]", reverse && "lg:order-2")}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div
          className={cn(
            "flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16",
            reverse && "lg:order-1",
          )}
        >
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="mt-4 max-w-md">{title}</h2>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
            {body}
          </p>
          <Link
            href={href}
            className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-ink underline decoration-line underline-offset-[6px] transition-colors duration-150 hover:decoration-ink"
          >
            {linkLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
