import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/categories";
import { cn } from "@/lib/utils";

/**
 * Category tile: image with an overlaid label.
 *
 * Per the animation skill, hover scales the IMAGE only (1.0 → 1.05, 300ms) while
 * the label stays put — so the text never drifts under the cursor.
 */
export function CategoryTile({
  category,
  sizes,
  className,
}: {
  category: Category;
  sizes: string;
  className?: string;
}) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className={cn("group/tile relative block overflow-hidden rounded-sm", className)}
    >
      <div className="relative aspect-[4/5] sm:aspect-[3/4]">
        <Image
          src={category.image}
          alt={`${category.name} furniture`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 ease-out group-hover/tile:scale-[1.05]"
        />
        <div className="scrim-bottom absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
          <h3 className="font-display text-xl font-light text-ink-inverse sm:text-2xl">
            {category.name}
          </h3>
          <p className="mt-1.5 max-w-[26ch] text-[0.8125rem] leading-snug text-ink-inverse/85">
            {category.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}
