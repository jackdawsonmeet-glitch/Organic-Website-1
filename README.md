# MyVeta Public — Final GitHub + Netlify Code

This is the final public MyVeta website without login, ready for VS Code, GitHub, and Netlify.

## Homepage word-game advertisement

The 970 × 90 homepage banner promotes **Daily Letter** at <https://crosswordgameplay.netlify.app/>. Although the domain says crossword, its current repository describes a five-letter word game, so the creative matches that game name and gameplay.

- Copy: “Your daily word break” / “Five letters. Six tries. A fresh puzzle each day.” / “Play Daily Letter”.
- The visible advertisement label remains above the banner. Its accessible name identifies the game and new-tab destination.
- Clicking anywhere on the banner opens the crossword website in a new tab. Its link sits above the adjacent referral zones so they cannot cover the artwork.
- `public/ads/daily-letter-970x90.svg` animates letter tiles, alternates two sliding headlines, grows a small accent line, and sweeps a soft highlight across the gold play link. Three eight-second cycles end at 24 seconds on the original readable headline. It contains no script, video, flashing, or gambling imagery.
- Visitors with reduced motion enabled receive the matching still PNG through a picture source; the SVG also disables its own animations under that preference. The PNG is 22,716 bytes. Asset size is not a PageSpeed score.
- `public/ads/daily-letter-970x90.svg` is the editable artwork. `AD_LINK_URL` and media paths are in `app/config/advertisement.ts`; the main media path uses the animated SVG, while the fallback and poster paths use its still PNG. No old casino fallback loads.

This change is limited to the advertisement. On the current `main` baseline, `DOCTOR_WEBSITE_URL` is still the inactive `Sample 2` placeholder and the stored delay is unchanged at `5_000`. The separate fullscreen/profile PR is not included here.

### Advertising review limits

The creative contains no prize, earnings, medical-benefit, guaranteed-result, or Google-approval claims. It follows the clarity and destination-matching principles in Google's [misrepresentation policy](https://support.google.com/adspolicy/answer/6020955?hl=en) and [destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en). Motion stops before the 30-second maximum in the [image-ad animation policy](https://support.google.com/adspolicy/answer/176108?hl=en). This SVG is a website asset, not a packaged Google Ads upload. Approval also depends on the full destination and advertiser account; this banner is not a compliance certification.

The crossword repository currently enables a 600-second automatic external view, requests fullscreen on ordinary clicks, and has an ad that describes a shopping offer while linking to a crossword page. These destination behaviors need separate review and correction before seeking Google Ads approval. The live destination returned HTTP 200 and Daily Letter content during a direct HTTP check. It sends `X-Frame-Options: DENY`, so the ad opens it in its own tab instead of embedding it. This is not interactive browser validation.

## Test in VS Code

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## First deployment: GitHub → Netlify

1. Create an empty repository on GitHub.
2. Open this folder in VS Code and run:

   ```bash
   git init
   git add .
   git commit -m "Initial MyVeta website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. In Netlify, choose **Add new project → Import an existing project → GitHub**.
4. Select the repository. Netlify will read `netlify.toml` and use:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Select **Deploy**. No environment variables are required.

## Future changes with pull requests

1. Create a new Git branch.
2. Make and commit the change.
3. Push the branch and open a GitHub pull request.
4. Netlify creates a separate Deploy Preview URL for that pull request.
5. Check the preview. Merge the pull request into `main` to update the production website.


## SEO configuration

Set `SITE_URL` to the preferred public origin (for example, your verified custom domain) in the hosting build environment. Use only the origin, with no path, query, or fragment. On Netlify, its built-in `URL` is the fallback and already represents the main site address. Do not use `DEPLOY_URL`, `DEPLOY_PRIME_URL`, or the doctor referral destination as the canonical origin.

Without either `SITE_URL` or Netlify's `URL`, local builds omit canonical URLs and WebSite markup and produce an empty sitemap. This allows local work without inventing a production domain. Configure the real address before deploying outside Netlify. Rebuild after changing these values.

- Public pages have distinct titles, descriptions, self-canonical URLs, and Open Graph/X text metadata.
- `/robots.txt` links to `/sitemap.xml`; the sitemap contains existing public content routes and preserves the current condition slugs.
- Unknown condition slugs return 404. All 27 known condition routes are generated at build time.
- Netlify preview and branch deploy pages use `noindex, follow`, with no sitemap entries. They remain crawlable so crawlers can read `noindex`.
- `/subscribe` is `noindex, follow` while its backend is unfinished. `/find-a-doctor` and API routes are excluded from the sitemap.
- Set `GOOGLE_SITE_VERIFICATION` to the HTML verification token supplied by Google Search Console when that property is ready. Then submit the production `/sitemap.xml` in Search Console.
- Health photos use Next.js responsive image delivery; the hero loads eagerly with high fetch priority, and the remaining images load lazily with reserved dimensions.

Seven full health guides are maintained in `app/content/health-articles.ts` and generated at `/health-news/[slug]`. Their homepage and health-section cards use that same registry. Each guide includes original educational text, linked primary sources, related reading, its own metadata, and Article markup that matches the visible content. No publication dates, medical reviewers, ratings, or individual author credentials have been invented.

Breadcrumbs are visible and marked up on guide, condition, health-section, wellbeing, and medication pages. The production sitemap includes 42 content URLs. Wellbeing topics and medication resource cards link to matching MyVeta guides or clearly identified public health resources; the inert medication search has been replaced by a MedlinePlus library link.

The new guides are AI-assisted and have not been independently medically reviewed; that status is visible on the guides and About page. Generic condition content, actual medical review, unfinished newsletter signup, and live search measurement remain work; see [SEO roadmap](docs/seo-roadmap.md).

### Verify the SEO output locally

Run `node scripts/check-website-choice.mjs` for the choice controller checks (first click, timer, Stay, Leave, dismissal, session persistence, separate ad destinations, blocked fullscreen/storage, and cleanup). These simulate browser APIs; they do not replace browser testing.

Build using a reserved test origin, then run the production HTTP checks:

```bash
SITE_URL=https://seo-validation.example npm run build
SITE_URL=https://seo-validation.example node scripts/check-seo.mjs
```

The test origin is for local validation only. Never configure it in your hosting environment. The check starts a temporary production server and verifies metadata, sitemap routes, preview indexing behavior in the built output, unknown-route 404s, image delivery, matching Article/BreadcrumbList markup, discoverable guides, and internal link/anchor destinations. No browser or live ranking measurement is involved.
