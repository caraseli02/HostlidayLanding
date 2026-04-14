# Hostliday Landing — Deployment Flow

> **Status:** Verified 2026-04-14 | **Issue:** CAR-13

## Current State

| Item | Value |
|------|-------|
| **Platform** | Vercel (auto-deploy via GitHub integration) |
| **Production URL** | https://hostliday-landing.vercel.app |
| **Repo** | `caraseli02/HostlidayLanding` (public) |
| **Framework** | Vite + vite-plus, pnpm |
| **CI** | GitHub Actions (`ci.yml`) — runs `pnpm build` on push/PR to main |

## Deployment Flow

> ⚠️ **Never push directly to `main`.** All changes go through PRs.

```
1. Create a feature branch from main
   → git checkout -b feat/my-change main

2. Push branch & open PR
   → GitHub Actions CI runs (build check)
   → Vercel creates a PREVIEW deployment (unique URL in PR comment)

3. Review preview URL → approve & merge PR
   → Vercel auto-deploys merged code to production
   → Live at https://hostliday-landing.vercel.app
```

**That's it.** Vercel is linked via the GitHub app (`vercel[bot]`). No extra workflow file needed — Vercel listens to the repo directly. Production deploys happen only when PRs are merged into `main`.

## What Was Disabled

- `deploy.yml.disabled` — was a GitHub Pages workflow. Correctly disabled. GitHub Pages is no longer the target.

## Verified Facts

1. **Vercel project exists** — `vercel[bot]` has made Production deployments (latest: 2026-04-14T18:27:52Z).
2. **Homepage is set** — repo homepage = `https://hostliday-landing.vercel.app`.
3. **Site is live** — returns HTTP 200.
4. **CI is lightweight** — single `build` job, no deploy step (Vercel handles that).

## Gaps & Recommendations

| # | Item | Status | Action |
|---|------|--------|--------|
| 1 | Vercel project ownership | ✅ Linked via `vercel[bot]` | Confirm Vlad has Vercel dashboard access to manage settings |
| 2 | Preview deployments | ✅ Auto (Vercel default for PRs) | No action needed |
| 3 | Custom domain | ❌ Not configured | Optional: add `hostliday.com` or subdomain when ready |
| 4 | Build output directory | ✅ Defaults to `dist/` (Vite standard) | Verify in Vercel dashboard → Settings → Build |
| 5 | Environment variables | ❓ Unknown | Check Vercel dashboard if any env vars are needed |
| 6 | Deploy protection | ❓ Unknown | Consider enabling Vercel's "Deployment Protection" for non-production previews |

## MVP Review Checklist

For each iteration:

- [ ] Open a PR → review preview URL → merge when approved
- [ ] After merge, verify live at `https://hostliday-landing.vercel.app`
- [ ] Check Vercel dashboard for build errors if site doesn't update
- [ ] Confirm CI passes (green check on GitHub)

## Operational Owner

- **Current:** Vercel auto-deploy (no manual step needed)
- **Recommended:** Vlad should log into Vercel dashboard to confirm full ownership of the project
- **Future:** For custom domains, env vars, or deploy hooks → Vercel dashboard → Project Settings
