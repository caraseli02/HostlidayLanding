import type { MealBlock, TimeSlot } from "./types";

/**
 * Itinerary templates for the plan generator.
 * These define meal blocks and day-pattern metadata
 * used by itinerary building logic.
 */

// ── Meal blocks ──────────────────────────────────────────
export const MEAL_BLOCKS: MealBlock[] = [
  { type: "meal", label: "Lunch anchor", slot: "afternoon" as TimeSlot },
  { type: "meal", label: "Dinner anchor", slot: "evening" as TimeSlot },
];

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
