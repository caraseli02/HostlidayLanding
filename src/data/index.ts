/**
 * Barrel export for the shared data layer.
 * Both pages import from here via their respective entry points.
 */
export { NEIGHBORHOODS, ALT_HOTEL_SUGGESTIONS } from "./neighborhoods";
export { HOTELS } from "./hotels";
export {
  MEAL_BLOCKS,
  DAY_CONTEXT_TEMPLATES,
  DEFAULT_DAY_CONTEXT,
  MAX_LEG_MINUTES,
} from "./itinerary-templates";

export type {
  Category,
  NeighborhoodKey,
  Activity,
  Restaurant,
  HiddenGem,
  NeighborhoodProfile,
  Hotel,
  HotelStatus,
  Budget,
  Pace,
  VibeTag,
  TimeSlot,
  MealBlock,
  ActivityBlock,
  ItineraryBlock,
  ItineraryDay,
  AltHotelSuggestion,
  IconicIntensity,
  TripPayload,
  EnhancerPayload,
} from "./types";

export { VALID_CATEGORIES } from "./types";
