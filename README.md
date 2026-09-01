# MyVeta Public — Final GitHub + Netlify Code

This is the final public MyVeta website without login, ready for VS Code, GitHub, and Netlify.

## Change the doctor website later

Open:

`app/config/doctorReferral.ts`

Change only this line:

```ts
export const DOCTOR_WEBSITE_URL="https://your-new-website.com/";
```

That single setting controls:

- all six transparent homepage referral areas;
- every **Find a Doctor** link;
- the automatic 30-second redirect.

To change the delay, edit `DOCTOR_REDIRECT_DELAY_MS` in the same file. `30_000` means 30 seconds; `60_000` means 60 seconds.

## Change the advertisement link later

Open:

`app/config/advertisement.ts`

Change only the **AD LINK** line:

```ts
export const AD_LINK_URL="https://your-new-ad-link.com/";
```

The animated GIF is stored at `public/ads/casino-jackpot-storyboard.gif`. Replace that file with another GIF using the same filename to change the advertisement without editing the page code.

## Test in VS Code

```bash
npm install
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
