import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { CarouselScroller } from "./CarouselScroller";
import { ProductCard } from "./ProductCard";

/**
 * Titled product rail — the homepage's "Best sellers" / "New in" rows and the
 * PDP's "You may also like". A Server Component: it renders the `<li>`-wrapped
 * cards and hands them to the client-side scroller as children, so the cards and
 * the product data stay off the client.
 *
 * Card widths are set here rather than inside the scroller so this component
 * controls how many are visible per breakpoint.
 *
 * From `sm` up the widths divide the rail EXACTLY, so a whole number of cards is
 * always visible and none is ever sliced at the right edge. The arithmetic is
 * `(100% - (n-1) × gap) / n` with the rail's `gap-4` (16px):
 *
 *   sm  2 cards → (100% − 16px) / 2
 *   lg  3 cards → (100% − 32px) / 3
 *   xl  4 cards → (100% − 48px) / 4
 *
 * Percentages resolve against the `<ul>`'s content box, which the scroller's
 * matching negative-margin/padding pair makes exactly the page gutter width — so
 * the first and last cards line up with every other section on the page.
 * Approximate widths (the previous `23.5%`) left a few percent over, and that
 * remainder is what showed up as a half-cut fifth card.
 *
 * MOBILE KEEPS ITS PEEK on purpose: four cards cannot fit under 640px, and the
 * arrows are hidden on touch, so the partial card is the only thing signalling
 * that the row scrolls (responsive-layout-audit skill).
 */
export function ProductCarouselRow({
  products,
  eyebrow,
  title,
  titleMuted,
  href,
  headingLevel = "h2",
  className,
}: {
  products: Product[];
  eyebrow?: string;
  title: string;
  titleMuted?: string;
  href?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className={cn("shell", className)} data-reveal="pending">
      <CarouselScroller
        label={title}
        eyebrow={eyebrow}
        title={title}
        titleMuted={titleMuted}
        href={href}
        headingLevel={headingLevel}
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="w-[70%] shrink-0 snap-start sm:w-[calc((100%_-_16px)/2)] lg:w-[calc((100%_-_32px)/3)] xl:w-[calc((100%_-_48px)/4)]"
          >
            <ProductCard
              product={product}
              // Mirrors the widths above. Slightly generous at each step so the
              // browser never picks a candidate narrower than the rendered card.
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, (max-width: 1280px) 34vw, 25vw"
            />
          </li>
        ))}
      </CarouselScroller>
    </section>
  );
}
