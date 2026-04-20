---
status: pending
priority: p2
issue_id: "004"
tags: [code-review, accessibility, reliability, frontend]
dependencies: []
---

# Restore reveal-script fallback for unsupported browsers

The landing page reveal animation now assumes `IntersectionObserver` exists. In browsers or embedded webviews without that API, the script throws before initialization finishes, while the CSS keeps major sections hidden at `opacity: 0`. That turns a decorative enhancement into a content-visibility failure.

## Findings

- `index.html:518-547` instantiates `new IntersectionObserver(...)` without the previous feature-detection guard.
- `src/landing.css:840-860` initializes `[data-reveal]`, `[data-hero-reveal]`, and `[data-stagger] > *` hidden until JS marks them visible.
- Because the throw happens before the FAQ script completes, this also prevents later inline behavior from running on affected clients.

## Proposed Solutions

### Option 1: Restore the old feature check

**Approach:** Guard on `!("IntersectionObserver" in window)` and immediately mark reveal targets visible when unsupported.

**Pros:**

- Smallest patch
- Restores previously working fallback behavior

**Cons:**

- Keeps reveal logic inline in `index.html`

**Effort:** 20-30 minutes

**Risk:** Low

---

### Option 2: Move reveal logic into a dedicated module with progressive enhancement

**Approach:** Extract the reveal script to a JS module that defaults to visible content, then enhances only when APIs exist.

**Pros:**

- Cleaner separation of concerns
- Easier to test and reuse

**Cons:**

- Larger refactor than needed for this regression

**Effort:** 1-2 hours

**Risk:** Medium

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**

- `index.html:518-547`
- `src/landing.css:840-889`

**Related components:**

- Landing page reveal animations
- FAQ inline script execution order

**Database changes (if any):**

- No

## Resources

- **PR:** [#18](https://github.com/caraseli02/HostlidayLanding/pull/18)
- **Branch:** `variation/bold-maximalist`

## Acceptance Criteria

- [ ] The landing page remains fully readable when `IntersectionObserver` is unavailable
- [ ] FAQ interactions still initialize on clients without `IntersectionObserver`
- [ ] Reduced-motion behavior remains intact
- [ ] `pnpm check` passes

## Work Log

### 2026-04-20 - Review finding created

**By:** Codex

**Actions:**

- Compared the current inline reveal script against `origin/main`
- Confirmed the old feature-detection fallback was removed
- Verified the CSS still hides reveal targets by default

**Learnings:**

- Decorative animation code is currently on the critical path for core content visibility
