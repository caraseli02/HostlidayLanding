import type { MealBlock, TimeSlot } from "./types";

/**
 * Itinerary templates for the plan generator.
 * These define meal blocks, pace profiles, and day-pattern metadata
 * used by the buildItinerary() logic in script.ts.
 */

// ── Meal blocks ──────────────────────────────────────────
export const MEAL_BLOCKS: MealBlock[] = [
  { type: "meal", label: "Lunch anchor", slot: "afternoon" as TimeSlot },
  { type: "meal", label: "Dinner anchor", slot: "evening" as TimeSlot },
];

// ── Pace profiles ────────────────────────────────────────
/** Number of activity blocks per day (excluding meals) */
export const PACE_BLOCKS: Record<string, number> = {
  slow: 2,
  balanced: 3,
  packed: 4,
};

// ── Activity blocks per time slot, by pace ───────────────
export const PACE_SLOT_DISTRIBUTION: Record<string, { morning: number; afternoon: number; evening: number }> = {
  slow: { morning: 1, afternoon: 1, evening: 0 },
  balanced: { morning: 1, afternoon: 1, evening: 1 },
  packed: { morning: 2, afternoon: 1, evening: 1 },
};

// ── Day context templates by use case ────────────────────
export const DAY_CONTEXT_TEMPLATES: Record<string, string> = {
  romantic: "romantic cadence",
  friends: "group momentum",
  family: "family-friendly timing",
  solo: "solo discovery rhythm",
};

export const DEFAULT_DAY_CONTEXT = "city-break flow";

// ── Max transit leg time (minutes) before flagging ───────
export const MAX_LEG_MINUTES = 45;
