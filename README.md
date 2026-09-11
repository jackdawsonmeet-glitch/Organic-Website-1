# MyVeta Public — Final GitHub + Netlify Code

This is the final public MyVeta website without login, ready for VS Code, GitHub, and Netlify.

## Stay / Leave choice and destination

The first ordinary click opens a small MyVeta **Stay on MyVeta / Leave website** dialog. The existing fullscreen request runs from that click; if fullscreen is unavailable, the dialog still works. The configured timer can also open the choice, without navigating or loading the destination.

- **Stay** closes the dialog on the current page without reloading it. Escape/native dismissal also means Stay. The automatic prompt is suppressed for the rest of that tab's session, including reloads and internal navigation.
- **Leave** opens the displayed destination in the same tab. There is no external iframe or destination preloading.
- Later intentional doctor or advertisement clicks show the choice for that link's destination. Ordinary browsing after Stay works normally, without requesting fullscreen again. Modified clicks keep the browser's usual behavior.

This is a site dialog. It does not replace the browser's own close-tab or unsaved-changes prompt.

To change the default **Leave** destination, open:

Open:

`app/config/doctorReferral.ts`

Change only this line:

```ts
export const DOCTOR_WEBSITE_URL="https://your-new-website.com/";
```

That single setting controls:

- all six original transparent homepage referral areas;
- every **Find a Doctor** link;
- the first-click and timed Stay / Leave prompts.

The destination remains controlled by this setting; advertisement clicks use their separate setting below. The dialog shows the full destination before the visitor chooses Leave.

`DOCTOR_REDIRECT_DELAY_MS` retains the owner's current value in that file: `1_000` milliseconds (one second). This controls when the choice appears if the visitor has not clicked or answered it. The timer never overrides Stay. For reference, `10_000` would mean ten seconds; this change does not alter the configured delay.

## Change the advertisement link later

Open:

`app/config/advertisement.ts`

Change only the **AD LINK** line:

```ts
export const AD_LINK_URL="https://your-new-ad-link.com/";
```

The banner plays `public/ads/casino-jackpot-storyboard.mp4` as a muted, inline loop. A first-frame poster appears while it loads. If playback fails or autoplay is blocked, it uses the original GIF. The surrounding advertisement link supplies the destination for its Stay / Leave choice.

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

Run `node scripts/check-website-choice.mjs` for the choice controller checks (first click, timer, Stay, Leave, dismissal, session persistence, separate ad destinations, blocked fullscreen/storage, and cleanup). These simulate browser APIs; they do not replace browser testing.

Build using a reserved test origin, then run the production HTTP checks:

```bash
SITE_URL=https://seo-validation.example npm run build
SITE_URL=https://seo-validation.example node scripts/check-seo.mjs
```

The test origin is for local validation only. Never configure it in your hosting environment. The check starts a temporary production server and verifies metadata, sitemap routes, preview indexing behavior in the built output, unknown-route 404s, image delivery, matching Article/BreadcrumbList markup, discoverable guides, and internal link/anchor destinations. No browser or live ranking measurement is involved.
