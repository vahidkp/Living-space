import { products, type Product } from "@/data/products";
import { categories, isCategorySlug, type CategorySlug } from "@/data/categories";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * FUTURE API / CMS SWAP SEAM  (data-model-cms-binding skill, rule 5)
 * ════════════════════════════════════════════════════════════════════════════
 * Every read of product data in this app goes through a function in this file.
 * No component imports `data/products.ts` directly.
 *
 * To move onto a real backend (Shopify / Medusa / custom API), replace the
 * BODIES of the accessors below with `fetch`/SDK calls that return the same
 * `Product` shape. Nothing in `app/` or `components/` needs to change:
 *
 *   export async function getAllProducts(): Promise<Product[]> {
 *     const res = await fetch(`${API}/products`, { next: { revalidate: 300 } });
 *     return res.json();
 *   }
 *
 * The accessors are intentionally synchronous today because the fixture is a
 * local module. When they become async, the call sites are already inside
 * async Server Components, so they only need an `await` added.
 *
 * `getFilteredProducts` is a PURE function over an array — deliberately kept
 * independent of the data source so it stays unit-testable, and so it can be
 * swapped for server-side query params later without touching the UI.
 * ════════════════════════════════════════════════════════════════════════════
 */

export type { Product };

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function isSortValue(value: string): value is SortValue {
  return SORT_OPTIONS.some((o) => o.value === value);
}

/**
 * Whether any product carries a list price. Today none does — everything is
 * made to order and quoted — and with no prices, the price filter has nothing
 * to bound and the price sorts have nothing to order, so both are withdrawn
 * rather than shown inert. Add a price to one product and they return.
 */
export function hasPricedProducts(): boolean {
  return products.some((p) => typeof p.price === "number");
}

/** The sort options that mean something for the loaded catalogue. */
export function getSortOptions(): readonly (typeof SORT_OPTIONS)[number][] {
  return hasPricedProducts()
    ? SORT_OPTIONS
    : SORT_OPTIONS.filter((o) => o.value !== "price-asc" && o.value !== "price-desc");
}

/**
 * Normalised, validated shape of the /shop URL search params.
 *
 * `categories` and `colors` are MULTI-SELECT, encoded as repeated params
 * (`?category=dining&category=bedroom`) rather than a comma-joined string.
 * Repeated params are what a plain HTML checkbox form submits, so the filters
 * keep working with JavaScript disabled without any encode/decode of our own.
 *
 * Empty array means "no constraint on this facet", so callers never have to
 * distinguish undefined from [].
 */
export type ShopFilters = {
  categories: CategorySlug[];
  colors: string[];
  sort: SortValue;
  minPrice?: number;
  maxPrice?: number;
  page: number;
};

export const PAGE_SIZE = 9;

// ── Accessors ───────────────────────────────────────────────────────────────

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featured = products.filter((p) => p.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getProductsByCategory(
  category: CategorySlug,
  limit?: number,
): Product[] {
  const matched = products.filter((p) => p.category === category);
  return typeof limit === "number" ? matched.slice(0, limit) : matched;
}

export function getSaleProducts(limit?: number): Product[] {
  const onSale = products.filter(
    (p) =>
      typeof p.price === "number" &&
      typeof p.compareAtPrice === "number" &&
      p.compareAtPrice > p.price,
  );
  return typeof limit === "number" ? onSale.slice(0, limit) : onSale;
}

export function getNewArrivals(limit?: number): Product[] {
  const isNew = products.filter((p) => p.badge === "new");
  return typeof limit === "number" ? isNew.slice(0, limit) : isNew;
}

/**
 * Related products for the PDP "You may also like" row: same category first,
 * topped up with featured pieces from elsewhere if the category is thin.
 * Never includes the product being viewed.
 */
export function getRelatedProducts(product: Product, limit = 8): Product[] {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const seen = new Set([product.id, ...sameCategory.map((p) => p.id)]);
  const filler = products.filter((p) => !seen.has(p.id) && p.featured);
  return [...sameCategory, ...filler].slice(0, limit);
}

// ── Filter facets ───────────────────────────────────────────────────────────

/**
 * Distinct colour names across the loaded product set, with the hex to render
 * a swatch. Derived from the data rather than hardcoded, so adding a product
 * with a new colourway extends the filter automatically (plp-filter-sort skill,
 * filter field 3).
 *
 * NOTE ON THE MATERIAL FILTER: PRD §10 models `materials` as a free-prose
 * string ("Full-grain aniline leather, kiln-dried beech frame, …"), not an
 * enum, so there is no reliable set of distinct values to derive a filter from.
 * Rather than regex-mine prose or bolt on an untyped field — which rule 1 of
 * the data-model-cms-binding skill forbids — the material facet is deferred
 * until the type gains a structured `materialTags: string[]`. Colour, price and
 * category cover the PRD's filter intent in the meantime.
 */
export function getColorFacets(): { name: string; hex: string; count: number }[] {
  const byName = new Map<string, { hex: string; count: number }>();
  for (const product of products) {
    for (const color of product.colors ?? []) {
      const existing = byName.get(color.name);
      if (existing) existing.count += 1;
      else byName.set(color.name, { hex: color.hex, count: 1 });
    }
  }
  return [...byName.entries()]
    .map(([name, { hex, count }]) => ({ name, hex, count }))
    // Most-used colourways first so the useful facets are visible without
    // scrolling; alphabetical within the same count for a stable order.
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Min/max across products that actually carry a price. Price-on-request items
 * are excluded — including them as 0 would drag the lower bound to zero and make
 * the filter's placeholder range meaningless.
 */
export function getPriceBounds(): { min: number; max: number } {
  const prices = products
    .map((p) => p.price)
    .filter((p): p is number => typeof p === "number");
  if (prices.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getCategoryFacets(): {
  slug: CategorySlug;
  name: string;
  count: number;
}[] {
  return categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: products.filter((p) => p.category === c.slug).length,
  }));
}

// ── URL search params → filters ─────────────────────────────────────────────

/** Raw `searchParams` as delivered by Next.js. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function positiveInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/**
 * Parses and validates the URL search params into a `ShopFilters`. Unknown or
 * malformed values fall back to defaults rather than throwing, so a hand-edited
 * URL can never 500 the shop page.
 */
/** Every value for a repeatable param, as an array regardless of arity. */
function allValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value === undefined ? [] : [value];
}

/** Drops duplicates while preserving first-seen order. */
function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function parseShopFilters(searchParams: RawSearchParams): ShopFilters {
  const rawSort = firstValue(searchParams.sort);
  // With no priced products there is no price control on the page, so a price
  // param (a stale link, a hand-edited URL) would empty the grid with nothing
  // visible to undo it. Ignore it, as for any other facet that isn't offered.
  const priced = hasPricedProducts();
  const min = priced ? positiveInt(firstValue(searchParams.minPrice)) : undefined;
  const max = priced ? positiveInt(firstValue(searchParams.maxPrice)) : undefined;
  const offeredSorts = getSortOptions();
  const page = positiveInt(firstValue(searchParams.page));

  // Guard against an inverted range (?minPrice=9000&maxPrice=100) producing a
  // silently empty grid — swap the bounds instead.
  const bounded =
    typeof min === "number" && typeof max === "number" && min > max
      ? { minPrice: max, maxPrice: min }
      : { minPrice: min, maxPrice: max };

  const knownColors = new Set(getColorFacets().map((c) => c.name));

  // Unknown values are dropped rather than throwing, so a hand-edited or stale
  // URL degrades to a looser filter instead of a 500. Duplicates are collapsed
  // so `?category=dining&category=dining` cannot skew anything downstream.
  return {
    categories: unique(allValues(searchParams.category).filter(isCategorySlug)),
    colors: unique(allValues(searchParams.color).filter((c) => knownColors.has(c))),
    sort:
      rawSort && isSortValue(rawSort) && offeredSorts.some((o) => o.value === rawSort)
        ? rawSort
        : "featured",
    ...bounded,
    page: page && page > 0 ? page : 1,
  };
}

/**
 * PURE filter + sort over a product array. The single implementation used by
 * the server render; no client-side duplicate exists (plp-filter-sort skill).
 */
export function getFilteredProducts(
  source: Product[],
  filters: ShopFilters,
): Product[] {
  // OR within a facet, AND across facets — the convention every shopper already
  // has from other storefronts. Ticking Dining and Bedroom widens the results;
  // adding a colour on top narrows them.
  const filtered = source.filter((product) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    )
      return false;
    // A price bound is a statement about price, so items without one cannot
    // satisfy it. They drop out of a filtered range rather than silently
    // passing through it.
    const bounded =
      typeof filters.minPrice === "number" || typeof filters.maxPrice === "number";
    if (bounded && typeof product.price !== "number") return false;
    if (
      typeof filters.minPrice === "number" &&
      typeof product.price === "number" &&
      product.price < filters.minPrice
    )
      return false;
    if (
      typeof filters.maxPrice === "number" &&
      typeof product.price === "number" &&
      product.price > filters.maxPrice
    )
      return false;
    if (
      filters.colors.length > 0 &&
      !(product.colors ?? []).some((c) => filters.colors.includes(c.name))
    )
      return false;
    return true;
  });

  // `toSorted` would be cleaner but isn't in the baseline browser targets;
  // copy first so the fixture array is never mutated in place.
  const sorted = [...filtered];

  // Price-on-request items sort to the END of both price orders rather than
  // being treated as 0 (which would put them first under "low to high" and
  // imply they are the cheapest thing in the catalogue).
  const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
    const ap = a.price;
    const bp = b.price;
    if (typeof ap !== "number" && typeof bp !== "number") return 0;
    if (typeof ap !== "number") return 1;
    if (typeof bp !== "number") return -1;
    return (ap - bp) * dir;
  };

  switch (filters.sort) {
    case "price-asc":
      sorted.sort(byPrice(1));
      break;
    case "price-desc":
      sorted.sort(byPrice(-1));
      break;
    case "newest":
      // No `createdAt` in the fixture shape yet (PRD §10). Reverse fixture
      // order is the documented proxy: newest entries are appended last.
      sorted.reverse();
      break;
    case "featured":
    default:
      sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
      break;
  }

  return sorted;
}

/**
 * Serialises a complete filter set to a `/shop` href.
 *
 * `page` is deliberately never written: any filter change resets to page one,
 * because holding page 3 while the result set shrinks to 8 items strands the
 * shopper on an empty grid. The default sort is omitted too, so the unfiltered
 * view canonicalises to a bare `/shop` rather than `/shop?sort=featured`.
 */
function serialise(next: {
  categories: readonly CategorySlug[];
  colors: readonly string[];
  sort: SortValue;
  minPrice?: string;
  maxPrice?: string;
}): string {
  const params = new URLSearchParams();
  // Repeated params (not comma-joined) so a no-JS checkbox form submission
  // produces byte-identical URLs to the ones we build here.
  for (const category of next.categories) params.append("category", category);
  for (const color of next.colors) params.append("color", color);
  if (next.sort !== "featured") params.set("sort", next.sort);
  if (next.minPrice) params.set("minPrice", next.minPrice);
  if (next.maxPrice) params.set("maxPrice", next.maxPrice);

  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

/** Builds a `/shop` href with the scalar facets changed and `page` reset. */
export function buildShopHref(
  current: ShopFilters,
  patch: Partial<Record<"sort" | "minPrice" | "maxPrice", string | undefined>>,
): string {
  return serialise({
    categories: current.categories,
    colors: current.colors,
    sort:
      "sort" in patch && patch.sort && isSortValue(patch.sort)
        ? patch.sort
        : current.sort,
    minPrice:
      "minPrice" in patch ? patch.minPrice : current.minPrice?.toString(),
    maxPrice:
      "maxPrice" in patch ? patch.maxPrice : current.maxPrice?.toString(),
  });
}

/**
 * Adds or removes one value from a multi-select facet — the href behind a
 * checkbox. Used for the JS-enhanced navigation; the no-JS path submits the
 * form instead and lands on the same URL.
 */
export function toggleFacetHref(
  current: ShopFilters,
  facet: "category" | "color",
  value: string,
): string {
  const key = facet === "category" ? "categories" : "colors";
  const list: string[] = [...current[key]];
  const index = list.indexOf(value);
  if (index === -1) list.push(value);
  else list.splice(index, 1);

  return serialise({
    categories: (key === "categories"
      ? list.filter(isCategorySlug)
      : current.categories) as CategorySlug[],
    colors: key === "colors" ? list : current.colors,
    sort: current.sort,
    minPrice: current.minPrice?.toString(),
    maxPrice: current.maxPrice?.toString(),
  });
}

/** Href that clears one entire facet, keeping everything else. */
export function clearFacetHref(
  current: ShopFilters,
  facet: "category" | "color",
): string {
  return serialise({
    categories: facet === "category" ? [] : current.categories,
    colors: facet === "color" ? [] : current.colors,
    sort: current.sort,
    minPrice: current.minPrice?.toString(),
    maxPrice: current.maxPrice?.toString(),
  });
}

export function hasActiveFilters(filters: ShopFilters): boolean {
  return (
    filters.categories.length > 0 ||
    filters.colors.length > 0 ||
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number"
  );
}

/** Count of active facet selections, for the mobile "Filters (3)" trigger. */
export function activeFilterCount(filters: ShopFilters): number {
  return (
    filters.categories.length +
    filters.colors.length +
    (typeof filters.minPrice === "number" ? 1 : 0) +
    (typeof filters.maxPrice === "number" ? 1 : 0)
  );
}
