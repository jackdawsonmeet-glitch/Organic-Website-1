import type { MetadataRoute } from "next";
import { absoluteUrl, isDeployPreview } from "./lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep pages crawlable so crawlers can read noindex on deploy previews.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: isDeployPreview ? undefined : absoluteUrl("/sitemap.xml"),
  };
}
