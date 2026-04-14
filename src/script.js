const form = document.getElementById("tripForm");
const daysReadout = document.getElementById("daysReadout");
const daysInput = document.getElementById("tripDays");
const validationNode = document.getElementById("formValidation");
const screenInput = document.getElementById("screenInput");
const screenResults = document.getElementById("screenResults");
const editTripButton = document.getElementById("editTripButton");
const resultsSubtitle = document.getElementById("resultsSubtitle");
const hotelList = document.getElementById("hotelList");
const itineraryList = document.getElementById("itineraryList");

const hotelTemplate = document.getElementById("hotelCardTemplate");
const dayTemplate = document.getElementById("dayCardTemplate");

const HOTEL_DATA = [
  {
    name: "Hotel Neri Relais",
    neighborhood: "Gothic Quarter",
    vibe: ["intimate boutique", "quiet old-town charm"],
    budgets: ["premium", "luxury"],
    paces: ["slow", "balanced"],
    status: "verified today",
    why: "Hidden courtyards and walkable old-town lanes make this ideal for low-friction evenings.",
    source: "https://www.hotelneri.com/",
    booking: "https://www.booking.com/"
  },
  {
    name: "H10 Casa Mimosa",
    neighborhood: "Eixample",
    vibe: ["scenic rooftop", "intimate boutique"],
    budgets: ["comfort", "premium"],
    paces: ["balanced", "packed"],
    status: "verified within 7 days",
    why: "Strong rooftop and central routing reduce travel dead-time across major architecture stops.",
    source: "https://www.h10hotels.com/",
    booking: "https://www.booking.com/"
  },
  {
    name: "Yurbban Passage Hotel & Spa",
    neighborhood: "El Born",
    vibe: ["luxury spa", "scenic rooftop"],
    budgets: ["premium", "luxury"],
    paces: ["slow", "balanced"],
    status: "verified within 7 days",
    why: "Spa-first reset with strong El Born placement for evening food routes and shorter transfers.",
    source: "https://www.yurbbanpassage.com/",
    booking: "https://www.booking.com/"
  },
  {
    name: "Room Mate Carla",
    neighborhood: "Eixample",
    vibe: ["scenic rooftop"],
    budgets: ["value", "comfort"],
    paces: ["packed", "balanced"],
    status: "stale",
    why: "Good value location near transit and architecture routes, but recent amenity data needs re-check.",
    source: "https://room-matehotels.com/",
    booking: "https://www.booking.com/"
  },
  {
    name: "Hotel Rec Barcelona",
    neighborhood: "Arc de Triomf",
    vibe: ["quiet old-town charm", "intimate boutique"],
    budgets: ["value", "comfort"],
    paces: ["slow", "balanced"],
    status: "unverified",
    why: "Promising fit for calmer pacing and old-town access, but live verification was not confirmed.",
    source: "https://www.hotelrecbarcelona.com/",
    booking: "https://www.booking.com/"
  }
];

const ACTIVITY_LIBRARY = {
  culture: [
    "Picasso Museum timed entry",
    "Roman wall and Gothic lanes walk",
    "Catalan music venue evening"
  ],
  food: [
    "Market tasting block in El Born",
    "Long lunch with local tapas route",
    "Chef-led dinner in Eixample"
  ],
  architecture: [
    "Sagrada Familia reserved slot",
    "Modernisme route: Casa Batllo + Passeig de Gracia",
    "Sunset Bunkers del Carmel viewpoint"
  ],
  nightlife: [
    "Cocktail bar cluster in Gracia",
    "Rooftop live set near the waterfront",
    "Late-night vermouth stop"
  ],
  wellness: [
    "Spa recovery block",
    "Beachfront sunrise walk",
    "Mindful pause in Ciutadella Park"
  ]
};

const MEAL_BLOCKS = ["Lunch moment", "Dinner moment"];

daysInput.addEventListener("input", () => {
  daysReadout.textContent = daysInput.value;
});

editTripButton.addEventListener("click", () => {
  showScreen("input");
});

form.addEventListener("submit", (event) => {
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

function showScreen(target) {
  if (target === "results") {
    screenInput.hidden = true;
    screenInput.classList.remove("screen-active");

    screenResults.hidden = false;
    requestAnimationFrame(() => {
      screenResults.classList.add("screen-active");
    });
    return;
  }

  screenResults.classList.remove("screen-active");
  setTimeout(() => {
    screenResults.hidden = true;
    screenInput.hidden = false;
    requestAnimationFrame(() => {
      screenInput.classList.add("screen-active");
    });
  }, 220);
}

function readForm() {
  const data = new FormData(form);
  const selectedPriorities = data.getAll("priority");

  if (selectedPriorities.length > 2) {
    return {
      valid: false,
      error: "Select up to 2 priorities so the plan remains focused and trustworthy."
    };
  }

  const useCase = data.get("tripUseCase");
  const budget = data.get("tripBudget");
  const pace = data.get("tripPace");
  const iconic = data.get("iconicIntensity");
  const vibe = data.get("vibeTag");
  const days = Number(data.get("tripDays"));

  if (!useCase || !budget || !pace || !iconic || !vibe || !days) {
    return {
      valid: false,
      error: "Complete all required fields to generate a constrained Barcelona plan."
    };
  }

  return {
    valid: true,
    data: {
      useCase,
      budget,
      pace,
      iconic,
      vibe,
      days,
      priorities: selectedPriorities
    }
  };
}

function renderResults(data) {
  const prioritiesLabel = data.priorities.length ? data.priorities.join(" + ") : "general highlights";
  resultsSubtitle.textContent = `${capitalize(data.days + "-day")} ${labelForUseCase(
    data.useCase
  )} with ${data.vibe} tone, ${data.pace} pace, ${data.iconic} iconic intensity, and ${prioritiesLabel} focus.`;

  const hotels = buildHotels(data);
  const itinerary = buildItinerary(data);

  renderHotels(hotels);
  renderItinerary(itinerary);
}

function buildHotels(data) {
  const directMatches = HOTEL_DATA.filter(
    (hotel) =>
      hotel.vibe.includes(data.vibe) && hotel.budgets.includes(data.budget) && hotel.paces.includes(data.pace)
  );

  const relaxedMatches = HOTEL_DATA.filter(
    (hotel) => hotel.vibe.includes(data.vibe) && hotel.budgets.includes(data.budget)
  );

  const fallback = HOTEL_DATA.filter((hotel) => hotel.budgets.includes(data.budget));

  const candidatePool = uniqueByName([...directMatches, ...relaxedMatches, ...fallback]);
  return candidatePool.slice(0, 4);
}

function buildItinerary(data) {
  const priorityPool = data.priorities.length ? data.priorities : ["culture", "architecture"];
  const paceBlocks = data.pace === "slow" ? 2 : data.pace === "balanced" ? 3 : 4;

  return Array.from({ length: data.days }).map((_, index) => {
    const dayNumber = index + 1;
    const focusedPriority = priorityPool[index % priorityPool.length];
    const activities = pickActivityBlock(focusedPriority, paceBlocks, data.iconic);

    return {
      dayNumber,
      context: dayContext(dayNumber, data),
      blocks: [...activities, ...MEAL_BLOCKS]
    };
  });
}

function pickActivityBlock(priority, count, iconic) {
  const base = [...(ACTIVITY_LIBRARY[priority] || ACTIVITY_LIBRARY.culture)];
  const iconicExtra = {
    low: [],
    medium: ["One iconic anchor slot"],
    high: ["Two iconic anchor slots with timed entries"]
  };

  return [...base.slice(0, count), ...(iconicExtra[iconic] || [])].slice(0, 4);
}

function dayContext(dayNumber, data) {
  const mode = {
    romantic: "romantic cadence",
    friends: "group momentum",
    family: "family-friendly timing",
    solo: "solo discovery rhythm"
  };

  return `Day ${dayNumber}: ${mode[data.useCase] || "city-break flow"}, max 45 min legs unless flagged.`;
}

function renderHotels(hotels) {
  hotelList.innerHTML = "";

  hotels.forEach((hotel) => {
    const fragment = hotelTemplate.content.cloneNode(true);
    const titleNode = fragment.querySelector("h4");
    const statusNode = fragment.querySelector(".status-pill");
    const metaNode = fragment.querySelector(".hotel-meta");
    const whyNode = fragment.querySelector(".hotel-why");
    const sourceLink = fragment.querySelectorAll("a")[0];
    const bookingLink = fragment.querySelectorAll("a")[1];

    titleNode.textContent = hotel.name;
    statusNode.textContent = hotel.status;
    statusNode.classList.add(`status-${hotel.status.replaceAll(" ", "-")}`);
    metaNode.textContent = `${hotel.neighborhood} • vibe fit: ${hotel.vibe.join(" / ")}`;
    whyNode.textContent = hotel.why;

    sourceLink.href = hotel.source;
    bookingLink.href = hotel.booking;

    hotelList.appendChild(fragment);
  });
}

function renderItinerary(days) {
  itineraryList.innerHTML = "";

  days.forEach((day) => {
    const fragment = dayTemplate.content.cloneNode(true);
    const titleNode = fragment.querySelector("h4");
    const contextNode = fragment.querySelector(".day-context");
    const listNode = fragment.querySelector(".activity-list");

    titleNode.textContent = `Day ${day.dayNumber}`;
    contextNode.textContent = day.context;

    day.blocks.forEach((block) => {
      const li = document.createElement("li");
      li.textContent = block;
      listNode.appendChild(li);
    });

    itineraryList.appendChild(fragment);
  });
}

function uniqueByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.name)) {
      return false;
    }
    seen.add(item.name);
    return true;
  });
}

function labelForUseCase(value) {
  const map = {
    romantic: "romantic escape",
    friends: "friends weekend",
    family: "family break",
    solo: "solo culture trip"
  };

  return map[value] || "city break";
}

function capitalize(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
