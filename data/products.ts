import type { CategorySlug } from "./categories";

/**
 * Product catalogue — Living Space Furniture (MOCKUP).
 *
 * PLACEHOLDER CONTENT: every image is a free-licence stock photo under
 * `public/images/stock/` (credits in CREDITS.md there), and each entry's name
 * and description were written to match its photo. None of it is the
 * business's own work. When real photography arrives, replace the files and
 * rewrite these entries — no component changes are needed.
 *
 * Every piece is made to order and quoted, so no entry has a `price`. Leave it
 * unset rather than 0 — see the note on the field below.
 *
 * The `Product` type is the single source of truth for the whole app. If a
 * component needs a field that isn't here, add it to this type FIRST, then the
 * fixtures, then the component — never bolt on an untyped field
 * (data-model-cms-binding skill, rule 1).
 *
 * Do not import `products` directly from a component. All reads go through the
 * accessor functions in `lib/products.ts`, which is the seam where this fixture
 * gets swapped for a live API call. See the note at the top of that file.
 */
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /**
   * Whole dirhams. OPTIONAL, because the business makes everything to order
   * and quotes each piece by size and finish — it publishes no prices. `undefined` means "Price on request"
   * and is rendered as such — it is NOT a missing value to be defaulted to 0,
   * which would both look like a bug and misprice the item.
   */
  price?: number;
  compareAtPrice?: number;
  images: string[]; // ordered gallery, [0] = primary / hover-swap pair at [1]
  description: string;
  materials?: string;
  dimensions?: string;
  colors?: { name: string; hex: string }[];
  badge?: "sale" | "new";
  featured?: boolean;
};

/**
 * One palette for every swatch, so the colour filter groups pieces under a
 * shared name rather than splitting near-identical shades into separate facets.
 * Hexes are sampled from the photos; they are catalogue data, not design tokens.
 */
const COLOR = {
  ivory: { name: "Ivory", hex: "#ECE6DA" },
  beige: { name: "Beige", hex: "#D6C4A8" },
  sand: { name: "Sand", hex: "#C9B08F" },
  lightGrey: { name: "Light Grey", hex: "#C9C9C7" },
  charcoal: { name: "Charcoal", hex: "#36373A" },
  black: { name: "Black", hex: "#1D1D1D" },
  espresso: { name: "Espresso", hex: "#3B2A22" },
  mocha: { name: "Mocha", hex: "#7A5A44" },
  terracotta: { name: "Terracotta", hex: "#C47C62" },
  teal: { name: "Teal", hex: "#6D9DA6" },
  navy: { name: "Navy", hex: "#2C3A55" },
  taupe: { name: "Taupe", hex: "#9C8F82" },
  walnut: { name: "Walnut", hex: "#6B4A33" },
  oak: { name: "Oak", hex: "#B38B62" },
  white: { name: "White", hex: "#F4F4F2" },
} as const;

const img = (file: string) => `/images/stock/${file}.jpg`;

export const products: Product[] = [
  // ── MAJLIS ──────────────────────────────────────────────────────
  {
    id: "ls-majlis-1",
    slug: "marble-wall-l-shaped-majlis",
    name: "Marble-Wall L-Shaped Majlis",
    category: "majlis",
    images: [img("majlis-1-0")],
    description:
      "A long, low L-shaped majlis in ivory fabric, run the full length of a marble-effect feature wall inlaid with brass lines. Deep seats, loose back cushions and scatter cushions in charcoal, rust and check keep it relaxed enough for every day and generous enough for a full house.",
    materials:
      "Shown in ivory textured fabric with charcoal and rust cushions. Made in any fabric, any length and any configuration — L, U or straight runs.",
    colors: [COLOR.ivory, COLOR.charcoal],
    featured: true,
  },
  {
    id: "ls-majlis-2",
    slug: "tufted-classic-majlis",
    name: "Tufted Classic Majlis",
    category: "majlis",
    images: [img("majlis-2-0")],
    description:
      "A formal majlis in the classic style: button-tufted backs, rolled arms and a matching tufted ottoman, in soft light-grey velvet. Made for a reception room with mouldings and a chandelier, and sized to the walls it sits against.",
    materials:
      "Shown in light-grey velvet with deep button tufting. Available in any velvet or fabric, with tufted or plain backs.",
    colors: [COLOR.lightGrey],
  },
  {
    id: "ls-majlis-3",
    slug: "sand-u-shaped-majlis",
    name: "Sand U-Shaped Majlis",
    category: "majlis",
    images: [img("majlis-3-0")],
    description:
      "A wide U-shaped majlis in warm sand fabric that wraps three sides of a large reception room, with plenty of seats for gatherings. Geometric black-and-cream cushions pick up the lattice screens behind it.",
    materials:
      "Shown in sand-coloured fabric with patterned scatter cushions. Every run is built to your room's dimensions.",
    colors: [COLOR.sand],
    featured: true,
  },
  {
    id: "ls-majlis-4",
    slug: "wraparound-leather-majlis",
    name: "Wraparound Leather Majlis",
    category: "majlis",
    images: [img("majlis-4-0")],
    description:
      "Continuous banquette seating in dark espresso leather that wraps the room wall to wall, with a quilted back and a low profile. A dramatic, enveloping majlis for a men's sitting room or a private lounge.",
    materials:
      "Shown in espresso leather with a quilted back. Available in leather or fabric, built to the exact length of every wall.",
    colors: [COLOR.espresso],
  },
  {
    id: "ls-majlis-5",
    slug: "floor-level-window-majlis",
    name: "Floor-Level Window Majlis",
    category: "majlis",
    images: [img("majlis-5-0")],
    description:
      "Traditional low seating set on a timber platform along a run of windows, with deep cushions and a row of back pillows in soft teal. Relaxed, floor-level majlis seating for a garden room or a family space.",
    materials:
      "Shown with grey seat cushions and teal back pillows on a timber base. Cushion fabric, height and depth made to order.",
    colors: [COLOR.teal, COLOR.lightGrey],
  },

  // ── SOFAS ───────────────────────────────────────────────────────
  {
    id: "ls-sofas-1",
    slug: "low-stone-three-seater-sofa",
    name: "Low Stone Three-Seater",
    category: "sofas",
    images: [img("sofas-1-0")],
    description:
      "A low, deep three-seater with wide square arms and plump seat cushions, in a pale stone-beige weave. Simple, solid and easy to live with — the kind of sofa a family room is built around.",
    materials:
      "Shown in beige woven fabric. Seat depth, length and fabric to your choice.",
    colors: [COLOR.beige],
  },
  {
    id: "ls-sofas-2",
    slug: "curved-terracotta-sofa",
    name: "Curved Terracotta Sofa",
    category: "sofas",
    images: [img("sofas-2-0")],
    description:
      "A long, curving sofa with a rounded back and soft bolster cushions, upholstered in warm terracotta. Its sweep works floating in the middle of a large living room as well as against a wall.",
    materials:
      "Shown in terracotta textured fabric. Made to your length and curve, in any fabric or colour.",
    colors: [COLOR.terracotta],
    featured: true,
  },
  {
    id: "ls-sofas-3",
    slug: "channel-tufted-velvet-sofa",
    name: "Channel-Tufted Velvet Sofa",
    category: "sofas",
    images: [img("sofas-3-0")],
    description:
      "A plush sofa with deep vertical channel tufting across the back and arms, in charcoal velvet, shown as a matching pair. Bold and comfortable, it pairs well with brass and marble.",
    materials:
      "Shown in charcoal velvet. Available as a single sofa, a pair or a full set, in any velvet colour.",
    colors: [COLOR.charcoal],
  },
  {
    id: "ls-sofas-4",
    slug: "channel-stitched-grey-sofa",
    name: "Channel-Stitched Grey Sofa",
    category: "sofas",
    images: [img("sofas-4-0")],
    description:
      "A tailored sofa in soft grey with fine channel stitching across the back, dressed with navy and houndstooth cushions. Crisp lines for a formal living room, made to your exact width.",
    materials:
      "Shown in light-grey fabric with navy and patterned cushions. Fabric, cushions and length made to order.",
    colors: [COLOR.lightGrey, COLOR.navy],
    featured: true,
  },
  {
    id: "ls-sofas-5",
    slug: "pillow-back-grey-sofa",
    name: "Pillow-Back Grey Sofa",
    category: "sofas",
    images: [img("sofas-5-0")],
    description:
      "A classic three-seater with soft pillow backs and rounded, padded arms, in light grey. Generous and comfortable, sized to fit the room rather than the other way round.",
    materials:
      "Shown in light-grey fabric. Available in two- and three-seat lengths, or any length you need.",
    colors: [COLOR.lightGrey],
  },

  // ── TV UNITS ────────────────────────────────────────────────────
  {
    id: "ls-tv-units-1",
    slug: "inlaid-media-wall-with-display-shelving",
    name: "Inlaid Media Wall with Display Shelving",
    category: "tv-units",
    images: [img("tv-units-1-0")],
    description:
      "A full feature wall in taupe with fine mirrored inlay lines, a floating console with slatted timber fronts and hidden LED lighting, and backlit walnut display shelves to one side. The TV, the storage and the lighting all designed as one piece.",
    materials:
      "Shown in taupe panelling with mirror inlay, walnut shelving and slatted timber. Every dimension built to your wall and screen size.",
    colors: [COLOR.taupe, COLOR.walnut],
    featured: true,
  },
  {
    id: "ls-tv-units-2",
    slug: "floating-walnut-tv-console",
    name: "Floating Walnut TV Console",
    category: "tv-units",
    images: [img("tv-units-2-0")],
    description:
      "A wall-hung console in light oak beneath a full-height walnut storage column, with an open niche at the end for books and records. Floating off the floor keeps the room feeling open.",
    materials:
      "Shown in walnut and light oak. Console length, column height and finishes made to order.",
    colors: [COLOR.walnut, COLOR.oak],
  },
  {
    id: "ls-tv-units-3",
    slug: "black-full-wall-tv-unit",
    name: "Black Full-Wall TV Unit",
    category: "tv-units",
    images: [img("tv-units-3-0")],
    description:
      "Floor-to-ceiling storage in matt black that runs the whole wall, with a recessed, slatted TV panel lit by a concealed LED strip. Everything put away behind flush, handle-free doors.",
    materials:
      "Shown in matt black with a slatted back panel. Any colour or veneer, built to the full width and height of your wall.",
    colors: [COLOR.black],
  },
  {
    id: "ls-tv-units-4",
    slug: "fluted-dark-media-wall",
    name: "Fluted Dark Media Wall",
    category: "tv-units",
    images: [img("tv-units-4-0")],
    description:
      "Dark fluted wall panelling framing the TV, with a low console beneath and backlit display shelves in warm gold light. A moody, cinematic media wall for a family lounge.",
    materials:
      "Shown in charcoal fluted panels with lit display shelving. Panel finish, shelving and console size to your choice.",
    colors: [COLOR.charcoal],
    featured: true,
  },
  {
    id: "ls-tv-units-5",
    slug: "white-handle-less-tv-cabinet",
    name: "White Handle-Less TV Cabinet",
    category: "tv-units",
    images: [img("tv-units-5-0")],
    description:
      "A low, clean-lined TV cabinet in white with push-to-open doors and no handles. Simple storage that disappears into a bright room.",
    materials:
      "Shown in white. Available in any colour, length and number of doors or drawers.",
    colors: [COLOR.white],
  },

  // ── BEDS & BED WALLS ────────────────────────────────────────────
  {
    id: "ls-beds-1",
    slug: "curved-headboard-bed-with-marquetry-wall",
    name: "Curved Headboard Bed & Marquetry Wall",
    category: "beds",
    images: [img("beds-1-0"), img("beds-1-1")],
    description:
      "A bed with a wide, curving upholstered headboard that wraps around the bedside tables, with a channel-tufted bench at its foot, set against a feature wall of inlaid timber. The bed and the bed wall designed together for a master suite.",
    materials:
      "Shown in ivory upholstery with a walnut marquetry bed wall. Bed size, headboard height and wall design made to order.",
    colors: [COLOR.ivory, COLOR.walnut],
    featured: true,
  },
  {
    id: "ls-beds-4",
    slug: "channel-tufted-white-bed",
    name: "Channel-Tufted White Bed",
    category: "beds",
    images: [img("beds-4-0")],
    description:
      "A statement bed with a tall, channel-tufted headboard and a matching footboard, upholstered in soft white. It reads beautifully against a dark feature wall.",
    materials:
      "Shown in white fabric with channel tufting. Available in any bed size and any fabric.",
    colors: [COLOR.white],
  },
  {
    id: "ls-beds-5",
    slug: "upholstered-bed-with-velvet-bench",
    name: "Upholstered Bed with Velvet Bench",
    category: "beds",
    images: [img("beds-5-0")],
    description:
      "A softly upholstered bed with a broad beige headboard, finished with a dark velvet bench on brass legs at its foot. Classic proportions for a calm, layered bedroom.",
    materials:
      "Shown in beige upholstery with a black velvet bench. Bed size, fabric and bench made to order.",
    colors: [COLOR.beige, COLOR.black],
  },
];
