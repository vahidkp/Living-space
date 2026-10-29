"use client";

import { useEffect, useId, useState } from "react";
import { type ShopFilters } from "@/lib/products";
import { Button } from "@/components/ui/Button";

/**
 * Min/max price inputs. Two number fields rather than a slider — the
 * plp-filter-sort skill prefers simple inputs for MVP speed, and typing an exact
 * ceiling is faster than dragging to it anyway.
 *
 * Local state mirrors the URL so the fields stay editable while typing, and
 * resyncs when the URL changes underneath (browser back, or "Clear all").
 *
 * NOT A <form>. It renders inside `FilterPanel`'s form, and HTML forbids nested
 * forms — the browser silently drops the inner one while parsing, so the server
 * HTML and the client DOM disagree and hydration fails outright. (That is
 * exactly what happened when this was a form: "In HTML, <form> cannot be a
 * descendant of <form>. This will cause a hydration error.")
 *
 * Living inside the outer form is also the better design: the inputs carry the
 * `minPrice`/`maxPrice` names, so a no-JS submission sends the price range and
 * the ticked checkboxes together in one request.
 */
export function PriceFilter({
  filters,
  bounds,
}: {
  filters: ShopFilters;
  bounds: { min: number; max: number };
}) {
  const minId = useId();
  const maxId = useId();

  const [min, setMin] = useState(filters.minPrice?.toString() ?? "");
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? "");

  useEffect(() => {
    setMin(filters.minPrice?.toString() ?? "");
    setMax(filters.maxPrice?.toString() ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  // No router push of its own: submitting is the enclosing form's job now, and
  // its handler assembles the URL from the form's own fields — including these.
  // Keeping a second navigation path here would be a way for the two to drift.

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <label htmlFor={minId} className="sr-only">
            Minimum price in AED
          </label>
          <input
            id={minId}
            name="minPrice"
            type="number"
            inputMode="numeric"
            min={0}
            step={50}
            placeholder={bounds.min.toLocaleString("en-AE")}
            value={min}
            onChange={(event) => setMin(event.target.value)}
            className="min-h-11 w-full rounded-sm border border-line bg-bg px-3 py-2 text-[0.8125rem] text-ink placeholder:text-muted focus:border-ink/40"
          />
        </div>
        <span aria-hidden="true" className="text-muted">
          &ndash;
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor={maxId} className="sr-only">
            Maximum price in AED
          </label>
          <input
            id={maxId}
            name="maxPrice"
            type="number"
            inputMode="numeric"
            min={0}
            step={50}
            placeholder={bounds.max.toLocaleString("en-AE")}
            value={max}
            onChange={(event) => setMax(event.target.value)}
            className="min-h-11 w-full rounded-sm border border-line bg-bg px-3 py-2 text-[0.8125rem] text-ink placeholder:text-muted focus:border-ink/40"
          />
        </div>
      </div>
      {/*
        A submit button for the enclosing filter form, which is right in both
        directions: with JS the form's onSubmit intercepts and client-navigates
        (checkbox state is already applied, so nothing is lost); without JS the
        browser submits price and checkboxes together in one GET.
      */}
      <Button type="submit" variant="outline" size="sm" className="mt-3 w-full">
        Apply price
      </Button>
    </div>
  );
}
