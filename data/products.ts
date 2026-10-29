import type { CategorySlug } from "./categories";

/**
 * Product catalogue — Living Space Furniture.
 *
 * EMPTY FOR NOW: the stock placeholder photos the mockup catalogue is written
 * from (`public/images/stock/`) are still being sourced. Every piece will be
 * price-on-request — leave `price` unset, never 0.
 *
 * The `Product` type is the single source of truth for the whole app. If a
 * component needs a field that isn't here, add it to this type FIRST, then the
 * fixtures, then the component — never bolt on an untyped field
 * (data-model-cms-binding skill, rule 1).
 *
 * Do not import `products` directly from a component. All reads go through the
 * accessor functions in `lib/products.ts`, which is the seam where this fixture
 * gets swapped for a live API call. See the note at the top of that file.
 */
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /**
   * Whole dirhams. OPTIONAL, because the business makes everything to order
   * and quotes each piece by size and finish — it publishes no prices. `undefined` means "Price on request"
   * and is rendered as such — it is NOT a missing value to be defaulted to 0,
   * which would both look like a bug and misprice the item.
   */
  price?: number;
  compareAtPrice?: number;
  images: string[]; // ordered gallery, [0] = primary / hover-swap pair at [1]
  description: string;
  materials?: string;
  dimensions?: string;
  colors?: { name: string; hex: string }[];
  badge?: "sale" | "new";
  featured?: boolean;
};

export const products: Product[] = [];
