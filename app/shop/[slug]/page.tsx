import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryBySlug } from "@/data/categories";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { ORDER_DELIVERY_COPY, SITE, TRUST_ITEMS } from "@/lib/site";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImageGallery } from "@/components/product/ImageGallery";
import { AccordionInfo, type AccordionSection } from "@/components/product/AccordionInfo";
import { AddToBag } from "@/components/product/AddToBag";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { ProductCarouselRow } from "@/components/product/ProductCarouselRow";
import { BadgeDiscount } from "@/components/product/BadgeDiscount";
import { TRUST_ICONS } from "@/components/ui/Icon";
import { getDiscountPercent } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Product Detail Page — statically generated from the fixture catalogue, so
 * every product is a static HTML file with no server dependency at request time.
 */
export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

/** Unknown slugs are a real 404, not a soft empty page. */
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found", robots: { index: false, follow: false } };
  }

  // Trim the description to a sensible meta length on a word boundary rather
  // than cutting mid-word.
  const description =
    product.description.length > 155
      ? `${product.description.slice(0, 155).replace(/\s+\S*$/, "")}…`
      : product.description;

  const primaryImage = product.images[0];

  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE.name}`,
      description,
      url: `/shop/${product.slug}`,
      ...(primaryImage
        ? { images: [{ url: primaryImage, width: 1200, height: 1500, alt: product.name }] }
        : {}),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const category = categoryBySlug.get(product.category);
  const related = getRelatedProducts(product, 8);
  const discount = getDiscountPercent(product.price, product.compareAtPrice);

  const sections: AccordionSection[] = [
    { title: "Description", body: product.description },
    ...(product.materials
      ? [{ title: "Materials & Care", body: product.materials }]
      : []),
    ...(product.dimensions
      ? [{ title: "Dimensions", body: product.dimensions }]
      : []),
    { title: "Ordering & Delivery", body: ORDER_DELIVERY_COPY },
  ];

  /**
   * schema.org/Product structured data (PRD §11).
   *
   * `priceValidUntil` is required by Google for a discounted offer, and image
   * URLs are made absolute — relative paths are invalid in JSON-LD.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    category: category?.name,
    brand: { "@type": "Brand", name: SITE.name },
    /*
     * `offers` is omitted entirely for price-on-request pieces.
     *
     * schema.org/Offer requires a price, and JSON.stringify silently drops an
     * `undefined` value — so leaving `price: product.price` in place would have
     * emitted a priceless Offer on every made-to-order piece — today, the whole
     * catalogue — which is invalid structured data and gets flagged in Search
     * Console. No offer node is better than a malformed one.
     */
    ...(typeof product.price === "number"
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE.url}/shop/${product.slug}`,
            priceCurrency: SITE.currency,
            price: product.price,
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: SITE.name },
          },
        }
      : {}),
  };

  // TRUST_ITEMS is exactly the three service promises now that the showroom
  // address has moved to the footer, so the PDP uses the list as-is — the old
  // `.slice(0, 3)` that trimmed off the fourth item is no longer needed.
  const pdpTrust = TRUST_ITEMS;

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data is not user-generated; JSON.stringify output is safe
        // here, with `<` escaped so it can never break out of the script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="shell py-8 lg:py-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(category
              ? [{ label: category.name, href: `/shop?category=${category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* ── Gallery ────────────────────────────────────────────────── */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* ── Info panel ─────────────────────────────────────────────── */}
          <div className="lg:pt-2">
            {category && (
              <p className="eyebrow text-muted">{category.name}</p>
            )}

            <h1 className="mt-3 text-[clamp(1.75rem,3.4vw,2.75rem)]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PriceDisplay
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                size="lg"
              />
              {discount !== null && <BadgeDiscount percent={discount} />}
            </div>

            <p className="mt-5 max-w-prose text-[0.9375rem] leading-relaxed text-ink-soft">
              {product.description}
            </p>

            <AddToBag productName={product.name} colors={product.colors} />

            {/* ── Trust row ────────────────────────────────────────────── */}
            <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-line pt-7 sm:grid-cols-3 sm:gap-4">
              {pdpTrust.map((item) => {
                const TrustIcon = TRUST_ICONS[item.icon];
                return (
                  <li
                    key={item.title}
                    className="flex items-center gap-2.5 sm:flex-col sm:gap-2 sm:text-center"
                  >
                    <TrustIcon size={22} className="shrink-0 text-ink-soft" />
                    <span className="text-[0.75rem] leading-snug text-ink-soft">
                      {item.title}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              {/*
                An h2 above the accordion's h3 panel headings — otherwise the
                document jumps h1 → h3. Visually hidden because the panels label
                themselves on screen.
              */}
              <h2 className="sr-only">Product details</h2>
              <AccordionInfo sections={sections} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Related products ───────────────────────────────────────────── */}
      <ProductCarouselRow
        products={related}
        eyebrow="You may also like"
        title="Pairs well with this."
        href={`/shop?category=${product.category}`}
        headingLevel="h2"
        className="section-y"
      />
    </>
  );
}
