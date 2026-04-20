---
status: complete
priority: p2
issue_id: "003"
tags: [code-review, quality, ci]
dependencies: []
---

# Fix formatting check failures on changed files

## Problem Statement

The repository quality gate currently fails because formatting checks do not pass on modified files. If CI enforces `pnpm check`, this will block merge even though typecheck and build are green.

## Findings

- `pnpm check` exits non-zero.
- Failure source: `vp fmt --check` reports issues in:
  - `compound-engineering.local.md`
  - `docs/REMEDIATION_PLAN.md`
  - `enhancer.html`
  - `index.html`
  - `src/enhancer.ts`
  - `vercel.json`
- `pnpm typecheck` passed.
- `pnpm build` passed.

## Proposed Solutions

### Option 1: Run formatter and commit normalized output

**Approach:** Execute `pnpm fmt`, review formatting-only diffs, and commit.

**Pros:**

- Fastest path to green checks
- Aligns codebase with existing formatting policy

**Cons:**

- Can produce noisy diffs in large HTML files

**Effort:** Small (15-30 min)

**Risk:** Low

---

### Option 2: Format only files in scope

**Approach:** Run formatter against specific touched files only.

**Pros:**

- Smaller diff surface
- Easier review of formatting changes

**Cons:**

- Requires careful file targeting
- Can miss additional formatter-detected files

**Effort:** Small (20-40 min)

**Risk:** Low

---

### Option 3: Adjust formatter scope (if specific files should be exempt)

**Approach:** Update formatting config/ignore rules for intentionally unformatted docs.

**Pros:**

- Avoids recurring false-positive failures
- Documents intended policy exceptions

**Cons:**

- Policy change requires team alignment
- Risk of over-excluding files

**Effort:** Medium (1-2 hours)

**Risk:** Medium

## Recommended Action

Implemented Option 1:

- Ran formatter (`pnpm fmt`).
- Re-ran full quality gate (`pnpm check`) after code fixes.
- Confirmed formatting, linting, and typecheck now pass.

## Technical Details

**Affected files:**

- `package.json` (`check` script invokes formatting gate)
- Files listed in formatter output

**Related components:**

- CI quality gates
- Developer pre-merge workflow

**Database changes (if any):**

- Migration needed? No
- New columns/tables? None

## Resources

- Command: `pnpm check`
- Formatter command: `pnpm fmt`

## Acceptance Criteria

- [x] `pnpm check` exits 0 locally
- [x] Formatter-induced diffs are reviewed and accepted
- [x] CI check for formatting is green
- [x] No unintended semantic changes introduced by formatting pass

## Work Log

### 2026-04-19 - Initial Discovery

**By:** Codex

**Actions:**

- Ran `pnpm check`
- Captured formatter failure list
- Ran `pnpm typecheck` and `pnpm build` for comparison

**Learnings:**

- Functional compilation is healthy, but format gate currently prevents clean quality check pass.

### 2026-04-19 - Fix Implemented

**By:** Codex

**Actions:**

- Ran `pnpm fmt`.
- Re-ran `pnpm check`; initially hit TS nullability lint errors in `src/lib/mobile-nav.ts`.
- Fixed nullability issues by introducing narrowed DOM aliases after runtime guards.
- Re-ran `pnpm fmt` and `pnpm check` to green.

**Learnings:**

- Parallel execution of `fmt` and `check` can produce misleading results; final validation should run sequentially.

## Notes

- Priority should be elevated to P1 if CI requires `pnpm check` as a hard merge gate.
