---
name: responsive-layout-audit
description: Audits and fixes responsive behavior across the three pages at mobile, tablet, and desktop breakpoints against the PRD layout spec. Use after any page or major component is first implemented, and before marking a page "done".
---

# Responsive Layout Audit Skill

## When to use
- Immediately after Homepage, Shop, or PDP first render with real content
- Whenever a new section/component is added to an existing page
- As a final pass before calling the MVP complete

## Breakpoints (PRD §11)
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: > 1024px

## Checklist per page

### Homepage
- [ ] Hero collapses to a shorter viewport height on mobile with headline remaining fully legible (no overflow/clipping)
- [ ] Category tiles: 3-up desktop → 2-up tablet → stacked or horizontal-scroll on mobile
- [ ] Split promo banners: image+text side-by-side desktop → stacked (image above text) on mobile
- [ ] Product carousels: multi-card desktop → 1.1–1.2 card peek on mobile with horizontal scroll-snap
- [ ] Lifestyle duo banner: side-by-side desktop → stacked on mobile
- [ ] Footer columns: 4-up desktop → 2-up tablet → single accordion-style or stacked column on mobile

### Shop (PLP)
- [ ] Filter sidebar: fixed left column desktop → collapses into a "Filters" trigger + drawer on mobile/tablet
- [ ] Product grid: 3–4 columns desktop → 2 columns tablet → 1–2 columns mobile
- [ ] Sort dropdown remains reachable and doesn't overlap the filter trigger on small screens

### PDP
- [ ] Two-column (gallery | info) desktop → stacked (gallery above info) on mobile/tablet
- [ ] Thumbnail rail: vertical beside main image on desktop → horizontal scroll strip below main image on mobile
- [ ] Sticky "Add to bag" bar consideration on mobile if the CTA would otherwise scroll far off-screen

## Method
1. Use the browser devtool viewport presets (or Playwright/Chrome DevTools MCP if available) at 375px, 768px, 1440px for every page.
2. Check for horizontal overflow (`document.documentElement.scrollWidth > window.innerWidth`) — there should be none at any breakpoint.
3. Verify tap targets are ≥ 40px on mobile (buttons, swatches, arrows).
4. Re-run after any fix to confirm no regression at the other two breakpoints.

## Output checklist
- [ ] No horizontal scroll/overflow at 375px, 768px, or 1440px on any of the 3 pages
- [ ] Every checklist item above verified visually
- [ ] Screenshots or notes captured for any deviation intentionally accepted
