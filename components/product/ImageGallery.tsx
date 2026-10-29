"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExpandIcon,
} from "@/components/ui/Icon";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

/**
 * PDP gallery: large main image with a thumbnail rail, plus a lightbox.
 *
 * Layout follows the responsive-layout-audit skill — thumbnail rail vertical
 * beside the image on desktop, horizontal strip beneath it on mobile.
 *
 * Interaction:
 *   · click/tap a thumbnail  → swap the main image (150ms cross-fade)
 *   · swipe the main image   → previous/next, without opening the lightbox
 *   · click the main image   → open the lightbox
 *   · ← / → in the lightbox  → previous/next
 *   · Escape / backdrop      → close, focus returns to the trigger
 */
export function ImageGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const lightboxRef = useRef<HTMLDivElement>(null);
  const mainImageButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const count = images.length;
  const safeIndex = Math.min(index, Math.max(count - 1, 0));
  const current = images[safeIndex];

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((prev) => (prev + delta + count) % count);
    },
    [count],
  );

  useFocusTrap({
    active: lightboxOpen,
    containerRef: lightboxRef,
    onDismiss: () => setLightboxOpen(false),
    restoreFocusTo: mainImageButtonRef,
  });

  // Swipe: only treat it as a horizontal swipe if X movement clearly dominates,
  // so a vertical page scroll that starts on the image doesn't change the slide.
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const startX = touchStartX.current;
    const startY = touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (startX === null || startY === null) return;

    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      go(deltaX < 0 ? 1 : -1);
    }
  };

  if (count === 0 || !current) return null;

  return (
    // `flex flex-col` on mobile, not just `lg:flex` — the `order` utilities below
    // only take effect inside a flex/grid container, so without this the
    // thumbnail rail rendered ABOVE the main image on small screens instead of
    // beneath it (responsive-layout-audit skill, PDP checklist).
    <div className="flex flex-col gap-0 lg:flex-row lg:gap-4">
      {/* ── Thumbnail rail ───────────────────────────────────────────── */}
      {count > 1 && (
        <ul
          className="no-scrollbar order-2 mt-3 flex gap-3 overflow-x-auto lg:order-1 lg:mt-0 lg:w-20 lg:flex-col lg:overflow-visible"
          aria-label={`${productName} image thumbnails`}
        >
          {images.map((image, i) => {
            const selected = i === safeIndex;
            return (
              <li key={image} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${productName} — view ${i + 1} of ${count}`}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative block size-16 overflow-hidden rounded-sm border transition-colors duration-150 lg:size-20",
                    selected ? "border-ink" : "border-line hover:border-ink/40",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Main image ───────────────────────────────────────────────── */}
      <div className="order-1 flex-1 lg:order-2">
        <button
          ref={mainImageButtonRef}
          type="button"
          onClick={() => setLightboxOpen(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label={`Enlarge image — ${productName}, view ${safeIndex + 1} of ${count}`}
          className="group/main relative block w-full cursor-zoom-in overflow-hidden rounded-sm bg-bg-alt"
        >
          <div className="relative aspect-[4/5]">
            {/*
              All frames stay mounted and cross-fade via opacity. Swapping the
              `src` of one element would flash a blank frame while the next image
              decodes; this way the outgoing image holds until the new one is
              painted. Only the first is eager — it is the page's LCP element.
            */}
            {images.map((image, i) => (
              <Image
                key={image}
                src={image}
                alt={
                  i === safeIndex
                    ? `${productName} — view ${i + 1} of ${count}`
                    : ""
                }
                aria-hidden={i === safeIndex ? undefined : "true"}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className={cn(
                  "object-cover transition-opacity duration-150 ease-out",
                  i === safeIndex ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>

          <span className="pointer-events-none absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-0 transition-opacity duration-150 group-hover/main:opacity-100 group-focus-visible/main:opacity-100">
            <ExpandIcon size={16} />
          </span>
        </button>

        {count > 1 && (
          <p className="mt-2 text-center text-[0.75rem] text-muted lg:hidden">
            {safeIndex + 1} / {count}
          </p>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="on-dark fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/95 p-4"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
        >
          <button
            type="button"
            aria-label="Close image viewer"
            tabIndex={-1}
            onClick={() => setLightboxOpen(false)}
            className="absolute inset-0 size-full cursor-zoom-out"
          />

          <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} — enlarged images`}
            className="relative z-10 flex max-h-full w-full max-w-4xl flex-col"
          >
            <div className="flex items-center justify-between pb-3">
              <p className="text-[0.8125rem] text-muted-inverse">
                {safeIndex + 1} / {count}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close image viewer"
                className="flex size-11 items-center justify-center text-ink-inverse"
              >
                <CloseIcon size={22} />
              </button>
            </div>

            <div className="relative aspect-[4/5] w-full sm:aspect-[4/3]">
              <Image
                src={current}
                alt={`${productName} — view ${safeIndex + 1} of ${count}`}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            {count > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="flex size-11 items-center justify-center rounded-full border border-muted-inverse/50 text-ink-inverse transition-colors duration-150 hover:bg-ink-inverse hover:text-ink"
                >
                  <ChevronLeftIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="flex size-11 items-center justify-center rounded-full border border-muted-inverse/50 text-ink-inverse transition-colors duration-150 hover:bg-ink-inverse hover:text-ink"
                >
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
