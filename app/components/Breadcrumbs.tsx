import Link from "next/link";
import { absoluteUrl, isDeployPreview, siteUrl } from "../lib/seo";
import JsonLd from "./JsonLd";
import styles from "./Breadcrumbs.module.css";

type Breadcrumb = { name: string; path: string };

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return <>
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol>{items.map((item, index) => <li key={item.path}>
        {index === items.length - 1
          ? <span aria-current="page">{item.name}</span>
          : <Link href={item.path}>{item.name}</Link>}
      </li>)}</ol>
    </nav>
    {siteUrl && !isDeployPreview && <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path),
      })),
    }} />}
  </>;
}
