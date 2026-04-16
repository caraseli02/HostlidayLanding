# Hostliday Landing Page Brief

## 1. Product Positioning Summary

**Hostliday** is a trust-first travel planning tool that generates verified, source-backed Barcelona itineraries — so travelers can stop tab-hopping and start trusting their plan.

**What it is:** A city-break planner (currently Barcelona-only) that takes trip inputs (use case, length, budget, pace, vibe, priorities) and returns hotel options and day-by-day itineraries, each stamped with verification freshness (verified today / within 7 days / stale / unverified).

**Who it is for:** Travelers planning 1–7 day city breaks who are overwhelmed by unverified online recommendations and want picks they can trust — couples, friend groups, families, and solo travelers.

**What makes it different:** Every recommendation shows _why it fits your inputs_ plus a _verification status_. No black-box suggestions. The trust layer is the product wedge.

**Trust-first angle:** Communicated through visible verification states, source links on every hotel, "why this fits" explanations, and the principle of "low-friction daily flow." The page should make trust tangible — not just claim it.

---

## 2. Recommended Landing Page Structure

### Above the fold

1. **Hero headline** — Clear value prop (e.g., "Plan a Barcelona trip you can actually trust")
2. **Subheadline** — One sentence on the trust-first wedge
3. **Single CTA: "Try the demo"** — links to the interactive planner

### Trust section

4. **How trust works** — 3-card explainer: Source-backed picks · Verification freshness · Low-friction daily flow

### Demo section

5. **Interactive planner** — The existing 2-screen demo (input form → results with verification states)

### Proof section

6. **Sample result preview** — Show a generated plan with verification badges visible before the user interacts (optional, reduces bounce)

### Footer

7. **Brand footer** — Hostliday logo, tagline ("Experiences, adventures, and stays"), minimal links

---

## 3. Brandbook Requirements to Preserve

### Colors (exact hex)

| Role                     | Value     |
| ------------------------ | --------- |
| Black (text)             | `#000000` |
| Core Red                 | `#BE0000` |
| Gradient Hot             | `#DA0000` |
| Gradient Deep            | `#810000` |
| Ash (secondary)          | `#A3A2A2` |
| Mist (background accent) | `#E1DFDD` |
| Paper (card bg)          | `#FFFAF9` |

**Gradient:** Hostlidian gradient runs from `#DA0000` to `#810000` at 120° inclination. Used on brand mark, CTAs, and accent elements.

### Typography

- **Primary font:** Montserrat (weights: Light, Medium, Bold, Black)
- **Recommended companion:** Inter (for body/secondary text)
- All external and internal communication uses these families

### Logo

- **Type:** Imagotype (isotype + logotype)
- **Buffer zone:** Minimum 0.5 in clear space around logo
- **Minimum size:** 0.5 in height
- Do not distort, recolor outside approved palette, or remove elements

### Visual rules

- No incorrect uses: don't stretch logo, don't use unapproved colors, don't place on noisy backgrounds
- Brand mark (the "H" icon) uses the gradient on a rounded square
- Premium, warm, refined aesthetic — not playful or casual

### Tone

- Clear and confident (not salesy)
- Premium travel feel (think boutique hotel, not hostel aggregator)
- Trust is earned through specificity, not superlatives

---

## 4. Implementation Direction

**What to build:** Refine the existing `index.html` + `src/` into a proper landing page that wraps the demo with marketing context.

**Approach:**

1. **Add landing sections above the demo** — hero, trust explainer, CTA button that scrolls to the planner
2. **Keep the demo intact** — the existing planner is the core product experience; don't rebuild it
3. **Add a footer** with brand lockup
4. **Respect the existing CSS variables** — colors, gradients, radius, shadows already match the brandbook
5. **Single CTA everywhere** — "Try the demo" (scrolls to planner or opens it)
6. **No new dependencies** — stay with vanilla HTML/CSS/JS + Vite + Montserrat from Google Fonts
7. **Responsive** — maintain existing mobile breakpoints, add landing-section responsiveness
8. **No backend changes** — this is a frontend-only landing page refinement

**What NOT to do:**

- Don't add navigation menus, pricing, or login flows
- Don't change the planner's form fields or result rendering
- Don't introduce new colors outside the brandbook palette
- Don't add JavaScript frameworks
- Don't change the verification status system

**Priority:** Make the hero + CTA + trust section polished and above the fold. The demo is already functional — the gap is the marketing context that makes a first-time visitor understand _what this is_ and _why to try it_ before they see the form.
