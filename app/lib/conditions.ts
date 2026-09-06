import { conditions } from "../data";

// Preserve the existing URLs, including punctuation, so existing links keep working.
export const conditionGuides = conditions.map((title) => ({
  title,
  slug: title.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-"),
}));

export function conditionPath(slug: string): string {
  return `/conditions/${encodeURIComponent(slug)}`;
}

export function findCondition(slug: string) {
  // Next.js can pass encoded punctuation during static generation. Resolve both
  // forms against the same allowlist without accepting arbitrary topic names.
  try {
    const decodedSlug = decodeURIComponent(slug);
    return conditionGuides.find((condition) => condition.slug === decodedSlug);
  } catch {
    return undefined;
  }
}
