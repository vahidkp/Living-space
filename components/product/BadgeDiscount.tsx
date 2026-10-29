import { cn } from "@/lib/utils";

/**
 * Discount tag, top-left of a product image (PRD §5.4).
 *
 * Terracotta is reserved for exactly this — it is the only place the accent
 * appears on a product tile (product-card-component skill, discount badge).
 */
export function BadgeDiscount({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none inline-flex items-center rounded-sm bg-bg/92 px-2 py-1",
        "text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-terracotta",
        className,
      )}
    >
      {percent}% off
    </span>
  );
}

/**
 * "New" / "Sale" status pill, top-right. Kept in ink rather than the accent so
 * two coloured chips never compete on one image.
 */
export function BadgeStatus({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none inline-flex items-center rounded-sm bg-bg/92 px-2 py-1",
        "text-[0.625rem] font-medium uppercase tracking-[0.06em] text-ink-soft",
        className,
      )}
    >
      {label}
    </span>
  );
}
