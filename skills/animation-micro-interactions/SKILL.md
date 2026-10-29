---
name: animation-micro-interactions
description: Adds restrained, brand-appropriate hover and reveal animations (image hover swap, fade-ins, carousel scroll) matching the calm Bloomr aesthetic. Use when polishing a component after its functional behavior is complete — never before functionality is working.
---

# Animation & Micro-interactions Skill

## When to use
- Final polish pass on a component that is already functionally complete
- Never as the first pass on a new component — get it working plainly first, then animate

## Tone
The reference brand is calm and editorial, not flashy. Every animation should be **subtle and fast** (150–300ms), never bouncy, never a distraction from the product photography.

## Approved patterns
- **ProductCard hover**: image cross-fade to secondary image (opacity transition, ~200ms), slight scale (1.0 → 1.03) on the image only, not the whole card.
- **CategoryTile hover**: gentle image scale (1.0 → 1.05, 300ms ease-out) with overlay label staying static.
- **Button hover**: background/border color transition only (150ms), no scale/bounce.
- **Section reveal on scroll**: optional simple fade+slight-translate-up (e.g. 16px) as sections enter viewport, using `IntersectionObserver` or a lightweight Framer Motion `whileInView` — keep the offset small and the duration short so it reads as polish, not a "scroll-jacking" effect.
- **Accordion expand/collapse**: height/opacity transition, ~200ms ease.
- **PDP gallery main image swap**: quick cross-fade (~150ms) between thumbnails, not an abrupt cut.

## Explicitly avoid
- Autoplaying carousels/sliders (conflicts with the calm, user-controlled browsing feel of the reference; also an accessibility concern)
- Parallax scrolling effects
- Bounce/spring easing, large scale jumps, or anything longer than ~350ms
- Animating layout-affecting properties (width/height/margin) where a `transform`/`opacity` equivalent exists — for performance

## Output checklist
- [ ] No animation exceeds ~350ms
- [ ] All animations use `transform`/`opacity` where possible (not layout-triggering properties) for smooth 60fps performance
- [ ] Respect `prefers-reduced-motion`: reveal/hover animations are disabled or reduced to instant state changes for users with that preference set
- [ ] No autoplaying motion anywhere on the site
