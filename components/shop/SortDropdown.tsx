"use client";

import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import { buildShopHref, type getSortOptions, type ShopFilters } from "@/lib/products";
import { ChevronDownIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Sort control.
 *
 * A native `<select>` rather than a custom listbox: it is keyboard operable,
 * screen-reader correct and touch-friendly for free, and on mobile it opens the
 * platform picker. A bespoke dropdown would be more work for a worse result.
 *
 * It renders the value from `searchParams` and pushes a new URL on change — it
 * does not own the sort state (plp-filter-sort skill).
 *
 * `options` comes from the server (`getSortOptions()`), because which sorts make
 * sense depends on the catalogue — the price sorts are withdrawn while nothing
 * has a price.
 */
export function SortDropdown({
  filters,
  options,
}: {
  filters: ShopFilters;
  options: ReturnType<typeof getSortOptions>;
}) {
  const router = useRouter();
  const id = useId();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2.5">
      <label htmlFor={id} className="hidden text-[0.8125rem] text-muted sm:inline">
        Sort
      </label>
      <div className="relative">
        <select
          id={id}
          value={filters.sort}
          aria-label="Sort products"
          onChange={(event) => {
            const href = buildShopHref(filters, { sort: event.target.value });
            startTransition(() => router.push(href, { scroll: false }));
          }}
          className={cn(
            "min-h-11 cursor-pointer appearance-none rounded-sm border border-line bg-bg py-2 pl-3.5 pr-9",
            "text-[0.8125rem] text-ink transition-colors duration-150 hover:border-ink/40",
            isPending && "opacity-60",
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}
