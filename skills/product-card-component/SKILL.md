---
name: product-card-component
description: Builds the reusable ProductCard and ProductCarouselRow components matching the Bloomr-style hover-swap product tile with discount badge and price display. Use when building or editing any component that renders a product in a grid or carousel (Homepage, Shop grid, PDP related-products).
---

# Product Card Component Skill

## When to use
- Building `components/product/ProductCard.tsx`
- Building `components/product/ProductCarouselRow.tsx`
- Building `components/product/PriceDisplay.tsx` and `BadgeDiscount.tsx`
- Any time product tiles look inconsistent between Homepage, Shop, and "You may also like"

## Behavior spec (from PRD §5.4/5.5)
- **Image**: square or portrait aspect ratio, `next/image` with `fill`, `object-cover`. On hover (desktop) or via a swipeable secondary image (mobile), swap to `images[1]` if present.
- **Discount badge**: top-left corner, small pill/tag, only rendered when `compareAtPrice` exists (e.g. "-20%" computed from price vs compareAtPrice). Use `--color-accent-terracotta` sparingly, only for this badge.
- **Name**: below image, ink color, sans font, single line with `truncate`.
- **Price**: `PriceDisplay` component — if `compareAtPrice` exists, show it with `line-through text-muted` followed by the current price in `text-ink font-medium`; otherwise show price alone.
- **Color swatches** (optional): small row of dots under the price if `colors` is populated; clicking a swatch (client component) swaps the card's displayed image if a matching image exists.
- **Click target**: entire card links to `/shop/[slug]` via Next `<Link>`; no nested interactive elements should break the link (swatches use `stopPropagation` or are rendered outside the anchor).

## ProductCarouselRow
- Horizontally scrollable row of `ProductCard`s (3–4 visible on desktop, 1.2 visible on mobile to hint scrollability), with left/right arrow buttons that scroll by one card width. Use native scroll-snap (`snap-x snap-mandatory` + `snap-start` on cards) rather than a heavy carousel library — keep dependencies minimal.
- Accepts a `title`/eyebrow label prop (e.g. "Best sellers") rendered above the row per PRD §5.4.

## Accessibility
- Card image `alt` must be the product name (or `images[i].alt` if per-image alt text is modeled later).
- Carousel arrow buttons need `aria-label="Previous products"` / `"Next products"`.
- Ensure focus outline is visible when tabbing through cards and arrows (do not `outline-none` without a replacement focus style).

## Output checklist
- [ ] Same `ProductCard` component is reused on Homepage, Shop grid, and PDP related-products (no duplicated/divergent card markup)
- [ ] Discount math is computed once in `lib/utils.ts` (e.g. `getDiscountPercent()`), not re-implemented per component
- [ ] Hover/swipe image swap works and gracefully no-ops when only one image exists
- [ ] Carousel is keyboard and touch scrollable without a heavy third-party carousel dependency
