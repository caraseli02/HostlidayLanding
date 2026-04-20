---
status: pending
priority: p2
issue_id: "006"
tags: [code-review, accessibility, design, frontend]
dependencies: []
---

# Improve small-label contrast on the landing page

Several small all-caps labels use coral text on the cream background at `0.7rem`. That combination falls below normal-text AA contrast, making important section cues harder to read for low-vision users.

## Findings

- `src/landing.css:84-89` defines `.label` as `0.7rem` uppercase text.
- `src/landing.css:377-379` and `src/landing.css:586-588` color section labels with `var(--hostliday-coral)` on the light cream background.
- This affects visible UI copy such as “Explore the city”, “The process”, and “Example recommendation”.

## Proposed Solutions

### Option 1: Darken the label color for small text

**Approach:** Keep the coral accent for larger blocks, but use a darker accessible variant for small labels.

**Pros:**

- Preserves the visual language
- Minimal layout impact

**Cons:**

- Slightly reduces the original punch of the accent

**Effort:** 20-30 minutes

**Risk:** Low

---

### Option 2: Keep the coral but increase size/weight and add a supporting surface

**Approach:** Increase label size and/or place labels on a darker chip/surface where needed.

**Pros:**

- Maintains the accent color
- Can feel more intentional visually

**Cons:**

- More layout/design churn
- Easy to overcorrect with too many chips/badges

**Effort:** 45-90 minutes

**Risk:** Medium

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**

- `src/landing.css:84-89`
- `src/landing.css:320-322`
- `src/landing.css:377-379`
- `src/landing.css:586-588`

**Related components:**

- Section headers
- Recommendation label styling

**Database changes (if any):**

- No

## Resources

- **PR:** [#18](https://github.com/caraseli02/HostlidayLanding/pull/18)

## Acceptance Criteria

- [ ] Small labels on light backgrounds meet AA contrast requirements
- [ ] The revised label treatment remains visually consistent across the landing page
- [ ] `pnpm check` passes

## Work Log

### 2026-04-20 - Review finding created

**By:** Codex

**Actions:**

- Reviewed the new label token and its usage sites on cream surfaces
- Cross-checked the size and color combination flagged during review

**Learnings:**

- Accent colors that work for large display text often fail once reused as small utility labels
