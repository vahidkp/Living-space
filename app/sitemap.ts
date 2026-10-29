import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/lib/products";
import { SITE } from "@/lib/site";

/**
 * Sitemap covering the PRD §7 sitemap: `/`, `/shop`, and every product slug —
 * generated from the fixture data, so it can never drift out of sync with the
 * catalogue (seo-metadata-schema skill).
 *
 * Category-filtered URLs are included because they are genuine, linked landing
 * pages. The other filter permutations are not: they are near-duplicates, and
 * `generateMetadata` on /shop marks them `noindex` for the same reason.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/shop`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories.map((category) => ({
      url: `${SITE.url}/shop?category=${category.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllProducts().map((product) => ({
      url: `${SITE.url}/shop/${product.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
