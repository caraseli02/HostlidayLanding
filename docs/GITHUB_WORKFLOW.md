# GitHub Delivery Workflow — HostlidayLanding

## 1. Repo Overview

- **Remote:** `https://github.com/caraseli02/HostlidayLanding.git`
- **Default branch:** `main`
- **Stack:** Vite + vite-plus (TypeScript), pnpm, static SPA
- **Build output:** `dist/`

## 2. Branch Strategy

**Trunk-based development (simple):**

| Branch   | Purpose                                       |
| -------- | --------------------------------------------- |
| `main`   | Production-ready code. Protected.             |
| `feat/*` | Feature branches (e.g. `feat/cta-refinement`) |
| `fix/*`  | Bug fixes                                     |

**Rules:**

- All changes go through feature branches → PR → `main`
- Direct push to `main` is disabled (GitHub setting)
- Feature branches are deleted after merge
- For this small project, keep it lean — no `develop` or `staging` branches

## 3. Required GitHub Repo Settings

Navigate to **Settings → General** in the GitHub repo:

### Branch Protection (main)

- ✅ Require a pull request before merging
- ✅ Require approvals (1 reviewer — fine to bypass for solo work)
- ✅ Require status checks to pass (once CI is set up)
- ✅ Require linear history (clean merge commits)

### General

- ✅ Automatically delete head branches
- ✅ Allow squash merging (preferred) + merge commits
- ❌ Do not allow rebase merging (keeps it simple)

## 4. CI Pipeline (GitHub Actions)

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-check:
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
      - run: pnpm check
```

**What it does:**

- Installs deps, builds, and runs checks on every PR and push to main
- Catches build errors and lint issues before they land

## 5. Deployment

### Recommended: GitHub Pages (free, perfect for static SPA)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
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

      - uses: actions/deploy-pages@v4
        id: deployment
```

**Setup steps:**

1. Go to **Settings → Pages**
2. Source: **GitHub Actions**
3. Push the workflow file — deploys automatically on merge to `main`

**Alternative options** (if custom domain needed):

- **Cloudflare Pages** — free, automatic, custom domains, fast CDN
- **Vercel** — free tier, auto-deploys from GitHub, preview URLs per PR
- **Netlify** — similar to Vercel, good for static sites

### Custom Domain (optional)

1. Add `CNAME` file to `dist/` via Vite config:
   ```ts
   // vite.config.ts
   export default defineConfig({
     // ...existing config
     build: {
       rollupOptions: {
         output: {
           /* existing */
         },
       },
     },
     // Serve CNAME from public/
   });
   ```
2. Create `public/CNAME` with your domain
3. Configure DNS at your registrar

## 6. Release & Versioning

For a landing page, keep it dead simple:

- **No formal releases** — `main` = live
- **Semantic versioning** in `package.json` only if you want changelogs
- **Tags** for milestones: `git tag v0.2.0 -m "Refined landing page"`
- GitHub Releases optional — useful for tracking what shipped when

## 7. Daily Workflow

```bash
# Start a feature
git checkout -b feat/cta-polish
# ... make changes ...
pnpm build && pnpm check  # verify locally

# Commit & push
git add . && git commit -m "feat: polish CTA section"
git push -u origin feat/cta-polish

# Open PR → CI runs → merge → auto-deploy
gh pr create --fill
```

## 8. Checklist to Activate

- [ ] Enable branch protection on `main`
- [ ] Add `.github/workflows/ci.yml`
- [ ] Add `.github/workflows/deploy.yml`
- [ ] Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
- [ ] Push both workflows to `main`
- [ ] Verify first deploy succeeds
- [ ] (Optional) Configure custom domain
