---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, accessibility, ux, frontend]
dependencies: []
---

# Fix in-page anchor offsets under the fixed header

The landing page now uses a permanently fixed header, but the old `scroll-margin-top` offsets for the in-page sections were removed. Clicking nav links lands the target headings under the header, partially hiding the content the user asked to jump to.

## Findings

- `src/landing.css:93-100` makes the navigation fixed at the top of the viewport.
- `index.html:81-83`, `index.html:122-124`, and `index.html:491-492` contain in-page links to `#neighborhoods`, `#how`, and `#faq`.
- Unlike `origin/main`, the PR no longer defines section-level `scroll-margin-top` for those targets.

## Proposed Solutions

### Option 1: Restore section `scroll-margin-top`

**Approach:** Add a consistent `scroll-margin-top` to `#neighborhoods`, `#how`, and `#faq`.

**Pros:**

- Minimal, robust fix
- Keeps anchor behavior predictable everywhere those IDs are linked

**Cons:**

- Requires keeping the offset in sync with header height changes

**Effort:** 15-20 minutes

**Risk:** Low

---

### Option 2: Use global smooth-scroll offset handling in JS

**Approach:** Intercept hash navigation and scroll with a computed header offset.

**Pros:**

- Can adapt to responsive header height dynamically

**Cons:**

- More moving parts than necessary
- Easy to regress browser-native hash behavior

**Effort:** 1-2 hours

**Risk:** Medium

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**

- `src/landing.css:93-100`
- `index.html:81-83`
- `index.html:122-124`
- `index.html:491-492`

**Related components:**

- Fixed top nav
- In-page anchor navigation

**Database changes (if any):**

- No

## Resources

- **PR:** [#18](https://github.com/caraseli02/HostlidayLanding/pull/18)

## Acceptance Criteria

- [ ] Clicking desktop nav anchors reveals the target section heading fully below the fixed header
- [ ] Clicking drawer nav anchors behaves the same on mobile
- [ ] Footer in-page links behave the same
- [ ] `pnpm check` passes

## Work Log

### 2026-04-20 - Review finding created

**By:** Codex

**Actions:**

- Compared anchor-target behavior with the old landing implementation
- Verified fixed-header CSS remained while section offsets were removed

**Learnings:**

- Fixed navigation and hash links need to be reviewed together; treating them separately causes clipped destinations
