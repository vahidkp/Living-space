---
name: plp-filter-sort
description: Implements the Shop / Product Listing Page filtering, sorting, and pagination using URL search params and Server Components. Use when building /shop, FilterSidebar, SortDropdown, or Pagination/LoadMore.
---

# PLP Filter & Sort Skill

## When to use
- Building `app/shop/page.tsx`
- Building `components/shop/FilterSidebar.tsx`, `SortDropdown.tsx`, `Pagination.tsx`
- Debugging any case where filter/sort state doesn't survive a page refresh or isn't shareable via URL

## Architecture
- `/shop` is a Server Component that reads `searchParams` (`category`, `sort`, `page`, and optional `minPrice`/`maxPrice`) directly — do not manage filter state in client-side React state as the source of truth.
- Filtering/sorting logic lives in a pure function in `lib/products.ts`, e.g. `getFilteredProducts(products, searchParams)`, unit-testable independent of React.
- `FilterSidebar` and `SortDropdown` are client components that update the URL via `useRouter().push` / `<Link>` with new search params — they render the current state from `searchParams`, they don't own it.
- On mobile, `FilterSidebar` collapses into a bottom-sheet/drawer triggered by a "Filters" button; use a Dialog/Sheet primitive from `components/ui`.

## Filter fields (from PRD §8.2)
1. Category (single or multi-select — pick single-select unless PRD is updated) — values come from `data/categories.ts`, not hardcoded strings.
2. Price range (min/max, can be a simple two-input or a slider — prefer simple inputs for MVP speed).
3. Color/Material — derived dynamically from the distinct `colors[].name` / `materials` present in the currently loaded product set, not a hardcoded list.
4. Availability — boolean, hide if no fixture data models stock (skip this filter if `Product` type has no stock field yet).

## Sort options
`Featured` (default, fixture order / `featured: true` first) · `Price: low to high` · `Price: high to low` · `Newest` (fixture order reversed, or an `id`-based proxy until a real `createdAt` exists).

## Rules
- Every filter/sort change must be reflected in the URL so the page is shareable and works with browser back/forward.
- Empty state: when filters produce zero results, render a clear message + a "Clear filters" link, never a blank grid.
- Result count ("124 items") updates based on the filtered set, shown next to the page title per PRD §8.2.
- Pagination: prefer a simple "Load more" button (client component appending the next page of already-fetched/static data) over full numbered pagination, to match the understated Bloomr aesthetic — but numbered pagination is acceptable if the catalog is large.

## Output checklist
- [ ] Reloading `/shop?category=dining&sort=price-asc` produces the same filtered/sorted view as navigating there via UI
- [ ] Filter and sort logic has zero duplication between server render and any client-side re-render
- [ ] Mobile filter drawer is keyboard-dismissible (Escape) and traps focus while open
