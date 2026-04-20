---
status: pending
priority: p3
issue_id: "009"
tags: [code-review, maintainability, frontend, css]
dependencies: []
---

# Simplify brittle landing-page CSS architecture

The variation introduces several maintainability shortcuts that are likely to drift or become fragile during the next design change: duplicated design tokens, multiple state systems for the hamburger animation, a `direction` hack for layout reversal, and hard-coded stagger sequencing tied to the current card count.

## Findings

- `src/landing.css:6-15` and `src/tailwind.css:7-88` define overlapping token systems for the same page.
- `src/landing.css:166-185` and `src/tailwind.css:90-103` both control hamburger animation state, and `src/tailwind.css` still references the removed legacy `.hamburger-line`.
- `src/landing.css:518-523` uses `direction: rtl` / `direction: ltr` to reverse one step layout instead of swapping grid placement directly.
- `src/landing.css:856-889` hard-codes seven stagger delays that match the current neighborhood card count exactly.

## Proposed Solutions

### Option 1: Consolidate to one token/state system and simplify the layout hooks

**Approach:** Pick one source of truth for theme tokens, one source of truth for nav animation state, and replace layout hacks with explicit modifier classes.

**Pros:**

- Reduces drift risk
- Makes the next variation easier to evolve

**Cons:**

- Cross-cuts multiple parts of the landing-page CSS

**Effort:** 2-4 hours

**Risk:** Medium

---

### Option 2: Keep the current structure but document and isolate each hack

**Approach:** Add comments, remove dead selectors, and narrow the fragile rules to clearly named modifiers.

**Pros:**

- Lower-cost cleanup
- Reduces confusion without a deeper refactor

**Cons:**

- Leaves duplicated concepts in place
- Less future-proof than full consolidation

**Effort:** 1-2 hours

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**

- `src/landing.css:6-15`
- `src/landing.css:166-185`
- `src/landing.css:518-523`
- `src/landing.css:856-889`
- `src/tailwind.css:7-112`

**Related components:**

- Landing page theme tokens
- Mobile nav animation state
- Steps layout alternation
- Neighborhood reveal sequencing

**Database changes (if any):**

- No

## Resources

- **PR:** [#18](https://github.com/caraseli02/HostlidayLanding/pull/18)
- **Known pattern:** [mobile-drawer-modal-aria-state-regression-2026-04-19.md](/Users/vladislavcaraseli/Documents/HostlidayLanding/docs/solutions/ui-bugs/mobile-drawer-modal-aria-state-regression-2026-04-19.md)

## Acceptance Criteria

- [ ] Landing-page tokens have a single source of truth or a clearly documented ownership boundary
- [ ] Hamburger animation state is driven by one mechanism only
- [ ] The alternating step layout does not depend on document direction hacks
- [ ] Stagger sequencing does not silently break when card count changes
- [ ] `pnpm check` passes

## Work Log

### 2026-04-20 - Review finding created

**By:** Codex

**Actions:**

- Consolidated multiple maintainability findings from the code-simplicity review
- Mapped the main brittle patterns back to exact CSS locations

**Learnings:**

- This variation is visually coherent, but its implementation currently carries more duplication and one-off logic than the other landing variants
