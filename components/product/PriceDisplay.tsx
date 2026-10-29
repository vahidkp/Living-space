import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";

/**
 * Price, with an optional struck compare-at price.
 *
 * The compare-at value is wrapped in a `<s>` element rather than styled with a
 * `line-through` class alone, so assistive tech announces it as superseded
 * rather than reading two prices with no relationship. The visually-hidden
 * labels name which is which.
 */
export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: {
  /** Undefined means price on request — see the note on `Product.price`. */
  price?: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discount = getDiscountPercent(price, compareAtPrice);
  const onSale = discount !== null;

  const scale = {
    sm: { now: "text-[0.8125rem]", was: "text-[0.75rem]" },
    md: { now: "text-sm", was: "text-[0.8125rem]" },
    lg: { now: "text-xl", was: "text-base" },
  }[size];

  // Price on request: made-to-order pieces are quoted per size and finish. Say
  // so plainly rather than rendering "AED 0" or an empty gap.
  if (typeof price !== "number") {
    return (
      <p className={cn("flex flex-wrap items-baseline", className)}>
        <span className={cn("font-medium text-ink", scale.now)}>
          Price on request
        </span>
      </p>
    );
  }

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      {onSale && (
        <s className={cn("text-muted", scale.was)}>
          <span className="sr-only">Original price: </span>
          {formatPrice(compareAtPrice as number)}
        </s>
      )}
      <span className={cn("font-medium text-ink", scale.now)}>
        <span className="sr-only">{onSale ? "Sale price: " : "Price: "}</span>
        {formatPrice(price)}
      </span>
    </p>
  );
}
