import {DOCTOR_WEBSITE_URL} from "./config/doctorReferral";
import { configuredWebsiteUrl } from "./lib/configured-website-url";
import Image from "next/image";
import WebsiteSchema from "./components/WebsiteSchema";
import { pageMetadata } from "./lib/seo";
import Link from "next/link";
import SiteShell from "./components/SiteShell";
import EditorialHub from "./components/EditorialHub";
import {AD_LINK_URL,AD_MEDIA_URL,AD_FALLBACK_MEDIA_URL,AD_POSTER_URL} from "./config/advertisement";
import AnimatedAdvertisement from "./components/AnimatedAdvertisement";
import { articlePath, featuredArticles } from "./content/health-articles";
const services=[
 {href:"/conditions",image:"/images/conditions-tablet.png",label:"HEALTH A TO Z",title:"Browse conditions",text:"Understand symptoms, possible causes, diagnosis, treatment choices, and when to seek professional care.",details:["Conditions organized alphabetically","Detailed guides in plain language"],action:"View all conditions"},
 {href:"/drugs",image:"/images/pharmacy-guidance.png",label:"MEDICATION SAFETY",title:"Drugs and supplements",text:"Look up uses, safety information, common side effects, interactions, and questions for your pharmacist.",details:["Drug information and safety guides","Medication review preparation"],action:"Search medicines"},
 {href:"/find-a-doctor",image:"/images/find-care-clinic.png",label:"FIND CARE",title:"Find care near you",text:"Search for doctors by specialty and United States location, then prepare for a more useful appointment.",details:["Compare specialties and locations","Plan questions before your visit"],action:"Find a doctor"}
];
export const metadata = pageMetadata({
  "title": "Health Information and Healthy Aging After 50",
  "description": "Explore health information for adults over 50, including conditions, medication safety, wellbeing, and an educational symptom checker.",
  "path": "/"
});

const doctorWebsite=configuredWebsiteUrl(DOCTOR_WEBSITE_URL);
const advertisementWebsite=configuredWebsiteUrl(AD_LINK_URL);

export default function Home(){
 const heroCopy=<><p className="eyebrow">HEALTHIER LIVING STARTS HERE</p><h1>Health information<br/><em>for life after 50.</em></h1><p className="hero-copy">Clear, reliable health guidance created to help adults over 50 make confident choices about prevention, treatment, nutrition, fitness, and everyday wellbeing.</p></>;
 const advertisement=<AnimatedAdvertisement src={AD_MEDIA_URL} fallbackSrc={AD_FALLBACK_MEDIA_URL} poster={AD_POSTER_URL}/>;
 return <SiteShell>
 <WebsiteSchema/>
 {doctorWebsite&&<a className="home-referral-hotspot home-referral-hotspot-1" href={doctorWebsite} aria-label="Visit Dr. Mayank Singh's website from section 1" title="Visit Dr. Mayank Singh"/>}
 {doctorWebsite&&<a className="home-referral-hotspot home-referral-hotspot-4" href={doctorWebsite} aria-label="Visit Dr. Mayank Singh's website from section 4" title="Visit Dr. Mayank Singh"/>}
 <section className="ad-slot referral-ad-zone">{doctorWebsite&&<a className="referral-hotspot referral-hotspot-2" href={doctorWebsite} aria-label="Visit Dr. Mayank Singh's website from section 2" title="Visit Dr. Mayank Singh"/>}{doctorWebsite&&<a className="referral-hotspot referral-hotspot-5" href={doctorWebsite} aria-label="Visit Dr. Mayank Singh's website from section 5" title="Visit Dr. Mayank Singh"/>}<span>ADVERTISEMENT</span>{advertisementWebsite?<a className="advertisement-link" href={advertisementWebsite} rel="sponsored noopener" aria-label="Advertisement: open external website">{advertisement}</a>:<figure className="advertisement-link" aria-label="Advertisement">{advertisement}</figure>}</section>
 <section className="hero photo-hero"><Image className="hero-background" src="/images/senior-wellness.png" alt="" fill sizes="100vw" loading="eager" fetchPriority="high"/>{doctorWebsite&&<a className="referral-hotspot referral-hotspot-3" href={doctorWebsite} aria-label="Visit Dr. Mayank Singh's website from section 3" title="Visit Dr. Mayank Singh"/>}<div className="container hero-grid"><div className="hero-message">{doctorWebsite?<a className="referral-copy-zone" href={doctorWebsite} title="Visit Dr. Mayank Singh">{heroCopy}</a>:<div className="referral-copy-zone">{heroCopy}</div>}<div className="hero-actions"><Link className="primary" href="/symptom-checker">Check your symptoms</Link><Link className="secondary" href="/find-a-doctor" prefetch={false}>Find a doctor</Link></div><div className="trust-row"><span>General health education</span><span>Written in plain language</span><span>Designed for adults 50+</span></div></div></div></section>
 <section className="quick service-section"><div className="container"><div className="service-heading"><p className="eyebrow">EXPLORE MYVETA HEALTH</p><h2>What can we help you with?</h2><p>Start with the information or care tool that best matches what you need today.</p></div><div className="quick-grid service-grid">{services.map(service=><Link className="service-card" href={service.href} prefetch={service.href === "/find-a-doctor" ? false : undefined} key={service.title}><Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" src={service.image} alt=""/><div className="service-card-body"><p className="tag">{service.label}</p><h3>{service.title}</h3><p>{service.text}</p><ul>{service.details.map(item=><li key={item}>{item}</li>)}</ul><strong>{service.action}</strong></div></Link>)}</div><div className="symptom-callout"><div><p className="eyebrow">NOT SURE WHERE TO START?</p><h3>Describe your symptoms and receive guided next steps</h3><p>Answer a few questions about age, symptoms, duration, and severity. The tool provides educational guidance and highlights when urgent care may be needed.</p></div><Link className="primary" href="/symptom-checker">Start symptom checker</Link></div></div></section>
 <section className="content-section container"><div className="section-head"><div><p className="eyebrow">EXPLORE HEALTH GUIDES</p><h2>Featured health stories</h2><p>Practical explainers with sources and questions for your care team.</p></div><Link href="/health-news">View all health guides</Link></div><div className="article-grid">{featuredArticles.map(a=><article key={a.slug}><Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" className="article-photo" src={a.image} alt={a.imageAlt}/><p className="tag">{a.category}</p><h3><Link href={articlePath(a.slug)}>{a.title}</Link></h3><p>{a.summary}</p></article>)}</div></section>
 <EditorialHub/>
 <section className="care-band"><div className="container care-grid"><Image width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" src="/images/appointment-questions.png" alt="Older adult preparing questions for a medical appointment"/><div><p className="eyebrow">PREPARE FOR BETTER CARE</p><h2>Make your next appointment more useful</h2><p>Organize symptoms, medications, recent test results, family history, and your most important questions before you meet your healthcare professional.</p><ul><li>Write down when each symptom started and what makes it better or worse.</li><li>Bring a complete medication and supplement list.</li><li>Ask for written next steps and when to follow up.</li></ul><Link className="primary" href="/find-a-doctor" prefetch={false}>Explore care options</Link></div></div></section>
 <section className="newsletter"><div className="container newsletter-inner"><div><p className="eyebrow">MYVETA WEEKLY</p><h2>Good health, delivered.</h2><p>New health articles, practical checklists, and selected videos in your inbox every Thursday.</p></div><form action="/subscribe"><input aria-label="Email address" placeholder="Your email address" type="email" required/><button>Subscribe free</button></form></div></section>
 </SiteShell>}
