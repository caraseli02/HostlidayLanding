---
status: pending
priority: p3
issue_id: "008"
tags: [code-review, performance, frontend, css]
dependencies: []
---

# Reduce costly paint and compositing effects on the landing page

The new landing page styling uses effects that are visually striking but expensive for scrolling and hover performance: a fixed nav blended against the full page and large-card gradient background transitions on hover.

## Findings

- `src/landing.css:93-100` applies `mix-blend-mode: difference` to the fixed navigation, forcing ongoing compositing against the content underneath.
- `src/landing.css:419-431` transitions full-card gradient backgrounds on the neighborhood overlay instead of animating cheaper properties like opacity or transform.
- These are likely to be most noticeable on lower-end mobile GPUs and embedded browsers.

## Proposed Solutions

### Option 1: Replace paint-heavy effects with opacity/layer-based alternatives

**Approach:** Use a conventional nav surface and split the neighborhood overlay into static and hover layers whose opacity changes.

**Pros:**

- Improves rendering predictability
- Keeps most of the intended visual feel

**Cons:**

- Some of the original art direction changes

**Effort:** 1-2 hours

**Risk:** Medium

---

### Option 2: Keep the effects but gate them to larger screens / hover-capable devices

**Approach:** Preserve the strongest effects only where they are least likely to hurt performance.

**Pros:**

- Keeps the desktop art direction mostly intact
- Reduces risk on mobile devices

**Cons:**

- Two behavior tiers to maintain
- Still retains expensive effects in some environments

**Effort:** 45-90 minutes

**Risk:** Medium

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**

- `src/landing.css:93-100`
- `src/landing.css:419-431`

**Related components:**

- Fixed top navigation
- Neighborhood card hover treatment

**Database changes (if any):**

- No

## Resources

- **PR:** [#18](https://github.com/caraseli02/HostlidayLanding/pull/18)

## Acceptance Criteria

- [ ] Scrolling no longer relies on a page-wide blended fixed header effect
- [ ] Neighborhood hover motion avoids animating gradient paints directly
- [ ] Visual intent is preserved within acceptable performance bounds
- [ ] `pnpm check` passes

## Work Log

### 2026-04-20 - Review finding created

**By:** Codex

**Actions:**

- Reviewed the new nav and neighborhood hover CSS for paint-heavy properties
- Captured the two highest-cost effects surfaced by performance review

**Learnings:**

- High-impact visual treatments should be biased toward transform/opacity animation to avoid paint-bound regressions
