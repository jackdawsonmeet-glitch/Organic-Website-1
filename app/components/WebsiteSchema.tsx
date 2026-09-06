import { absoluteUrl, isDeployPreview, siteName } from "../lib/seo";

export default function WebsiteSchema() {
  const url = absoluteUrl("/");
  if (!url || isDeployPreview) return null;

  const data = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url, inLanguage: "en-US" };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
