import type { Metadata } from "next";
import Link from "next/link";
import { categoryBySlug } from "@/data/categories";
import {
  activeFilterCount,
  getAllProducts,
  getFilteredProducts,
  getSortOptions,
  hasActiveFilters,
  parseShopFilters,
  PAGE_SIZE,
  type RawSearchParams,
} from "@/lib/products";
import { SITE } from "@/lib/site";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { MobileFilterSheet } from "@/components/shop/MobileFilterSheet";
import { SortDropdown } from "@/components/shop/SortDropdown";

/**
 * Shop / Product Listing Page.
 *
 * A Server Component that derives everything it renders from `searchParams` —
 * there is no client-side filter state anywhere, so a reload, a shared link and
 * a back-button press all produce the same view (plp-filter-sort skill).
 */

type PageProps = {
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const filters = parseShopFilters(await searchParams);
  // Categories are multi-select now, so a specific title only makes sense when
  // exactly one is ticked. Two or more fall back to the generic title rather
  // than producing "Dining & Bedroom & Outdoor Furniture".
  const category =
    filters.categories.length === 1
      ? categoryBySlug.get(filters.categories[0]!)
      : undefined;

  const title = category ? `${category.name} Furniture` : "Shop All Furniture";
  const description = category
    ? `${category.tagline} Browse our ${category.name.toLowerCase()} collection — delivered and assembled across the UAE.`
    : SITE.description;

  return {
    title,
    description,
    // Filtered permutations are near-duplicate listings, so point the canonical
    // at the clean /shop URL and keep them out of the index. Only the unfiltered
    // page competes for search traffic.
    alternates: { canonical: "/shop" },
    robots: hasActiveFilters(filters)
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: { title, description, url: "/shop" },
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const filters = parseShopFilters(await searchParams);
  const all = getAllProducts();
  const matched = getFilteredProducts(all, filters);

  // A single ticked category names the page; several are summarised, since
  // "Dining & Bedroom & Décor" as an h1 reads badly and grows unbounded.
  const category =
    filters.categories.length === 1
      ? categoryBySlug.get(filters.categories[0]!)
      : undefined;
  const heading = category
    ? category.name
    : filters.categories.length > 1
      ? `${filters.categories.length} categories`
      : "All furniture";

  // Cumulative paging: ?page=2 renders the first 18 items, not items 10–18.
  // Driven by the URL rather than client state, so "Load more" survives a
  // refresh and the deep link shows what the shopper was actually looking at.
  const visibleCount = Math.min(filters.page * PAGE_SIZE, matched.length);
  const visible = matched.slice(0, visibleCount);
  const hasMore = visibleCount < matched.length;

  const activeCount = activeFilterCount(filters);

  const loadMoreHref = (() => {
    const params = new URLSearchParams();
    // `append`, not `set` — multi-select facets are repeated params, and `set`
    // would silently keep only the last category the shopper ticked.
    for (const slug of filters.categories) params.append("category", slug);
    for (const color of filters.colors) params.append("color", color);
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    if (typeof filters.minPrice === "number")
      params.set("minPrice", String(filters.minPrice));
    if (typeof filters.maxPrice === "number")
      params.set("maxPrice", String(filters.maxPrice));
    params.set("page", String(filters.page + 1));
    return `/shop?${params.toString()}`;
  })();

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: category ? "/shop" : undefined },
          ...(category ? [{ label: category.name }] : []),
        ]}
      />

      <div className="mt-6 max-w-2xl">
        <h1>{heading}</h1>
        {category && (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
            {category.tagline}
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[16rem_1fr] lg:gap-12">
        {/* ── Desktop sidebar ──────────────────────────────────────────── */}
        <aside aria-label="Product filters" className="hidden lg:block">
          <div className="sticky top-36">
            {/*
              An h2 above the filter groups' h3s. Without it the document jumped
              h1 → h3, which the accessibility-audit skill treats as a failure.
              Visually hidden because the sidebar's purpose is obvious on sight.
            */}
            <h2 className="sr-only">Filter products</h2>
            <FilterPanel filters={filters} />
          </div>
        </aside>

        {/* ── Results ──────────────────────────────────────────────────── */}
        <section aria-label="Products">
          <h2 className="sr-only">
            {matched.length} {matched.length === 1 ? "product" : "products"}
          </h2>
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <MobileFilterSheet activeCount={activeCount}>
                <h2 className="sr-only">Filter products</h2>
                <FilterPanel filters={filters} />
              </MobileFilterSheet>
              <p
                className="text-[0.8125rem] text-muted"
                // Announce the new count when filtering changes it.
                role="status"
                aria-live="polite"
              >
                {matched.length} {matched.length === 1 ? "item" : "items"}
              </p>
            </div>
            <SortDropdown filters={filters} options={getSortOptions()} />
          </div>

          {visible.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3">
                {visible.map((product, index) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      // The first tile is the LCP candidate on this page, so it
                      // is the one image here that loads eagerly.
                      priority={index === 0}
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 30vw"
                    />
                  </li>
                ))}
              </ul>

              {hasMore && (
                <div className="mt-14 flex flex-col items-center gap-3">
                  <p className="text-[0.75rem] text-muted">
                    Showing {visible.length} of {matched.length}
                  </p>
                  <Link
                    href={loadMoreHref}
                    scroll={false}
                    className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/35 px-10 py-3.5 text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-150 hover:border-ink hover:bg-ink hover:text-ink-inverse"
                  >
                    Load more
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-sm border border-line bg-bg-alt/50 px-6 py-16 text-center">
      <h2 className="font-display text-2xl font-light">Nothing matches that yet</h2>
      <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
        No pieces fit this combination of filters. Try clearing one to see
        more.
      </p>
      <Link
        href="/shop"
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-sm border border-ink bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-[0.08em] text-ink-inverse transition-colors duration-150 hover:bg-ink-soft"
      >
        Clear filters
      </Link>
    </div>
  );
}
