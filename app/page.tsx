import { categories } from "@/data/categories";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/products";
import { whatsappHref } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { CategoryTile } from "@/components/home/CategoryTile";
import { PromoBannerSplit } from "@/components/home/PromoBannerSplit";
import { DarkPromoStrip, PromoBannerDuo } from "@/components/home/PromoBannerDuo";
import { ProductCarouselRow } from "@/components/product/ProductCarouselRow";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Homepage — section order follows PRD §8.1 exactly:
 *   hero → category tiles → split promo → featured carousel →
 *   lifestyle duo → dark promo strip → second carousel → (newsletter + footer
 *   come from the root layout).
 *
 * A Server Component throughout. The only client JS on this page is the
 * carousel arrow controls and the mobile menu.
 *
 * PLACEHOLDER IMAGERY: every photo on this page is a free-licence stock
 * stand-in (`public/images/stock/CREDITS.md`) until the business supplies its
 * own. The copy is written about the business, not about the photos, so it
 * survives the swap unchanged.
 */
export default function HomePage() {
  // "Featured" rather than "Best sellers": there are no sales figures behind the
  // catalogue, and a rail that claims to rank by popularity without any is a
  // small lie. Featured is an editorial pick, which is what this is.
  const featured = getFeaturedProducts(8);
  const sofas = getProductsByCategory("sofas", 8);

  return (
    /*
     * One flex column owns the vertical rhythm for the whole page, instead of
     * each section padding itself.
     *
     * Previously only some sections carried `section-y`, so spacing depended on
     * which neighbour happened to have padding — and where two unpadded sections
     * met (the lifestyle duo against the dark strip) they touched with no gap at
     * all. A single `gap` cannot be forgotten on a new section and cannot double
     * up when two padded ones meet.
     *
     * 64px / 96px is the PRD §5.4 rhythm. The gap adds no leading space, so the
     * hero still sits flush under the header; `pb-*` supplies the trailing space
     * before the footer, which the gap cannot.
     */
    <div className="flex flex-col gap-16 pb-16 lg:gap-24 lg:pb-24">
      <Hero />

      {/* ── Shop by category ───────────────────────────────────────────── */}
      <section className="shell" data-reveal="pending">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category."
          titleMuted="Four ranges, all made to order."
          href="/shop"
          linkLabel="Shop all"
          className="mb-8"
        />
        {/*
          Four categories: two-up on tablets, one row of four on desktop, so no
          tile is ever orphaned. A fifth category would break that and needs
          this grid revisited.
        */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <CategoryTile
                category={category}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Split promo ────────────────────────────────────────────────── */}
      <PromoBannerSplit
        eyebrow="Villas & projects"
        title="One team for the whole villa"
        body="From the majlis to the master bedroom, every piece is designed and built for the room it is going into — sofas, TV walls, beds and bed walls together, with one point of contact and door-to-door service anywhere in the UAE."
        href="/shop"
        linkLabel="Explore the collection"
        image="/images/stock/scene-living.jpg"
        imageAlt="SCENE_LIVING_ALT"
      />

      {/* ── First product rail ─────────────────────────────────────────── */}
      <ProductCarouselRow
        products={featured}
        eyebrow="Featured"
        title="Designs to start from."
        titleMuted="Every one made to your size."
        href="/shop"
      />

      {/* ── Lifestyle duo ──────────────────────────────────────────────── */}
      <PromoBannerDuo
        panels={[
          {
            eyebrow: "Majlis",
            title: "Room for every guest",
            href: "/shop?category=majlis",
            linkLabel: "Shop majlis",
            image: "/images/stock/scene-majlis.jpg",
            imageAlt: "SCENE_MAJLIS_ALT",
          },
          {
            eyebrow: "Bedrooms",
            title: "The bed wall, made to measure",
            href: "/shop?category=beds",
            linkLabel: "Shop beds & bed walls",
            image: "/images/stock/scene-bedroom.jpg",
            imageAlt: "SCENE_BEDROOM_ALT",
          },
        ]}
      />

      {/* ── Dark promo strip ───────────────────────────────────────────── */}
      {/*
        The one CTA on the page that starts a real conversation: everything is
        quoted per piece, so a WhatsApp message with a photo of the room IS the
        enquiry form.
      */}
      <DarkPromoStrip
        eyebrow="Made to measure"
        title="Tell us about your space"
        body="Send your room measurements or a photo of the space on WhatsApp. We will suggest a design, help you choose the fabric and finish, and come back with a quotation — then deliver door to door, anywhere in the UAE."
        href={whatsappHref(
          "Hello Living Space — I'd like a quotation for a custom piece.",
        )}
        linkLabel="Message us on WhatsApp"
        image="/images/stock/scene-tv.jpg"
        imageAlt="SCENE_TV_ALT"
      />

      {/* ── Second product rail ────────────────────────────────────────── */}
      <ProductCarouselRow
        products={sofas}
        eyebrow="Sofas"
        title="Sofas."
        titleMuted="Any size, any fabric."
        href="/shop?category=sofas"
      />
    </div>
  );
}
