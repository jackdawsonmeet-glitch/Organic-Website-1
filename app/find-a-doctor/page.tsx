import {redirect} from "next/navigation";
import {DOCTOR_WEBSITE_URL} from "../config/doctorReferral";
import Link from "next/link";
import SiteShell from "../components/SiteShell";
import { configuredWebsiteUrl } from "../lib/configured-website-url";
import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({
 title: "Doctor Profile",
 description: "The doctor profile link is not available yet. Continue browsing health information and healthy aging guides on MyVeta Health.",
 path: "/find-a-doctor",
 noIndex: true,
});

export default function FindADoctor(){
 const destination = configuredWebsiteUrl(DOCTOR_WEBSITE_URL);
 if(destination)redirect(destination);
 return <SiteShell><section className="page-hero"><div className="container">
  <h1>Doctor profile</h1>
  <p>The doctor profile link is not available yet.</p>
  <Link className="primary" href="/">Return to MyVeta Health</Link>
 </div></section></SiteShell>;
}
