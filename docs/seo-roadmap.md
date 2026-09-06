# MyVeta Health SEO roadmap

Source baseline: `7085281766a48f5e8c70bc288022be3cad490be3` in Organic-Website-1, reviewed September 6, 2026. This is a source audit; the production domain, Google indexing, Search Console data, rankings, and real-user performance have not been verified. The owner subsequently supplied `https://myvetahealth.netlify.app/` as the live website URL. Live indexing and performance remain unverified.

## First implementation

- Replace shared development metadata with distinct page titles, descriptions, canonical URLs, and Open Graph/X text.
- Add a production sitemap and robots file, with a configurable canonical origin and optional Search Console verification token.
- Limit condition routes to the 27 existing topics, preserve existing slugs, and return 404 for unknown topics.
- Generate known condition pages at build time; fix the A–Z anchors and navigation to real topics.
- Preserve the original timed iframe, fullscreen click handler, and all six homepage referral areas. The owner explicitly requested a 10-second delay and unchanged click behavior/destination. Keep those behaviors intact during future SEO work; the ad link retains its sponsored attribute.
- Remove stale account/admin links and requests to missing endpoints from the public shell.
- Replace unsubstantiated medical-review labels with educational wording. Do not invent reviewers, credentials, or dates.
- Deliver health photographs through Next.js responsive images, preload the hero, and reserve image dimensions.
- Mark the unfinished newsletter signup and Netlify preview builds `noindex, follow`. Existing condition pages remain indexable; assess them with real search data before changing that policy.

This is a technical foundation. It does not demonstrate improved rankings or resolve the editorial gaps below.

## Required behavior

SEO improvements must preserve the timed redirect, existing click targets, fullscreen behavior, and configured referral destination. The requested delay is 10 seconds. Do not remove or disable these features as an SEO optimization.

## Priorities after review

| Priority | Finding | Next action | Evidence of completion |
| --- | --- | --- | --- |
| 1 | The owner confirmed `https://myvetahealth.netlify.app/`; the search baseline is unknown. | Verify its Search Console property; inspect indexing, queries, and pages. Confirm the main conversion. | Correct canonical URLs; baseline clicks, impressions, CTR, position, and indexed-page counts. |
| 1 | All 27 condition pages share the same generic body. | Prioritize a few relevant conditions and create distinct, useful guides with authoritative sources and a real qualified review process. Avoid mass expansion. | Each guide answers the topic's questions and displays verifiable authorship, reviewer details when reviewed, references, and genuine dates. |
| 1 | Seven full guides now replace article-card placeholders. They have not been independently medically reviewed. | Have a qualified professional review the guides, improve them based on real reader needs, and record actual review details. | Matching stable links, clear source citations, and verifiable review details when completed. |
| 1 | Medication resources now link to real MyVeta, FDA, and NLM destinations. Newsletter signup is still not connected. | Implement the subscription backend or correct its promises and success behavior in a separate functional change. | Subscribers are actually saved and receive the promised service. |
| 1 | About/footer policy and privacy statements are not fully supported by implemented features. | Confirm the operator, contact details, real editorial/review process, data flows, and relevant policies. | Public trust and privacy information accurately describes the website. |
| 2 | Main images were multi-megabyte files delivered directly. | Verify responsive image behavior on the actual host and measure mobile performance. Check the animated advertisement separately. | Production PageSpeed/Lighthouse measurements and available real-user Core Web Vitals; record before/after data. |
| 2 | Wellbeing links now reach relevant guides or identified MedlinePlus resources. Some broader navigation and video labels still need editorial review. | Verify remaining labels against their actual destinations. | Working links with descriptive anchor text and useful destinations. |
| 2 | Several branded social links lead to platform homepages. | Connect verified official profiles or remove the misleading links. | Each branded profile link belongs to the actual publisher. |
| 3 | No validated keyword or competitor research exists. | Use Search Console queries plus the confirmed audience to select topics, improve existing pages, and earn relevant editorial links. | Growth in relevant search visits and the chosen conversion, without purchased link schemes or ranking guarantees. |

## Initial topic hypotheses

The current copy targets adults over 50 in the United States. Confirm that positioning before creating a content schedule. Potential intents that fit the existing site include preparing for a medication review, questions to ask at a medical appointment, and practical healthy aging habits. These are editorial hypotheses, not validated search-volume or competition estimates.

## Measurement

After deployment, submit the canonical sitemap and inspect representative URLs in Search Console. Compare a documented baseline with later comparable periods, distinguishing branded from nonbranded traffic and reviewing page-level changes. Track the chosen conversion separately from traffic. Allow for recrawling, indexing, seasonality, and content changes when interpreting results; do not attribute every change to this patch.

## References

- [Google: Avoid intrusive interstitials and dialogs](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)
- [Google: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Next.js: Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: Image component](https://nextjs.org/docs/app/api-reference/components/image)
- [Netlify: Build environment variables](https://docs.netlify.com/build/configure-builds/environment-variables/)


## Validation of the initial foundation

Production and Netlify preview builds passed Next.js compilation and TypeScript checking. The HTTP check covered all 36 content pages: distinct titles/descriptions, canonical paths, Open Graph/X text, one H1, indexing rules, a 35-URL production sitemap, an empty preview sitemap, actual 404 responses, existing encoded condition URLs, the doctor redirect, mounted redirect component, and all six original referral areas. The homepage WebSite markup was checked against the configured origin.

In a local image check, a 640-pixel WebP hero response was 42,962 bytes versus its 2,610,321-byte PNG source. This is one image response, not a production page-speed measurement or a Core Web Vitals score. Browser/visual testing and live SEO verification were not performed.


After the owner's correction, the original redirect component and all six referral areas were restored, with a 10-second delay. The revised code passed compilation, TypeScript, and the 36-page HTTP checks without a configured origin. A separate code-level check exercised the timer, doctor/ad clicks, fullscreen requests, ordinary link handling, and cleanup using simulated browser objects; no live-browser test was performed.


## Content and discovery implementation

Built on owner commit `b666d7b22fed2a2538f2a73b4e179c5f4702da60` after the redirect restoration was merged.

- Added seven complete educational guides for the seven existing article cards. A single server-side registry supplies the body, listing cards, metadata, sources, related links, and sitemap paths.
- Added crawlable article links on the homepage and health hub, related-guide links, and visible breadcrumbs with matching structured data. Unknown guide slugs return 404.
- Added Article markup only to the new full guides, using the visible MyVeta organization attribution and sources. No medical reviewer, rating, publication date, or review date is fabricated. AI assistance and the lack of independent medical review are disclosed.
- Replaced wellbeing `#` links and medication resource placeholders with real destinations. The inactive medication search now points to the MedlinePlus medicine library.
- Preserved the entire timed redirect component, both destination configuration files, symptom-checker page and API, global styles, homepage referral/hero block, and root layout. This includes the owner's latest consultation wording, all six referral areas, the 10-second delay, and the fullscreen click handler.

This work does not establish a 100/100 live SEO score or promise Google rankings. The live site could not be retrieved through the available web checks. A deployed Lighthouse/PageSpeed audit and Search Console inspection are still needed; the local HTTP checks cover generated output and routing.

Implementation references: [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) and [Google BreadcrumbList structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb). Medical source links are provided beside the relevant sections in each guide.

Validation of the content changes: production and Netlify preview builds passed compilation and TypeScript checks. The HTTP suite passed for all 43 content pages, with 42 sitemap URLs in production and zero in preview. It also checked all internal links and anchors, seven discoverable full guides, matching visible/schema breadcrumbs and article data, unknown-guide 404s, and the retained referral targets. ESLint passed for the new components, article routes/data, sitemap, and updated check script. A source comparison confirmed the six protected files, root layout, and homepage referral/hero block are byte-for-byte unchanged from the owner baseline.
