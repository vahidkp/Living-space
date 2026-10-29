# Living Space Furniture — storefront

Next.js 15 (App Router) + TypeScript strict + Tailwind v4. Three pages: Home
(`/`), Shop/PLP (`/shop`), PDP (`/shop/[slug]`).

**The business is Living Space Furniture**, a maker of custom home furniture in
Abu Dhabi. Its Instagram, @livingspacefurniture2024, is the only published
source: "Custom Made Furniture | UAE • Villas & Projects Specialist •
Door-to-Door Service • All UAE Work Available", plus a phone number. The four
categories (majlis, sofas, TV units, beds & bed walls) come from its story
highlights. `lib/site.ts` records which facts came from there and which are
unknown: no street address, no email, no opening hours. Don't invent them.

**Every product photo is a STOCK PLACEHOLDER.** The business hasn't supplied
photography yet, so the 18 catalogue entries use free-licence
Unsplash images (credits in `public/images/stock/CREDITS.md`). Their names and
descriptions are written to match each photo. They are not Living Space's work
and must be replaced before launch. To replace them, swap the image files and
rewrite the entries in `data/products.ts`; no component changes are needed.

This build began as the Zero Space Furniture office storefront (sibling project
`../almadinah-furniture`), which in turn began from the PRD's brief. The
engineering is that build. The brand, copy, contacts, categories and catalogue
are Living Space's. The PRD is a record of the original brief, not a
description of this build.

**Every piece is price-on-request**, because everything is made to order and
quoted. `Product.price` is OPTIONAL, and that isn't a gap in the data. Never
default a missing price to 0: it sorts items to the front of "price: low to
high", renders "AED 0", and emits an invalid schema.org Offer. The handling is in
`PriceDisplay`, `getFilteredProducts` (bounds exclude unpriced items), the price
sort comparator (unpriced items sort last), and the PDP JSON-LD (the `offers`
node is omitted). Because no product has a price today, `hasPricedProducts()`
also withdraws the price filter and the price sorts, and `parseShopFilters`
ignores price params. Give any one product a price and all of it comes back.

Design language is derived from the Bloomr reference screenshot in the repo root
(warm neutrals, light serif display, generous whitespace, restrained motion),
with the left-aligned hero headline and category treatment from the Ashley
screenshot.

```bash
npm run dev        # local dev
npm run build      # production build (also runs type + lint checks)
npm run typecheck  # tsc --noEmit
npm run lint
```

## The rules that matter here

These are enforced conventions, not preferences. The repo has been audited
against each; breaking one is a regression.

**Design tokens.** Every colour, font and radius is declared once in
`app/globals.css` under `@theme`, which emits the CSS variables *and* the
matching Tailwind utilities. Never write a hex value or `font-family` in a
component — use `bg-bg`, `text-ink`, `border-line`, `font-display`. The only
inline colour in the codebase is `style={{ backgroundColor: color.hex }}` on
product swatches, which is *data* from the catalogue, not a design token.

Two PRD §5.2 hexes were darkened to clear WCAG AA 4.5:1; the measured table is in
the comment block in `globals.css`. Keep that table accurate if you change them.

**Data access.** No component imports `data/products.ts` directly. Everything
goes through `lib/products.ts`, which is the seam where fixtures get swapped for
a real API — replace the function bodies, leave the components alone. The
`Product` type mirrors PRD §10 exactly; if you need a new field, change the type
first, then the fixtures, then the component. Never an untyped field.

**Site furniture lives in the root layout, outside `<main>`.** `AnnouncementBar`,
`Header`, `TrustBar`, `Footer` and `WhatsAppButton` are rendered once in
`app/layout.tsx` — never per page. `TrustBar` is the tinted service-promise band
between the page content and the footer; the contact details sit in the
footer's brand column in a real `<address>`. `TRUST_ITEMS` in `lib/site.ts` is
the three promises from the Instagram bio and nothing else, and the PDP reuses
that list verbatim.

**Server by default.** Only genuinely interactive pieces are `"use client"`:
carousel arrows, image gallery, accordion, filter sheet, price inputs, sort
select, quantity stepper, mobile menu, newsletter. The product card is a Server
Component — its hover image-swap is pure CSS, so a 24-tile grid ships no JS for
the tiles. Keep it that way.

**Filters are multi-select checkboxes.** `categories` and `colors` on
`ShopFilters` are arrays, encoded as **repeated** params
(`?category=dining&category=bedroom`) — not comma-joined, because repeated params
are exactly what a plain HTML checkbox form submits, so the no-JS path and the
JS path produce byte-identical URLs. Semantics are OR within a facet, AND across
facets. Use `params.append`, never `set`, when writing these.

The whole panel is one `<form method="get" action="/shop">` with a `<noscript>`
Apply button, so filtering works without JavaScript. **Never nest a `<form>`
inside it** — `PriceFilter`'s inputs live in that same form for this reason (a
nested form is dropped by the parser and hydration fails).

**Filter state lives in the URL.** `/shop` reads `searchParams` and derives
everything. There is no client-side filter state and no second filtering
implementation — `getFilteredProducts()` is a pure function used once, on the
server. A reload, a shared link and a back-button press must all produce the
same view.

**Images.** `next/image` only; a raw `<img>` is a bug. Exactly one `priority`
image per page, on the true LCP element. Always pass an accurate `sizes` — the
correct value depends on the layout the component sits in, which is why
`ProductCard` takes it as a prop rather than guessing.

**Motion.** Nothing exceeds ~300ms and everything animates `transform`/`opacity`.
`prefers-reduced-motion` is respected everywhere, and the scroll-reveal is
progressive enhancement — with JS off, nothing is ever hidden.

The announcement marquee is the **only** continuously-moving thing on the site,
and it is allowed to be because it ships a pause button (WCAG 2.2.2), pauses on
hover, and does not animate at all under reduced motion. Don't add a second
autoplaying element without the same treatment, and don't remove that button.

**Accessibility.** The bar is: zero axe violations at WCAG 2.1 AA, one `h1` per
page, no skipped heading levels, visible focus ring on everything, dialogs trap
focus and restore it, pointer targets ≥24px. All of that is currently true and
covered by the test scripts described below.

## Brand

The brand is **Living Space Furniture**, spelled to match the logo artwork,
which reads "LIVING SPACE" over "FURNITURE". `SITE.name` in `lib/site.ts` is the
single source. It feeds the title template, OpenGraph, the Product JSON-LD, the
footer copyright and the logo's accessible name, so never hardcode the brand
name in a component. (The PRD predates every rebrand and still says
"Almadinah". Its filename is referenced verbatim in `globals.css` and should not
be "corrected". The `ChatGPT Image …png` in the root is that old Al-Madina logo,
not this one.)

The business is in **Abu Dhabi** and works across the UAE. The phone in
`SHOWROOM` is from the Instagram bio, so keep `phone` and `phoneHref` in sync.
The WhatsApp number is ASSUMED to be the same line; confirm it before launch.

Logo assets live in `public/brand/`, derived from `IMG-20261027-WA0002.jpg`. The
artwork is stacked, and the files re-arrange it into a horizontal lockup
(5.41:1) because the stacked one is unreadable at header height. `Logo` takes
`tone` and `sizes`, but no `variant`. Neither tone is the raw artwork:

- On cream, the source gold measures 1.52:1, so the header file uses a deeper
  gold (`#9D812C`).
- On the dark footer, the charcoal wordmark measures ~1.2:1, so the footer file
  recolours it to cream.

`public/brand/README.md` has the measurements and how the alpha was rebuilt
from the JPEG.

The palette tokens are unchanged from the original build: olive and terracotta
accents on warm neutrals. The brand gold lives only in the logo files, so it is
not a token.

## Layout gotchas worth knowing

Three non-obvious things bit during the build and are commented in place:

- **The reveal bootstrap needs `suppressHydrationWarning` on `<html>`.** It sets
  `data-reveal-ready` before hydration by design, which React reports as a
  mismatch. Don't "fix" it by server-rendering the attribute — that would break
  the progressive enhancement it exists to provide.

- **The reveal bootstrap watches the DOM with a `MutationObserver`, and must.**
  It runs once, on full page load. Client-side navigation then rebuilds a page
  with fresh `data-reveal="pending"` nodes that no `IntersectionObserver` is
  watching — while `data-reveal-ready` is still set on `<html>`, so the CSS hides
  them and nothing ever un-hides them. Going to `/shop` and back left all six
  revealing sections permanently blank. Don't reduce it to a one-shot
  `querySelectorAll` at `DOMContentLoaded`.

- **Scroll-snap cancels container padding.** A `snap-start` item aligns to the
  *scroll-padding* edge, so an edge-to-edge rail needs `scroll-pl-*` matching its
  `px-*` or the browser snaps the first card flush to the viewport and silently
  eats the gutter. See `CarouselScroller`.
- **The carousel rail must be the `<ul>` itself.** Putting `role="group"` on it
  strips the list role and orphans the `<li>`s (axe: serious). Wrapping it in a
  scroll `<div>` and giving the `<ul>` `w-max` fixes axe but breaks the cards'
  percentage widths. The resolution — no `role`, label on the list — is the only
  arrangement satisfying both, and the reasoning is in the file.

## Testing

There is no test framework in `package.json` by design — the QA tooling
(Playwright, axe-core, Lighthouse) was run from a scratch directory so it stays
out of the app's dependency tree. To re-run it, install those three in a scratch
folder and use the scripts described in `HANDOFF.md`, or wire them into CI.

What was verified: 30 functional/interaction assertions, axe-core across 10 page
states, Lighthouse mobile median-of-3, and rendered screenshots at 375 / 768 /
1440. Numbers are in `HANDOFF.md`.

## Scope

Cart, checkout, auth, search results and a real CMS are explicitly out of scope
(PRD §9). "Add to bag" confirms and does nothing else; the header search GETs to
`/shop`; the newsletter confirms locally. Do not scaffold `/cart`, `/checkout` or
`/account` routes. If a new section or page is requested, check it against PRD §9
before building it.
