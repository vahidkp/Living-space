---
name: image-optimization
description: Ensures all imagery uses next/image correctly with proper sizing, priority hints, and formats to hit the PRD's performance targets. Use whenever an <img> tag or background-image is added anywhere in the codebase.
---

# Image Optimization Skill

## When to use
- Any time a new image is added to Hero, CategoryTile, ProductCard, PromoBanners, or ImageGallery
- During the performance audit pass before shipping

## Rules
1. **Never use a raw `<img>` tag.** Always use `next/image`'s `<Image>` component.
2. Hero image (and any other largest-contentful-paint candidate, typically the first visible image on each page) gets `priority` — but only that one image per page. All other images must NOT have `priority` (over-using it defeats lazy loading and hurts LCP).
3. Provide accurate `sizes` attributes for responsive images used in grids/carousels (e.g. `sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"` for a 4-up product grid) so the browser doesn't download oversized images on mobile.
4. Source images should be pre-optimized (compressed, correct aspect ratio) before landing in `/public/images` or the remote image host — don't rely on `next/image` alone to fix a 6000px source photo.
5. Use `fill` + a parent with `position: relative` and a fixed aspect ratio (`aspect-square`, `aspect-[4/5]`, etc.) for cards/tiles rather than fixed width/height, so layouts stay fluid across breakpoints without CLS.
6. All images require meaningful `alt` text (never `alt=""` unless the image is purely decorative, in which case mark it `aria-hidden` too).
7. If using a remote image host (Cloudinary, etc.), configure `next.config.js` `images.remotePatterns` explicitly — don't disable Next's image optimization to work around config friction.

## Output checklist
- [ ] Zero raw `<img>` tags in `components/` or `app/` (grep check)
- [ ] Exactly one `priority` image per page, on the true above-the-fold hero
- [ ] Lighthouse reports no "improperly sized images" or "next-gen formats" warnings
- [ ] No layout shift from images loading (CLS contribution ~0 from image elements)
