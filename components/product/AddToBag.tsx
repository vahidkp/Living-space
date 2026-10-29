"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Quantity stepper, colour selector and "Add to bag" CTA.
 *
 * There is NO cart in this phase (PRD §9), so adding shows a confirmation and
 * nothing else — no persistence, no store, no navigation. The confirmation is
 * an `aria-live` region so it is announced, not just seen.
 *
 * The colour selector is genuinely interactive here (unlike on the grid tile),
 * because the PDP has room to name the selected colour in text. It is visual
 * state only — there is no inventory to check against in the MVP.
 */
export function AddToBag({
  productName,
  colors,
}: {
  productName: string;
  colors?: { name: string; hex: string }[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors?.[0]?.name ?? null);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the pending timer on unmount so it can't fire against a gone component.
  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleAdd = () => {
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 3200);
  };

  return (
    <div>
      {/* ── Colour ───────────────────────────────────────────────────── */}
      {colors && colors.length > 0 && (
        <div className="mt-7">
          <p className="eyebrow text-muted">
            Colour
            {selectedColor && (
              <span className="ml-2 normal-case tracking-normal text-ink">
                {selectedColor}
              </span>
            )}
          </p>
          <ul className="mt-3 flex flex-wrap items-center gap-2.5">
            {colors.map((color) => {
              const selected = color.name === selectedColor;
              return (
                <li key={color.name}>
                  <button
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    aria-pressed={selected}
                    aria-label={`Colour: ${color.name}`}
                    title={color.name}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full border transition-colors duration-150",
                      selected ? "border-ink" : "border-line hover:border-ink/40",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      style={{ backgroundColor: color.hex }}
                      className="size-7 rounded-full border border-ink/10"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Quantity + CTA ───────────────────────────────────────────── */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div
          className="flex items-center justify-between rounded-sm border border-line sm:w-36"
          role="group"
          aria-label="Quantity"
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex size-12 items-center justify-center text-ink transition-colors duration-150 hover:text-ink-soft disabled:text-muted/50"
          >
            <MinusIcon size={16} />
          </button>
          {/*
            aria-live so the new value is announced after a button press —
            otherwise a screen-reader user hears nothing change.
          */}
          <span
            aria-live="polite"
            aria-atomic="true"
            className="min-w-8 text-center text-sm font-medium text-ink"
          >
            <span className="sr-only">Quantity: </span>
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            disabled={quantity >= 99}
            aria-label="Increase quantity"
            className="flex size-12 items-center justify-center text-ink transition-colors duration-150 hover:text-ink-soft disabled:text-muted/50"
          >
            <PlusIcon size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex min-h-12 flex-1 items-center justify-center rounded-sm border border-ink bg-ink px-8 text-xs font-medium uppercase tracking-[0.08em] text-ink-inverse transition-colors duration-150 hover:bg-ink-soft"
        >
          Add to bag
        </button>
      </div>

      {/*
        Confirmation. Always rendered so the live region exists in the DOM before
        it gains content — a region inserted at the same moment as its text is
        unreliably announced.
      */}
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-3.5 flex items-center gap-2 text-[0.8125rem] transition-opacity duration-150",
          added ? "text-olive opacity-100" : "opacity-0",
        )}
      >
        {added && (
          <>
            <CheckIcon size={16} className="shrink-0" />
            <span>
              Added to bag — {quantity} × {productName}
              {selectedColor ? `, ${selectedColor}` : ""}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
