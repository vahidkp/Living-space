/**
 * Category fixture data.
 *
 * `Category.slug` is the union used by `Product.category` — the two must stay in
 * lockstep. Filter UI reads from here rather than hardcoding category strings
 * (plp-filter-sort skill, filter field 1).
 *
 * These are the ranges Living Space Furniture shows on Instagram: its story
 * highlights are Majlis, TV Unit and Bed Wall, and its posts are mostly sofas
 * and living rooms. Add a category here (and to the slug union) when the
 * business confirms another — the home page grid is four across, so a fifth
 * would need its layout revisited.
 */

export type CategorySlug = "majlis" | "sofas" | "tv-units" | "beds";

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Short editorial line used on category tiles and PLP headers. */
  tagline: string;
  /** Hero/tile image for the category. */
  image: string;
};

export const categories: Category[] = [
  {
    slug: "majlis",
    name: "Majlis",
    tagline: "Seating for hosting — low, generous and made to run the length of your walls.",
    image: "/images/stock/majlis-1-0.jpg",
  },
  {
    slug: "sofas",
    name: "Sofas",
    tagline: "Sofas and sectionals in the size, depth and fabric you choose.",
    image: "/images/stock/sofas-1-0.jpg",
  },
  {
    slug: "tv-units",
    name: "TV Units",
    tagline: "Consoles and panelled media walls, made to fit the wall and the screen.",
    image: "/images/stock/tv-units-1-0.jpg",
  },
  {
    slug: "beds",
    name: "Beds & Bed Walls",
    tagline: "Upholstered beds with a feature wall behind, built to the width of the room.",
    image: "/images/stock/beds-1-0.jpg",
  },
];

export const categoryBySlug = new Map<CategorySlug, Category>(
  categories.map((c) => [c.slug, c]),
);

export function isCategorySlug(value: string): value is CategorySlug {
  return categoryBySlug.has(value as CategorySlug);
}
