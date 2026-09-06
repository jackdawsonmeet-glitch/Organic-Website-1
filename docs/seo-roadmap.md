# MyVeta Health SEO roadmap

Source baseline: `7085281766a48f5e8c70bc288022be3cad490be3` in Organic-Website-1, reviewed September 6, 2026. This is a source audit; the production domain, Google indexing, Search Console data, rankings, and real-user performance have not been verified. The configured doctor/ad destination is not evidence of this site's production domain.

## First implementation

- Replace shared development metadata with distinct page titles, descriptions, canonical URLs, and Open Graph/X text.
- Add a production sitemap and robots file, with a configurable canonical origin and optional Search Console verification token.
- Limit condition routes to the 27 existing topics, preserve existing slugs, and return 404 for unknown topics.
- Generate known condition pages at build time; fix the A–Z anchors and navigation to real topics.
- Remove the timed iframe takeover, fullscreen click handler, and invisible referral areas. Keep visible ads and intentional doctor referrals. Mark the ad link as sponsored.
- Remove stale account/admin links and requests to missing endpoints from the public shell.
- Replace unsubstantiated medical-review labels with educational wording. Do not invent reviewers, credentials, or dates.
- Deliver health photographs through Next.js responsive images, preload the hero, and reserve image dimensions.
- Mark the unfinished newsletter signup and Netlify preview builds `noindex, follow`. Existing condition pages remain indexable; assess them with real search data before changing that policy.

This is a technical foundation. It does not demonstrate improved rankings or resolve the editorial gaps below.

## Priorities after review

| Priority | Finding | Next action | Evidence of completion |
| --- | --- | --- | --- |
| 1 | The actual public origin and search baseline are unknown. | Confirm the domain, intended audience, and main conversion. Verify its Search Console property; inspect indexing, queries, and pages. | Correct canonical URLs; baseline clicks, impressions, CTR, position, and indexed-page counts. |
| 1 | All 27 condition pages share the same generic body. | Prioritize a few relevant conditions and create distinct, useful guides with authoritative sources and a real qualified review process. Avoid mass expansion. | Each guide answers the topic's questions and displays verifiable authorship, reviewer details when reviewed, references, and genuine dates. |
| 1 | Article cards and daily summaries have no full articles. | Publish complete articles with stable URLs and link each card to its own article. Use article markup only when supported by visible content. | Every article link reaches a matching complete article; no claim to read a full article that does not exist. |
| 1 | Drug search and tool links are placeholders; newsletter signup is not connected. | Complete these services or replace promises and dead controls with accurate descriptions of what is available. | Users can complete the advertised task; no false success messages. |
| 1 | About/footer policy and privacy statements are not fully supported by implemented features. | Confirm the operator, contact details, real editorial/review process, data flows, and relevant policies. | Public trust and privacy information accurately describes the website. |
| 2 | Main images were multi-megabyte files delivered directly. | Verify responsive image behavior on the actual host and measure mobile performance. Check the animated advertisement separately. | Production PageSpeed/Lighthouse measurements and available real-user Core Web Vitals; record before/after data. |
| 2 | Wellbeing topics link to `#`; some navigation labels promise absent content. | Build useful topic sections/pages or simplify labels to match the destination. | Working links with descriptive anchor text and useful destinations. |
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


## Validation of this implementation

Production and Netlify preview builds passed Next.js compilation and TypeScript checking. The HTTP check covered all 36 content pages: distinct titles/descriptions, canonical paths, Open Graph/X text, one H1, indexing rules, a 35-URL production sitemap, an empty preview sitemap, actual 404 responses, existing encoded condition URLs, and the intentional doctor redirect. The homepage WebSite markup was checked against the configured origin.

In a local image check, a 640-pixel WebP hero response was 42,962 bytes versus its 2,610,321-byte PNG source. This is one image response, not a production page-speed measurement or a Core Web Vitals score. Browser/visual testing and live SEO verification were not performed.
