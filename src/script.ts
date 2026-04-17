import { showScreen, capitalize } from "./lib/transitions";
import { HOTELS, MEAL_BLOCKS, DAY_CONTEXT_TEMPLATES, DEFAULT_DAY_CONTEXT, MAX_LEG_MINUTES } from "./data";
import type {
  Hotel,
  Pace,
  Budget,
  VibeTag,
  Category,
  IconicIntensity,
  TripPayload,
} from "./data";

interface ItineraryDay {
  dayNumber: number;
  context: string;
  blocks: string[];
}

type FormResult = { valid: false; error: string } | { valid: true; data: TripPayload };

const form = document.getElementById("tripForm") as HTMLFormElement | null;
const daysReadout = document.getElementById("daysReadout");
const daysInput = document.getElementById("tripDays") as HTMLInputElement | null;
const validationNode = document.getElementById("formValidation");
const screenInput = document.getElementById("screenInput");
const screenResults = document.getElementById("screenResults");
const editTripButton = document.getElementById("editTripButton");
const resultsSubtitle = document.getElementById("resultsSubtitle");
const hotelList = document.getElementById("hotelList");
const itineraryList = document.getElementById("itineraryList");

const hotelTemplate = document.getElementById("hotelCardTemplate") as HTMLTemplateElement | null;
const dayTemplate = document.getElementById("dayCardTemplate") as HTMLTemplateElement | null;

// Hotels imported from src/data/hotels.ts — expanded to cover all 7 neighborhoods
const HOTEL_DATA = HOTELS;

// Activity library uses string labels for the landing page demo.
// The plan generator (future) will use rich Activity data from src/data/neighborhoods.ts.
const ACTIVITY_LIBRARY: Record<Category, string[]> = {
  culture: [
    "Picasso Museum timed entry",
    "Roman wall and Gothic lanes walk",
    "Catalan music venue evening",
  ],
  food: [
    "Market tasting block in El Born",
    "Long lunch with local tapas route",
    "Chef-led dinner in Eixample",
  ],
  architecture: [
    "Sagrada Familia reserved slot",
    "Modernisme route: Casa Batlló + Passeig de Gràcia",
    "Sunset Bunkers del Carmel viewpoint",
  ],
  nightlife: [
    "Cocktail bar cluster in Gràcia",
    "Rooftop live set near the waterfront",
    "Late-night vermouth stop",
  ],
  wellness: ["Spa recovery block", "Beachfront sunrise walk", "Mindful pause in Ciutadella Park"],
};

const MEAL_LABELS = MEAL_BLOCKS.map((m) => m.label);

if (
  form &&
  daysReadout &&
  daysInput &&
  validationNode &&
  screenInput &&
  screenResults &&
  editTripButton &&
  resultsSubtitle &&
  hotelList &&
  itineraryList &&
  hotelTemplate &&
  dayTemplate
) {
  daysInput.addEventListener("input", () => {
    daysReadout.textContent = daysInput.value;
  });

  editTripButton.addEventListener("click", () => {
    showScreen("input");
  });

  form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    const payload = readForm();
    if (!payload.valid) {
      validationNode.textContent = payload.error;
      return;
    }

    validationNode.textContent = "";
    renderResults(payload.data);
    showScreen("results");
  });
}

function showScreen(target: "input" | "results"): void {
  if (target === "results") {
    screenInput!.hidden = true;
    screenInput!.classList.remove("screen-active");

    screenResults!.hidden = false;
    requestAnimationFrame(() => {
      screenResults!.classList.add("screen-active");
    });
    return;
  }

  screenResults!.classList.remove("screen-active");
  setTimeout(() => {
    screenResults!.hidden = true;
    screenInput!.hidden = false;
    requestAnimationFrame(() => {
      screenInput!.classList.add("screen-active");
    });
  }, 220);
}

function readForm(): FormResult {
  const data = new FormData(form!);
  const selectedPriorities = data.getAll("priority") as ActivityCategory[];

  if (selectedPriorities.length > 2) {
    return {
      valid: false,
      error: "Select up to 2 priorities so the plan remains focused and trustworthy.",
    };
  }

  const useCase = data.get("tripUseCase") as string | null;
  const budget = data.get("tripBudget") as Budget | null;
  const pace = data.get("tripPace") as Pace | null;
  const iconic = data.get("iconicIntensity") as IconicIntensity | null;
  const vibe = data.get("vibeTag") as VibeTag | null;
  const days = Number(data.get("tripDays"));

  if (!useCase || !budget || !pace || !iconic || !vibe || !days) {
    return {
      valid: false,
      error: "Complete all required fields to generate a constrained Barcelona plan.",
    };
  }

  return {
    valid: true,
    data: { useCase, budget, pace, iconic, vibe, days, priorities: selectedPriorities },
  };
}

function renderResults(data: TripPayload): void {
  const prioritiesLabel = data.priorities.length
    ? data.priorities.join(" + ")
    : "general highlights";
  resultsSubtitle!.textContent = `${capitalize(data.days + "-day")} ${labelForUseCase(
    data.useCase,
  )} · ${data.vibe} tone · ${data.pace} pace · ${data.iconic} iconic intensity · ${prioritiesLabel} focus`;

  const hotels = buildHotels(data);
  const itinerary = buildItinerary(data);

  renderHotels(hotels);
  renderItinerary(itinerary);
}

function buildHotels(data: TripPayload): Hotel[] {
  const directMatches = HOTEL_DATA.filter(
    (hotel) =>
      hotel.vibe.includes(data.vibe) &&
      hotel.budgets.includes(data.budget) &&
      hotel.paces.includes(data.pace),
  );
  const relaxedMatches = HOTEL_DATA.filter(
    (hotel) => hotel.vibe.includes(data.vibe) && hotel.budgets.includes(data.budget),
  );
  const fallback = HOTEL_DATA.filter((hotel) => hotel.budgets.includes(data.budget));
  const candidatePool = uniqueByName([...directMatches, ...relaxedMatches, ...fallback]);
  return candidatePool.slice(0, 4);
}

function buildItinerary(data: TripPayload): ItineraryDay[] {
  const priorityPool = data.priorities.length
    ? data.priorities
    : (["culture", "architecture"] as Category[]);
  const paceBlocks = data.pace === "slow" ? 2 : data.pace === "balanced" ? 3 : 4;

  return Array.from({ length: data.days }).map((_, index) => {
    const dayNumber = index + 1;
    const focusedPriority = priorityPool[index % priorityPool.length]!;
    const activities = pickActivityBlock(focusedPriority, paceBlocks, data.iconic);
    return {
      dayNumber,
      context: dayContext(dayNumber, data),
      blocks: [...activities, ...MEAL_LABELS],
    };
  });
}

function pickActivityBlock(
  priority: Category,
  count: number,
  iconic: IconicIntensity,
): string[] {
  const base = [...(ACTIVITY_LIBRARY[priority] || ACTIVITY_LIBRARY.culture)];
  const iconicExtra: Record<IconicIntensity, string[]> = {
    low: [],
    medium: ["One iconic anchor slot"],
    high: ["Two iconic anchor slots with timed entries"],
  };
  return [...base.slice(0, count), ...iconicExtra[iconic]].slice(0, 4);
}

function dayContext(dayNumber: number, data: TripPayload): string {
  return `Day ${dayNumber}: ${DAY_CONTEXT_TEMPLATES[data.useCase] || DEFAULT_DAY_CONTEXT} · max ${MAX_LEG_MINUTES} min legs unless flagged`;
}

function renderHotels(hotels: Hotel[]): void {
  hotelList!.innerHTML = "";

  hotels.forEach((hotel) => {
    const fragment = hotelTemplate!.content.cloneNode(true) as DocumentFragment;
    const titleNode = fragment.querySelector("h4")!;
    const statusNode = fragment.querySelector(".status-pill")!;
    const matchReasonNode = fragment.querySelector(".hotel-match-reason")!;
    const metaNode = fragment.querySelector(".hotel-meta")!;
    const freshnessNode = fragment.querySelector(".hotel-freshness")!;
    const sourceNode = fragment.querySelector(".hotel-source")!;
    const links = fragment.querySelectorAll("a");

    titleNode.textContent = hotel.name;
    statusNode.textContent = hotel.status;
    statusNode.classList.add(`status-${hotel.status.replaceAll(" ", "-")}`);
    matchReasonNode.textContent = hotel.why;
    metaNode.textContent = `${hotel.neighborhood} · vibe fit: ${hotel.vibe.join(" / ")}`;
    freshnessNode.textContent = `\u{1F550} ${hotel.freshness}`;
    sourceNode.textContent = `\u{1F4CE} ${hotel.source}`;

    links[0]!.href = hotel.sourceUrl;
    links[1]!.href = hotel.booking;

    hotelList!.appendChild(fragment);
  });
}

function renderItinerary(days: ItineraryDay[]): void {
  itineraryList!.innerHTML = "";

  days.forEach((day) => {
    const fragment = dayTemplate!.content.cloneNode(true) as DocumentFragment;
    const titleNode = fragment.querySelector("h4")!;
    const contextNode = fragment.querySelector(".day-context")!;
    const listNode = fragment.querySelector(".activity-list")!;

    titleNode.textContent = `Day ${day.dayNumber}`;
    contextNode.textContent = day.context;

    day.blocks.forEach((block) => {
      const li = document.createElement("li");
      li.textContent = block;
      listNode.appendChild(li);
    });

    itineraryList!.appendChild(fragment);
  });
}

function uniqueByName(items: Hotel[]): Hotel[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

function labelForUseCase(value: string): string {
  const map: Record<string, string> = {
    romantic: "romantic escape",
    friends: "friends weekend",
    family: "family break",
    solo: "solo culture trip",
  };
  return map[value] || "city break";
}

export {};
