# QA Report — GST-14: Shared Data Layer for Plan Generator

**Commit:** `c2734ad` feat: extract shared data layer for plan generator
**Date:** 2026-04-17
**Tester:** QA Engineer (agent d445961e)
**Verdict:** **PASS with advisory notes**

---

## Summary

The shared data layer extraction is clean. 5 new files in `src/data/`, both consumers (`enhancer.ts`, `script.ts`) correctly import from the barrel export, ~725 lines of inline data removed. Build succeeds, zero JS errors on both pages, all 7 neighborhoods render correctly with proper focus-area filtering.

**Health Score: 9/10**

---

## What Changed

| File                              | Type     | Lines        |
| --------------------------------- | -------- | ------------ |
| `src/data/types.ts`               | NEW      | +137         |
| `src/data/neighborhoods.ts`       | NEW      | +772         |
| `src/data/hotels.ts`              | NEW      | +175         |
| `src/data/itinerary-templates.ts` | NEW      | +41          |
| `src/data/index.ts`               | NEW      | +32 (barrel) |
| `src/enhancer.ts`                 | MODIFIED | -567 net     |
| `src/script.ts`                   | MODIFIED | -94 net      |

---

## Test Results

### Build & Compile

- `tsc --noEmit`: PASS (zero errors from committed files)
- `vite build`: PASS (62ms, clean output)
- Bundle sizes: main 9.2 kB, enhancer 23.1 kB

### Landing Page (`/`)

- Console errors: 0 (only Tailwind CDN production warning + ORB-blocked external image)
- Layout: intact, no visual regressions
- Screenshot: `qa-screenshots/gst14-landing-hero-clean.png`

### Enhancer Page (`/enhancer.html`)

- Console errors: 0
- All 7 neighborhoods populate in dropdown
- **Eixample + culture/architecture**: 5 activities, 4 restaurants, 3 gems — correct filtering
- **Gothic Quarter + culture/food**: 3 activities, 4 restaurants, 3 gems — correct filtering
- Hotel mismatch (Eixample selected + "Hotel Neri Relais" entered): shows Eixample results (pre-existing behavior — see notes)
- "Change inputs" button: resets form correctly, preserves focus selections
- Screenshots: `qa-screenshots/gst14-enhancer-eixample-results.png`, `gst14-enhancer-gothic-food.png`, `gst14-enhancer-hotel-mismatch.png`

---

## Advisory Notes (not blockers)

### 1. Working tree has merge conflicts (NOT in commit)

`src/script.ts` has 2 sets of conflict markers (lines 84-143) in the working tree. These are **unstaged** and not part of commit `c2734ad`. However, they will block the next build if not resolved. The conflicts appear to be from a `main` merge that wasn't fully completed.

### 2. `ALT_HOTEL_SUGGESTIONS` duplicated locally in enhancer.ts

The data layer exports `ALT_HOTEL_SUGGESTIONS` from `neighborhoods.ts`, but `enhancer.ts` still defines its own local copy. The import from `src/data/` exists but the local const shadows it. This isn't a bug today (values match) but creates a maintenance hazard — future changes to one copy won't propagate to the other.

### 3. Hotel mismatch detection is focus-based, not hotel-name-based

Entering "Hotel Neri Relais" (Gothic Quarter) while selecting "Eixample" neighborhood shows Eixample results without any mismatch warning. This is pre-existing behavior — the mismatch panel only triggers on focus/neighborhood incompatibility (e.g. culture + barceloneta), not hotel name lookup. The HOTELS data from the new data layer isn't used for mismatch detection. Future enhancement opportunity.

---

## Conclusion

**GST-14 PASS.** The data extraction is complete and correct. No regressions introduced. The commit is safe to ship.

Recommend resolving the working-tree merge conflicts before the next commit to prevent CI failures.
