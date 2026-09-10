import type { MetadataRoute } from "next";

/**
 * The site had no robots.txt at all, so crawlers had no sitemap pointer.
 * /api/ is disallowed because the chat endpoint is rate-limited and has no
 * business being crawled.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://jacobkuriakose.com/sitemap.xml",
  };
}
