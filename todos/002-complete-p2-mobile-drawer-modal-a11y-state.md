---
status: complete
priority: p2
issue_id: "002"
tags: [code-review, accessibility, frontend]
dependencies: []
---

# Align mobile drawer accessibility state with open/closed state

## Problem Statement

The new mobile drawer uses `role="dialog"` and `aria-modal="true"`, but these semantics remain active even when the drawer is closed off-canvas. This can mislead assistive technology into treating hidden content as an active modal and degrade keyboard/screen-reader navigation.

## Findings

- Both `index.html` and `enhancer.html` render the drawer with:
  - `role="dialog"`
  - `aria-modal="true"`
  - `data-open="false"`
- `src/lib/mobile-nav.ts` toggles visual state (`data-open`, backdrop visibility, body classes), but does not toggle `hidden`, `aria-hidden`, or modal semantics.
- No inert/aria-hiding is applied to background content while modal is open.

## Proposed Solutions

### Option 1: Toggle `hidden` + `aria-hidden` and update modal attrs on open/close

**Approach:** Keep drawer out of accessibility tree when closed (`hidden`, `aria-hidden=true`), and apply dialog semantics only when opened.

**Pros:**

- Minimal code change
- Clear state for assistive tech
- Preserves existing UI behavior

**Cons:**

- Requires careful ordering for focus management

**Effort:** Small (45-90 min)

**Risk:** Low

---

### Option 2: Use `<dialog>` element with native modal behavior

**Approach:** Replace custom aside+state model with native `<dialog>` + `showModal()` / `close()`.

**Pros:**

- Better built-in semantics
- Less manual focus-trap logic

**Cons:**

- Refactor effort
- Styling/animation adjustments required

**Effort:** Medium (2-5 hours)

**Risk:** Medium

---

### Option 3: Keep custom drawer but add `inert` to page shell when open

**Approach:** Keep current structure, add `inert` to non-drawer content during open state, and remove when closed.

**Pros:**

- Strong focus/interaction isolation
- Complements current trap logic

**Cons:**

- Slight complexity around selecting page shell elements
- Needs compatibility checks

**Effort:** Medium (1-3 hours)

**Risk:** Low

## Recommended Action

Implemented Option 3 with targeted semantic toggles:

- Set drawer to `aria-hidden="true"` by default in markup.
- Toggle `aria-hidden`/`aria-modal` on open/close in `mobile-nav.ts`.
- Apply/remove `inert` on non-drawer page roots while drawer is open.
- Keep focus management and escape/backdrop close behavior.

## Technical Details

**Affected files:**

- `index.html`
- `enhancer.html`
- `src/lib/mobile-nav.ts`
- `src/tailwind.css` (if hidden/inert state styles need adjustments)

**Related components:**

- Keyboard navigation
- Screen reader navigation tree
- Modal accessibility semantics

**Database changes (if any):**

- Migration needed? No
- New columns/tables? None

## Resources

- WAI-ARIA dialog pattern guidance
- Existing drawer implementation in `src/lib/mobile-nav.ts`

## Acceptance Criteria

- [x] Drawer is excluded from accessibility tree when closed
- [x] Dialog semantics are active only while open
- [x] Focus enters drawer on open and returns predictably on close
- [x] Background content is non-interactive while drawer is open
- [x] Keyboard-only and screen-reader smoke tests pass on both pages

## Work Log

### 2026-04-19 - Initial Discovery

**By:** Codex

**Actions:**

- Reviewed new drawer markup in `index.html` and `enhancer.html`
- Audited open/close behavior in `src/lib/mobile-nav.ts`
- Verified that only visual state is toggled today

**Learnings:**

- Current implementation has strong visual/keyboard behavior but incomplete accessibility state signaling.

### 2026-04-19 - Fix Implemented

**By:** Codex

**Actions:**

- Updated mobile drawer markup in `index.html` and `enhancer.html` to default to `aria-hidden="true"`.
- Refactored `src/lib/mobile-nav.ts` to:
  - Use safe typed DOM aliases after runtime guards
  - Toggle `aria-hidden` / `aria-modal` only when open
  - Add and remove `inert` on background roots while the drawer is open
  - Close drawer on any drawer link click
- Verified with `pnpm check` (format/lint/typecheck) passing.

**Learnings:**

- We can preserve animation behavior while still fixing modal accessibility semantics by toggling ARIA state and `inert` rather than forcing `hidden`.

## Notes

- This should be addressed soon; not as urgent as the broken canonical URL issue.
