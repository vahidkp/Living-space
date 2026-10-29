---
name: seo-metadata-schema
description: Adds per-page metadata, OpenGraph tags, sitemap, and Product structured data required by the PRD's SEO section. Use once each page's content is finalized, and whenever a new product is added to the fixture data.
---

# SEO & Metadata Skill

## When to use
- After Homepage, Shop, or PDP content is finalized
- Whenever `data/products.ts` changes (sitemap and structured data must stay in sync)

## Requirements per page

### Homepage (`app/page.tsx` / `app/layout.tsx`)
- Root `metadata` export: site title template (e.g. `%s | Almadinah Furniture`), default description, OpenGraph defaults, favicon/social share image.

### Shop (`app/shop/page.tsx`)
- `generateMetadata` reflecting active filters where reasonable (e.g. "Dining Furniture | Almadinah Furniture" when `?category=dining` is present), falling back to a generic "Shop All Furniture" title otherwise.

### PDP (`app/shop/[slug]/page.tsx`)
- `generateMetadata` per product: `title` = product name + brand, `description` = trimmed product description, `openGraph.images` = product's primary image.
- Inline `<script type="application/ld+json">` with `schema.org/Product`: `name`, `image`, `description`, `offers.price`, `offers.priceCurrency` (AED), `offers.availability`.

### Site-wide
- `app/sitemap.ts` generating entries for `/`, `/shop`, and every `/shop/[slug]` from the fixture data.
- `app/robots.ts` allowing all crawling for this public storefront.
- Semantic heading order on every page: exactly one `h1` per page, `h2`/`h3` used hierarchically for section titles — never skip levels or use headings purely for font size.

## Output checklist
- [ ] Every page has a unique `<title>` and `<meta description>`
- [ ] `sitemap.xml` includes every product slug currently in the fixture data
- [ ] PDP JSON-LD validates against Google's Rich Results structured data expectations
- [ ] Heading hierarchy passes an automated audit (no skipped levels, exactly one h1 per page)
