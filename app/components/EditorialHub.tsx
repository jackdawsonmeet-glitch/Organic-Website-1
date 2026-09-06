import Image from "next/image";
import Link from "next/link";
import { articlePath, articleReadTime, practicalArticles } from "../content/health-articles";
import { dailyVideos } from "../data";

export default function EditorialHub() {
  return <>
    <section className="daily-section"><div className="container">
      <div className="section-head"><div>
        <p className="eyebrow">PRACTICAL HEALTH EDUCATION</p>
        <h2>Guides for everyday health</h2>
        <p>Prepare for appointments and explore healthy habits with clearly linked sources.</p>
      </div><Link href="/health-news">Browse all health guides</Link></div>
      <div className="daily-grid">{practicalArticles.map((article, index) => <article className={index === 0 ? "daily-lead" : "daily-item"} key={article.slug}>
        {index === 0 && <Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" className="daily-lead-photo" src={article.image} alt={article.imageAlt} />}
        <div className={index === 0 ? "daily-lead-copy" : ""}>
          <p className="article-meta">{article.category}</p>
          <h3><Link href={articlePath(article.slug)}>{article.title}</Link></h3>
          <p>{article.summary}</p>
          {index === 0 && <><p className="daily-inside"><b>Inside this guide</b></p><div className="article-topics">{article.sections.map(section => <span key={section.id}>{section.title}</span>)}</div></>}
          <div className="article-bottom"><span>{articleReadTime(article)}</span><span>Educational guide</span></div>
        </div>
      </article>)}</div>
    </div></section>
    <section className="video-section"><div className="container">
      <div className="section-head"><div><p className="eyebrow">WATCH AND LEARN</p><h2>Health organization video channels</h2><p>Explore video channels from health organizations.</p></div></div>
      <div className="video-grid">{dailyVideos.map(video => <article className="video-card" key={video.title}>
        <a href={video.videoUrl} target="_blank" rel="noreferrer" className="video-poster" aria-label={`Visit channel: ${video.source}`}>
          <Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" src={video.image} alt="" /><span className="watch-label">Visit channel</span>
        </a>
        <div className="video-copy"><p className="tag">{video.section} · {video.source}</p><h3>{video.title}</h3><details><summary>View video summary</summary><p>{video.summary}</p></details></div>
      </article>)}</div>
    </div></section>
  </>;
}
