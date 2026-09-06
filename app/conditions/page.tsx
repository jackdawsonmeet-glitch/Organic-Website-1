import Link from "next/link";
import SiteShell from "../components/SiteShell";
import { conditionGuides, conditionPath } from "../lib/conditions";
import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({
  title: "Health Conditions A to Z",
  description: "Browse health conditions alphabetically and find introductory information and questions to prepare for a conversation with your healthcare professional.",
  path: "/conditions",
});

const letters = [...new Set(conditionGuides.map(({ title }) => title[0]))].sort();

export default function Conditions() {
  return <SiteShell>
    <section className="page-hero"><div className="container">
      <p className="eyebrow">HEALTH A TO Z</p><h1>Health conditions A to Z</h1>
      <p>Explore introductory information and questions to discuss with a healthcare professional.</p>
    </div></section>
    <section className="container page-content">
      <div className="condition-intro"><h2>Find a health topic</h2>
        <p>Choose a condition to explore a general overview and prepare for a medical visit.</p>
      </div>
      <h2>Browse by letter</h2>
      <nav className="alphabet" aria-label="Condition letters">
        {letters.map((letter) => <a key={letter} href={`#${letter}`}>{letter}</a>)}
      </nav>
      {letters.map((letter) => <section key={letter} aria-labelledby={letter}>
        <h2 id={letter} className="condition-letter">{letter}</h2>
        <div className="condition-grid">
          {conditionGuides.filter(({ title }) => title.startsWith(letter)).map(({ title, slug }) => (
            <Link id={title.toLowerCase().replaceAll(" ", "-")} key={slug} href={conditionPath(slug)}>{title}</Link>
          ))}
        </div>
      </section>)}
    </section>
  </SiteShell>;
}
