import type { MetadataRoute } from "next";
import { articlePath, healthArticles } from "./content/health-articles";
import { conditionGuides, conditionPath } from "./lib/conditions";
import { absoluteUrl, isDeployPreview, siteUrl } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Never emit a guessed host, preview host, or localhost in search submissions.
  if (!siteUrl || isDeployPreview) return [];

  const paths = [
    "/", "/conditions", "/drugs", "/wellbeing", "/health-news",
    "/symptom-checker", "/about", "/privacy",
    ...conditionGuides.map(({ slug }) => conditionPath(slug)),
    ...healthArticles.map(({ slug }) => articlePath(slug)),
  ];

  // Add lastModified only when genuine per-page editorial dates are available.
  return paths.map((path) => ({ url: absoluteUrl(path)! }));
}
