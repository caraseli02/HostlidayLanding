/**
 * Shared data types for the plan generator.
 * Both the landing page demo and the enhancer import from here.
 */

// ── Category ──────────────────────────────────────────────
export type Category = "culture" | "food" | "architecture" | "nightlife" | "wellness";

export const VALID_CATEGORIES = new Set<string>([
  "culture",
  "food",
  "architecture",
  "nightlife",
  "wellness",
]);

// ── Neighborhood ─────────────────────────────────────────
export type NeighborhoodKey =
  | "gothic"
  | "eixample"
  | "born"
  | "gracia"
  | "barceloneta"
  | "raval"
  | "sant-pere";

// ── Activity ─────────────────────────────────────────────
export interface Activity {
  name: string;
  category: Category;
  walkTime: string;
  why: string;
  source: string;
  /** Suggested time of day for scheduling (optional enrichment) */
  timeSlot?: "morning" | "afternoon" | "evening";
  /** Typical visit duration in minutes (optional enrichment) */
  durationMin?: number;
}

// ── Restaurant ───────────────────────────────────────────
export interface Restaurant {
  name: string;
  walkTime: string;
  cuisine: string;
  priceBand: string;
  why: string;
  source: string;
}

// ── Hidden Gem ───────────────────────────────────────────
export interface HiddenGem {
  name: string;
  why: string;
}

// ── Neighborhood Profile ─────────────────────────────────
export interface NeighborhoodProfile {
  key: NeighborhoodKey;
  displayName: string;
  vibe: string;
  bestFor: Category[];
  activities: Activity[];
  restaurants: Restaurant[];
  gems: HiddenGem[];
}

// ── Hotel ────────────────────────────────────────────────
export type HotelStatus = "verified today" | "verified within 7 days" | "stale" | "unverified";
export type Budget = "value" | "comfort" | "premium" | "luxury";
export type Pace = "slow" | "balanced" | "packed";
export type VibeTag =
  | "scenic rooftop"
  | "intimate boutique"
  | "luxury spa"
  | "quiet old-town charm";

export interface Hotel {
  name: string;
  neighborhood: string;
  neighborhoodKey: NeighborhoodKey;
  vibe: VibeTag[];
  budgets: Budget[];
  paces: Pace[];
  status: HotelStatus;
  why: string;
  freshness: string;
  source: string;
  sourceUrl: string;
  booking: string;
}

// ── Itinerary ────────────────────────────────────────────
export type TimeSlot = "morning" | "afternoon" | "evening";

export interface MealBlock {
  type: "meal";
  label: string;
  slot: TimeSlot;
}

export interface ActivityBlock {
  type: "activity";
  activity: Activity;
  slot: TimeSlot;
}

export type ItineraryBlock = ActivityBlock | MealBlock;

export interface ItineraryDay {
  dayNumber: number;
  context: string;
  neighborhoodKey: NeighborhoodKey;
  blocks: ItineraryBlock[];
}

// ── Alt Hotel Suggestion ─────────────────────────────────
export interface AltHotelSuggestion {
  neighborhood: string;
  hotel: string;
  reason: string;
}

// ── Landing page form payload ────────────────────────────
export type IconicIntensity = "low" | "medium" | "high";

export interface TripPayload {
  useCase: string;
  budget: Budget;
  pace: Pace;
  iconic: IconicIntensity;
  vibe: VibeTag;
  days: number;
  priorities: Category[];
}

// ── Enhancer form payload ────────────────────────────────
export interface EnhancerPayload {
  neighborhood: NeighborhoodKey;
  hotelName: string;
  focuses: Category[];
}
