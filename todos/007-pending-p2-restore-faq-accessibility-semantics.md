---
status: pending
priority: p2
issue_id: "007"
tags: [code-review, accessibility, frontend, trust]
dependencies: []
---

# Restore explicit FAQ question-to-answer accessibility semantics

The FAQ refactor kept the basic expand/collapse behavior, but it dropped the explicit accessible relationship between each question button and its answer panel. Screen readers now lose the named region association that the previous implementation provided.

## Findings

- `index.html:420-465` defines FAQ buttons with `aria-controls`, but the buttons no longer have IDs.
- The answer containers at `index.html:424`, `438`, `451`, and `465` are plain `div`s with `aria-hidden`, not labeled regions.
- The prior implementation exposed answer panels with `role="region"` and `aria-labelledby`, which made the relationship between the button and revealed content explicit.

## Proposed Solutions

### Option 1: Restore button IDs and labeled regions

**Approach:** Give each FAQ button an ID and add `role="region"` plus `aria-labelledby` on the matching answer container.

**Pros:**

- Minimal patch
- Restores the semantics that previously existed

**Cons:**

- Requires keeping IDs and references in sync

**Effort:** 20-30 minutes

**Risk:** Low

---

### Option 2: Replace the custom accordion markup with a well-structured disclosure pattern component

**Approach:** Encapsulate the FAQ structure so the ARIA relationship is generated consistently.

**Pros:**

- Harder to regress in future variations
- Improves maintainability if more FAQs are added

**Cons:**

- More work than necessary for this PR

**Effort:** 1-2 hours

**Risk:** Medium

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**

- `index.html:420-465`
- `index.html:550-568`

**Related components:**

- FAQ accordion
- Trust/explainer content on the landing page

**Database changes (if any):**

- No

## Resources

- **PR:** [#18](https://github.com/caraseli02/HostlidayLanding/pull/18)

## Acceptance Criteria

- [ ] Each FAQ button has a stable ID
- [ ] Each answer panel is explicitly labeled by its trigger
- [ ] Screen readers can identify the revealed answer as belonging to the selected question
- [ ] `pnpm check` passes

## Work Log

### 2026-04-20 - Review finding created

**By:** Codex

**Actions:**

- Compared the new FAQ markup with the previous implementation
- Verified the explicit region labeling was removed during the rewrite

**Learnings:**

- Simple accordion rewrites often preserve visual behavior while quietly dropping screen-reader structure
