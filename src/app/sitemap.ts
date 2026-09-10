import type { MetadataRoute } from "next";

/**
 * The site is a single page, so this is short, but without it crawlers have no
 * canonical entry point declared and nothing pointing at lastModified.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jacobkuriakose.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
