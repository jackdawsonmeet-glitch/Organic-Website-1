import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import JsonLd from "../../components/JsonLd";
import SiteShell from "../../components/SiteShell";
import { articlePath, articleReadTime, findArticle, healthArticles } from "../../content/health-articles";
import { absoluteUrl, isDeployPreview, pageMetadata, siteName } from "../../lib/seo";
import styles from "./page.module.css";

type ArticleParams = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return healthArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticleParams): Promise<Metadata> {
  const article = findArticle((await params).slug);
  if (!article) notFound();
  const metadata = pageMetadata({ title: article.seoTitle, description: article.summary, path: articlePath(article.slug) });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" } };
}

export default async function HealthGuide({ params }: ArticleParams) {
  const article = findArticle((await params).slug);
  if (!article) notFound();
  const path = articlePath(article.slug);
  const url = absoluteUrl(path);
  const related = article.related.flatMap(slug => {
    const guide = findArticle(slug);
    return guide ? [guide] : [];
  });

  return <SiteShell>
    {url && !isDeployPreview && <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.summary,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: siteName, url: absoluteUrl("/about") },
      publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
      articleSection: article.category,
      inLanguage: "en-US",
      citation: article.sources.map(source => source.url),
    }} />}
    <section className="page-hero condition-hero">
      <div className="container">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Health guides", path: "/health-news" }, { name: article.title, path }]} />
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
        <p className="review-line">By <Link href="/about">{siteName}</Link> · {articleReadTime(article)}</p>
      </div>
    </section>
    <div className="container page-content article-layout">
      <aside className="article-nav" aria-label="On this page">
        <b>On this page</b>
        {article.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        <a href="#sources">Sources and further reading</a>
        <a href="#related-guides">Related guides</a>
      </aside>
      <article className={`medical-article ${styles.article}`}>
        <p className={styles.disclosure}>AI-assisted educational guide; not independently medically reviewed. Use it to prepare questions for a qualified healthcare professional. <Link href="/about#health-content">About our health content</Link></p>
        <p>{article.introduction}</p>
        <Image className={styles.photo} src={article.image} alt={article.imageAlt} width={1536} height={1024} sizes="(max-width: 900px) 100vw, 760px" />
        {article.sections.map(section => <section id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets && <ul>{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}
          <p className={styles.citations}>Sources: {section.sourceIds.map((sourceId, index) => {
            const source = article.sources[sourceId];
            return <span key={source.url}>{index > 0 && "; "}<a href={source.url}>{source.publisher}: {source.title}</a></span>;
          })}</p>
        </section>)}
        <section id="sources">
          <h2>Sources and further reading</h2>
          <ul>{article.sources.map(source => <li key={source.url}><a href={source.url}>{source.publisher}: {source.title}</a></li>)}</ul>
          <p>These links support the educational information above. The source organizations have not reviewed or endorsed this MyVeta guide.</p>
        </section>
        <section id="related-guides">
          <h2>Related guides</h2>
          <ul>{related.map(guide => <li key={guide.slug}><Link href={articlePath(guide.slug)}>{guide.title}</Link></li>)}</ul>
          <Link href="/health-news">Browse all health guides</Link>
        </section>
      </article>
    </div>
  </SiteShell>;
}
