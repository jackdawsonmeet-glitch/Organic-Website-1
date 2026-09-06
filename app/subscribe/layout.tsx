import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({
  title: "Health Newsletter",
  description: "Learn about the MyVeta Health newsletter and healthy aging topics.",
  path: "/subscribe",
  // This form currently has no subscription backend.
  noIndex: true,
});

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
