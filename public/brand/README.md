# Brand assets

Derived from the supplied artwork, `IMG-20261027-WA0002.jpg` in the repo root
(1440×1440 JPEG, logo on solid black). Nothing was redrawn. Each file is the
original's own pixels, re-arranged and/or recoloured.

| File | Size | Where it's used |
|---|---|---|
| `ls-logo.png` | 1428×264 (5.41:1) | Header, on the cream page |
| `ls-logo-cream.png` | 1428×264 | Footer, on the dark surface |
| `ls-mark.png` | 546×465 | Source for the favicon / app icons |

Brand colours measured off the artwork: **gold `#DDC785`**, **charcoal `#25262A`**.

## Why the lockup is horizontal

The artwork is stacked: the triangle mark above "LIVING SPACE" / "FURNITURE",
at about 1.35:1. At the header's 40px height that makes the wordmark roughly
5px tall, so it can't be read. These files put the same two pieces side by side
instead. The mark is on the left, scaled to 1.2× the text block's height. The
two-line text block is on the right, cropped as one unit so its original
spacing and centring are untouched.

## Getting real alpha out of a JPEG on black

The source has no transparency, and its charcoal glyphs sit on black at only
~1.2:1, so a colour key would lose them. Each pixel is instead treated as
`a_gold·GOLD + a_char·CHARCOAL` over black and solved for both coverages. That
gives true antialiased alpha and lets each variant swap ink colours while every
glyph keeps its own edge.

Two JPEG problems needed handling:

- **Chroma subsampling greys out the gold's edges**, so a dim gold edge pixel
  is numerically identical to solid charcoal. Pixels are therefore assigned to
  whichever ink's solid *core* is nearer (cores must be solid across a 5×5
  neighbourhood, which 1–2px edge rings are not). The two-ink split is kept
  only where the LS monogram meets the triangle. Without this, every gold glyph
  had a dark outline on the cream header.
- **Ringing and block noise** are dropped beyond 7px of any glyph and
  noise-floored within it. A few 2–3px notches along the triangle's inner base,
  from a dark chroma line in the source, are filled by a directional gap-fill
  that only raises a pixel with ink on both sides.

The build script lives outside the repo. Re-running it needs only Pillow.

## Why neither tone is the raw artwork

Measured against the surfaces they sit on:

| | on cream `#F7F4EF` | on dark `#161611` |
|---|---|---|
| source gold `#DDC785` | **1.52:1** (triangle and "FURNITURE" all but vanish) | 10.88:1 |
| deep gold `#9D812C` | 3.41:1 | n/a |
| charcoal `#25262A` | 13.78:1 | ~1.2:1 (invisible) |
| cream `#F7F4EF` | n/a | 16.54:1 |

- `ls-logo.png` keeps the charcoal and darkens the gold to `#9D812C`. That's
  the same hue, with lightness lowered until it clears 3:1 (the WCAG bar for
  graphics) on both page tints.
- `ls-logo-cream.png` keeps the source gold and recolours only the charcoal to
  cream. This is the same treatment the footer logo has always had.

## Icons

`app/icon.png`, `app/apple-icon.png` and `app/favicon.ico` are the triangle mark
on a `--color-surface-dark` tile: gold triangle, cream monogram, matching the
dark ground the artwork was supplied on. The mark is lifted ~4% above centre,
because a triangle's mass sits low and a box-centred one looks dropped. It was
checked at 16 / 32 / 48px. The triangle and LS stay distinct at 32px and up.

## If a vector version exists

Use it. These are raster derivatives of a 1440px JPEG. A vector (SVG/AI/EPS)
would be sharper at every size, a fraction of the bytes, and would let the
footer treatment be a CSS `fill` instead of a second file.
