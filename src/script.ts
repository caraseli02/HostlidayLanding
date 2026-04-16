/* ═══ TYPES ═══ */
type HotelStatus = "verified today" | "verified within 7 days" | "stale" | "unverified";
type Pace = "slow" | "balanced" | "packed";
type Budget = "value" | "comfort" | "premium" | "luxury";
type IconicIntensity = "low" | "medium" | "high";
type ActivityCategory = "culture" | "food" | "architecture" | "nightlife" | "wellness";
type VibeTag = "scenic rooftop" | "intimate boutique" | "luxury spa" | "quiet old-town charm";

interface Hotel {
  name: string; neighborhood: string; vibe: VibeTag[]; budgets: Budget[];
  paces: Pace[]; status: HotelStatus; why: string; freshness: string;
  source: string; sourceUrl: string; booking: string;
}
interface TripPayload {
  useCase: string; budget: Budget; pace: Pace; iconic: IconicIntensity;
  vibe: VibeTag; days: number; priorities: ActivityCategory[];
}
interface ItineraryDay { dayNumber: number; context: string; blocks: string[]; }
type FormResult = { valid: false; error: string } | { valid: true; data: TripPayload };

/* ═══ COUNTER ═══ */
function initCounter(): void {
  const el = document.getElementById("tripCount");
  if (!el) return;
  const obs = new IntersectionObserver((entries) => {
    const e = entries[0];
    if (!e || !e.isIntersecting) return;
    const start = performance.now(), dur = 1800, target = 2847;
    (function tick(now: number) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    obs.unobserve(e.target);
  }, { threshold: 0.5 });
  obs.observe(el);
}

/* ═══ HERO ═══ */
function initHero(): void {
  const input = document.getElementById("heroInput") as HTMLInputElement | null;
  const send = document.getElementById("heroSend");
  const scroll = document.querySelector(".scroll-cta");

  function goDemo() { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }

  send?.addEventListener("click", goDemo);
  input?.addEventListener("keydown", e => { if (e.key === "Enter") goDemo(); });
  scroll?.addEventListener("click", goDemo);

  document.querySelectorAll<HTMLButtonElement>(".pill[data-action]").forEach(p => {
    p.addEventListener("click", () => {
      const sel = document.getElementById("tripUseCase") as HTMLSelectElement | null;
      const a = p.dataset.action;
      if (a === "romantic" && sel) sel.value = "romantic";
      if (a === "friends" && sel) sel.value = "friends";
      goDemo();
    });
  });
}

/* ═══ DEMO ═══ */
const form = document.getElementById("tripForm") as HTMLFormElement;
const daysReadout = document.getElementById("daysReadout")!;
const daysInput = document.getElementById("tripDays") as HTMLInputElement;
const validationNode = document.getElementById("formValidation")!;
const screenInput = document.getElementById("screenInput")!;
const screenResults = document.getElementById("screenResults")!;
const editTripButton = document.getElementById("editTripButton")!;
const resultsSubtitle = document.getElementById("resultsSubtitle")!;
const hotelList = document.getElementById("hotelList")!;
const itineraryList = document.getElementById("itineraryList")!;
const hotelTemplate = document.getElementById("hotelCardTemplate") as HTMLTemplateElement;
const dayTemplate = document.getElementById("dayCardTemplate") as HTMLTemplateElement;

const HOTEL_DATA: Hotel[] = [
  { name:"Hotel Neri Relais", neighborhood:"Gothic Quarter", vibe:["intimate boutique","quiet old-town charm"], budgets:["premium","luxury"], paces:["slow","balanced"], status:"verified today", why:"Hidden courtyards and walkable old-town lanes make this ideal for low-friction evenings.", freshness:"Checked 3 hours ago", source:"hotelneri.com", sourceUrl:"https://www.hotelneri.com/", booking:"https://www.booking.com/" },
  { name:"H10 Casa Mimosa", neighborhood:"Eixample", vibe:["scenic rooftop","intimate boutique"], budgets:["comfort","premium"], paces:["balanced","packed"], status:"verified within 7 days", why:"Strong rooftop and central routing reduce travel dead-time across major architecture stops.", freshness:"Checked 2 days ago", source:"h10hotels.com", sourceUrl:"https://www.h10hotels.com/", booking:"https://www.booking.com/" },
  { name:"Yurbban Passage Hotel & Spa", neighborhood:"El Born", vibe:["luxury spa","scenic rooftop"], budgets:["premium","luxury"], paces:["slow","balanced"], status:"verified within 7 days", why:"Spa-first reset with strong El Born placement for evening food routes and shorter transfers.", freshness:"Checked 5 days ago", source:"yurbbanpassage.com", sourceUrl:"https://www.yurbbanpassage.com/", booking:"https://www.booking.com/" },
  { name:"Room Mate Carla", neighborhood:"Eixample", vibe:["scenic rooftop"], budgets:["value","comfort"], paces:["packed","balanced"], status:"stale", why:"Good value location near transit and architecture routes, but recent amenity data needs re-check.", freshness:"Checked 12 days ago", source:"room-matehotels.com", sourceUrl:"https://room-matehotels.com/", booking:"https://www.booking.com/" },
  { name:"Hotel Rec Barcelona", neighborhood:"Arc de Triomf", vibe:["quiet old-town charm","intimate boutique"], budgets:["value","comfort"], paces:["slow","balanced"], status:"unverified", why:"Promising fit for calmer pacing and old-town access, but live verification was not confirmed.", freshness:"Not verified", source:"hotelrecbarcelona.com", sourceUrl:"https://www.hotelrecbarcelona.com/", booking:"https://www.booking.com/" },
];

const ACTIVITY_LIBRARY: Record<ActivityCategory, string[]> = {
  culture:["Picasso Museum timed entry","Roman wall and Gothic lanes walk","Catalan music venue evening"],
  food:["Market tasting block in El Born","Long lunch with local tapas route","Chef-led dinner in Eixample"],
  architecture:["Sagrada Familia reserved slot","Modernisme route: Casa Batlló + Passeig de Gràcia","Sunset Bunkers del Carmel viewpoint"],
  nightlife:["Cocktail bar cluster in Gràcia","Rooftop live set near the waterfront","Late-night vermouth stop"],
  wellness:["Spa recovery block","Beachfront sunrise walk","Mindful pause in Ciutadella Park"],
};
const MEAL = ["Lunch anchor","Dinner anchor"] as const;

daysInput.addEventListener("input", () => { daysReadout.textContent = daysInput.value; });
editTripButton.addEventListener("click", () => showScreen("input"));
form.addEventListener("input", () => { validationNode.textContent = ""; });
form.addEventListener("change", () => { validationNode.textContent = ""; });
form.addEventListener("submit", e => {
  e.preventDefault();
  const r = readForm();
  if (!r.valid) { validationNode.textContent = r.error; return; }
  validationNode.textContent = "";
  renderResults(r.data);
  showScreen("results");
});

function showScreen(t: "input"|"results") {
  if (t === "results") {
    screenInput.hidden = true; screenInput.classList.remove("screen-active");
    screenResults.hidden = false;
    requestAnimationFrame(() => screenResults.classList.add("screen-active"));
  } else {
    screenResults.classList.remove("screen-active");
    setTimeout(() => {
      screenResults.hidden = true; screenInput.hidden = false;
      requestAnimationFrame(() => screenInput.classList.add("screen-active"));
    }, 220);
  }
}

function readForm(): FormResult {
  const d = new FormData(form);
  const pri = d.getAll("priority") as ActivityCategory[];
  if (pri.length > 2) return { valid:false, error:"Select up to 2 priorities." };
  const useCase = d.get("tripUseCase") as string|null;
  const budget = d.get("tripBudget") as Budget|null;
  const pace = d.get("tripPace") as Pace|null;
  const iconic = d.get("iconicIntensity") as IconicIntensity|null;
  const vibe = d.get("vibeTag") as VibeTag|null;
  const days = Number(d.get("tripDays"));
  if (!useCase||!budget||!pace||!iconic||!vibe||!days) return { valid:false, error:"Complete all required fields." };
  return { valid:true, data:{ useCase, budget, pace, iconic, vibe, days, priorities:pri } };
}

function renderResults(data: TripPayload) {
  const pl = data.priorities.length ? data.priorities.join(" + ") : "general highlights";
  resultsSubtitle.textContent = `${cap(data.days+"-day")} ${uc(data.useCase)} · ${data.vibe} tone · ${data.pace} pace · ${data.iconic} iconic · ${pl} focus`;
  renderHotels(buildHotels(data));
  renderItinerary(buildItinerary(data));
}

function buildHotels(d: TripPayload): Hotel[] {
  const a = HOTEL_DATA.filter(h => h.vibe.includes(d.vibe) && h.budgets.includes(d.budget) && h.paces.includes(d.pace));
  const b = HOTEL_DATA.filter(h => h.vibe.includes(d.vibe) && h.budgets.includes(d.budget));
  const c = HOTEL_DATA.filter(h => h.budgets.includes(d.budget));
  const seen = new Set<string>();
  return [...a,...b,...c].filter(h => seen.has(h.name) ? false : (seen.add(h.name), true)).slice(0,4);
}

function buildItinerary(d: TripPayload): ItineraryDay[] {
  const pool = d.priorities.length ? d.priorities : ["culture","architecture"] as ActivityCategory[];
  const blocks = d.pace==="slow"?2:d.pace==="balanced"?3:4;
  const mode: Record<string,string> = { romantic:"romantic cadence", friends:"group momentum", family:"family-friendly timing", solo:"solo discovery rhythm" };
  return Array.from({length:d.days}).map((_,i) => {
    const day = i+1, focus = pool[i%pool.length]!;
    const extra: Record<IconicIntensity,string[]> = { low:[], medium:["One iconic anchor slot"], high:["Two iconic anchor slots with timed entries"] };
    const acts = [...(ACTIVITY_LIBRARY[focus]||ACTIVITY_LIBRARY.culture).slice(0,blocks), ...extra[d.iconic]].slice(0,4);
    return { dayNumber:day, context:`Day ${day}: ${mode[d.useCase]||"city-break flow"} · max 45 min legs`, blocks:[...acts,...MEAL] };
  });
}

function renderHotels(hotels: Hotel[]) {
  hotelList.innerHTML = "";
  hotels.forEach(h => {
    const f = hotelTemplate.content.cloneNode(true) as DocumentFragment;
    f.querySelector("h4")!.textContent = h.name;
    const sp = f.querySelector(".status-pill")!; sp.textContent = h.status; sp.classList.add(`status-${h.status.replaceAll(" ","-")}`);
    f.querySelector(".hotel-match-reason")!.textContent = h.why;
    f.querySelector(".hotel-meta")!.textContent = `${h.neighborhood} · ${h.vibe.join(" / ")}`;
    f.querySelector(".hotel-freshness")!.textContent = `\u{1F550} ${h.freshness}`;
    f.querySelector(".hotel-source")!.textContent = `\u{1F4CE} ${h.source}`;
    const links = f.querySelectorAll("a"); links[0]!.href = h.sourceUrl; links[1]!.href = h.booking;
    hotelList.appendChild(f);
  });
}

function renderItinerary(days: ItineraryDay[]) {
  itineraryList.innerHTML = "";
  days.forEach(d => {
    const f = dayTemplate.content.cloneNode(true) as DocumentFragment;
    f.querySelector("h4")!.textContent = `Day ${d.dayNumber}`;
    f.querySelector(".day-context")!.textContent = d.context;
    const ul = f.querySelector(".activity-list")!;
    d.blocks.forEach(b => { const li = document.createElement("li"); li.textContent = b; ul.appendChild(li); });
    itineraryList.appendChild(f);
  });
}

function uc(s: string) {
  return ({romantic:"romantic escape",friends:"friends weekend",family:"family break",solo:"solo culture trip"} as Record<string,string>)[s]||"city break";
}
function cap(s: string) { return s.charAt(0).toUpperCase()+s.slice(1); }

/* ═══ INIT ═══ */
initHero();
initCounter();
