---
module: Hostliday Landing - Mobile Navigation
date: 2026-04-19
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - Mobile drawer appeared closed but still behaved like an active modal for assistive technologies.
  - Drawer open/close toggled visual state only, without synchronized ARIA modal visibility state.
  - Background page content was still interactable while drawer was open before inert-state handling.
  - Local quality gate failed during the fix cycle until formatting and TS-safe refactor were completed.
root_cause: logic_error
resolution_type: code_fix
severity: medium
related_components: [development_workflow, tooling]
tags: [accessibility, mobile-drawer, aria-modal, aria-hidden, inert, quality-gate]
---

# Troubleshooting: Mobile Drawer Modal Semantics Out of Sync with Visual State

## Problem

The mobile navigation drawer used modal semantics that were not tied to real open/closed state. Users could visually close the drawer while assistive technologies still treated it as modal context, creating navigation noise and inconsistent interaction behavior.

## Environment

- Module: Hostliday Landing - Mobile Navigation
- Affected Component: Frontend drawer behavior (`src/lib/mobile-nav.ts`, `index.html`, `enhancer.html`)
- Date: 2026-04-19

## Symptoms

- Drawer markup exposed `role="dialog"` while closed state semantics were not fully synchronized.
- Open/close logic changed CSS/visual flags (`data-open`, backdrop visibility, body classes) but initially did not fully align `aria-hidden` / `aria-modal` state transitions.
- Background content needed inert isolation while drawer was open.
- `pnpm check` initially failed during remediation due to formatting/type-safety follow-up work.

## What Didn't Work

**Attempted Solution 1:** Relying on visual state toggles only.

- **Why it failed:** Visual open/close is insufficient for assistive-tech correctness. Accessibility semantics remained partially stale relative to UI state.

**Attempted Solution 2:** Applying updates without passing the full quality gate.

- **Why it failed:** `pnpm check` surfaced follow-up issues (format/lint/type safety), so remediation was incomplete until all gates were green.

## Solution

Implemented explicit accessibility state management alongside visual state management in the mobile drawer controller.

**Code changes**:

```ts
// src/lib/mobile-nav.ts
function applyClosedA11yState(): void {
  drawerPanel.setAttribute("aria-hidden", "true");
  drawerPanel.removeAttribute("aria-modal");
  drawerBackdrop.setAttribute("aria-hidden", "true");
  setBackgroundInert(false);
}

function applyOpenA11yState(): void {
  drawerPanel.setAttribute("aria-hidden", "false");
  drawerPanel.setAttribute("aria-modal", "true");
  drawerBackdrop.setAttribute("aria-hidden", "false");
  setBackgroundInert(true);
}
```

```ts
// src/lib/mobile-nav.ts
function open(): void {
  drawerPanel.setAttribute("data-open", "true");
  drawerBackdrop.setAttribute("data-visible", "true");
  toggleButton.setAttribute("aria-expanded", "true");
  applyOpenA11yState();
}

function close(returnFocus = true): void {
  drawerPanel.setAttribute("data-open", "false");
  drawerBackdrop.setAttribute("data-visible", "false");
  toggleButton.setAttribute("aria-expanded", "false");
  applyClosedA11yState();
}
```

```html
<!-- index.html and enhancer.html -->
<aside id="mobileDrawer" role="dialog" aria-hidden="true" data-open="false" ...></aside>
```

Additional stabilization:

- Closed state is enforced at initialization (`close(false)` in setup).
- Drawer closes from all key paths (toggle, close button, backdrop, Escape, link click).
- Background inertness is toggled with drawer state.

**Commands run**:

```bash
pnpm fmt
pnpm check
```

## Why This Works

The bug came from split state management: visual state and accessibility state were handled separately and inconsistently. The fix centralizes semantic transitions (`aria-hidden`, `aria-modal`, `inert`) and calls them from the same open/close state transitions that drive visual behavior. This guarantees assistive technologies and keyboard interaction receive the same truth as the rendered UI.

## Prevention

- Use a single state transition path for drawer open/close that updates visual, ARIA, focus, inert, and scroll-lock state together.
- Ensure initial HTML state matches initial runtime state.
- Add regression tests for all close paths (button, backdrop, Escape, link click).
- Require `pnpm check` to pass before review/merge for frontend interaction changes.

## Related Issues

- [todos/002-complete-p2-mobile-drawer-modal-a11y-state.md](../../../todos/002-complete-p2-mobile-drawer-modal-a11y-state.md)
- [todos/003-complete-p2-fix-format-check-failures.md](../../../todos/003-complete-p2-fix-format-check-failures.md)
- Follow-up pending: [todos/001-pending-p1-fix-canonical-and-sitemap-target-urls.md](../../../todos/001-pending-p1-fix-canonical-and-sitemap-target-urls.md)
- Context source: [docs/REMEDIATION_PLAN.md](../../REMEDIATION_PLAN.md)
