import { showScreen, capitalize } from "./lib/transitions";
import { NEIGHBORHOODS, ALT_HOTEL_SUGGESTIONS, VALID_CATEGORIES } from "./data";
import type {
  Category,
  NeighborhoodKey,
  Activity,
  Restaurant,
  HiddenGem,
  EnhancerPayload,
} from "./data";

type FormResult = { valid: false; error: string } | { valid: true; data: EnhancerPayload };

// Data is imported from ./data — this file is now pure UI logic.

// Removed: const NEIGHBORHOODS, const ALT_HOTEL_SUGGESTIONS (now in src/data/neighborhoods.ts)
// Removed: interfaces Activity, Restaurant, HiddenGem, etc. (now in src/data/types.ts)
// Removed: const VALID_FOCUS_AREAS (now VALID_CATEGORIES in src/data/types.ts)

const form = document.getElementById("enhancerForm") as HTMLFormElement;
const validationNode = document.getElementById("formValidation")!;
const screenInput = document.getElementById("screenInput")!;
const screenResults = document.getElementById("screenResults")!;
const editButton = document.getElementById("editButton")!;
const resultsSubtitle = document.getElementById("resultsSubtitle")!;
const activityList = document.getElementById("activityList")!;
const restaurantList = document.getElementById("restaurantList")!;
const gemList = document.getElementById("gemList")!;
const altPanel = document.getElementById("altPanel")!;
const altContent = document.getElementById("altContent")!;
const altTemplate = document.getElementById("altSuggestionTemplate") as HTMLTemplateElement;

const activityTemplate = document.getElementById("activityCardTemplate") as HTMLTemplateElement;
const restaurantTemplate = document.getElementById("restaurantCardTemplate") as HTMLTemplateElement;
const gemTemplate = document.getElementById("gemCardTemplate") as HTMLTemplateElement;

editButton.addEventListener("click", () => showScreen("input", screenInput, screenResults));

// Pre-fill neighborhood from URL param (e.g. /enhancer?neighborhood=gothic)
const params = new URLSearchParams(window.location.search);
const prefill = params.get("neighborhood");
if (prefill) {
  const select = document.getElementById("neighborhood") as HTMLSelectElement;
  if (select && [...select.options].some((o) => o.value === prefill)) {
    select.value = prefill;
  }
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const result = readForm();
  if (!result.valid) {
    validationNode.textContent = result.error;
    return;
  }
  validationNode.textContent = "";
  renderResults(result.data);
  showScreen("results", screenInput, screenResults);
});

function readForm(): FormResult {
  const data = new FormData(form);
  const neighborhood = data.get("neighborhood") as NeighborhoodKey | null;
  const focuses = data
    .getAll("focus")
    .filter((v): v is Category => typeof v === "string" && VALID_CATEGORIES.has(v));

  if (!neighborhood) {
    return { valid: false, error: "Select your hotel neighborhood to get started." };
  }
  if (focuses.length > 2) {
    return { valid: false, error: "Pick up to 2 focus areas so the plan stays focused." };
  }

  return {
    valid: true,
    data: { neighborhood, hotelName: (data.get("hotelName") as string) ?? "", focuses },
  };
}

function renderResults(data: EnhancerPayload): void {
  const profile = NEIGHBORHOODS.find((n) => n.key === data.neighborhood);
  if (!profile) return;

  const focusLabel = data.focuses.length ? data.focuses.join(" + ") : "general highlights";
  const hotelLabel = data.hotelName
    ? `Staying at ${data.hotelName}`
    : `Based in ${profile.displayName}`;
  resultsSubtitle.textContent = `${hotelLabel} · ${profile.displayName} · ${focusLabel} focus`;

  const activities = filterByFocus(profile.activities, data.focuses);
  renderActivities(activities);
  renderRestaurants(profile.restaurants);
  renderGems(profile.gems);
  renderAltSuggestion(data);
}

function filterByFocus(activities: Activity[], focuses: Category[]): Activity[] {
  if (!focuses.length) return activities;
  const matched = activities.filter((a) => focuses.includes(a.category));
  return matched.length >= 2 ? matched : activities;
}

function renderActivities(activities: Activity[]): void {
  activityList.innerHTML = "";
  for (const act of activities) {
    const fragment = activityTemplate.content.cloneNode(true) as DocumentFragment;
    const title = fragment.querySelector("h4")!;
    const walkBadge = fragment.querySelector("[data-walk-badge]")!;
    const why = fragment.querySelector("[data-why]")!;
    const category = fragment.querySelector("[data-category]")!;
    const source = fragment.querySelector("[data-source]")!;

    title.textContent = act.name;
    walkBadge.textContent = act.walkTime;
    why.textContent = act.why;
    category.textContent = capitalize(act.category);
    source.textContent = act.source;

    activityList.appendChild(fragment);
  }
}

function renderRestaurants(restaurants: Restaurant[]): void {
  restaurantList.innerHTML = "";
  for (const rest of restaurants) {
    const fragment = restaurantTemplate.content.cloneNode(true) as DocumentFragment;
    const title = fragment.querySelector("h4")!;
    const walkBadge = fragment.querySelector("[data-walk-badge]")!;
    const why = fragment.querySelector("[data-why]")!;
    const cuisine = fragment.querySelector("[data-category]")!;
    const price = fragment.querySelector("[data-source]")!;

    title.textContent = rest.name;
    walkBadge.textContent = rest.walkTime;
    why.textContent = rest.why;
    cuisine.textContent = rest.cuisine;
    price.textContent = rest.priceBand;

    restaurantList.appendChild(fragment);
  }
}

function renderGems(gems: HiddenGem[]): void {
  gemList.innerHTML = "";
  for (const gem of gems) {
    const fragment = gemTemplate.content.cloneNode(true) as DocumentFragment;
    const title = fragment.querySelector("h4")!;
    const why = fragment.querySelector("[data-why]")!;

    title.textContent = gem.name;
    why.textContent = gem.why;

    gemList.appendChild(fragment);
  }
}

/**
 * Shows an alternative hotel suggestion when the user's selected focuses
 * don't align well with their chosen neighborhood.
 *
 * Edge case: when no focuses are selected (data.focuses is empty), the panel
 * is hidden because we can't determine a mismatch — "general highlights" mode
 * is always valid for any neighborhood. The panel only appears when there is
 * a clear reason to suggest a different base (e.g. culture focus + barceloneta).
 */
function renderAltSuggestion(data: EnhancerPayload): void {
  const suggestions = ALT_HOTEL_SUGGESTIONS[data.neighborhood];
  if (!suggestions || !suggestions.length) {
    altPanel.hidden = true;
    return;
  }

  const focusMismatch =
    data.focuses.length > 0 &&
    !data.focuses.some((f) => {
      const profile = NEIGHBORHOODS.find((n) => n.key === data.neighborhood);
      return profile?.bestFor.includes(f);
    });

  if (!focusMismatch && data.focuses.length > 0) {
    altPanel.hidden = true;
    return;
  }

  const suggestion = suggestions[0]!;
  altPanel.hidden = false;
  const fragment = altTemplate.content.cloneNode(true) as DocumentFragment;
  const hotel = fragment.querySelector("[data-alt-hotel]")!;
  const neighborhood = fragment.querySelector("[data-alt-neighborhood]")!;
  const reason = fragment.querySelector("[data-alt-reason]")!;

  hotel.textContent = suggestion.hotel;
  neighborhood.textContent = suggestion.neighborhood;
  reason.textContent = suggestion.reason;

  altContent.replaceChildren(fragment);
}

export {};
