# HostlidayLanding — Deployment Plan

## Recommendation: GitHub Pages via GitHub Actions

**Why GitHub Pages:**
- **Zero cost** for public repos
- **Zero config hosting** — serves static files from `dist/` (36KB total)
- **Native GitHub integration** — repo already on `github.com/caraseli02/HostlidayLanding`
- **Custom domain support** — can point `hostliday.com` or a subdomain later
- **HTTPS by default** — free SSL certificates
- **Branch-based deploys** — clean CI/CD via GitHub Actions

**Alternatives considered:**
| Platform | Cost | Notes |
|---|---|---|
| Vercel | Free tier | Overkill for a single static page; adds vendor coupling |
| Netlify | Free tier | Similar to Vercel; unnecessary for this scope |
| Cloudflare Pages | Free | Good but adds account management overhead |
| AWS S3 + CloudFront | ~$0.50/mo | Too much infra for a landing page |
| GitHub Pages | **Free** | ✅ Best fit: native, zero-config, already integrated |

---

## Deployment Workflow

### Step 1: Add GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Step 2: Enable GitHub Pages in repo settings

1. Go to **Settings → Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. The workflow above handles the rest

### Step 3: Verify deployment

After pushing to `main`:
- Site live at: `https://caraseli02.github.io/HostlidayLanding/`
- Check **Actions** tab for build status

### Step 4 (Optional): Custom domain

1. Add `CNAME` file to `dist/` via vite config:
   ```ts
   // vite.config.ts — add to defineConfig:
   build: { rollupOptions: {} },
   // For custom domain, create public/CNAME with: hostliday.com
   ```
2. In **Settings → Pages → Custom domain**, enter your domain
3. Configure DNS at your registrar:
   - CNAME record: `hostliday.com` → `caraseli02.github.io`

---

## Required Environment / Assumptions

- **GitHub repo**: Public (required for free GitHub Pages)
- **pnpm**: v10+ (already in use, lockfile committed)
- **Node**: 20 LTS
- **Build output**: `dist/` directory (static HTML/CSS/JS, ~36KB)
- **No server-side requirements** — purely static
- **No environment variables** needed for the landing page

---

## Implementation Checklist

- [ ] Create `.github/workflows/deploy.yml` (content above)
- [ ] Ensure repo is public (Settings → General → Danger Zone)
- [ ] Enable GitHub Pages with Actions source (Settings → Pages)
- [ ] Push to `main` and verify first deploy
- [ ] Confirm live URL: `https://caraseli02.github.io/HostlidayLanding/`
- [ ] (Optional) Configure custom domain

---

## Monitoring

- **Build status**: GitHub Actions badge (add to README)
- **Uptime**: GitHub Pages SLA (99.95%)
- **Analytics**: Add Plausible/Umami script in `index.html` head if needed

```markdown
<!-- Add to README.md for build status badge -->
[![Deploy](https://github.com/caraseli02/HostlidayLanding/actions/workflows/deploy.yml/badge.svg)](https://github.com/caraseli02/HostlidayLanding/actions/workflows/deploy.yml)
```
