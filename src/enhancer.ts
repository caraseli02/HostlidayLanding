type FocusArea = "culture" | "food" | "architecture" | "nightlife" | "wellness";
type NeighborhoodKey =
  | "gothic"
  | "eixample"
  | "born"
  | "gracia"
  | "barceloneta"
  | "raval"
  | "sant-pere";

interface Activity {
  name: string;
  category: FocusArea;
  walkTime: string;
  why: string;
  source: string;
}

interface Restaurant {
  name: string;
  walkTime: string;
  cuisine: string;
  priceBand: string;
  why: string;
  source: string;
}

interface HiddenGem {
  name: string;
  why: string;
}

interface NeighborhoodProfile {
  key: NeighborhoodKey;
  displayName: string;
  vibe: string;
  bestFor: FocusArea[];
  activities: Activity[];
  restaurants: Restaurant[];
  gems: HiddenGem[];
}

interface EnhancerPayload {
  neighborhood: NeighborhoodKey;
  hotelName: string;
  focuses: FocusArea[];
}

type FormResult = { valid: false; error: string } | { valid: true; data: EnhancerPayload };

const NEIGHBORHOODS: NeighborhoodProfile[] = [
  {
    key: "gothic",
    displayName: "Gothic Quarter",
    vibe: "Medieval lanes, hidden plazas, and centuries of layered history underfoot.",
    bestFor: ["culture", "food", "architecture"],
    activities: [
      {
        name: "Picasso Museum",
        category: "culture",
        walkTime: "3 min",
        why: "World-class collection in five medieval palaces. Book timed entry to skip queues.",
        source: "museupicasso.bcn.cat",
      },
      {
        name: "Roman wall & Plaça del Rei",
        category: "architecture",
        walkTime: "2 min",
        why: "4th-century Roman ruins underneath the square. Free to view from street level.",
        source: "muhba.cat",
      },
      {
        name: "Barcelona Cathedral",
        category: "architecture",
        walkTime: "1 min",
        why: "Gothic masterpiece with rooftop terrace views. Morning light through the cloister is unmatched.",
        source: "catedralbcn.org",
      },
      {
        name: "Plaça Reial evening walk",
        category: "nightlife",
        walkTime: "4 min",
        why: "Lampposts by Gaudí, live music spilling from bars, and the city's best people-watching after 9pm.",
        source: "barcelona.cat",
      },
    ],
    restaurants: [
      {
        name: "Can Culleretes",
        walkTime: "2 min",
        cuisine: "Traditional Catalan",
        priceBand: "€€",
        why: "Barcelona's oldest restaurant (1786). No shortcuts, no fusion — just escudella and botifarra.",
        source: "canculleretes.com",
      },
      {
        name: "El Xampanyet",
        walkTime: "8 min",
        cuisine: "Tapas / Cava",
        priceBand: "€€",
        why: "Standing-room-only cava bar in El Born. Anchovies and txistorra are the order.",
        source: "elxampanyet.cat",
      },
      {
        name: "Bar del Pla",
        walkTime: "6 min",
        cuisine: "Creative tapas",
        priceBand: "€€",
        why: "Neighborhood staple with excellent vermouth and a sea urchin speciality worth the walk.",
        source: "bardelpla.com",
      },
    ],
    gems: [
      {
        name: "Plaça Sant Felip Neri",
        why: "A silent square with pockmarked walls from a 1938 bombing. The most moving spot in the city.",
      },
      {
        name: "MUHBA Roman ruins",
        why: "Subterranean ruins of Roman Barcino under Plaça del Rei. Almost tourist-free before noon.",
      },
      {
        name: "Carrer dels Flassaders",
        why: "A perfectly preserved medieval street most visitors walk right past en route to El Born.",
      },
    ],
  },
  {
    key: "eixample",
    displayName: "Eixample",
    vibe: "Grid-pattern modernisme, wide boulevards, and Barcelona's architectural crown jewels.",
    bestFor: ["architecture", "food", "culture"],
    activities: [
      {
        name: "Sagrada Familia",
        category: "architecture",
        walkTime: "10 min",
        why: "Gaudí's unfinished masterpiece. Book the tower access — the spine of the building is a staircase through a forest.",
        source: "sagradafamilia.org",
      },
      {
        name: "Casa Batlló + Passeig de Gràcia",
        category: "architecture",
        walkTime: "5 min",
        why: "The Manzana de la Discordia block has three competing modernista facades within 50 meters.",
        source: "casabatllo.es",
      },
      {
        name: "Fundació Antoni Tàpies",
        category: "culture",
        walkTime: "4 min",
        why: "Contemporary art in a moderniste building topped with a sculpture of cloud and wire. Often empty.",
        source: "ftapies.com",
      },
      {
        name: "Bunkers del Carmel sunset",
        category: "culture",
        walkTime: "25 min (bus + walk)",
        why: "360° panoramic views of the entire city. Go 30 min before sunset, bring drinks.",
        source: "barcelona.cat",
      },
    ],
    restaurants: [
      {
        name: "Cervecería Catalana",
        walkTime: "4 min",
        cuisine: "Tapas / Montaditos",
        priceBand: "€€",
        why: "Institution-quality tapas bar. Get the bikini sandwich and anything with jamón ibérico.",
        source: "cervezerialacatalana.com",
      },
      {
        name: "Paco Meralgo",
        walkTime: "6 min",
        cuisine: "Market cuisine",
        priceBand: "€€€",
        why: "Chef Paco's market-driven menu changes daily. The rice dishes are technically flawless.",
        source: "pacomeralgo.com",
      },
      {
        name: "Brunch & Cake (Enric Granados)",
        walkTime: "3 min",
        cuisine: "Brunch / Café",
        priceBand: "€€",
        why: "Best brunch on a tree-lined pedestrian street. The banana pancakes travel well if you're heading out.",
        source: "brunchandcake.com",
      },
    ],
    gems: [
      {
        name: "Hospital de Sant Pau",
        why: "A moderniste hospital complex that is vastly under-visited. The pavilions are tiled in pastel ceramic art.",
      },
      {
        name: "Casa Amatller",
        why: "Next door to Batlló, equally stunning, a fraction of the crowds, and the chocolate-making history tour is excellent.",
      },
      {
        name: "Mercat de la Concepció",
        why: "Neighborhood market without the La Boqueria crowds. The flower stalls on the corner are worth the visit alone.",
      },
    ],
  },
  {
    key: "born",
    displayName: "El Born / La Ribera",
    vibe: "Artisan workshops, gallery density, and the city's best evening paseo street.",
    bestFor: ["culture", "food", "nightlife"],
    activities: [
      {
        name: "Santa Maria del Mar",
        category: "culture",
        walkTime: "1 min",
        why: "The 'Cathedral of the Sea'. Pure Catalan Gothic, unornamented, with extraordinary acoustics.",
        source: "santamariadelmarbarcelona.org",
      },
      {
        name: "Palau de la Música Catalana",
        category: "culture",
        walkTime: "5 min",
        why: "Modernista concert hall with a stained-glass skylight. The guided tour is worth it even without a concert.",
        source: "palaudemusica.cat",
      },
      {
        name: "Mercat de Santa Caterina",
        category: "food",
        walkTime: "4 min",
        why: "Colorful wave-roofed market. The produce is local and the bar inside (Cuines Santa Caterina) is excellent.",
        source: "mercadsantacaterina.com",
      },
      {
        name: "Passeig del Born evening stroll",
        category: "nightlife",
        walkTime: "1 min",
        why: "The medieval street transforms after 8pm. Outdoor bars, gallery openings, and a relaxed crowd.",
        source: "barcelona.cat",
      },
    ],
    restaurants: [
      {
        name: "Cal Pep",
        walkTime: "2 min",
        cuisine: "Standing tapas",
        priceBand: "€€€",
        why: "Legendary counter-service tapas. Arrive 15 min before opening or accept a long wait.",
        source: "calpep.com",
      },
      {
        name: "El Xampanyet",
        walkTime: "2 min",
        cuisine: "Tapas / Cava",
        priceBand: "€€",
        why: "Tiny cava bar on Carrer de Montcada. The best pre- or post-museum stop in the city.",
        source: "elxampanyet.cat",
      },
      {
        name: "La Cova Fumada",
        walkTime: "8 min",
        cuisine: "Tapas / Seafood",
        priceBand: "€",
        why: "No sign, no menu, no phone. The birthplace of the bomba tapas. Closes when food runs out.",
        source: "barcelona.cat",
      },
    ],
    gems: [
      {
        name: "Museu Frederic Marès",
        why: "A sculptor's personal collection of medieval art housed in a former royal palace. Strange, beautiful, empty.",
      },
      {
        name: "Carrer de Montcada",
        why: "Medieval merchant street with three museums. Walk it slowly — the doors and courtyards are the exhibit.",
      },
      {
        name: "Passeig de Picasso arcades",
        why: "The covered archways opposite Parc de la Ciutadella are a favorite local photography spot at golden hour.",
      },
    ],
  },
  {
    key: "gracia",
    displayName: "Gràcia",
    vibe: "Village-within-a-city energy. Plazas, independent shops, and the best neighborhood feel in Barcelona.",
    bestFor: ["food", "nightlife", "culture"],
    activities: [
      {
        name: "Park Güell",
        category: "architecture",
        walkTime: "15 min",
        why: "Gaudí's mosaic park. The free zone is worth the walk; the paid monument zone needs advance booking.",
        source: "parkguell.barcelona",
      },
      {
        name: "Plaça del Sol evening",
        category: "nightlife",
        walkTime: "3 min",
        why: "The heart of Gràcia nightlife. Grab a vermouth at Sol de Nit and watch the square fill up after 9pm.",
        source: "barcelona.cat",
      },
      {
        name: "Carrer de Verdi strip",
        category: "culture",
        walkTime: "2 min",
        why: "Independent cinemas, bookshops, vintage stores, and bars all within two pedestrian-friendly blocks.",
        source: "barcelona.cat",
      },
      {
        name: "Casa Vicens",
        category: "architecture",
        walkTime: "12 min",
        why: "Gaudí's first major commission. Islamic-inspired brickwork in a quiet residential area. Almost never crowded.",
        source: "casavicens.org",
      },
    ],
    restaurants: [
      {
        name: "La Pepita",
        walkTime: "3 min",
        cuisine: "Creative tapas",
        priceBand: "€€",
        why: "Twisted takes on classic tapas in a lively space. The foie gras with apple is the move.",
        source: "lapepita.barcelona",
      },
      {
        name: "Chivuo's",
        walkTime: "2 min",
        cuisine: "Gourmet sandwiches",
        priceBand: "€",
        why: "Possibly the best sandwiches in Barcelona. The chivito is enormous — share it.",
        source: "chivuos.com",
      },
      {
        name: "Les Tres a la Cuina",
        walkTime: "5 min",
        cuisine: "Catalan / Market",
        priceBand: "€€",
        why: "Tiny neighborhood restaurant run by three friends. Reservations essential for dinner.",
        source: "lestresalacuina.com",
      },
    ],
    gems: [
      {
        name: "Plaça del Diamant",
        why: "The square from Mercè Rodoreda's novel. A statue of Colometa (the protagonist) sits quietly in the corner.",
      },
      {
        name: "Mercat de l'Abaceria Central",
        why: "Gràcia's neighborhood market since 1892. The bar inside serves honest, cheap vermouth and anchovies.",
      },
      {
        name: "Jardins de la Tamarita",
        why: "A hidden garden on the Gràcia/Sarrià border with peacocks, fountains, and zero tourists.",
      },
    ],
  },
  {
    key: "barceloneta",
    displayName: "Barceloneta",
    vibe: "Beachfront fisherman's quarter. Salt air, seafood, and Mediterranean light.",
    bestFor: ["food", "wellness"],
    activities: [
      {
        name: "Barceloneta beach walk",
        category: "wellness",
        walkTime: "2 min",
        why: "Morning walk from the W Hotel breakwater to Port Olímpic. Best before 9am when it's locals-only.",
        source: "barcelona.cat",
      },
      {
        name: "Torre del Rellotge",
        category: "architecture",
        walkTime: "3 min",
        why: "19th-century lighthouse clock tower at the port entrance. The anchor chain motif is a photo-worthy detail.",
        source: "barcelona.cat",
      },
      {
        name: "W Hotel rooftop (Eclipse)",
        category: "nightlife",
        walkTime: "8 min",
        why: "Cocktails with panoramic sea-and-city views. Dress code enforced after 8pm.",
        source: "w-barcelona.com",
      },
      {
        name: "Port Vell marina stroll",
        category: "wellness",
        walkTime: "5 min",
        why: "Walk the wooden boardwalk past the sailing boats toward Maremagnum. Evening light on the water is therapeutic.",
        source: "barcelona.cat",
      },
    ],
    restaurants: [
      {
        name: "La Mar Salada",
        walkTime: "3 min",
        cuisine: "Seafood / Rice dishes",
        priceBand: "€€€",
        why: "The neighborhood's best seafood rice. Book ahead — locals fill it by 2pm.",
        source: "lamarsalada.com",
      },
      {
        name: "Can Paixano (La Xampanyeria)",
        walkTime: "6 min",
        cuisine: "Cava / Standing tapas",
        priceBand: "€",
        why: "€2 cava and €3 bocadillos. Chaotic, loud, and exactly what Barceloneta feels like.",
        source: "canpaixano.com",
      },
      {
        name: "El Vaso de Oro",
        walkTime: "3 min",
        cuisine: "Tapas / Beer",
        priceBand: "€€",
        why: "Standing bar on Carrer de Balboa. The bomba and draught beer are canonical Barceloneta.",
        source: "barcelona.cat",
      },
    ],
    gems: [
      {
        name: "Far del Llobregat walk",
        why: "Past the W Hotel, a breakwater path with uninterrupted sea views. Zero tourists, all locals.",
      },
      {
        name: "Mercat de la Barceloneta",
        why: "The neighborhood market where restaurants buy their morning catch. The bar inside serves it 20 minutes later.",
      },
      {
        name: "Carrer de Ginebra",
        why: "A narrow lane of tiled facades that looks like it hasn't changed in a century — because it hasn't.",
      },
    ],
  },
  {
    key: "raval",
    displayName: "El Raval",
    vibe: "Raw, creative, multicultural. Street art, dive bars, and the city's most diverse food scene.",
    bestFor: ["culture", "food", "nightlife"],
    activities: [
      {
        name: "MACBA (Museum of Contemporary Art)",
        category: "culture",
        walkTime: "3 min",
        why: "Richard Meier's white building is a landmark. The permanent collection covers Spanish contemporary art 1950–present.",
        source: "macba.cat",
      },
      {
        name: "La Boqueria market",
        category: "food",
        walkTime: "5 min",
        why: "The city's most famous market. Go before 10am to see it at its best — produce-stacked, local, alive.",
        source: "boqueria.barcelona",
      },
      {
        name: "Rambla del Raval",
        category: "culture",
        walkTime: "2 min",
        why: "A widened boulevard with the Botero cat statue. Evening is when the neighborhood actually wakes up.",
        source: "barcelona.cat",
      },
      {
        name: "Jardins de Rubió i Lluch",
        category: "wellness",
        walkTime: "5 min",
        why: "A hidden garden courtyard with palm trees and a fountain. The calmest spot in the neighborhood.",
        source: "barcelona.cat",
      },
    ],
    restaurants: [
      {
        name: "Bar Cañete",
        walkTime: "4 min",
        cuisine: "Tapas / Seafood counter",
        priceBand: "€€€",
        why: "Counter-service seafood at its finest. The gambas al ajillo are the benchmark.",
        source: "barcanete.com",
      },
      {
        name: "Manticore",
        walkTime: "3 min",
        cuisine: "Asian-fusion / Cocktails",
        priceBand: "€€",
        why: "Hidden behind an unmarked door. The bao buns and craft cocktails make it worth finding.",
        source: "manticore.barcelona",
      },
      {
        name: "Ramen no Hoshi",
        walkTime: "2 min",
        cuisine: "Japanese ramen",
        priceBand: "€€",
        why: "Tiny counter-service ramen joint. The tonkotsu is the best outside Japan in this city.",
        source: "ramennohoshi.com",
      },
    ],
    gems: [
      {
        name: "Sant Pau del Camp",
        why: "A 10th-century Romanesque monastery hidden in plain sight. The cloister is the oldest in Barcelona.",
      },
      {
        name: "CCCBA (Centre de Cultura Contemporània)",
        why: "Next to MACBA, often overlooked. Free exhibitions on urban culture, migration, and photography.",
      },
      {
        name: "Carrer d'en Rull",
        why: "Street art alley that rotates new murals monthly. A different gallery every time you walk through.",
      },
    ],
  },
  {
    key: "sant-pere",
    displayName: "Sant Pere / Arc de Triomf",
    vibe: "Transitional neighborhood between old town and modernist Barcelona. Authentic, unpolished, centrally placed.",
    bestFor: ["culture", "architecture"],
    activities: [
      {
        name: "Arc de Triomf",
        category: "architecture",
        walkTime: "2 min",
        why: "The 1888 World's Fair entrance gate. The brickwork and friezes are best photographed in morning light.",
        source: "barcelona.cat",
      },
      {
        name: "Parc de la Ciutadella",
        category: "wellness",
        walkTime: "3 min",
        why: "Barcelona's central park. The lake, the zoo entrance, the mammoth statue — all free to wander.",
        source: "barcelona.cat",
      },
      {
        name: "Palau de la Música (tour)",
        category: "culture",
        walkTime: "4 min",
        why: "A 45-minute guided tour through the world's only Art Nouveau concert hall. The stained glass alone is worth it.",
        source: "palaudemusica.cat",
      },
      {
        name: "Recinte Modernista de Sant Pau",
        category: "architecture",
        walkTime: "10 min",
        why: "The larger, quieter moderniste hospital complex. Skip the Sagrada crowds and come here instead.",
        source: "santpaubarcelona.org",
      },
    ],
    restaurants: [
      {
        name: "Bar Lobo",
        walkTime: "3 min",
        cuisine: "Modern tapas",
        priceBand: "€€",
        why: "All-day dining with a garden terrace. The burrata with tomato jam is reliable.",
        source: "barlobo.com",
      },
      {
        name: "Taverna El Born",
        walkTime: "6 min",
        cuisine: "Catalan / Grilled",
        priceBand: "€€",
        why: "Just over the boundary into El Born. Wood-fired meats and honest suquet de peix.",
        source: "tavernaelborn.com",
      },
      {
        name: "Mercat de Sant Antoni perimeter bars",
        walkTime: "8 min",
        cuisine: "Market tapas",
        priceBand: "€",
        why: "The bars around the renovated market serve pinchos and vermouth for a fraction of tourist-center prices.",
        source: "mercatsantantoni.com",
      },
    ],
    gems: [
      {
        name: "Plaça de la Llana",
        why: "A tiny square with a medieval well and a contemporary sculpture. The old-and-new collision is pure Barcelona.",
      },
      {
        name: "Palau Robert exhibitions",
        why: "Free exhibitions on Catalan culture and photography in a moderniste palace on Passeig de Gràcia.",
      },
      {
        name: "Carrer dels Flassaders extension",
        why: "Walk the full length into El Born and watch the architecture shift from medieval to modern gallery.",
      },
    ],
  },
];

const ALT_HOTEL_SUGGESTIONS: Record<
  string,
  { neighborhood: string; hotel: string; reason: string }[]
> = {
  barceloneta: [
    {
      neighborhood: "Gothic Quarter",
      hotel: "Hotel Neri Relais",
      reason:
        "Your picks lean culture and architecture. The Gothic Quarter puts you within 5 min walk of all of them — Barceloneta adds 20+ min transit each way.",
    },
  ],
  "sant-pere": [
    {
      neighborhood: "El Born",
      hotel: "Yurbban Passage Hotel & Spa",
      reason:
        "El Born has more evening restaurants and nightlife within walking distance, with the same cultural access. A better base for staying out late.",
    },
  ],
};

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

const activityTemplate = document.getElementById("activityCardTemplate") as HTMLTemplateElement;
const restaurantTemplate = document.getElementById("restaurantCardTemplate") as HTMLTemplateElement;
const gemTemplate = document.getElementById("gemCardTemplate") as HTMLTemplateElement;

editButton.addEventListener("click", () => showScreen("input"));

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const result = readForm();
  if (!result.valid) {
    validationNode.textContent = result.error;
    return;
  }
  validationNode.textContent = "";
  renderResults(result.data);
  showScreen("results");
});

function showScreen(target: "input" | "results"): void {
  if (target === "results") {
    screenInput.hidden = true;
    screenInput.classList.remove("screen-active");
    screenResults.hidden = false;
    requestAnimationFrame(() => screenResults.classList.add("screen-active"));
    return;
  }
  screenResults.classList.remove("screen-active");
  setTimeout(() => {
    screenResults.hidden = true;
    screenInput.hidden = false;
    requestAnimationFrame(() => screenInput.classList.add("screen-active"));
  }, 220);
}

function readForm(): FormResult {
  const data = new FormData(form);
  const neighborhood = data.get("neighborhood") as NeighborhoodKey | null;
  const focuses = data.getAll("focus") as FocusArea[];

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

function filterByFocus(activities: Activity[], focuses: FocusArea[]): Activity[] {
  if (!focuses.length) return activities;
  const matched = activities.filter((a) => focuses.includes(a.category));
  return matched.length >= 2 ? matched : activities;
}

function renderActivities(activities: Activity[]): void {
  activityList.innerHTML = "";
  for (const act of activities) {
    const fragment = activityTemplate.content.cloneNode(true) as DocumentFragment;
    const title = fragment.querySelector("h4")!;
    const walkBadge = fragment.querySelector(".walk-badge")!;
    const why = fragment.querySelector(".result-card-why")!;
    const category = fragment.querySelector(".result-card-category")!;
    const source = fragment.querySelector(".result-card-source")!;

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
    const walkBadge = fragment.querySelector(".walk-badge")!;
    const why = fragment.querySelector(".result-card-why")!;
    const cuisine = fragment.querySelector(".result-card-cuisine")!;
    const price = fragment.querySelector(".result-card-price")!;

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
    const why = fragment.querySelector(".result-card-why")!;

    title.textContent = gem.name;
    why.textContent = gem.why;

    gemList.appendChild(fragment);
  }
}

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
  altContent.innerHTML = `
    <div class="alt-suggestion">
      <p class="alt-hotel-name">${suggestion.hotel}</p>
      <p class="alt-neighborhood">${suggestion.neighborhood}</p>
      <p class="alt-reason">${suggestion.reason}</p>
    </div>
  `;
}

function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export {};
