# Product Requirements Document
## Almadinah Furniture — E-commerce Website (3-Page MVP)

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | August 11, 2026 |
| **Author** | Product/Design |
| **Status** | Draft for build |
| **Tech Stack** | Next.js (App Router) + TypeScript + Tailwind CSS |
| **Build Environment** | Google Antigravity (agentic IDE) |
| **Design Inspiration** | Bloomr (bloomr.ae) — reference screenshot attached |

---

## 1. Executive Summary

Almadinah Furniture needs a premium, editorial-feeling e-commerce front end that matches the calm, warm, minimalist aesthetic of **Bloomr** — muted earth tones, generous whitespace, large lifestyle photography, serif headline type paired with clean sans body copy, and restrained, high-craft UI chrome (no clutter, no loud sale banners).

This MVP covers **three pages only**:

1. **Homepage** — brand storytelling + category/product discovery
2. **Shop / Category Listing Page (PLP)** — browsable, filterable grid of products
3. **Product Detail Page (PDP)** — single product deep-dive with gallery and add-to-cart

Cart, checkout, auth, and CMS backend are explicitly **out of scope** for this phase (see §9).

---

## 2. Goals & Objectives

- Recreate the **look, feel, layout rhythm, and interaction patterns** of the Bloomr reference site, re-skinned for the Almadinah Furniture brand.
- Ship a **fast, responsive, accessible** Next.js storefront that can later plug into a real commerce backend (Shopify/Medusa/custom API) without a redesign.
- Establish a **reusable design system** (tokens, components) so future pages (cart, checkout, PDP variants) are trivial to add.
- Keep the codebase **agent-friendly** — clean file structure, typed data models, and documented components so Antigravity's agents can extend it autonomously.

## 3. Target Audience

- Middle East / Gulf region shoppers (AED-style pricing conventions, RTL-ready architecture even if v1 ships LTR-only English).
- Design-conscious buyers furnishing homes — mid-to-premium price point, similar shopper profile to Bloomr's audience.

## 4. Non-Goals (see §9 for full out-of-scope list)

- No payment processing, no real checkout flow, no user accounts in this phase.

---

## 5. Design Language (extracted from Bloomr reference)

### 5.1 Visual mood
Warm neutral, gallery-like, low-saturation. Photography carries the emotion; UI gets out of the way. Thin dividing rules, small-caps micro-labels, lots of negative space, soft shadows only on hover states.

### 5.2 Color palette

| Token | Hex (approx.) | Usage |
|---|---|---|
| `--color-bg` | `#F7F4EF` | Page background, cards |
| `--color-bg-alt` | `#EDE7DC` | Section backgrounds, tinted panels |
| `--color-ink` | `#221F1B` | Primary text, dark banners |
| `--color-ink-soft` | `#4A463E` | Secondary text |
| `--color-muted` | `#8B8578` | Captions, meta text, borders |
| `--color-accent-olive` | `#5C6B4E` | Category tags, hover accents |
| `--color-accent-terracotta` | `#B26B4A` | Sale badges, CTA hover (used sparingly) |
| `--color-surface-dark` | `#161611` | Footer, dark promo banners |
| `--color-line` | `#DFD9CC` | Hairline dividers |

### 5.3 Typography

| Role | Family (suggested) | Notes |
|---|---|---|
| Display / H1–H2 | `"Fraunces"` or `"Playfair Display"` (serif, light weight) | Large, tight tracking, sentence case |
| Section labels / eyebrow | `"Inter"`, uppercase, letter-spacing +0.08em, 11–12px | e.g. "SHOP BY CATEGORY", "40% OFF EVERYTHING" |
| Body / UI | `"Inter"` or `"Neue Montreal"` | Regular 15–16px, relaxed line-height |
| Price | `"Inter"` medium | Slightly larger than body, ink color |

### 5.4 Layout rhythm

- Full-bleed hero (100vw, ~70–85vh) with centered serif headline + single ghost/outline CTA button.
- Alternating **section pattern**: hero → 3-up category tiles → split promo (image + text) → 3-up product carousel with "up to X% off" badges → 2-up lifestyle banner duo → dark promo strip (VIP/service) → 3-up product carousel → newsletter/footer dark band.
- Max content width ~1440px, 24–32px gutters, 64–96px vertical rhythm between sections.
- Product cards: square/portrait image, hover swaps to secondary image or reveals swatch dots, name in ink, price with strikethrough original + discounted price, small discount tag top-left.
- Buttons: pill or slightly-rounded rectangle, outline style on light backgrounds, solid ink/olive on dark backgrounds. No heavy drop shadows.

### 5.5 Components to build

`Header` (logo center, search left, account/cart right, thin promo bar above), `Footer` (dark, multi-column + newsletter), `Hero`, `CategoryTile`, `ProductCard`, `ProductCarouselRow` (with left/right arrows), `PromoBannerSplit` (image+copy), `PromoBannerDuo` (2 images), `DarkPromoStrip`, `Breadcrumb`, `FilterSidebar`, `SortDropdown`, `Pagination`/`LoadMore`, `ImageGallery` (PDP), `AccordionInfo` (materials/dimensions/shipping), `BadgeDiscount`, `PriceDisplay`.

---

## 6. Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS variables for the design tokens in §5.2/5.3
- **Component layer:** shadcn/ui primitives (Dialog, Accordion, Select) restyled to match tokens
- **Images:** `next/image` with a remote loader (Cloudinary or local `/public` for MVP)
- **Data layer (MVP):** local typed JSON/TS fixtures (`/data/products.ts`) shaped to match a future CMS/API contract — see §8
- **State:** React state/URL search params for filters; no global store needed for a 3-page, cart-less MVP
- **Animation:** Framer Motion for hover/reveal micro-interactions (kept subtle, per §5)
- **Fonts:** `next/font` for the serif + sans pairing
- **Deployment target:** Vercel

---

## 7. Site Map

```
/                    Homepage
/shop                Shop (Product Listing Page) — supports ?category=&sort=&page=
/shop/[slug]         Product Detail Page
```

Shared across all three: `Header`, `AnnouncementBar`, `Footer`.

---

## 8. Page-by-Page Specification

### 8.1 Homepage (`/`)

**Purpose:** Set brand tone, drive traffic into categories and top products.

Sections (top to bottom, mirroring the reference layout):

1. **Announcement bar** — thin dark strip, rotating single-line promo text.
2. **Header** — logo centered, search icon + input (left), account/cart icons (right), sticky on scroll.
3. **Hero** — full-bleed lifestyle image, serif H1 (e.g. "Timeless pieces for modern living"), small subcopy, one outline CTA ("Shop the collection").
4. **Shop by category** — 3 tiles (e.g. Living Room, Bedroom, Dining) with image + label, hover zoom.
5. **Split promo banner** — image left/right alternating, serif headline + short copy + CTA link ("Learn more →").
6. **Featured products carousel** — 3–4 visible `ProductCard`s, horizontal scroll/arrows, "New in" or "Best sellers" eyebrow label.
7. **Lifestyle duo banner** — two large images side-by-side, each with an overlay label + CTA ("The Finishing Touches", "Made to Be Lived In").
8. **Dark promo strip** — VIP/design-service callout on dark background, ghost button.
9. **Second product carousel** — different category (e.g. seasonal edit).
10. **Newsletter + Footer** — dark band, email capture, 4-column link groups, social icons, payment/shipping badges.

**Functional requirements:**
- All CTAs route to `/shop` (optionally with a `?category=` filter).
- Product cards link to `/shop/[slug]`.
- Fully responsive: hero and carousels collapse to single-column swipeable on mobile.
- Images lazy-loaded below the fold; hero image is priority-loaded.

### 8.2 Shop / Category Listing Page (`/shop`)

**Purpose:** Browse, filter, and sort the full catalog.

Layout:
- Breadcrumb (`Home / Shop` or `Home / Shop / Living Room`).
- Page title (serif) + result count.
- Left **filter sidebar** (desktop) / bottom-sheet filter drawer (mobile): Category, Price range, Color/Material, Availability.
- Top-right **sort dropdown**: Featured, Price low–high, Price high–low, Newest.
- **Product grid**: 3–4 columns desktop, 2 columns tablet, 1–2 columns mobile. Each `ProductCard` shows image (hover swap), name, price (with sale price if applicable), discount badge, quick-add swatch dots if variants exist.
- **Pagination or "Load more"** at the bottom.
- Empty-state message if filters return zero results.

**Functional requirements:**
- Filters and sort reflected in the URL (`/shop?category=dining&sort=price-asc`) so state is shareable/bookmarkable and works with server components.
- Filtering/sorting can be done server-side (re-fetch with new search params) for a clean RSC-first implementation.

### 8.3 Product Detail Page (`/shop/[slug]`)

**Purpose:** Convert — give the shopper everything needed to decide.

Layout:
- Breadcrumb (`Home / Shop / [Category] / [Product name]`).
- Two-column layout: **left** = image gallery (large main image + thumbnail rail, swipeable on mobile), **right** = product info panel:
  - Product name (serif), category eyebrow label
  - Price (with strikethrough compare-at price if on sale)
  - Short description
  - Variant selectors (color swatch / size, if applicable)
  - Quantity stepper + primary CTA button ("Add to bag" — visually functional, cart drawer is stubbed/mocked for this phase per §9)
  - Trust row (free delivery, easy returns, warranty — icon row)
  - **Accordion**: Description, Materials & Care, Dimensions, Shipping & Returns
- **Below the fold**: "You may also like" — related products carousel (reuses `ProductCarouselRow`).

**Functional requirements:**
- Gallery supports keyboard/swipe navigation and a lightbox/zoom on click.
- Static generation (`generateStaticParams`) from the product fixture data for fast loads; `generateMetadata` for per-product SEO title/description/OG image.
- Graceful 404 (`notFound()`) for unknown slugs.

---

## 9. Out of Scope (this phase)

- Cart drawer persistence, checkout, payment gateway integration
- User authentication / accounts / order history
- Real CMS or backend API (a typed fixture file stands in; the shape is designed to map 1:1 onto a future API so swapping is low-effort)
- Multi-language / RTL layout (architecture should not block it later — avoid hardcoded LTR-only logic where trivial to avoid)
- Search results page (header search icon can be present visually; wiring is a fast-follow)

---

## 10. Data Model (fixture shape, MVP)

```ts
type Product = {
  id: string;
  slug: string;
  name: string;
  category: "living-room" | "bedroom" | "dining" | "outdoor" | "decor";
  price: number;          // in AED, minor-unit-free for MVP
  compareAtPrice?: number;
  images: string[];       // ordered gallery, [0] = primary/hover-swap pair at [1]
  description: string;
  materials?: string;
  dimensions?: string;
  colors?: { name: string; hex: string }[];
  badge?: "sale" | "new";
  featured?: boolean;
};
```

---

## 11. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Lighthouse Performance ≥ 90 mobile; hero image `priority`, all others lazy; Core Web Vitals (LCP < 2.5s, CLS < 0.1) |
| Responsiveness | Breakpoints: mobile (< 640px), tablet (640–1024px), desktop (> 1024px); layout matches reference behavior at each |
| Accessibility | WCAG 2.1 AA: semantic landmarks, alt text on all product imagery, keyboard-navigable carousels/gallery/filters, visible focus states, color contrast ≥ 4.5:1 for body text |
| SEO | Per-page metadata via `generateMetadata`, semantic heading hierarchy, OpenGraph tags, sitemap.xml, product structured data (`schema.org/Product`) on PDP |
| Browser support | Latest 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari |
| Code quality | ESLint + Prettier + TypeScript strict mode; component-level co-located styles via Tailwind, no inline style sprawl |

---

## 12. Success Metrics (for this MVP)

- Visual/interaction parity review against the Bloomr reference (design QA checklist, section by section)
- Lighthouse scores meeting §11 targets on all 3 pages
- Zero console errors/warnings; passes `next build` cleanly
- All 3 pages fully responsive at 375px, 768px, 1440px

---

## 13. Suggested Build Sequence (for Antigravity agents)

1. Scaffold Next.js + Tailwind + design tokens (fonts, colors, spacing) — no page content yet.
2. Build shared shell: `Header`, `AnnouncementBar`, `Footer`.
3. Build the component library in isolation: `ProductCard`, `CategoryTile`, `Hero`, `PromoBannerSplit/Duo`, `DarkPromoStrip`, `ProductCarouselRow`.
4. Assemble Homepage from components + fixture data.
5. Build `FilterSidebar` + `SortDropdown` + grid → assemble Shop page.
6. Build `ImageGallery` + info panel + accordion → assemble PDP.
7. Pass: responsive QA → accessibility audit → performance audit → SEO metadata pass.

This sequence maps directly to the skill set in the accompanying `antigravity-skills` package.
