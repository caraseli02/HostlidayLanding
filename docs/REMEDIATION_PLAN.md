# Hostliday Landing — Remediation Plan

## Context

Deep code review identified **77 findings** across accessibility, SEO, performance, security, code quality, and progressive enhancement. The project has two HTML pages (`index.html`, `enhancer.html`) sharing a data layer (`src/data/`) and shared utilities (`src/lib/`), but suffers from: dead code, dual CSS systems, missing a11y/SEO basics, source/dist divergence, and progressive enhancement failures.

The plan is organized into **4 phases** by priority. Each phase is independently shippable.

---

## Phase 1 — Critical Fixes (blockers & dead code)

### 1.1 Delete `src/styles.css` (1059 lines of dead code)

- Never imported by any entry point
- References fonts (Syne, Bricolage Grotesque) not loaded anywhere
- Contains `.site-nav`, `.hero`, `.data-card`, `.stats-bar`, `.pipeline-section`, etc. — none match either HTML file
- **File:** `src/styles.css` → delete entirely

### 1.2 Remove or repurpose `src/script.ts` (263 lines of dead code)

- All DOM refs (`tripForm`, `hotelList`, `itineraryList`, etc.) return `null` in `index.html`
- Guard block at lines 64-77 silently does nothing
- `main.ts` imports it, so it runs on every landing page visit
- `ItineraryDay` type defined here (line 11) conflicts with `src/data/types.ts` (line 109)
- `ACTIVITY_LIBRARY` (line 38) duplicates data from `neighborhoods.ts`
- `FormResult` type duplicates `enhancer.ts`
- **Action:** Delete `script.ts`, update `main.ts` to only import CSS, or replace with landing-page-specific logic (reveal animations, FAQ)

### 1.3 Fix progressive enhancement failure (content invisible without JS)

- `landing.css` lines 88-96: `[data-reveal]` starts at `opacity: 0`
- If JS fails, entire page is blank
- **Action:** Add `<noscript>` fallback in both HTML files:
  ```html
  <noscript
    ><style>
      [data-reveal],
      [data-hero-reveal] {
        opacity: 1;
        transform: none;
      }
    </style></noscript
  >
  ```
- Also add a CSS rule that makes content visible after a timeout or when `.motion-ready` is absent

### 1.4 Rebuild `dist/` — source/divergence is critical

- `dist/index.html` loads `cdn.tailwindcss.com` in production (runtime compiler)
- Contains 585 lines of inline `<style>` and multiple `onclick` inline handlers
- `dist/` is an older version of the page, completely different from current `index.html`
- **Action:** Delete `dist/` contents, run `pnpm build` to regenerate from source

### 1.5 Fix stale copyright year

- Both footers: `© 2025` — it's 2026
- **Files:** `index.html:775`, `enhancer.html:573`
- **Action:** Update to `© 2025–2026` or make dynamic via JS

---

## Phase 2 — Accessibility & SEO (high-impact, user-facing)

### 2.1 Add skip-to-content link to `index.html`

- Present in `enhancer.html` (line 54) but missing from `index.html`
- **Action:** Add `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to main content</a>` after `<body>` tag

### 2.2 Add mobile navigation to both pages

- `hidden md:flex` hides nav on mobile with **no alternative** (no hamburger, no drawer)
- Users on phones cannot navigate to sections
- **Action:** Add a mobile nav toggle (hamburger button) + slide-out/dropdown menu for `<768px`

### 2.3 Fix brand name semantics

- `index.html:39`: `<div>Hostliday</div>` — not focusable, not a link
- Should be `<a href="/">Hostliday</a>` (matches `enhancer.html` pattern)
- **Action:** Change to `<a href="/" class="...">Hostliday</a>`

### 2.4 Add SEO meta tags to both pages

Missing on both pages:

- `<link rel="canonical">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- `<meta name="theme-color" content="#be0000">`
- Favicon reference
- **Files:** `index.html` head, `enhancer.html` head

### 2.5 Add `preconnect` to `enhancer.html`

- `index.html` has `preconnect` for Google Fonts; `enhancer.html` does not
- **Action:** Add `<link rel="preconnect">` for `fonts.googleapis.com` and `fonts.gstatic.com`

### 2.6 Fix non-functional nav elements in `enhancer.html`

- Lines 75-94: nav links point to `#destinations`, `#planner`, `#faq` — none exist on the page
- Line 112-116: "Sign In" button does nothing
- Lines 104-110: Search input has no handler
- **Action:** Either add section IDs, link to `index.html` sections, or remove non-functional elements

### 2.7 Add `lang="ca"` for Catalan text

- `enhancer.html:167,170`: `Barri Gòtic`, `Gràcia` in Catalan
- **Action:** Wrap in `<span lang="ca">` for screen reader pronunciation

### 2.8 Fix `aria-required` on form elements

- `enhancer.html:160`: `<select required>` missing `aria-required="true"`
- **Action:** Add `aria-required="true"` to required form controls

---

## Phase 3 — Code Quality & Consistency

### 3.1 Consolidate CSS token system to one

Three separate variable systems exist:

- `tailwind.css` `@theme`: `--color-primary`, `--color-surface`, etc.
- `landing.css` `:root`: `--hostliday-ink`, `--hostliday-red`, etc.
- ~~`styles.css`~~ (deleted in Phase 1)
- **Action:** Migrate `landing.css` custom properties into `tailwind.css` `@theme`, remove duplicate `:root` block

### 3.2 Extract inline `<script>` from `index.html` (lines 780-840)

- 60 lines of inline JS for reveal animations + FAQ accordion
- Not CSP-compatible, not shared with enhancer
- **Action:** Move to `src/landing-animations.ts`, import in `main.ts`. Keep the `motion-ready` body class logic as a tiny inline script (3 lines) for flash prevention

### 3.3 Extract inline `<style>` from `enhancer.html` (lines 19-50)

- Duplicates focus-ring and font rules from external CSS
- Sets `outline: none` on inputs without proper replacement
- **Action:** Move rules to `src/enhancer.css`, fix the `outline: none` issue

### 3.4 Consolidate `.screen` transition CSS

- `enhancer.css` (lines 3-30) and deleted `styles.css` both define `.screen` / `.screen-active`
- **Action:** Move shared screen transition to `src/lib/screen-transitions.css`, import in both `landing.css` and `enhancer.css`

### 3.5 Remove dead exports from `src/data/`

- `PACE_BLOCKS` and `PACE_SLOT_DISTRIBUTION` exported but never imported
- `script.ts` (the consumer) hardcodes the same values locally
- **Action:** Remove unused exports from `itinerary-templates.ts` and `index.ts`

### 3.6 Fix neighborhood name inconsistency

- `hotels.ts:150,165`: `"Arc de Triomf"`
- `neighborhoods.ts:648`: `"Sant Pere / Arc de Triomf"`
- **Action:** Align to `"Sant Pere / Arc de Triomf"` in both files

### 3.7 Unify footer content between pages

- `index.html` footer: simple, no social links, different nav columns
- `enhancer.html` footer: social icons (all `href="#"`), different columns, different brand description
- Brand descriptions contradict each other
- **Action:** Create a shared footer structure with consistent brand messaging

### 3.8 Fix hardcoded freshness strings

- `hotels.ts`: "Checked 3 hours ago", "Checked 12 days ago" — always stale
- `index.html:101`: "Hotel data verified today" — misleading
- `index.html:557`: "Verified 2h ago" — static
- **Action:** Use relative date calculation from a `lastVerified` ISO timestamp, or reword to "Last verified: [date]" format with actual dates

### 3.9 Remove redundant `export {}`

- `script.ts:262`, `enhancer.ts:200` — files already import modules, `export {}` is unnecessary
- **Action:** Remove (or keep if it aids readability — very low priority)

### 3.10 Clean up `tsconfig.json`

- `jsx: "preserve"` set with no JSX files in project
- **Action:** Remove `jsx` option

---

## Phase 4 — Performance & Hardening

### 4.1 Optimize Google Fonts loading

- Two render-blocking font CSS requests per page
- Material Symbols loads ~800 icons for ~10 used
- **Action:**
  - Combine DM Sans + Instrument Serif into single request
  - Add `rel="preload"` for critical font files
  - Consider self-hosting fonts or using `@font-face` with `font-display: swap`
  - Subset Material Symbols or switch to SVG icons for the ~10 used

### 4.2 Add responsive images

- No `<picture>` or `srcset` used anywhere
- All images serve single resolution (mobile downloads 1920px hero)
- **Action:** Add `srcset` to hero image and neighborhood cards with 600w, 1200w, 1920w variants

### 4.3 Add `dns-prefetch` for external domains

- Missing for `images.unsplash.com`
- **Action:** Add `<link rel="dns-prefetch" href="//images.unsplash.com">` to both pages

### 4.4 Fix `prefers-reduced-motion` gaps

- `landing.css:137-149`: `trust-pulse` animation runs infinitely, no reduced-motion override
- `enhancer.html:43`: `outline: none` on inputs removes focus indicator
- **Action:** Add `@media (prefers-reduced-motion: reduce)` rule to stop `trust-pulse` animation

### 4.5 Add security headers configuration

- No CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Action:** Add `_headers` file (for Netlify) or `vercel.json` (for Vercel) with security headers

### 4.6 Fix conflicting border classes on alt panel

- `enhancer.html:358`: `border border-surface-container-high/50` and `border-amber-400/50` conflict
- **Action:** Use only `border-amber-400/50` for the alt suggestion panel

### 4.7 Add `robots.txt` and `sitemap.xml`

- Neither exists in the project
- **Action:** Create static `public/robots.txt` and `public/sitemap.xml`

---

## Files Modified (Summary)

| File                              | Phase   | Action                                     |
| --------------------------------- | ------- | ------------------------------------------ |
| `src/styles.css`                  | 1       | Delete                                     |
| `src/script.ts`                   | 1       | Delete or replace                          |
| `src/main.ts`                     | 1,3     | Update imports                             |
| `src/data/index.ts`               | 3       | Remove dead exports                        |
| `src/data/itinerary-templates.ts` | 3       | Remove dead exports                        |
| `src/data/hotels.ts`              | 3       | Fix names, fix freshness                   |
| `src/data/neighborhoods.ts`       | 3       | Fix name alignment                         |
| `src/data/types.ts`               | 1       | Remove duplicate ItineraryDay              |
| `src/tailwind.css`                | 3       | Consolidate tokens                         |
| `src/landing.css`                 | 3,4     | Remove dup tokens, add reduced-motion      |
| `src/enhancer.css`                | 3       | Move inline styles here                    |
| `src/lib/transitions.ts`          | —       | No changes                                 |
| `src/enhancer.ts`                 | 3       | Minor cleanup                              |
| `index.html`                      | 1,2,3,4 | Skip link, meta tags, noscript, mobile nav |
| `enhancer.html`                   | 1,2,3,4 | Meta tags, fix nav, extract inline styles  |
| `dist/*`                          | 1       | Rebuild from source                        |
| `tsconfig.json`                   | 3       | Remove jsx option                          |
| `vite.config.js`                  | —       | No changes                                 |

---

## Verification

After each phase:

1. `pnpm check` — lint + typecheck must pass
2. `pnpm build` — must produce clean `dist/` with no errors
3. `pnpm preview` — visual QA on both pages
4. Manual checks:
   - Tab through both pages with keyboard only (a11y)
   - View on mobile viewport (< 768px) — mobile nav must appear
   - Disable JS — content must be visible (noscript fallback)
   - Run Lighthouse audit — target 90+ for a11y, SEO, performance
   - Check social sharing preview with `https://cards-dev.twitter.com/validator` and Facebook debugger
