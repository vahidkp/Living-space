import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * AED price formatting. Prices are whole-dirham integers in the MVP fixture
 * (PRD §10), so no minor units are rendered.
 *
 * Rendered as "AED 8,997" to match the reference site's convention rather than
 * Intl's default "AED 8,997.00" / "د.إ" symbol form.
 */
export function formatPrice(amount: number): string {
  return `AED ${new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

/**
 * Discount percentage from a compare-at price. Computed here once so no
 * component re-implements the arithmetic (product-card-component skill).
 * Returns null when there is no genuine markdown to show.
 */
export function getDiscountPercent(
  price?: number,
  compareAtPrice?: number,
): number | null {
  // No price means "price on request", and there is nothing to discount from.
  if (typeof price !== "number") return null;
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
