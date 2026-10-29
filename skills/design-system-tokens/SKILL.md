---
name: design-system-tokens
description: Establishes and enforces the Almadinah Furniture design system (colors, typography, spacing, radii) as Tailwind/CSS tokens matching the Bloomr-inspired PRD. Use when creating global styles, tailwind.config, fonts, or when any component appears to use a color/font not defined in the token set.
---

# Design System Tokens Skill

## When to use
- Initial project scaffold (tailwind.config, globals.css, font loading)
- Any time a new component is created — verify it consumes tokens, not raw hex/px values
- Design QA pass comparing implementation to the PRD's §5 design language

## Source of truth
Read `PRD-Almadinah-Furniture.md` §5 before generating any styles. Do not invent colors or fonts outside that section.

## Rules
1. All colors MUST be defined as CSS variables in `app/globals.css` under `:root`, then mapped into `tailwind.config.ts` under `theme.extend.colors` (e.g. `bg`, `bg-alt`, `ink`, `ink-soft`, `muted`, `accent-olive`, `accent-terracotta`, `surface-dark`, `line`). Never hardcode hex values inside components.
2. Load two font families with `next/font/google` (or local files if brand fonts are supplied): a light-weight serif for display/headings and a clean sans for body/UI, matching PRD §5.3. Expose them as `--font-display` and `--font-sans` CSS variables and map to Tailwind `fontFamily`.
3. Headings (`h1`, `h2`, section titles) use the display/serif font, sentence case, tight tracking. Eyebrow/micro-labels use the sans font, uppercase, `tracking-[0.08em]`, 11–12px.
4. Spacing scale should favor generous section padding: use Tailwind spacing tokens `16, 20, 24` (64–96px) for vertical section rhythm — define a reusable `section-y` utility class or wrapper component rather than repeating arbitrary padding per page.
5. Buttons: define two variants only — `outline` (transparent bg, 1px ink/olive border, on light backgrounds) and `solid-dark` (ink or olive fill, cream text, on dark backgrounds). No drop shadows above `shadow-sm`; shadows only appear on hover/interactive states.
6. Border radius: keep subtle — `rounded-sm`/`rounded-md` only (2–8px). This is not a rounded, playful brand; keep edges close to square with slightly softened corners.

## Output checklist
- [ ] `tailwind.config.ts` extended with the full color + font token set
- [ ] `app/globals.css` defines CSS variables and base typographic defaults (h1–h6, body, small)
- [ ] A `docs/design-tokens.md` (or Storybook-less swatch page at `/dev/tokens`) exists so future agents/humans can visually verify tokens
- [ ] No component in the repo contains a raw hex color or `font-family` string outside the token files (grep check before marking done)
