# MyVeta Public — Final GitHub + Netlify Code

This is the final public MyVeta website without login, ready for VS Code, GitHub, and Netlify.

## Doctor profile and fullscreen browsing

The doctor and advertisement settings both point to the supplied dental profile at <https://dr-mayank-singh-bds-mds.netlify.app/>. They remain separate settings in `app/config/doctorReferral.ts` and `app/config/advertisement.ts`.

- The homepage opens normally, without a Stay / Leave prompt or an embedded destination download.
- An ordinary click anywhere in the MyVeta document requests fullscreen. Normal menu controls, forms, and internal navigation keep working. Already-active fullscreen is reused; after a browser exit or denial, a later click can request it again.
- `DOCTOR_REDIRECT_DELAY_MS=10_000` opens the profile ten seconds after the root component mounts. Clicking a doctor link, referral area, or advertisement opens its destination immediately and cancels the pending timer.
- The profile loads in an iframe within the existing MyVeta document, so opening it does not require a top-level navigation that ends the current fullscreen session. The iframe is created only when the profile opens.
- The profile toolbar offers **Back to MyVeta**, **Fullscreen**, and **Open separately**. Going back closes the view, cancels any pending opening, and leaves the current fullscreen state alone. Opening separately uses a normal new tab and is also available if the destination later stops allowing embedding.

Fullscreen is controlled by the browser. A timer cannot grant the required user activation: without a prior click, the profile opens within the browser window and the visitor can use **Fullscreen**. Escape and browser exit controls remain available; no Escape handler, exit-blocking logic, or automatic fullscreen re-entry loop is installed. Native dialog dismissal can also close the profile view. Clicking inside the cross-origin profile does not dispatch clicks to MyVeta; the surrounding toolbar remains available. A browser may deny fullscreen, end it on tab changes or navigation, or not support it.

The new profile returned HTTP 200 with no frame-blocking response headers when checked during this change. This is a response-header check, not browser testing or independent verification of the clinician's credentials. If the doctor setting is a placeholder or invalid address, the timer and profile component remain inactive and **Find a Doctor** serves the existing unavailable-profile page.

## Advertisement animation

The configured advertisement link opens the same profile view. The banner keeps its existing dimensions and styling. It plays `public/ads/casino-jackpot-storyboard.mp4` as a muted, inline loop, with a first-frame poster and the original GIF fallback if playback fails. An unset advertisement destination leaves the animation visible without an outgoing link.

`AD_MEDIA_URL`, `AD_POSTER_URL`, and `AD_FALLBACK_MEDIA_URL` in the same configuration file select these assets. To replace the creative, update all three together so the video, poster, and fallback show the same advertisement. `AD_MEDIA_URL` can also point to an image/GIF to render it directly.

The optimized video is 163,280 bytes; including its 35,734-byte poster, the normal download is about 87% smaller than the original 1,521,631-byte GIF. Its 45 frame timestamps and three-second loop duration are preserved. Video compression is lossy. These are asset measurements, not a new live PageSpeed score.

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

Run `node scripts/check-doctor-profile.mjs` for the fullscreen and profile controller checks (ordinary clicks, the ten-second timer, doctor/ad links, fullscreen ordering and denial, separate-tab links, cancellation, and cleanup). These simulate browser APIs; they do not replace browser testing.

Build using a reserved test origin, then run the production HTTP checks:

```bash
SITE_URL=https://seo-validation.example npm run build
SITE_URL=https://seo-validation.example node scripts/check-seo.mjs
```

The test origin is for local validation only. Never configure it in your hosting environment. The check starts a temporary production server and verifies metadata, sitemap routes, preview indexing behavior in the built output, unknown-route 404s, image delivery, matching Article/BreadcrumbList markup, discoverable guides, and internal link/anchor destinations. No browser or live ranking measurement is involved.
