"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import {
  clearFacetHref,
  getCategoryFacets,
  getColorFacets,
  getPriceBounds,
  hasPricedProducts,
  hasActiveFilters,
  toggleFacetHref,
  type ShopFilters,
} from "@/lib/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PriceFilter } from "./PriceFilter";

/**
 * The filter controls. Rendered once in the desktop sidebar and again inside the
 * mobile bottom sheet — one implementation, so the two can never drift.
 *
 * MULTI-SELECT CHECKBOXES. Ticking two categories widens the results (OR within
 * a facet); adding a colour narrows them (AND across facets).
 *
 * ── Why real <input type="checkbox"> rather than styled links ──────────────
 * These were `<Link>`s before, which had the nice property of needing no
 * JavaScript. Checkboxes keep that property here, without faking the semantics:
 *
 *   · everything sits in a real `<form method="get" action="/shop">`, so with
 *     JavaScript disabled a shopper ticks boxes and presses the Apply button
 *     that `<noscript>` reveals, and the browser submits
 *     `?category=dining&category=bedroom` — byte-identical to the URLs we build
 *   · with JavaScript on, `onChange` navigates immediately and the Apply button
 *     never appears
 *   · assistive tech announces "checkbox, checked", and Space toggles, because
 *     these ARE checkboxes rather than links wearing a tick
 *
 * THE URL REMAINS THE ONLY SOURCE OF TRUTH. `checked` is derived from the
 * `filters` prop, which the server parsed out of `searchParams` — there is no
 * `useState` mirroring selections here, so a reload, a shared link and the back
 * button all produce the same view (plp-filter-sort skill).
 */
export function FilterPanel({ filters }: { filters: ShopFilters }) {
  const router = useRouter();
  const categoryFacets = getCategoryFacets();
  const colorFacets = getColorFacets();
  const bounds = getPriceBounds();
  const active = hasActiveFilters(filters);

  const toggle = (facet: "category" | "color", value: string) => {
    // `scroll: false` keeps the shopper's place in the grid; jumping to the top
    // of the page on every tick makes comparing filtered results miserable.
    router.push(toggleFacetHref(filters, facet, value), { scroll: false });
  };

  return (
    <form
      action="/shop"
      method="get"
      // Names the form landmark, which matters here because the header's search
      // form also posts GET to /shop — without a name the two are
      // indistinguishable to a screen-reader user moving between landmarks (and,
      // as it happens, to a test harness).
      aria-label="Product filters"
      className="divide-y divide-line"
      // Belt and braces: if the form is somehow submitted while JS is running
      // (Enter in a field, say), route through the client router instead of a
      // full page load. The URL is assembled from the form's own state, so the
      // result is identical either way.
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        for (const [key, value] of data.entries()) {
          if (typeof value === "string" && value !== "") params.append(key, value);
        }
        const query = params.toString();
        router.push(query ? `/shop?${query}` : "/shop", { scroll: false });
      }}
    >
      {/*
        Sort rides along as a hidden field so a no-JS submission preserves it —
        the sort control is a separate <select> outside this form.

        Price needs no hidden field: PriceFilter's own inputs are named
        `minPrice`/`maxPrice` and sit inside this form, so they submit
        themselves. Duplicating them here would send each value twice.
      */}
      {filters.sort !== "featured" && (
        <input type="hidden" name="sort" value={filters.sort} />
      )}

      {/* ── Category ─────────────────────────────────────────────────── */}
      <FilterGroup
        title="Category"
        selectedCount={filters.categories.length}
        onClear={
          filters.categories.length > 0
            ? () => router.push(clearFacetHref(filters, "category"), { scroll: false })
            : undefined
        }
      >
        <ul className="space-y-0.5">
          {categoryFacets.map((facet) => (
            <li key={facet.slug}>
              <FacetCheckbox
                name="category"
                value={facet.slug}
                checked={filters.categories.includes(facet.slug)}
                onToggle={() => toggle("category", facet.slug)}
                label={facet.name}
                count={facet.count}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      {/* ── Price ────────────────────────────────────────────────────── */}
      {/* Only when something has a price — see `hasPricedProducts()`. */}
      {hasPricedProducts() && (
        <FilterGroup title="Price (AED)">
          <PriceFilter filters={filters} bounds={bounds} />
        </FilterGroup>
      )}

      {/* ── Colour ───────────────────────────────────────────────────── */}
      {/*
        The colour facets are derived from the catalogue, and the catalogue names
        colourways individually ("Tanned Cognac", "Cypress", "Dune"), so there are
        ~26 of them and most match a single product. Left uncapped the list ran
        far past the product grid. Capping the height keeps every option reachable
        — it scrolls, and is keyboard scrollable — while the ordering in
        `getColorFacets()` floats the colours shared by several pieces to the top.

        If the catalogue ever gains a structured colour family per product, this
        should become a short list of families instead.
      */}
      <FilterGroup
        title="Colour"
        selectedCount={filters.colors.length}
        onClear={
          filters.colors.length > 0
            ? () => router.push(clearFacetHref(filters, "color"), { scroll: false })
            : undefined
        }
      >
        <ul className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
          {colorFacets.map((color) => (
            <li key={color.name}>
              <FacetCheckbox
                name="color"
                value={color.name}
                checked={filters.colors.includes(color.name)}
                onToggle={() => toggle("color", color.name)}
                label={color.name}
                count={color.count}
                swatch={color.hex}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      {/*
        AVAILABILITY FILTER — intentionally absent. PRD §8.2 lists it, but the
        `Product` type (PRD §10) models no stock field, and the plp-filter-sort
        skill says to skip this filter until it does. Adding a fake "in stock"
        flag would be inventing data the catalogue does not have.
      */}

      <div className="space-y-3 pt-5">
        {/* Only reachable without JavaScript; with JS the onChange has already
            navigated by the time a shopper could reach for it. */}
        <noscript>
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Apply filters
          </Button>
        </noscript>

        {active && (
          // A Link, not a plain <a>: this is an internal route, so it should be
          // client-navigated and prefetched like every other in-app link. It
          // sits inside the <form> but is not a submit control, so it does not
          // interfere with the no-JS submission path.
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center text-[0.8125rem] text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-ink"
          >
            Clear all filters
          </Link>
        )}
      </div>
    </form>
  );
}

function FilterGroup({
  title,
  selectedCount = 0,
  onClear,
  children,
}: {
  title: string;
  selectedCount?: number;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="py-5 first:pt-0">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        {/* <legend> cannot be flexed reliably across browsers, so the visible
            heading is a sibling and the legend is visually hidden — the group
            still gets an accessible name for screen readers. */}
        <legend className="sr-only">{title}</legend>
        <span aria-hidden="true" className="eyebrow text-muted">
          {title}
          {selectedCount > 0 && ` (${selectedCount})`}
        </span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[0.75rem] text-muted underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </fieldset>
  );
}

function FacetCheckbox({
  name,
  value,
  checked,
  onToggle,
  label,
  count,
  swatch,
}: {
  name: string;
  value: string;
  checked: boolean;
  onToggle: () => void;
  label: string;
  count: number;
  swatch?: string;
}) {
  const id = useId();

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onToggle}
        // The native box is hidden but NOT `display:none` — it stays in the
        // accessibility tree and in the tab order, and the styled square below
        // renders its state via peer-checked.
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          "flex min-h-11 flex-1 cursor-pointer select-none items-center gap-2.5 rounded-sm px-1 text-[0.8125rem] transition-colors duration-150",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive",
          checked ? "text-ink" : "text-ink-soft hover:text-ink",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-150",
            checked ? "border-ink bg-ink" : "border-ink/30 bg-bg",
          )}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M1.5 5.2 3.8 7.5 8.5 2.8"
                stroke="var(--color-bg)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        {swatch && (
          <span
            aria-hidden="true"
            style={{ backgroundColor: swatch }}
            className="size-4 shrink-0 rounded-full border border-ink/15"
          />
        )}

        <span className="flex-1 truncate">{label}</span>
        <span className="shrink-0 text-muted">{count}</span>
      </label>
    </div>
  );
}
