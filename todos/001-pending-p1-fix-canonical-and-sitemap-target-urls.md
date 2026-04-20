---
status: pending
priority: p1
issue_id: "001"
tags: [code-review, seo, deployment]
dependencies: []
---

# Fix canonical and sitemap target URLs

## Problem Statement

The new SEO metadata points to URLs that are currently unreachable in production. This can cause crawlers and social link unfurlers to index/share broken pages, and may de-rank valid pages due to invalid canonical signals.

## Findings

- `index.html` and `enhancer.html` now set canonical/OG/Twitter URLs to `https://hostliday.vercel.app/...`.
- `public/sitemap.xml` also uses the same host.
- Live check on 2026-04-19:
  - `https://hostliday.vercel.app` returns `404 DEPLOYMENT_NOT_FOUND`
  - `https://hostliday-landing.vercel.app` returns `200`
- `docs/DEPLOYMENT.md` documents `https://hostliday-landing.vercel.app` as production URL.

## Proposed Solutions

### Option 1: Point metadata/sitemap to current production domain

**Approach:** Replace all canonical/OG/Twitter/sitemap host values with `https://hostliday-landing.vercel.app`.

**Pros:**

- Fastest fix
- Removes broken canonical signals immediately
- No hosting changes required

**Cons:**

- Hard-codes platform domain
- Requires future update if custom domain changes

**Effort:** Small (30-60 min)

**Risk:** Low

---

### Option 2: Add custom domain + parameterize site URL at build time

**Approach:** Configure a stable custom domain and generate canonical/sitemap from an env var during build.

**Pros:**

- Long-term correct source of truth
- Avoids future manual edits across files

**Cons:**

- Requires Vercel/domain setup
- Slightly more implementation effort

**Effort:** Medium (2-4 hours)

**Risk:** Medium

---

### Option 3: Temporarily remove canonical/OG URL fields until domain is finalized

**Approach:** Keep title/description/image but remove URL-specific tags and sitemap host until stable domain is ready.

**Pros:**

- Avoids publishing wrong canonical signals
- Lower risk than keeping invalid URLs

**Cons:**

- Less SEO structure short-term
- Needs follow-up once domain is settled

**Effort:** Small (20-40 min)

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**

- `index.html`
- `enhancer.html`
- `public/sitemap.xml`
- `docs/DEPLOYMENT.md` (reference/source of expected prod URL)

**Related components:**

- Social sharing previews (Open Graph/Twitter)
- Search engine canonicalization
- XML sitemap indexing

**Database changes (if any):**

- Migration needed? No
- New columns/tables? None

## Resources

- `docs/DEPLOYMENT.md`
- Production checks run on 2026-04-19 via `curl -I`

## Acceptance Criteria

- [ ] Canonical and OG/Twitter URLs resolve with HTTP 200 in production
- [ ] `public/sitemap.xml` host matches active production host
- [ ] No metadata references to `hostliday.vercel.app` remain (unless deployment exists)
- [ ] Re-verify with `curl -I` for homepage + enhancer URLs
- [ ] Search preview/debug tools (OG/Twitter validators) show valid URLs

## Work Log

### 2026-04-19 - Initial Discovery

**By:** Codex

**Actions:**

- Reviewed SEO changes in `index.html`, `enhancer.html`, and `public/sitemap.xml`
- Cross-checked expected production URL from `docs/DEPLOYMENT.md`
- Verified live responses using `curl -I` for both Vercel hosts

**Learnings:**

- The new metadata host is not currently deployed
- Current documented production host is reachable and should be used as canonical source

## Notes

- Treat as merge-blocking because canonical/sitemap errors can poison indexing quickly after deploy.
