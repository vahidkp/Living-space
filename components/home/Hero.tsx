import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Full-bleed homepage hero (PRD §5.4: 70–85vh, serif headline, single outline
 * CTA), with the reference's left-aligned copy placement.
 *
 * This holds the ONLY `priority` image on the homepage — it is the LCP element.
 *
 * PLACEHOLDER IMAGE: `hero.jpg` is a free-licence stock photo (see
 * `public/images/stock/CREDITS.md`), standing in until the business supplies
 * photography of its own work. It is not a Living Space interior, so the alt
 * text describes the room without claiming it. Replace it with a wide (≥2400px)
 * shot of a finished villa project, and keep the calmer side on the left where
 * the headline sits.
 *
 * Height is capped in `vh` but also floored in `rem`, so a short landscape phone
 * viewport can't crush the headline into the CTA.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[30rem] items-end overflow-hidden bg-bg-alt h-[76vh] max-h-[46rem] sm:items-center">
      <Image
        src="/images/stock/hero.jpg"
        alt="HERO_ALT"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/*
        Scrim. Two elements rather than one with a `sm:` variant, because the
        scrim classes are plain component classes — Tailwind does not generate
        breakpoint variants for them, so `sm:scrim-full` would silently no-op.
        Mobile: gradient from the bottom, where the copy sits. Desktop: an even
        wash, since the copy is vertically centred over the image.
      */}
      <div className="scrim-bottom absolute inset-0 sm:hidden" aria-hidden="true" />
      <div className="scrim-full absolute inset-0 hidden sm:block" aria-hidden="true" />

      <div className="on-dark shell relative z-10 pb-12 sm:pb-0">
        <div className="max-w-xl">
          <p className="eyebrow text-ink-inverse/85">Custom-made furniture · UAE</p>
          <h1 className="mt-4 text-ink-inverse">Made to measure for the way you live</h1>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-inverse/90">
            Majlis, sofas, TV units and bed walls — built to your size, fabric and
            finish, for villas and homes across the Emirates.
          </p>
          <ButtonLink
            href="/shop"
            variant="outline-inverse"
            size="lg"
            className="mt-8"
          >
            Explore the collection
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
