import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "../lib/seo";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteShell from "../components/SiteShell";
import EditorialHub from "../components/EditorialHub";
import { articlePath, featuredArticles } from "../content/health-articles";

export const metadata = pageMetadata({
  title: "Health Topics and Healthy Aging Resources",
  description: "Read practical health guides about heart health, strength, nutrition, preventive screening, medication reviews, and sleep after 50.",
  path: "/health-news",
});

export default function News() {
  return <SiteShell>
    <section className="page-hero"><div className="container">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Health guides", path: "/health-news" }]} />
      <p className="eyebrow">HEALTH EDUCATION</p>
      <h1>Health news and guides</h1>
      <p>Practical guides with sources and questions to discuss with your care team, for adults 50+ in the United States.</p>
    </div></section>
    <section className="container page-content" aria-label="Featured health guides">
      <div className="article-grid">{featuredArticles.map(article => <article key={article.slug}>
        <Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" className="article-photo" src={article.image} alt={article.imageAlt} />
        <p className="tag">{article.category}</p>
        <h2><Link href={articlePath(article.slug)}>{article.title}</Link></h2>
        <p>{article.summary}</p>
      </article>)}</div>
    </section>
    <EditorialHub />
  </SiteShell>;
}
