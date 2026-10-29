"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CloseIcon, FilterIcon } from "@/components/ui/Icon";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

/**
 * Bottom-sheet filter drawer for mobile and tablet (PRD §8.2).
 *
 * The panel content is `children` — the same server-rendered `FilterPanel` the
 * desktop sidebar uses, passed through as an RSC payload. This component only
 * supplies the sheet chrome and its open/closed state.
 *
 * Focus trap, Escape-to-dismiss, focus restore and scroll lock come from the
 * shared `useFocusTrap` hook.
 */
export function MobileFilterSheet({
  children,
  activeCount,
}: {
  children: ReactNode;
  /** Number of active filters, shown as a badge on the trigger. */
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    onDismiss: () => setOpen(false),
    restoreFocusTo: triggerRef,
  });

  // Filter links inside the sheet navigate rather than closing it directly, so
  // close once the URL has actually changed. Keyed on the serialised params so
  // it fires on every facet change, not just the first.
  const paramKey = `${pathname}?${searchParams.toString()}`;
  const initialKey = useRef(paramKey);
  useEffect(() => {
    if (paramKey !== initialKey.current) {
      initialKey.current = paramKey;
      setOpen(false);
    }
  }, [paramKey]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="flex min-h-11 items-center gap-2 rounded-sm border border-line bg-bg px-3.5 py-2 text-[0.8125rem] text-ink transition-colors duration-150 hover:border-ink/40 lg:hidden"
      >
        <FilterIcon size={17} />
        Filters
        {activeCount > 0 && (
          <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-ink text-[0.625rem] font-medium text-ink-inverse">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 size-full cursor-default bg-ink/40"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            className="absolute inset-x-0 bottom-0 flex max-h-[86vh] flex-col rounded-t-lg bg-bg"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
              <h2 className="eyebrow text-muted">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="-m-2 flex size-11 items-center justify-center p-2 text-ink"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

            <div className="shrink-0 border-t border-line px-5 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-sm border border-ink bg-ink px-6 py-3.5 text-xs font-medium uppercase tracking-[0.08em] text-ink-inverse transition-colors duration-150 hover:bg-ink-soft"
              >
                View results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
