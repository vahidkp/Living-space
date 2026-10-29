import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { cn, getDiscountPercent } from "@/lib/utils";
import { BadgeDiscount, BadgeStatus } from "./BadgeDiscount";
import { PriceDisplay } from "./PriceDisplay";

/**
 * The single product tile used on the homepage carousels, the shop grid, and
 * the PDP related-products row. There is no second card implementation anywhere
 * in the app (product-card-component skill, first checklist item).
 *
 * Deliberately a SERVER component: the hover image-swap is done with a CSS
 * `group-hover` opacity cross-fade, so a grid of 24 tiles ships zero client JS.
 *
 * `sizes` is passed in by the caller, because the correct value depends on the
 * layout the card sits in (4-up grid vs 1.3-up mobile carousel) and a wrong
 * `sizes` is the most common cause of oversized image downloads.
 */
export function ProductCard({
  product,
  sizes,
  priority = false,
  className,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const primary = product.images[0];
  const secondary = product.images[1];
  const hasSwap = Boolean(secondary && secondary !== primary);

  return (
    <article className={cn("pc-card relative", className)}>
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Fixed aspect ratio container → no CLS as images load */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bg-alt">
          {primary && (
            <Image
              src={primary}
              alt={product.name}
              fill
              sizes={sizes}
              priority={priority}
              className={cn(
                "pc-img object-cover",
                hasSwap && "pc-img-primary-swap",
              )}
            />
          )}

          {/*
            Secondary image sits underneath and is revealed by fading the primary
            out. `aria-hidden` because it shows the same product the primary
            already described — announcing it twice adds nothing.

            `.hover-only` keeps it out of the DOM box model entirely on touch
            devices, where a hover swap can never happen; see the comment on that
            utility in globals.css for why lazy-loading alone doesn't save it.
          */}
          {hasSwap && secondary && (
            <div className="hover-only absolute inset-0 -z-10">
              <Image
                src={secondary}
                alt=""
                aria-hidden="true"
                fill
                sizes={sizes}
                loading="lazy"
                className="pc-img object-cover"
              />
            </div>
          )}

          {discount !== null && (
            <BadgeDiscount percent={discount} className="absolute left-3 top-3" />
          )}
          {product.badge === "new" && (
            <BadgeStatus label="New" className="absolute right-3 top-3" />
          )}
        </div>

        <div className="mt-3.5">
          <h3 className="truncate text-[0.875rem] font-normal tracking-normal text-ink font-sans">
            {product.name}
          </h3>
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            className="mt-1.5"
          />
        </div>
      </Link>

      {/*
        Colourway indicators.

        These are presentational, not interactive. The reference site's swatches
        swap the tile image, which requires per-colour photography; PRD §10 models
        `colors` as name+hex only, with no image mapping. Rendering fake buttons
        that visibly do nothing is worse than rendering an honest indicator, so
        these are dots plus a screen-reader summary. When the data gains
        per-colour images, this becomes a client component and the dots become
        buttons — the card's layout does not change.
      */}
      {product.colors && product.colors.length > 1 && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="sr-only">
            Available in {product.colors.length} colours:{" "}
            {product.colors.map((c) => c.name).join(", ")}
          </span>
          {product.colors.map((color) => (
            <span
              key={color.name}
              aria-hidden="true"
              title={color.name}
              className="size-3 rounded-full border border-ink/15"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      )}
    </article>
  );
}
