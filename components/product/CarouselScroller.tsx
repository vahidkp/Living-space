"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll-snap rail with its section heading and arrow controls.
 *
 * No carousel library — native CSS scroll-snap does the scrolling, and this
 * component adds only the arrows and their disabled state (product-card-component
 * and performance-lighthouse skills both call for this explicitly).
 *
 * The heading is rendered HERE rather than by the caller so the arrows can sit in
 * its actions slot. They were previously absolutely positioned above the rail,
 * which landed them exactly on top of the "View all" link (measured: both at
 * right: 1408px). Laying them out in the same flex row makes collision
 * impossible rather than merely unlikely.
 *
 * `children` are Server Components (the `<li>`-wrapped ProductCards) passed
 * through as an RSC payload, so making this rail interactive does not pull the
 * cards or the product data into the client bundle.
 *
 * There is no autoplay, by design — the animation skill rules it out.
 */
export function CarouselScroller({
  children,
  label,
  eyebrow,
  title,
  titleMuted,
  href,
  headingLevel = "h2",
  className,
}: {
  /** Server-rendered `<li>` items. The caller owns their widths. */
  children: ReactNode;
  /** Accessible name for the scrollable region. */
  label: string;
  eyebrow?: string;
  title: string;
  titleMuted?: string;
  href?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    // 2px tolerance: sub-pixel layout means scrollLeft rarely hits the exact max.
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setOverflows(maxScroll > 2);
    setAtStart(rail.scrollLeft <= 2);
    setAtEnd(rail.scrollLeft >= maxScroll - 2);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    sync();
    rail.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const firstItem = rail.querySelector("li");
    // Fall back to 80% of the rail width if it is somehow empty.
    const step = firstItem
      ? firstItem.getBoundingClientRect().width + 16
      : rail.clientWidth * 0.8;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        titleMuted={titleMuted}
        href={href}
        as={headingLevel}
        className="mb-7"
        actions={
          // Hidden when everything already fits, and on mobile where the rail is
          // swiped rather than clicked through.
          overflows ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <ArrowButton
                direction="left"
                disabled={atStart}
                onClick={() => scrollByCard(-1)}
              />
              <ArrowButton
                direction="right"
                disabled={atEnd}
                onClick={() => scrollByCard(1)}
              />
            </div>
          ) : undefined
        }
      />

      {/*
        The <ul> is itself the scroll container, and deliberately carries NO
        `role`. Two constraints pin this down:

        1. `role="group"` here would override the implicit `list` role and orphan
           every child <li> — axe-core reports it as a serious "listitem: <li>
           elements must be contained in a <ul> or <ol>" violation. So the label
           and tabIndex go on the list itself, which keeps its list semantics
           while still being a focusable, named scroll region (role=list
           supports aria-label).

        2. Wrapping the list in a separate scroll <div> and giving the <ul>
           `w-max` was the other way to satisfy axe, but it breaks the cards:
           their widths are percentages, and against a max-content parent a
           percentage has nothing stable to resolve against, so the cards size
           to their content instead (measured: mobile homepage grew from 8553px
           to 10063px tall). The list must be the element with the definite
           width, which means it must be the scroll container.

        THE EDGE-BLEED IS MOBILE-ONLY, and that is load-bearing.

        On mobile the negative margin + matching padding let the rail scroll from
        one screen edge to the other while its first card still lines up with the
        page gutter. `scroll-pl-*` is what makes that hold: a snap-start item
        aligns to the scroll-padding edge, so without it the browser snaps the
        first card flush to the container's border edge on load and silently
        cancels the padding (measured: first card at x=0 instead of x=20).

        From `sm` up the bleed is REMOVED (`mx-0 px-0 scroll-pl-0`) so the rail's
        border box equals the page gutter exactly. That is what guarantees a whole
        number of cards is visible: overflow clips at the gutter, so the next card
        is fully outside the box rather than peeking through the padding.

        Getting this wrong is subtle — with the bleed left on, the cards still
        *divide* the content box exactly, so any measurement of the content box
        says "4 cards, 0 partial" while a 48px sliver of the fifth is plainly
        visible in the padding zone. Visibility is governed by the border box, not
        the content box.
      */}
      <ul
        ref={railRef}
        tabIndex={0}
        aria-label={label}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1 gap-4",
          "-mx-5 px-5 scroll-pl-5",
          "sm:mx-0 sm:px-0 sm:scroll-pl-0",
        )}
      >
        {children}
      </ul>
    </div>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous products" : "Next products"}
      className={cn(
        "flex size-11 items-center justify-center rounded-full border transition-colors duration-150",
        disabled
          ? "cursor-not-allowed border-line text-muted/50"
          : "border-line text-ink hover:border-ink hover:bg-ink hover:text-ink-inverse",
      )}
    >
      <Icon size={17} />
    </button>
  );
}
