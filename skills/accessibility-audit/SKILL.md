---
name: accessibility-audit
description: Audits and fixes WCAG 2.1 AA accessibility issues (contrast, keyboard nav, ARIA, alt text) across the storefront per the PRD's non-functional requirements. Use as a pass after each page is functionally complete, and whenever an interactive component (carousel, gallery, accordion, filter drawer) is built.
---

# Accessibility Audit Skill

## When to use
- After any interactive component is built (carousel, image gallery, accordion, filter drawer, dropdown)
- As a dedicated pass before the MVP is considered done, on all three pages

## Checklist

### Structure & semantics
- [ ] One `<h1>` per page; logical heading order; `<nav>`, `<main>`, `<footer>` landmarks present
- [ ] Product grids use a `<ul>/<li>` (or equivalent semantic list) structure, not bare `<div>` soup
- [ ] All images have meaningful `alt` text; purely decorative images are `aria-hidden`

### Keyboard
- [ ] Every interactive element (carousel arrows, gallery thumbnails, accordion headers, filter drawer trigger, sort dropdown, quantity stepper, swatches) is reachable and operable via Tab/Shift+Tab/Enter/Space
- [ ] Visible focus ring on every focusable element (never `outline: none` without a replacement style meeting contrast requirements)
- [ ] Dialogs/drawers (mobile filter sheet, PDP lightbox) trap focus while open and restore focus to the trigger on close; dismissible via Escape

### Color & contrast
- [ ] Body text on `--color-bg`/`--color-bg-alt` meets 4.5:1 contrast against `--color-ink`
- [ ] Muted/caption text (`--color-muted`) checked separately — if it fails 4.5:1 at small sizes, darken it slightly rather than using it for essential copy
- [ ] Interactive elements (buttons, links) are distinguishable by more than color alone (underline, icon, weight change)

### ARIA
- [ ] Accordion headers: `aria-expanded`, `aria-controls` correctly wired
- [ ] Carousel: `aria-label` on the region and on prev/next buttons; consider `aria-live="polite"` on a hidden status region if the visible card changes on autoplay (autoplay is discouraged for this brand's calm aesthetic — prefer manual/scroll-snap only)
- [ ] Filter checkboxes/radios properly associated with `<label>` elements

## Tooling
Run automated checks (axe-core via Playwright, or Chrome DevTools Lighthouse Accessibility audit) on all three pages, then manually verify keyboard flows since automated tools cannot fully validate focus order or gesture support.

## Output checklist
- [ ] Lighthouse Accessibility score ≥ 95 on all three pages
- [ ] Manual keyboard walkthrough completed on all three pages with no dead ends
- [ ] No color contrast failures reported by automated audit
