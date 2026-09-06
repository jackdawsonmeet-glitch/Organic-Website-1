import type { Metadata } from "next";
import { isDeployPreview, siteName, siteUrl } from "./lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteName, template: `%s | ${siteName}` },
  description: "Explore health information, medication safety, and healthy aging resources for adults over 50.",
  robots: { index: !isDeployPreview, follow: true },
  icons: { icon: "/favicon.svg" },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
