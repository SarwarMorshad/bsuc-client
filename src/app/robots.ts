import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Crawler rules. The member-only areas are disallowed: the job portal becomes
 * a private route, and login/join are transactional pages.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/jobs", "/login", "/bn/jobs", "/bn/login", "/de/jobs", "/de/login"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
