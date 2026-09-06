import Breadcrumbs from "../components/Breadcrumbs";
import { articlePath } from "../content/health-articles";
import Image from "next/image";
import { pageMetadata } from "../lib/seo";
import Link from "next/link";import SiteShell from "../components/SiteShell";import {wellbeing} from "../data";
export const metadata = pageMetadata({
  "title": "Wellbeing and Healthy Habits After 50",
  "description": "Explore healthy aging topics including movement, nutrition, sleep, and social connection, with a practical foundation for everyday wellbeing.",
  "path": "/wellbeing"
});

const resources: Record<string, { href: string; publisher: string }> = {
  "Aging Well": { href: articlePath("staying-strong-after-50"), publisher: "MyVeta guide" },
  "Healthy Beauty": { href: "https://medlineplus.gov/skinaging.html", publisher: "MedlinePlus: skin aging" },
  "Men's Health": { href: "https://medlineplus.gov/menshealth.html", publisher: "MedlinePlus" },
  "Nutrition": { href: articlePath("balanced-plate-after-50"), publisher: "MyVeta guide" },
  "Fitness & Exercise": { href: articlePath("staying-strong-after-50"), publisher: "MyVeta guide" },
  "Food & Recipes": { href: "https://medlineplus.gov/recipes/", publisher: "MedlinePlus" },
  "Health & Balance": { href: articlePath("strength-and-balance-beyond-walking"), publisher: "MyVeta guide" },
  "Mental Wellness": { href: "https://medlineplus.gov/mentalhealth.html", publisher: "MedlinePlus" },
  "Sleep": { href: articlePath("evening-routine-for-better-sleep"), publisher: "MyVeta guide" },
  "Women's Health": { href: "https://medlineplus.gov/womenshealth.html", publisher: "MedlinePlus" },
};

export default function Wellbeing(){return <SiteShell><section className="page-hero"><div className="container"><Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Wellbeing", path: "/wellbeing" }]} /><p className="eyebrow">LIVE WELL</p><h1>Well-being after 50</h1><p>Practical guidance for movement, nutrition, sleep, emotional wellness, relationships, prevention, and healthy aging.</p></div></section><section className="container page-content"><div className="care-grid" style={{marginBottom:55}}><Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" src="/images/wellbeing-tai-chi.png" alt="Older adults practicing tai chi outdoors"/><div><h2>Small choices add up</h2><p>Healthy aging is not one perfect routine. It is a sustainable combination of activity, nutritious food, social connection, restorative sleep, preventive care, and support for emotional health.</p><p>Start with one change that fits your abilities and daily life. Speak with a healthcare professional before beginning a demanding exercise program or making a major dietary change.</p></div></div><h2>Explore wellness topics</h2><p>Choose a MyVeta guide or a topic collection on MedlinePlus from the National Library of Medicine.</p><div className="condition-grid">{wellbeing.map(x=><Link key={x} href={resources[x].href}>{x}<small> · {resources[x].publisher}</small></Link>)}</div><section className="medication-guide"><h2>A practical weekly foundation</h2><div className="info-grid"><div><h3>Move in different ways</h3><p>Combine aerobic movement, strength exercises, balance practice, flexibility, and appropriate recovery.</p></div><div><h3>Build satisfying meals</h3><p>Include vegetables, fruit, whole grains, protein foods, and sources of healthy fats while considering personal medical needs.</p></div><div><h3>Protect sleep</h3><p>Keep consistent sleep and wake times, manage evening light and caffeine, and discuss ongoing sleep problems.</p></div><div><h3>Stay connected</h3><p>Regular contact with friends, family, neighbors, community groups, and care teams can support physical and emotional wellbeing.</p></div></div></section></section></SiteShell>}
