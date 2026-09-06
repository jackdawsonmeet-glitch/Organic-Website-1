import { pageMetadata } from "../lib/seo";
import SiteShell from "../components/SiteShell";export const metadata = pageMetadata({
  "title": "About MyVeta Health",
  "description": "Learn about MyVeta Health and its focus on understandable health information, useful resources, and healthy aging for adults over 50.",
  "path": "/about"
});

export default function About(){return <SiteShell><section className="page-hero"><div className="container"><p className="eyebrow">ABOUT MYVETA</p><h1>Health information with respect and clarity.</h1><p>MyVeta Health is being created for adults 50+ who want understandable guidance, useful tools, and easier paths to appropriate care.</p></div></section><section className="container page-content"><h2>Our editorial promise</h2><div className="quick-grid"><div className="stat"><h3>Clear</h3><p>Plain-language explanations without unnecessary jargon.</p></div><div className="stat"><h3>Responsible</h3><p>General health education with clear limits; individual care decisions belong with a qualified healthcare professional.</p></div><div className="stat"><h3>Independent</h3><p>Advertising areas clearly labelled and separated from editorial content.</p></div></div></section></SiteShell>}
