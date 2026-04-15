// CAR-11: Demo Form UX Improvements
// 3-step wizard with inline validation and loading state

const form = document.getElementById("tripForm");
const daysReadout = document.getElementById("daysReadout");
const daysInput = document.getElementById("tripDays");
const validationNode = document.getElementById("formValidation");
const screenInput = document.getElementById("screenInput");
const screenResults = document.getElementById("screenResults");
const editTripButton = document.getElementById("editTripButton");
let resultsSubtitle = document.getElementById("resultsSubtitle");
let hotelList = document.getElementById("hotelList");
let itineraryList = document.getElementById("itineraryList");

const hotelTemplate = document.getElementById("hotelCardTemplate");
const dayTemplate = document.getElementById("dayCardTemplate");

// Wizard state
let currentStep = 1;
const TOTAL_STEPS = 3;

const HOTEL_DATA = [
  {
    name: "Hotel Neri Relais",
    neighborhood: "Gothic Quarter",
    vibe: ["intimate boutique", "quiet old-town charm"],
    budgets: ["premium", "luxury"],
    paces: ["slow", "balanced"],
    status: "verified today",
    why: "Hidden courtyards and walkable old-town lanes make this ideal for low-friction evenings.",
    freshness: "Checked 3 hours ago",
    source: "hotelneri.com",
    sourceUrl: "https://www.hotelneri.com/",
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
    freshness: "Checked 2 days ago",
    source: "h10hotels.com",
    sourceUrl: "https://www.h10hotels.com/",
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
    freshness: "Checked 5 days ago",
    source: "yurbbanpassage.com",
    sourceUrl: "https://www.yurbbanpassage.com/",
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
    freshness: "Checked 12 days ago",
    source: "room-matehotels.com",
    sourceUrl: "https://room-matehotels.com/",
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
    freshness: "Not verified",
    source: "hotelrecbarcelona.com",
    sourceUrl: "https://www.hotelrecbarcelona.com/",
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
    "Modernisme route: Casa Batlló + Passeig de Gràcia",
    "Sunset Bunkers del Carmel viewpoint"
  ],
  nightlife: [
    "Cocktail bar cluster in Gràcia",
    "Rooftop live set near the waterfront",
    "Late-night vermouth stop"
  ],
  wellness: [
    "Spa recovery block",
    "Beachfront sunrise walk",
    "Mindful pause in Ciutadella Park"
  ]
};

const MEAL_BLOCKS = ["Lunch anchor", "Dinner anchor"];

// Initialize wizard
function initWizard() {
  updateStepVisibility();
  updateStepIndicators();
  setupPriorityCounter();
}

daysInput.addEventListener("input", () => {
  daysReadout.textContent = daysInput.value;
});

editTripButton.addEventListener("click", () => {
  showScreen("input");
});

// Wizard navigation
function goToStep(step) {
  // Validate current step before moving forward
  if (step > currentStep && !validateStep(currentStep)) {
    return;
  }

  currentStep = step;
  updateStepVisibility();
  updateStepIndicators();
  clearValidationErrors();
}

function updateStepVisibility() {
  // Hide all form groups
  document.querySelectorAll('.form-group').forEach(group => {
    group.style.display = 'none';
  });

  // Show current step groups
  if (currentStep === 1) {
    document.querySelector('.form-group:nth-of-type(1)').style.display = 'block';
  } else if (currentStep === 2) {
    document.querySelector('.form-group:nth-of-type(2)').style.display = 'block';
  } else if (currentStep === 3) {
    document.querySelector('.form-group:nth-of-type(3)').style.display = 'block';
  }

  // Update navigation buttons
  updateNavigationButtons();
}

function updateNavigationButtons() {
  let navHtml = '';

  if (currentStep > 1) {
    navHtml += '<button type="button" class="btn-secondary" onclick="goToStep(' + (currentStep - 1) + ')">← Back</button>';
  }

  if (currentStep < TOTAL_STEPS) {
    navHtml += '<button type="button" class="btn-primary btn-full" onclick="goToStep(' + (currentStep + 1) + ')">Next →</button>';
  } else {
    navHtml += '<button type="submit" class="btn-primary btn-full">Generate my verified plan</button>';
  }

  const existingNav = document.querySelector('.wizard-nav');
  if (existingNav) existingNav.remove();

  const navContainer = document.createElement('div');
  navContainer.className = 'wizard-nav';
  navContainer.innerHTML = navHtml;

  const ctaRow = document.querySelector('.cta-row');
  ctaRow.innerHTML = '';
  ctaRow.appendChild(navContainer);
}

function updateStepIndicators() {
  let indicatorsHtml = '';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const isActive = i === currentStep;
    const isCompleted = i < currentStep;
    indicatorsHtml += `<span class="step-dot ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}" data-step="${i}"></span>`;
  }

  let existingIndicator = document.querySelector('.step-indicator');
  if (!existingIndicator) {
    existingIndicator = document.createElement('div');
    existingIndicator.className = 'step-indicator';
    form.insertBefore(existingIndicator, form.firstChild);
  }
  existingIndicator.innerHTML = indicatorsHtml;
}

// Validation
function validateStep(step) {
  clearValidationErrors();

  let isValid = true;

  if (step === 1) {
    const useCase = document.getElementById('tripUseCase');
    if (!useCase.value) {
      showFieldError(useCase, 'Select a trip type');
      isValid = false;
    }
  } else if (step === 2) {
    const budget = document.getElementById('tripBudget');
    const pace = document.getElementById('tripPace');
    const iconic = document.getElementById('iconicIntensity');

    if (!budget.value) {
      showFieldError(budget, 'Select a budget level');
      isValid = false;
    }
    if (!pace.value) {
      showFieldError(pace, 'Select your preferred pace');
      isValid = false;
    }
    if (!iconic.value) {
      showFieldError(iconic, 'Choose sightseeing intensity');
      isValid = false;
    }
  } else if (step === 3) {
    const vibes = document.querySelectorAll('input[name="vibeTag"]');
    const vibeSelected = Array.from(vibes).some(v => v.checked);
    if (!vibeSelected) {
      showFieldError(vibes[0].closest('.field-row'), 'Select a stay vibe');
      isValid = false;
    }
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('field-error');
  const errorDiv = document.createElement('p');
  errorDiv.className = 'field-error-text';
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
}

function clearValidationErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.classList.remove('field-error');
  });
  document.querySelectorAll('.field-error-text').forEach(el => {
    el.remove();
  });
  validationNode.textContent = '';
}

// Priority counter
function setupPriorityCounter() {
  const priorityGroup = document.getElementById('priorityGroup');
  const checkboxes = priorityGroup.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checkedCount = Array.from(checkboxes).filter(c => c.checked).length;

      // Update counter display
      let counter = priorityGroup.querySelector('.priority-counter');
      if (!counter) {
        counter = document.createElement('span');
        counter.className = 'priority-counter';
        priorityGroup.appendChild(counter);
      }
      counter.textContent = `${checkedCount}/2 selected`;

      // Disable unchecked boxes if limit reached
      if (checkedCount >= 2) {
        checkboxes.forEach(c => {
          if (!c.checked) c.disabled = true;
        });
      } else {
        checkboxes.forEach(c => {
          c.disabled = false;
        });
      }
    });
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Final validation
  if (!validateStep(3)) {
    return;
  }

  const payload = readForm();
  if (!payload.valid) {
    validationNode.textContent = payload.error;
    return;
  }

  validationNode.textContent = "";
  showLoadingState(payload.data);
});

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
    data: { useCase, budget, pace, iconic, vibe, days, priorities: selectedPriorities }
  };
}

// Loading state
function showLoadingState(data) {
  const loadingHtml = `
    <div class="loading-state">
      <div class="loading-skeleton">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
      <p class="loading-message">Cross-referencing sources, checking freshness, building your plan...</p>
    </div>
  `;

  screenInput.hidden = true;
  screenInput.classList.remove('screen-active');

  screenResults.innerHTML = loadingHtml;
  screenResults.hidden = false;
  screenResults.classList.add('screen-active');

  // Simulate loading then show results
  setTimeout(() => {
    renderResults(data);
    showScreen("results");
  }, 1500);
}

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

function renderResults(data) {
  // Build summary header
  const prioritiesLabel = data.priorities.length ? data.priorities.join(" + ") : "general highlights";
  const summaryHtml = `
    <div class="results-summary">
      <div class="summary-config">
        <span class="summary-pill">${data.days}-day</span>
        <span class="summary-pill">${labelForUseCase(data.useCase)}</span>
        <span class="summary-pill">${data.budget}</span>
        <span class="summary-pill">${data.pace}</span>
        <span class="summary-pill">${prioritiesLabel}</span>
      </div>
      <div class="summary-actions">
        <button type="button" class="btn-secondary" id="editTripButton">← Edit trip inputs</button>
      </div>
    </div>
    <div class="results-head">
      <div>
        <p class="eyebrow">Generated plan</p>
        <h2 id="resultsTitle">Your verified Barcelona plan</h2>
        <p class="results-subtitle" id="resultsSubtitle"></p>
      </div>
    </div>
  `;

  // Reattach edit button listener
  screenResults.innerHTML = summaryHtml + `
    <div class="results-grid">
      <section class="panel" aria-labelledby="hotelPanelTitle">
        <div class="panel-head">
          <h3 id="hotelPanelTitle">Hotel options</h3>
          <span class="meta-pill">Source-linked · freshness-aware</span>
        </div>
        <div id="hotelList" class="hotel-list"></div>
      </section>

      <section class="panel" aria-labelledby="itineraryPanelTitle">
        <div class="panel-head">
          <h3 id="itineraryPanelTitle">Day-by-day itinerary</h3>
          <span class="meta-pill">Pacing-checked · max 4 major blocks</span>
        </div>
        <div id="itineraryList" class="itinerary-list"></div>
      </section>
    </div>
  `;

  document.getElementById('editTripButton').addEventListener('click', () => {
    showScreen("input");
  });

  resultsSubtitle = document.getElementById("resultsSubtitle");
  hotelList = document.getElementById("hotelList");
  itineraryList = document.getElementById("itineraryList");

  resultsSubtitle.textContent = `${capitalize(data.days + "-day")} ${labelForUseCase(
    data.useCase
  )} · ${data.vibe} tone · ${data.pace} pace · ${data.iconic} iconic intensity · ${prioritiesLabel} focus`;

  const hotels = buildHotels(data);
  const itinerary = buildItinerary(data);

  renderHotels(hotels, data);
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
  return `Day ${dayNumber}: ${mode[data.useCase] || "city-break flow"} · max 45 min legs unless flagged`;
}

function renderHotels(hotels, data) {
  hotelList.innerHTML = "";

  hotels.forEach((hotel) => {
    const fragment = hotelTemplate.content.cloneNode(true);
    const titleNode = fragment.querySelector("h4");
    const statusNode = fragment.querySelector(".status-pill");
    const matchReasonNode = fragment.querySelector(".hotel-match-reason");
    const metaNode = fragment.querySelector(".hotel-meta");
    const freshnessNode = fragment.querySelector(".hotel-freshness");
    const sourceNode = fragment.querySelector(".hotel-source");
    const links = fragment.querySelectorAll("a");

    titleNode.textContent = hotel.name;
    statusNode.textContent = hotel.status;
    statusNode.classList.add(`status-${hotel.status.replaceAll(" ", "-")}`);
    matchReasonNode.textContent = hotel.why;
    metaNode.textContent = `${hotel.neighborhood} · vibe fit: ${hotel.vibe.join(" / ")}`;
    freshnessNode.textContent = `🕐 ${hotel.freshness}`;
    sourceNode.textContent = `📎 ${hotel.source}`;

    links[0].href = hotel.sourceUrl;
    links[1].href = hotel.booking;

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
    if (seen.has(item.name)) return false;
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

// Make global functions available for onclick handlers
window.goToStep = goToStep;

// Initialize on load
initWizard();
