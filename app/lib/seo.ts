import type { Metadata } from "next";

export const siteName = "MyVeta Health";

// Netlify's URL is the production address, including during deploy previews.
// SITE_URL can override it when a preferred custom domain is configured.
const configuredUrl = process.env.SITE_URL || process.env.URL;

function readSiteUrl(value: string | undefined): URL | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) {
    throw new Error("SITE_URL must be an absolute http(s) origin, without credentials, a path, query, or fragment.");
  }
  return url;
}

export const siteUrl = readSiteUrl(configuredUrl);
export const isDeployPreview = Boolean(process.env.CONTEXT && process.env.CONTEXT !== "production");

export function absoluteUrl(path: string): string | undefined {
  return siteUrl ? new URL(path, siteUrl).href : undefined;
}

export function pageMetadata({ title, description, path, noIndex = false }: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${siteName}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: !isDeployPreview && !noIndex, follow: true },
    openGraph: { title: fullTitle, description, url, siteName, type: "website", locale: "en_US" },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
