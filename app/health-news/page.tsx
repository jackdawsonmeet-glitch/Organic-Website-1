import Image from "next/image";
import { pageMetadata } from "../lib/seo";
import SiteShell from "../components/SiteShell";import EditorialHub from "../components/EditorialHub";import {articles} from "../data";
export const metadata = pageMetadata({
  "title": "Health Topics and Healthy Aging Resources",
  "description": "Browse health topics and selected resources about heart health, strength, nutrition, prevention, medication safety, and sleep after 50.",
  "path": "/health-news"
});

export default function News(){return <SiteShell><section className="page-hero"><div className="container"><p className="eyebrow">LATEST UPDATES</p><h1>Health news and guides</h1><p>Health topic summaries and selected resources for adults 50+ in the United States.</p></div></section><section className="container page-content"><div className="article-grid">{articles.map(a=><article key={a.title}><Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" className="article-photo" src={a.image} alt=""/><p className="tag">{a.tag}</p><h3>{a.title}</h3><p>{a.text}</p></article>)}</div></section><EditorialHub/></SiteShell>}
