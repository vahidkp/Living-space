/**
 * Site-wide copy and configuration constants.
 *
 * Anything that appears in more than one place — nav links, trust-row items,
 * footer columns, the shared ordering copy on the PDP accordion — lives here so
 * it is edited once (pdp-gallery-builder skill: "pull copy from a small
 * constant, not hardcoded inline per PDP").
 *
 * SOURCE: the business's Instagram profile, @livingspacefurniture2024. Its bio
 * is the only published description of the business: "Custom Made Furniture |
 * UAE • Villas & Projects Specialist • Door-to-Door Service • All UAE Work
 * Available", a phone number, and an "Abu Dhabi" highlight. Everything here is
 * written to stay inside those facts — no street address, email, opening hours,
 * years in business or factory location is published, so none is claimed.
 */

/**
 * BRAND NAME — spelled to match the logo artwork, which reads "LIVING SPACE"
 * over "FURNITURE".
 *
 * This constant is the single source: it feeds the metadata title template,
 * OpenGraph, the PDP's Product structured data, the footer copyright and the
 * logo's accessible name. Changing it here changes all of them.
 */
export const SITE = {
  name: "Living Space Furniture",
  shortName: "Living Space",
  description:
    "Custom-made furniture for villas, homes and projects across the UAE — majlis, sofas, TV units and beds built to your measurements, with door-to-door service from Abu Dhabi.",
  /** Used for canonical/OG URLs. Override with NEXT_PUBLIC_SITE_URL in deploy. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://livingspacefurniture.vercel.app",
  locale: "en_AE",
  currency: "AED",
} as const;

/**
 * WhatsApp enquiry link. Digits only, no `+` or spaces — that is what wa.me
 * expects.
 *
 * ASSUMED: this is the mobile from the Instagram bio (054 738 2878). The bio
 * does not say it is on WhatsApp, though a UAE mobile listed for enquiries
 * almost always is. Confirm with the business before launch; if their WhatsApp
 * is a different line, set NEXT_PUBLIC_WHATSAPP_NUMBER rather than editing this.
 */
export const WHATSAPP = {
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971547382878",
  /** Pre-filled first message. Generic, so it suits any page the user is on. */
  message:
    "Hello Living Space — I'd like to ask about a piece I saw on your website.",
} as const;

/** A wa.me link with a pre-filled message — the generic one unless given. */
export function whatsappHref(message: string = WHATSAPP.message): string {
  return `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(message)}`;
}

/**
 * Announcement-bar lines (PRD §8.1.1), rendered as a marquee — the three claims
 * of the Instagram bio, nearly verbatim.
 *
 * Keep them short enough to read while moving. The marquee duration scales
 * with how many there are, so adding a fourth slows the cycle rather than
 * speeding everything up.
 *
 * The FIRST line is also the one shown alone under prefers-reduced-motion, so
 * it should be the message that matters most.
 */
export const ANNOUNCEMENTS = [
  "Custom-made furniture, built to your measurements",
  "Villas & projects specialists — all UAE work available",
  "Door-to-door service across the Emirates",
] as const;

/** Primary category nav, rendered in the header's second row. */
export const NAV_LINKS = [
  { label: "Majlis", href: "/shop?category=majlis" },
  { label: "Sofas", href: "/shop?category=sofas" },
  { label: "TV Units", href: "/shop?category=tv-units" },
  { label: "Beds & Bed Walls", href: "/shop?category=beds" },
] as const;

/**
 * Service promises, shown in the `TrustBar` band above the footer and reused
 * verbatim on the PDP. One per claim in the Instagram bio.
 */
export const TRUST_ITEMS = [
  {
    icon: "warranty" as const,
    title: "Custom Made to Order",
    body: "Every piece built to your size, fabric and finish.",
  },
  {
    icon: "showroom" as const,
    title: "Villas & Projects Specialist",
    body: "From a single bed wall to furnishing a whole villa.",
  },
  {
    icon: "delivery" as const,
    title: "Door-to-Door Service",
    body: "Abu Dhabi and every emirate — all UAE work available.",
  },
] as const;

/**
 * Contact details, rendered in the footer's brand column inside a semantic
 * `<address>` so they are announced as contact information.
 *
 * Only what the Instagram profile publishes: the city and one phone number.
 * There is deliberately no street address and no email — inventing either
 * sends someone to a door or an inbox that doesn't exist. Add them here when
 * the business supplies them.
 *
 * `phoneHref` is the machine-readable form of `phone` — keep the pair in sync.
 */
export const SHOWROOM = {
  label: "Get in touch",
  addressLines: ["Abu Dhabi", "United Arab Emirates"],
  phone: "+971 54 738 2878",
  phoneHref: "+971547382878",
} as const;

/**
 * Social profiles. Instagram is the business's main presence; its bio links
 * nowhere else but Threads, which is the same account. No Facebook or LinkedIn
 * profile could be found, and a social icon pointing nowhere is worse than one
 * fewer icon.
 */
export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/livingspacefurniture2024/",
  },
] as const;

export const FOOTER_COLUMNS = [
  {
    heading: "Furniture",
    links: [
      { label: "Majlis", href: "/shop?category=majlis" },
      { label: "Sofas", href: "/shop?category=sofas" },
      { label: "TV Units", href: "/shop?category=tv-units" },
      { label: "Beds & Bed Walls", href: "/shop?category=beds" },
      { label: "All Furniture", href: "/shop" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Custom Orders", href: "/shop" },
      { label: "Villas & Projects", href: "/shop" },
      { label: "Door-to-Door Service", href: "/shop" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/shop" },
      { label: "Contact", href: "/shop" },
    ],
  },
] as const;

/**
 * Shared ordering & delivery copy for the PDP accordion's last panel —
 * identical across every product, so it is defined once here.
 *
 * No returns policy is stated: the business publishes none, and made-to-order
 * pieces are rarely returnable, so promising one would be a guess.
 */
export const ORDER_DELIVERY_COPY = [
  "Every piece is made to order. Tell us the size, fabric and finish you want — or send a photo of the space — and we will come back with a design and a quotation. Pricing depends on dimensions and materials, which is why each piece is quoted individually.",
  "We offer a door-to-door service across the UAE, from Abu Dhabi to the Northern Emirates, and take on whole villas and larger projects as well as single pieces.",
  "The quickest way to start is a message on WhatsApp.",
].join("\n\n");
