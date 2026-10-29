---
name: nextjs-ecommerce-scaffold
description: Scaffolds the Next.js App Router project structure for the Almadinah Furniture 3-page storefront (Home, Shop/PLP, Product/PDP) with typed fixture data. Use at project start, or when adding a new route/page/data file to keep structure consistent.
---

# Next.js Ecommerce Scaffold Skill

## When to use
- Bootstrapping the repository for the first time
- Adding any new route, layout, or data fixture
- Verifying the project still matches the sitemap in PRD §7

## Required structure
```
app/
  layout.tsx              # root layout: fonts, Header, AnnouncementBar, Footer
  page.tsx                # Homepage (/)
  globals.css
  shop/
    page.tsx              # Shop / PLP (/shop) — reads searchParams for category/sort/page
    [slug]/
      page.tsx             # PDP (/shop/[slug]) — generateStaticParams + generateMetadata
components/
  layout/                 # Header, AnnouncementBar, Footer
  home/                   # Hero, CategoryTile, PromoBannerSplit, PromoBannerDuo, DarkPromoStrip
  shop/                   # FilterSidebar, SortDropdown, Pagination
  product/                # ProductCard, ProductCarouselRow, ImageGallery, AccordionInfo, BadgeDiscount, PriceDisplay
  ui/                     # shadcn primitives restyled to tokens
data/
  products.ts             # typed fixture matching PRD §10 Product type
  categories.ts
lib/
  utils.ts                # cn(), price formatting, etc.
public/
  images/                 # sourced/optimized imagery
```

## Rules
1. Use the **App Router** exclusively (no `pages/` directory). Server Components by default; add `"use client"` only to components that need interactivity (filters, gallery, carousels, accordions, quantity stepper).
2. `data/products.ts` must export a typed `Product[]` matching the exact shape in PRD §10 — this is the contract other skills (plp-filter-sort, pdp-gallery-builder) depend on. Do not drift from it without updating the PRD.
3. `/shop` and `/shop/[slug]` must be able to run fully statically (`generateStaticParams` on the PDP) since there is no real backend yet — this keeps the MVP fast and deployable to Vercel with zero server dependencies.
4. Every new page must include `Header`, `AnnouncementBar`, and `Footer` via the root `layout.tsx` — do not duplicate them per-page.
5. Keep the three pages and only the three pages in scope (§9 of PRD). Do not scaffold `/cart`, `/checkout`, `/account` routes — stub CTAs may point at `/shop` or be visually present but non-functional per the PRD.

## Output checklist
- [ ] `next build` succeeds with zero errors
- [ ] All three routes render with placeholder/fixture content
- [ ] TypeScript strict mode passes (`tsc --noEmit`)
- [ ] No route exists outside the PRD §7 sitemap
