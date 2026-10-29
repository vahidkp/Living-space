import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/**
 * Brand lockup, from the supplied artwork (`IMG-20261027-WA0002.jpg`).
 *
 * The artwork is a STACKED lockup — gold triangle with the LS monogram above
 * "LIVING SPACE" / "FURNITURE" — at roughly 1.35:1. In a 40px header that puts
 * the wordmark at about 5px tall, so these files re-arrange the same two pieces
 * side by side: mark on the left, the original two-line text block on the
 * right, at 5.41:1. Nothing was redrawn. See `public/brand/README.md`.
 *
 * `tone="inverse"` swaps to the footer treatment, and `tone="ink"` is not the
 * raw artwork either. The source gold measures only 1.52:1 on the cream page —
 * the triangle and "FURNITURE" all but vanish — so the light-surface file uses
 * the same hue darkened to #9D812C (3.41:1). On the dark footer the source gold
 * is kept (10.88:1) and only the charcoal glyphs, which sit at ~1.2:1 there,
 * are recoloured to cream.
 *
 * `sizes` defaults to the header's rendered width; callers that draw the logo
 * at a different height pass their own, as `ProductCard` does for its tiles.
 */
const ASSET = {
  ink: "/brand/ls-logo.png",
  inverse: "/brand/ls-logo-cream.png",
  width: 1428,
  height: 264,
} as const;

export function Logo({
  className,
  tone = "ink",
  priority = false,
  // Header: h-7 (28px → 152px) below 640, h-10 (40px → 217px) above.
  sizes = "(max-width: 639px) 152px, 217px",
}: {
  className?: string;
  tone?: "ink" | "inverse";
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-block", className)}
      // The image's alt text is the link's accessible name; there is no visible
      // text inside, so WCAG 2.5.3 (Label in Name) cannot be violated here.
      aria-label={`${SITE.name} — go to homepage`}
    >
      <Image
        src={tone === "ink" ? ASSET.ink : ASSET.inverse}
        alt=""
        width={ASSET.width}
        height={ASSET.height}
        priority={priority}
        // Intrinsic dimensions are declared above and the height is fixed by the
        // caller's class, so the aspect ratio is locked and this contributes no
        // layout shift.
        className="h-full w-auto object-contain"
        sizes={sizes}
      />
    </Link>
  );
}
