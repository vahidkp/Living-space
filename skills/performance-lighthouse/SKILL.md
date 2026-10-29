---
name: performance-lighthouse
description: Runs and remediates Lighthouse/Core Web Vitals performance issues to hit the PRD's 90+ mobile performance target. Use as a final pass on each page, and any time a heavy dependency (carousel lib, animation lib, web font) is being considered.
---

# Performance Audit Skill

## When to use
- Final pass on Homepage, Shop, and PDP before calling the MVP done
- Before adding any new npm dependency that touches the client bundle (carousel libraries, animation libraries, icon packs)

## Targets (PRD §11)
- Lighthouse Performance ≥ 90 on mobile
- LCP < 2.5s, CLS < 0.1

## Checklist
- [ ] Only one `priority` image per page (see image-optimization skill) and it's the true LCP element
- [ ] Fonts loaded via `next/font` (self-hosted/optimized, no render-blocking external `<link>` to Google Fonts) with `display: swap` (or Next's default) to avoid invisible-text flashes
- [ ] Client components (`"use client"`) are limited to genuinely interactive pieces (carousel, gallery, filters, accordion, quantity stepper) — static sections (hero copy, footer links) stay Server Components to minimize JS shipped to the browser
- [ ] No heavy third-party carousel/slider library — native CSS scroll-snap is used instead (see product-card-component skill) to avoid unnecessary JS weight
- [ ] Framer Motion (if used) is scoped to small, specific hover/reveal animations, not wrapping entire pages, to limit bundle impact
- [ ] Run `next build` and check the route-level JS size output; flag any page whose First Load JS is unusually large relative to the others
- [ ] Images served in a modern format (`next/image` handles this automatically) and appropriately sized per breakpoint (see `sizes` guidance in image-optimization skill)
- [ ] No unused dependencies left in `package.json` from earlier scaffolding experiments

## Method
Run Lighthouse (Chrome DevTools or CLI) in mobile emulation mode against the deployed preview (or `next build && next start` locally) for all three pages. Address the top 2–3 flagged opportunities each pass rather than micro-optimizing everything at once; re-run after each fix.

## Output checklist
- [ ] Lighthouse Performance ≥ 90 mobile on Homepage, Shop, and PDP
- [ ] LCP < 2.5s and CLS < 0.1 confirmed on all three pages
- [ ] First Load JS per route documented and reasonable (no single page dramatically heavier without justification)
