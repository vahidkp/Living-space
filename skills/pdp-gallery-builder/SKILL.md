---
name: pdp-gallery-builder
description: Builds the Product Detail Page image gallery, variant selectors, quantity stepper, and info accordion. Use when building app/shop/[slug]/page.tsx or the ImageGallery/AccordionInfo components.
---

# PDP Gallery & Info Panel Skill

## When to use
- Building `app/shop/[slug]/page.tsx`
- Building `components/product/ImageGallery.tsx`, `AccordionInfo.tsx`
- Adding variant (color/size) selection or the quantity stepper

## ImageGallery behavior
- Main large image + a vertical (desktop) or horizontal (mobile) thumbnail rail from `product.images`.
- Clicking/tapping a thumbnail swaps the main image (client component, local state — no need for global state).
- Clicking the main image opens a lightbox/zoom overlay (Dialog primitive) with the same image set, closable via Escape, backdrop click, or a close button.
- Support swipe gesture on mobile to move between images without opening the lightbox.
- All thumbnails and the main image require descriptive `alt` text (product name + index, e.g. "Hartimor Sofa — view 2").

## Info panel
- Order top to bottom: eyebrow category label → product name (serif, large) → `PriceDisplay` (reuse from product-card-component skill) → short description (2–3 lines) → variant selectors (if `product.colors` present, render swatches; selecting one is purely visual state in MVP, no inventory logic) → quantity stepper (client component, min 1) → primary CTA button "Add to bag".
- The "Add to bag" button is **visually functional but not wired to a real cart** per PRD §9 — on click, show a lightweight toast/confirmation ("Added to bag") rather than navigating anywhere or throwing an error. Do not build a persistent cart store for this phase.
- Trust row: 3 short icon+label items (e.g. Free delivery, Easy returns, 2-year warranty) — pull copy from a small constant, not hardcoded inline per PDP.

## AccordionInfo
- Sections: Description, Materials & Care, Dimensions, Shipping & Returns — built from `product.description`, `product.materials`, `product.dimensions`, and a shared static shipping/returns copy block.
- Only one section open at a time OR all collapsed by default with "Description" pre-expanded — match whichever the reference site pattern suggests; default to all-collapsed-except-first if unsure.
- Must be keyboard operable (Enter/Space to toggle, proper `aria-expanded`).

## Static generation & SEO
- `generateStaticParams()` returns all slugs from `data/products.ts`.
- `generateMetadata({ params })` sets `title`, `description`, and `openGraph.images` from the matched product; call `notFound()` if the slug doesn't match any fixture product.
- Add `schema.org/Product` JSON-LD (name, image, price, availability) via a `<script type="application/ld+json">` in the page for SEO per PRD §11.

## Output checklist
- [ ] Unknown slug renders Next.js 404, not a crash
- [ ] Gallery works via mouse, keyboard, and touch
- [ ] "Add to bag" gives clear visual feedback without a real cart dependency
- [ ] Related products row at the bottom reuses `ProductCarouselRow`, not a bespoke implementation
