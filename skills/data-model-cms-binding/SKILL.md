---
name: data-model-cms-binding
description: Maintains the typed product/category fixture data and keeps its shape forward-compatible with a future real backend/CMS. Use whenever product or category fixture data is added, edited, or when planning the eventual swap to a live API.
---

# Data Model & Future-CMS Binding Skill

## When to use
- Adding, editing, or removing entries in `data/products.ts` / `data/categories.ts`
- Any time a component needs a new product field not yet in the `Product` type
- Planning work for swapping fixtures for a real backend (fast-follow, not this phase)

## Rules
1. The `Product` type in `data/products.ts` is the single source of truth and must exactly match PRD §10. If a component needs a field the type doesn't have, **update the type first**, then the fixture data, then the component — never bolt on an untyped/`any` field.
2. Keep all data access behind small functions in `lib/products.ts` (e.g. `getAllProducts()`, `getProductBySlug(slug)`, `getFeaturedProducts()`, `getFilteredProducts(products, params)`) rather than importing the raw array directly all over the app. This is what will make swapping fixtures for a real API/CMS call later a localized change instead of a rewrite.
3. Use realistic placeholder content (proper furniture names, categories, plausible AED prices, real dimension/material strings) rather than "Product 1", "Lorem ipsum" — this is what will get demoed and QA'd against the Bloomr reference, so it should read like a real catalog.
4. Slugs must be URL-safe, unique, kebab-case, and stable (don't regenerate them on every edit — downstream links/SEO depend on stability).
5. When this project eventually connects to a real backend, the intended seam is: replace the function bodies in `lib/products.ts` with `fetch`/SDK calls returning the same `Product` type, leaving every component untouched. Document this seam explicitly in a code comment at the top of `lib/products.ts`.

## Output checklist
- [ ] `Product` and `Category` types match PRD §10 exactly, with no ad-hoc `any`
- [ ] All product data access goes through `lib/products.ts` helper functions, not direct array imports, in components
- [ ] Fixture catalog has enough realistic variety (multiple categories, at least a few sale items, a few featured items) to exercise every UI state (badge, no-badge, swatches, no-swatches)
- [ ] A comment documents the intended future API swap seam
