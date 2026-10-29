import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Two variants only, per design-system-tokens rule 5:
 *   outline     — transparent, 1px border, for light backgrounds
 *   solid-dark  — ink fill with cream text, for dark backgrounds and primary CTAs
 *
 * Plus `outline-inverse`, which is the same outline treatment recoloured for
 * placement over photography and dark surfaces — not a third visual language,
 * just the outline variant with inverted ink.
 *
 * No shadow above shadow-sm; colour/border transitions only on hover (150ms).
 */
const VARIANTS = {
  outline:
    "border border-ink/35 text-ink hover:border-ink hover:bg-ink hover:text-ink-inverse",
  "outline-inverse":
    "border border-ink-inverse/70 text-ink-inverse hover:bg-ink-inverse hover:text-ink hover:border-ink-inverse",
  "solid-dark":
    "border border-ink bg-ink text-ink-inverse hover:bg-ink-soft hover:border-ink-soft",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-[0.6875rem]",
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-3.5 text-xs sm:px-10",
} as const;

type ButtonVariant = keyof typeof VARIANTS;
type ButtonSize = keyof typeof SIZES;

const base = cn(
  "inline-flex items-center justify-center gap-2 rounded-sm",
  "font-sans font-medium uppercase tracking-[0.08em] leading-none",
  "transition-colors duration-150 ease-out",
  "disabled:pointer-events-none disabled:opacity-45",
);

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: SharedProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "outline",
  size = "md",
  className,
  children,
  href,
  ...props
}: SharedProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
