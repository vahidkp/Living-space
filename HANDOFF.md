# Handoff — Living Space Furniture storefront

> **Rebranded 2026-10-29 from Zero Space Furniture to Living Space Furniture.**
> Everything below §0 is the verification record of the Zero Space build. That
> build had the same engineering but a different brand and an office-furniture
> catalogue. Its structure, accessibility and performance work all carry over.
> Its numbers were measured on a different catalogue and different images, so
> **re-run them before quoting them for this site.**

## 0. The Living Space rebrand — what changed, and what is placeholder

**Changed:** the brand name, logo and icons (`public/brand/README.md`), all
copy, the contact details, the categories (majlis / sofas / TV units / beds &
bed walls), and the whole catalogue. Everything is now price-on-request, so the
price filter and price sorts are withdrawn until a product has a price (see
`hasPricedProducts()` in `lib/products.ts`). The header's "Sale" link became
"All Furniture", and the home page's dark strip now opens a WhatsApp enquiry.

**Placeholder, and must be replaced before launch:**

- **Every image** is a free-licence stock photo (`public/images/stock/CREDITS.md`).
  None of them shows Living Space's work. The product names and descriptions
  were written to match those photos, so they go when the photos go.
- **The WhatsApp number** is assumed to be the bio's mobile, 054 738 2878.
- **The business details** come only from the Instagram bio. There is no
  street address, email, opening hours or returns policy, and none is
  invented. Add them to `lib/site.ts` when the business supplies them.
- **Footer service and company links** still point at `/shop`, as they did
  before.

---

## 1. Verified results

Measured against a production build (`next build && next start`), not dev mode.

### Lighthouse — mobile emulation, median of 3 runs

| Page | Performance | Accessibility | Best practices | SEO | CLS | LCP | TBT |
|---|---|---|---|---|---|---|---|
| Homepage | **95** | **100** | 100 | 100 | 0 | 2.9s | 168ms |
| Shop | **93** | **100** | 100 | 92 | 0 | 2.9s | 143ms |
| PDP | **94** | **100** | 100 | 100 | 0 | 3.0s | 129ms |

PRD §11 targets — Performance ≥90 and CLS <0.1 — are met on all three pages.
Accessibility ≥95 (the skill's bar) is exceeded at 100.

**Re-run these three times.** Individual runs on a loaded development machine
swung between 84 and 96 for the same build; the medians above were stable across
several rounds. A single low number means the machine was busy, not that
something regressed.

### Axe-core, WCAG 2.1 A + AA

**Zero violations** across ten page states: home / shop / PDP / 404 / empty-filter
results, each at 375px and 1440px — plus the mobile filter sheet and the PDP
lightbox audited *while open*, since a modal's problems only exist when it is.

### Functional suite — 30 assertions, all passing

Filtering, sorting, cumulative "load more", empty state, inverted price range,
focus trapping and Escape/focus-restore on both overlays, gallery thumbnails and
lightbox navigation, accordion keyboard operation, quantity stepper bounds, add-to-bag
confirmation content, carousel scrolling and list semantics, newsletter, JSON-LD
validity, `prefers-reduced-motion`, and a **JavaScript-disabled** pass confirming
no section is left invisible and product cards still render.

### Responsive

No horizontal overflow at 375 / 768 / 1440 on any page (`scrollWidth === innerWidth`
at every breakpoint). No broken images. Exactly one `h1` per page, no skipped
heading levels. Every pointer target ≥24px (WCAG 2.5.8); every button, swatch,
arrow and stepper ≥44px.

### Weight

| Page | JS (first load) | Fonts | Images (above fold) |
|---|---|---|---|
| Homepage | 121 kB | 65 kB | 111 kB / 4 requests |
| Shop | 124 kB | 65 kB | 214 kB / 19 requests |
| PDP | 124 kB | 65 kB | 221 kB / 13 requests |

Images are served as AVIF. The homepage hero — the LCP element — is 23 kB.

---

## 2. Two performance findings worth keeping

**The hover-swap image was doubling mobile image bytes.** Each product card
renders a second image for the hover cross-fade. It sits stacked behind the
primary inside the same in-viewport box, so `loading="lazy"` did *not* prevent
it: the browser considered it visible and fetched it. On touch devices, where a
hover swap can never fire, that was pure waste. It is now inside a `.hover-only`
wrapper that is `display: none` outside `(hover: hover) and (pointer: fine)` —
`display:none` being the only thing that reliably stops the fetch. This moved
homepage Total Blocking Time from **680ms to ~150ms** and the score from
**77 to 93**. The primary image's fade is gated behind the same media query, so a
touch browser's sticky `:hover` can never fade a card to an empty box.

**The scroll-reveal bootstrap caused a React hydration mismatch.** It stamps
`data-reveal-ready` onto `<html>` during head parse, before hydration, so the
client DOM carries an attribute the server HTML does not. That divergence is
deliberate — it is what keeps the reveal a progressive enhancement — so the fix
was `suppressHydrationWarning` on the `<html>` element (React's documented escape
hatch for a pre-hydration script mutating an element it owns), not removing the
behaviour. It applies one level deep, so mismatches elsewhere are still reported.
Verified: no hydration warnings on any of the three pages, and all six reveal
targets still transition from `pending` to `shown` on scroll.

**Fraunces weight 400 was downloaded on every page and never rendered a glyph** —
base `h1`–`h4` is weight 300 and every explicit `font-display` usage pairs with
`font-light`. Dropping it took fonts from 83 kB to 65 kB.

---

## 3. Deliberate departures from the PRD

Each of these is a case where two instructions conflicted. Flagging rather than
burying them — reverse any you disagree with.

**No shadcn/ui** (PRD §6 suggests it). Only three primitives were needed —
accordion, lightbox, filter sheet. Hand-building them with correct ARIA and a
shared focus-trap hook cost less than a Radix dependency, and the
performance-lighthouse skill explicitly warns against client-bundle weight. The
result is 100 on accessibility.

**No Framer Motion** (PRD §6 suggests it). Every motion pattern the PRD asks for
— hover cross-fade, image scale, scroll reveal, accordion expand — is a CSS
`transform`/`opacity` transition. Reveal uses one `IntersectionObserver`. This
avoided ~50 kB of client JS against a ≥90 mobile target.

**Tailwind v4 CSS-first tokens, not `tailwind.config.ts`.** The design-system
skill's checklist names that file, but v4's `@theme` block satisfies the actual
rule better: it emits the CSS variables *and* generates the utilities from one
declaration, so `var(--color-ink)` and `text-ink` cannot drift apart.

**The announcement bar is a marquee** (PRD §8.1.1 asks for "rotating"; built
static first, then changed to a scrolling marquee on request).

This is the one place the site animates continuously, so it carries the
mitigations that make that legitimate rather than merely tolerated:

- **An explicit pause/play button.** WCAG 2.2.2 requires a real mechanism to stop
  content that moves automatically for more than five seconds. Hover does not
  count — it is unreachable by keyboard and touch. The button is Tab-reachable
  and Space/Enter operable, and carries `aria-pressed`.
- **Pause on hover**, so a mouse user can stop a line mid-read.
- **No animation at all under `prefers-reduced-motion`**, where it degrades to a
  single static line (the first, which is why `lib/site.ts` notes that entry
  should be the message that matters most).
- The message list is rendered **twice** and the track translates by exactly
  −50%, so the loop is seamless with nothing measured in JS. The duplicate is
  `aria-hidden` — the same sentences announced twice is noise.

There is deliberately **no pause-on-focus**. The bar holds no focusable content
besides the toggle, so such a rule could only fire on the toggle itself — and
pressing "Resume" would then leave the marquee visibly stopped while it still had
focus, which reads as a broken control.

Two bugs found while building it, both worth knowing about:

- A `:focus-within` pause was written first and **could never fire**, for the
  reason above. Removed rather than papered over.
- The reduced-motion `display: none` overrides **silently lost to Tailwind**:
  they were declared inside `@layer components`, but the elements carry the
  `flex` utility and the utilities layer is ordered later. The bar showed all six
  messages stacked. Those overrides now sit unlayered at the end of
  `globals.css`, which outranks every layer. If you add rules that must beat a
  Tailwind utility, put them there too.

Verified by 13 assertions covering scroll, all three pause paths, the aria-hidden
duplicate, reduced motion, and mobile overflow.

**Two PRD §5.2 colours were darkened** to reach WCAG AA 4.5:1 on both the
`#F7F4EF` and `#EDE7DC` grounds. Hue and saturation held constant:

| Token | PRD | Used | on `--color-bg` | on `--color-bg-alt` |
|---|---|---|---|---|
| `--color-muted` | `#8B8578` | `#6D685E` | 3.34 → **5.05** | 3.00 → **4.50** |
| `--color-terracotta` | `#B26B4A` | `#95593E` | 3.76 → **5.07** | 3.38 → **4.52** |

Every other PRD token passed as written. Full measured table is in `globals.css`.

**Product-card swatches are indicators, not buttons.** The reference site's
swatches swap the tile image, which needs per-colour photography; PRD §10 models
`colors` as name + hex with no image mapping. Rendering buttons that visibly do
nothing is worse than an honest indicator, so the grid shows dots plus a
screen-reader summary. The PDP swatches *are* interactive, because there is room
to name the selection in text. When per-colour imagery exists, the card becomes a
client component and the dots become buttons — the layout does not change.

**The colour filter is capped in height, not in options.** Colour facets are
derived from the catalogue, and the catalogue names colourways individually
("Tanned Cognac", "Cypress", "Dune") — so there are ~26 of them and most match a
single product. Uncapped, the list ran well past the product grid. It now scrolls
within a fixed height, shows a count per colour, and orders by how many products
share the colourway. If the data ever gains a structured colour *family* per
product, this should become a short list of families instead.

**No material or availability filter** (PRD §8.2 lists both). `Product.materials`
is free prose ("Full-grain aniline leather, kiln-dried beech frame…"), not an
enum, so there is no set of distinct values to derive a facet from; and there is
no stock field at all. Both need a schema change, which the data-model skill says
to make deliberately rather than by bolting on untyped fields. Category, price and
colour cover the PRD's filter intent meanwhile.

**`/shop` renders dynamically.** The scaffold skill asks for all routes to be
fully static; the plp-filter-sort skill requires filter state to be read from
`searchParams` on the server. Those cannot both hold — a page reading
`searchParams` is dynamic by definition. The more specific instruction won. There
is still no backend: all 24 PDPs are statically prerendered, and `/shop` renders
from a local fixture with no I/O. One consequence is that Next sets
`cache-control: no-store` on `/shop`, which disqualifies it from the browser
back/forward cache. If that matters, either add explicit cache headers for `/shop`
or adopt Partial Prerendering.

---

## 2a. The catalogue is real, and it changed the data model

The storefront now carries **the actual Zero Space range**, not the fictional home
furniture the PRD specified: 62 products over six categories, pulled from
zerospacedecor.com's open WooCommerce Store API
(`/wp-json/wc/store/v1/products`) rather than scraped from HTML.

What the import does, in `scratchpad` scripts that are not part of the app:

- normalises names, slugs, prices (minor units → whole dirhams) and categories
- strips SEO boilerplate from descriptions — nearly every paragraph repeated
  "best office fit-out furniture supplier in Dubai, UAE"
- splits the spec bullets into `materials` / `dimensions`
- maps the Finish / Color / Leg Color attributes onto swatch hexes
- re-encodes all 121 photos to 1200px progressive JPEG (34 MB → 6.5 MB)

### Price-on-request is a real state, not missing data

Eleven pieces — seven workstations, a pedestal, a sofa, a desk and a chair — are
quoted per configuration and carry no published price. `Product.price` is
optional to model this. Defaulting it to 0 would be wrong in four separate
places, all of which are handled:

| Where | Behaviour |
|---|---|
| `PriceDisplay` | renders "Price on request", not "AED 0" |
| price sort | sorts them **last** in both directions, not first under "low to high" |
| price filter | a range excludes them — a bound is a statement about price |
| PDP JSON-LD | the whole `offers` node is omitted; `JSON.stringify` drops an undefined `price`, which would otherwise emit an Offer with no price and fail Search Console validation |

### Two things found in their data

- **A stale slug.** `ZS-1819-V Visitor Executive Leather Chair` still lives at
  `…/medium-back-executive-leather-chair-zs-1802-m` — the product was renamed
  without updating the URL. Kept as-is, because it is their live canonical URL,
  but worth fixing at source.
- **13 products excluded**: 11 had no image, no category, or both; the rest
  duplicated. Nothing was invented to fill gaps.

### The scrim had to be strengthened

Their photography is largely product shots on near-white studio backgrounds. The
category-tile scrim was tuned for the old dark lifestyle images and put white
tagline text at roughly 2.3:1 over the storage and sofa tiles. **axe cannot catch
this** — it sees text over a transparent element and skips it. The gradient is now
measured against a hypothetical pure-white photo, giving a worst case of 7.23:1.
If you lighten those stops, re-measure by hand.

## 2b. Filters are multi-select checkboxes

The category and colour facets were single-select `<Link>`s; they are now real
`<input type="checkbox">` controls, which means **multi-select**.

- **URL encoding is repeated params** — `?category=dining&category=bedroom`,
  not a comma-joined value. That is precisely what a plain HTML checkbox form
  submits, so the no-JS path and the JS path land on byte-identical URLs and only
  one parser is needed. When writing these, `params.append` — `set` would keep
  only the last one.
- **Semantics: OR within a facet, AND across facets.** Dining + Bedroom = 11
  items (5 + 6); adding a colour narrows from there. Verified against the fixture.
- **The URL is still the only source of truth.** `checked` derives from the
  `filters` prop the server parsed out of `searchParams`; there is no `useState`
  mirroring selections, so reload, share and back/forward all agree.
- **It works without JavaScript.** The panel is one
  `<form method="get" action="/shop">`; a `<noscript>` Apply button submits it.
  Verified with `javaScriptEnabled: false` — ticking two boxes and submitting
  yields `?category=bedroom&category=dining` and renders 11 items.
- The native inputs are `sr-only` (still focusable, still in the a11y tree) with
  a styled square drawn via `peer-checked`. Screen readers announce "checkbox,
  checked" and Space toggles. **A test must click the `<label>`, not the input** —
  Playwright's `.check()` aims at the hidden input and is blocked by the label.

### The nested-form trap this exposed

`PriceFilter` had its own `<form>`. Wrapping the panel in a form nested them, and
HTML forbids that: the browser drops the inner form while parsing, so the server
HTML and the client DOM disagree and **hydration fails outright** — the same class
of error as the earlier `<html>` attribute mismatch.

The fix moved `PriceFilter`'s inputs into the single outer form under the
`minPrice`/`maxPrice` names, which is also better behaviour: a no-JS submission
now sends the price range and the ticked boxes in one request. Its "Apply price"
button is a plain submit, which the form's `onSubmit` intercepts when JS is
running. `PriceFilter` no longer pushes routes itself — one navigation path, so
the two cannot drift.

Also fixed while here: the filter form had no accessible name, making it
indistinguishable from the header's search form (also `action="/shop" method="get"`)
both to a screen-reader user moving between landmarks and to the test harness. It
is now `aria-label="Product filters"`.

Covered by 22 assertions in addition to the standing suites.

## 3. The mobile menu bug — worth reading before adding any overlay

The nav drawer opened as a **375×64 sliver tucked inside the header** instead of
a full-height panel. Nothing was wrong with the drawer's own CSS.

The header carries `backdrop-blur-sm`. A non-`none` `backdrop-filter` makes an
element a **containing block for fixed-position descendants** — the same rule
that `transform`, `filter`, `perspective`, `will-change` and `contain` trigger. So
`fixed inset-0` on a DOM child of the header resolved against *the header's box*,
not the viewport. Measured on a 375×800 viewport: the overlay rendered at y=36
with height 64.

Fixed by rendering the overlay through `createPortal` into `<body>`, which takes
it out of that containing block entirely. That was chosen over the one-line
alternative of dropping the header's blur because it also immunises the drawer
against any future ancestor picking up a transform.

Two consequences handled with it:

- The overlay no longer inherits the trigger's `lg:hidden`, so a `matchMedia`
  listener closes the drawer if the viewport crosses `lg` while it is open —
  otherwise a resize would strand a modal over the desktop layout.
- The portal target is resolved after mount (`document` does not exist during the
  server render). The drawer can only open on a click, so nothing is delayed.

**If you add any fixed-positioned overlay inside the header, portal it too.** The
shop filter sheet and the PDP lightbox live in page content and were verified
unaffected (bottom sheet at y=112 h=688, lightbox centred — both as designed).

Covered by 25 assertions: geometry at 375 and 768, portal target, focus entry and
restoration, Escape / backdrop / link dismissal, scroll lock and release, the
resize case, and axe with the drawer open.

## 3a. Two fixes that only showed up on a wide screen

**The design-service strip left a black band on the right.** The whole section
sat inside `.shell`, whose max-width is 1440px, so the image stopped there while
the dark background continued to the viewport edge — invisible at 1440, obviously
broken at 1680+. The copy now stays inside `.shell` (keeping its left edge
aligned with every other section) while the image is positioned from the
section's midpoint to its right edge, so it meets the viewport edge at any width.
Verified at 1024 / 1440 / 1680: right-hand gap is 0px at all three, and the copy's
left edge still lands on the shell gutter.

Worth checking any future full-bleed section for the same trap: a full-width
background plus shell-constrained content only looks right at exactly 1440.

**Headings moved from uppercase sans to the display serif.** The design-service
strip ("Al-Madina Interiors") and the footer's "Be the first to know" both used
the heavy uppercase Inter `display-caps` treatment; both now use Fraunces in
sentence case, matching the hero and the section headings and sitting far better
beside the serif logo.

`display-caps` now survives in exactly one place: the two lifestyle banner
headings overlaid on photography ("The Finishing Touches", "Made to Be Lived
In"). That is the reference site's own mix — serif for typographic headings, caps
for photo overlays — so it was left alone. If you want those serif too, it is a
one-line change in `PromoBannerDuo.tsx`, and the `.display-caps` utility can then
be deleted from `globals.css` entirely.

**Section spacing is now owned in one place.** Vertical rhythm used to come from
a `section-y` class applied to *some* homepage sections, so the gap between any
two depended on whether either happened to be padded — and where two unpadded
sections met (the lifestyle duo against the dark strip) they touched with no gap
at all. `app/page.tsx` now wraps the page in a single flex column with
`gap-16 lg:gap-24`, which cannot be forgotten on a new section and cannot double
up where two padded ones meet. Measured: every gap is exactly 64px on mobile and
96px on desktop, including the one before the footer — the PRD §5.4 rhythm.

## 3b. The brand mark — and a name discrepancy

The supplied logo artwork is now in place: the horizontal wordmark in the header,
the full badge as a cream knockout in the footer, and the armchair as the
favicon / app icons. Assets, extraction method and colour measurements are
documented in `public/brand/README.md`.

**Name resolved to "Al-Madina Furniture", matching the logo.** The PRD and the
original build used "Almadinah Furniture", which disagreed with the mark on every
page title. The logo is the authoritative brand asset, so the site was aligned to
it rather than the other way round.

`SITE.name` in `lib/site.ts` is the single source and feeds the title template,
OpenGraph, the Product JSON-LD `brand`, the footer copyright and the logo's
accessible name. Four other spots were prose and were changed with it: the hero
eyebrow ("The Al-Madina Collection"), the design-service strip ("Al-Madina
Interiors"), the `package.json` name, and the placeholder deploy URL
(`al-madina-furniture.vercel.app`).

Two "Almadinah" strings intentionally remain: the reference to the PRD's actual
filename in `globals.css`, and the comment in `lib/site.ts` recording why the
rename happened. The **repository directory itself** is still
`almadinah-furniture` — renaming a checked-out folder is your call, not
something to do behind your back, and nothing in the build depends on it.

If a **vector** version of the logo exists, use it — the current assets are
crops of a raster PNG. See `public/brand/README.md`.

The mark's red and green also sit outside the PRD §5.2 warm-neutral palette. The
site palette was left as the PRD specifies and the logo carries its own colour,
which is a normal arrangement; but if you want the palette pulled toward the
brand colours, that is a deliberate design pass worth doing on purpose.

## 4. Known gaps — read before demoing

**The photography is placeholder and must be replaced.** 38 Unsplash images
(Unsplash License: commercial use, no attribution) stand in for product shots.
**These are not photographs of Almadinah products.** Several are room scenes
rather than the specific piece named — the copy describes a product the image only
approximates. **Outdoor is the weakest category** and should be reshot first: the
two outdoor products and the category tile use woven/lounge imagery that reads as
an interior. See `public/images/README.md`.

**Product copy is invented.** Names, prices, materials and dimensions are
plausible but fictional, written to exercise every UI state (sale, new, swatches,
no-swatches, long names). Treat none of it as merchandising truth.

**Not wired up:** search (GETs to `/shop`, PRD §9 defers it), the newsletter
(confirms locally — replace the `onSubmit` in `NewsletterForm`), "Add to bag"
(confirms, no cart per PRD §9), and account/wishlist icons (point at `/shop`).
Footer legal and help links all point at `/shop` as placeholders.

**One Lighthouse audit is a false negative.** Shop reports `meta-description`
missing, which drops its SEO score to 92. The tag is verifiably present in both
the served HTML and the live DOM after hydration:
`curl -s localhost:3123/shop | grep 'meta name="description"'`. Nothing to fix.

**Simulated vs measured LCP.** Lighthouse reports LCP at 2.8–3.0s, above the
PRD's 2.5s target — but that figure is Lantern's *simulation*, not a
measurement. With the same throttling actually applied (4× CPU, 1.6 Mbps, via
CDP), LCP measures **1.1s**, and the LCP resource is a 23 kB AVIF. The composite
performance score passes at 92–94. This is the one PRD §11 target not cleanly
met on its headline instrument, so it is worth re-measuring on real Vercel
infrastructure with field data before deciding whether anything needs doing.

**`bf-cache` fails** on all pages, partly because Playwright launches Chrome with
the back/forward cache disabled, and on `/shop` additionally because of the
`no-store` header described above.

---

## 5. Reproducing the QA

The QA tools are deliberately *not* in `package.json` — they would ship as
dependencies of a storefront that does not need them. To re-run:

```bash
mkdir -p /tmp/qa && cd /tmp/qa && npm init -y
npm i playwright axe-core lighthouse
# then run the storefront in another terminal:
#   npm run build && npm run start -- -p 3123
```

Playwright is pointed at the system Chrome via `chromium.launch({ channel: "chrome" })`,
which avoids a 150 MB browser download. Launch with
`--no-sandbox --disable-gpu --hide-scrollbars`, and navigate with
`waitUntil: "domcontentloaded"` — `"load"` blocks indefinitely on a page with
this many lazy images.

Wiring these into CI as a pre-merge gate is the obvious next step; the assertions
are already written as pass/fail.

---

## 6. Suggested next steps

1. Replace placeholder photography, outdoor first.
2. Real product data — then delete the invented copy.
3. Swap `lib/products.ts` bodies for API calls (the seam is documented in-file).
4. Cart + checkout, at which point "Add to bag" gets a real destination.
5. Search results page; the header form already GETs a `q` param.
6. RTL/Arabic — the layout avoids hardcoded LTR assumptions but has not been tested.
