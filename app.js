// fleetr public booking site (fleetr.ai).
//
// Plain JavaScript, no build step, hash routes so GitHub Pages serves every
// page from index.html. Everything a customer sees comes from the public
// booking functions (fleetr-infra supabase/public_booking.sql and
// public_booking_checkout.sql), called with the anon key, and phone
// verification goes through the worker's /phone/send and /phone/verify.
//
// Every value from the database is put on the page as text, never as HTML.

const SB_URL = "https://hzcatlecvwpqxedrzfog.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Y2F0bGVjdndwcXhlZHJ6Zm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzQzMTMsImV4cCI6MjA5MzY1MDMxM30.mfqwWQh54hPsRunAVB6RDf_IrvwKmhSYWWJ4sMy0rcw";
const WORKER = "https://fleetr-ai-proxy.connor-0a5.workers.dev";
const APP_URL = "https://app.fleetr.ai";
const TURNSTILE_KEY = "0x4AAAAAAFP1n93AtpZAqdDg";
const PHOTO_BASE = `${SB_URL}/storage/v1/object/public/listing-photos/`;
const DEFAULT_CENTRE = [47.5615, -52.7126];

const CATEGORIES = ["Car", "SUV", "Truck", "Van", "Luxury", "Other"];
// Several vehicle types travel in the URL as one comma-separated "cat",
// always read back in CATEGORIES order.
const catList = (s) => { const want = String(s || "").split(","); return CATEGORIES.filter((c) => want.includes(c)); };

// ─── Icons ───────────────────────────────────────────────────────────────────
// Interface icons on a 24 grid. The vehicle icons are side profiles on a
// 40 by 24 grid, drawn to one set of wheels and one ground line so the six
// read as a family.
const SVG_OPEN = (vb) => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`;
const WHEELS = '<circle cx="10.5" cy="17.5" r="2.6"/><circle cx="29.5" cy="17.5" r="2.6"/><path d="M3 17.5h4.9M13.1 17.5h13.8M32.1 17.5H37"/>';
const VEHICLES = {
  Car:    '<path d="M3 17.5v-3.1c0-1 .7-1.9 1.7-2.1L9.6 11l3.9-3.6c.7-.6 1.6-1 2.5-1h8.5c1 0 2 .4 2.7 1.2l3.1 3.4 4.6 1c1 .2 1.7 1.1 1.7 2.1v3.4"/><path d="M11.3 11h18.9M20.2 6.6V11"/>' + WHEELS,
  SUV:    '<path d="M3 17.5V9.6C3 8.7 3.7 8 4.6 8h20.6l5.4 3.6 4.9 1c.9.2 1.5 1 1.5 1.9v3"/><path d="M3 11.6h27.6M12 8v3.6M21 8v3.6M6 5.6h17"/>' + WHEELS,
  Truck:  '<path d="M3 17.5v-6.3h16.5"/><path d="M19.5 17.5V6.8h7.6l4.3 4.6 4.1.7c.9.2 1.5.9 1.5 1.8v3.6"/><path d="M23.4 6.8v4.6h8"/>' + WHEELS,
  Van:    '<path d="M3 17.5V6.6C3 5.7 3.7 5 4.6 5h22.6l5.9 5.6 2.4.6c.9.2 1.5 1 1.5 1.9v4.4"/><path d="M27.2 5v5.6h5.9M7 8.6h15.5M17.5 8.6v8.9"/>' + WHEELS,
  Luxury: '<path d="M3 17.5v-2.8c0-1 .7-1.9 1.7-2.1l6.6-1.2 4.7-3.6c.8-.6 1.7-.9 2.7-.9h4.6c1.1 0 2.1.5 2.8 1.3l3 3.2 5.4 1c1 .2 1.7 1.1 1.7 2.1v3"/><path d="M13.5 11.4h15.4M33.5 3.6l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z"/>' + WHEELS,
  Other:  '<circle cx="11" cy="12" r="5"/><circle cx="11" cy="12" r="1.5"/><path d="M16 12h19M30 12v4M34.5 12v3"/>',
};
const ICONS = {
  search:   '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  map:      '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  list:     '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  plane:    '<path d="M2.5 13.5l7.5-1.2 4.8-6.8c.6-.9 1.9-1.1 2.7-.4.8.6 1 1.8.4 2.6l-4.8 6.8 1.6 7.4-1.8.9-3.4-6.2-4.6.8-1.4 2.3-1.4-.4.4-3.2z"/>',
  delivery: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  moon:     '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  check:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  left:     '<path d="M15 5l-7 7 7 7"/>',
  right:    '<path d="M9 5l7 7-7 7"/>',
  arrow:    '<path d="M4 12h16M14 6l6 6-6 6"/>',
  card:     '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
  id:       '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16a3 3 0 0 1 6 0M14.5 10h4M14.5 13.5h3"/>',
  driver:   '<circle cx="10" cy="8" r="3.5"/><path d="M3 20a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  deposit:  '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  pin:      '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  phone:    '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  close:    '<path d="M6 6l12 12M18 6L6 18"/>',
  key:      '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  fuel:     '<path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12M4 10h10M14 8l3 3v6a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
  alert:    '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  chat:     '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  camera:   '<path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>',
  spark:    '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  shieldCheck: '<path class="sc-body" d="M12 2.5l8.5 3.2v6.2c0 5.2-3.6 8.7-8.5 9.8-4.9-1.1-8.5-4.6-8.5-9.8V5.7z"/><path class="sc-check" d="M8.4 12.2l2.5 2.5 4.8-5"/>',
  document: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14.5 3v4.5H19M9 12h7M9 15.5h7M9 9h3"/>',
  globe:    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
};
function icon(name, strokeWidth) {
  const t = document.createElement("template");
  const vehicle = VEHICLES[name];
  t.innerHTML = (vehicle ? SVG_OPEN("0 0 40 24") + vehicle : SVG_OPEN("0 0 24 24") + (ICONS[name] || ICONS.search)) + "</svg>";
  const s = t.content.firstChild;
  if (strokeWidth) s.setAttribute("stroke-width", strokeWidth);
  return s;
}

// ─── DOM ─────────────────────────────────────────────────────────────────────
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "value") el.value = v;
    else if (k === "checked") el.checked = !!v;
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, String(v));
  }
  add(el, kids);
  // Link buttons get an arrow that slides in on hover (see .btn-arrow).
  if (tag === "a" && el.classList.contains("btn") && !el.querySelector("svg")) {
    const label = document.createElement("span");
    label.className = "btn-label";
    label.append(...el.childNodes);
    const arrow = document.createElement("span");
    arrow.className = "btn-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.append(icon("arrow", "2.2"));
    el.append(label, arrow);
  }
  return el;
}
// replaceChildren, skipping null and false as h does.
function set(el, ...kids) { el.replaceChildren(); return add(el, ...kids); }
function add(el, ...kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k instanceof Node ? k : String(k));
  }
  return el;
}

// Run before every page change: maps, document listeners, timers.
let cleanups = [];
function onCleanup(fn) { cleanups.push(fn); }
function runCleanups() { const c = cleanups; cleanups = []; c.forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } }); }

// ─── Data ────────────────────────────────────────────────────────────────────
async function rpc(fn, args) {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`${fn} ${res.status}`);
  return res.json();
}

async function worker(path, body) {
  const res = await fetch(`${WORKER}${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const out = await res.json().catch(() => null);
  return out || { ok: false, message: "Something went wrong. Try again." };
}

const REASONS = {
  bad_query:            "Enter a city or airport code.",
  bad_category:         "Choose a vehicle type.",
  bad_dates:            "Choose a return time after the pick-up.",
  too_soon:             "That pick-up is too soon. Choose a later time.",
  too_long:             "That rental is longer than this branch allows. Choose an earlier return.",
  pickup_outside_hours: "The branch is closed at that pick-up time. Check the hours and choose another time.",
  return_outside_hours: "The branch is closed at that return time. Check the hours and choose another time.",
  no_availability:      "Nothing is available for these dates.",
  not_found:            "This branch isn't taking bookings on fleetr.ai right now.",
  bad_class:            "That vehicle isn't available to book. Choose another.",
  bad_name:             "Enter your first and last name.",
  bad_email:            "Enter a valid email address.",
  bad_phone:            "Enter a Canadian or US mobile number.",
  phone_not_verified:   "Your phone verification has expired. Verify your number again.",
  not_available:        "That vehicle was just booked for these dates. Choose another vehicle or different dates.",
  bad_coverages:        "One of the coverages is no longer offered. Go back and choose again.",
  try_again:            "Something went wrong. Try again.",
  network:              "We couldn't reach fleetr. Check your connection and try again.",
};
const reasonText = (r) => REASONS[r] || REASONS.try_again;

const photoUrl = (path) => (path ? PHOTO_BASE + String(path).split("/").map(encodeURIComponent).join("/") : null);

// ─── Dates ───────────────────────────────────────────────────────────────────
// Every date and time is the branch's own wall clock, as the database reads it.
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); };
const validYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "") && !Number.isNaN(parseYmd(s).getTime());
const validTime = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s || "");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function fmtDay(s, withYear) {
  const d = parseYmd(s);
  return `${DOW[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}${withYear ? `, ${d.getFullYear()}` : ""}`;
}
function fmtTime(t) {
  const [hh, mm] = t.split(":").map(Number);
  return `${hh % 12 || 12}:${pad(mm)} ${hh < 12 ? "AM" : "PM"}`;
}
const fmtShort = (s) => { const d = parseYmd(s); return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`; };
const TIMES = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`);
// Mirrors booking_days: whole days, any part of a day counts, at least one.
function rentalDays(pu, rt) {
  const ms = (s) => { const [d, t] = s.split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mi] = t.split(":").map(Number); return Date.UTC(y, m - 1, dd, hh, mi); };
  return Math.max(1, Math.ceil((ms(rt) - ms(pu)) / 86400000));
}
const stamp = (date, time) => `${date}T${time}`;
const asTimestamp = (s) => `${s}:00`;

function defaultTrip() {
  const pu = addDays(ymd(new Date()), 1);
  return { puDate: pu, puTime: "10:00", rtDate: addDays(pu, 3), rtTime: "10:00" };
}
function tripFrom(q) {
  const d = defaultTrip();
  const [pd, pt] = (q.get("pu") || "").split("T");
  const [rd, rtm] = (q.get("rt") || "").split("T");
  return {
    puDate: validYmd(pd) ? pd : d.puDate, puTime: validTime(pt) ? pt : d.puTime,
    rtDate: validYmd(rd) ? rd : d.rtDate, rtTime: validTime(rtm) ? rtm : d.rtTime,
  };
}
const tripPu = (t) => stamp(t.puDate, t.puTime);
const tripRt = (t) => stamp(t.rtDate, t.rtTime);
const tripRange = (t) => `${fmtShort(t.puDate)} ${fmtTime(t.puTime)} \u2013 ${fmtShort(t.rtDate)} ${fmtTime(t.rtTime)}`;

// ─── Money ───────────────────────────────────────────────────────────────────
const round2 = (n) => Math.round(n * 100) / 100;
const money = (n, cents) => {
  const v = Number(n) || 0;
  const whole = !cents && Math.abs(v - Math.round(v)) < 0.005;
  return "$" + v.toLocaleString("en-CA", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
};

// The price breakdown. Tax applies to every charge, as it will on the rental
// agreement. coverages: the ones accepted, each with pricePerDay.
function quote(cls, days, coverages, taxes) {
  const lines = [{ label: `${money(cls.dailyRate, true)} \u00d7 ${days} day${days === 1 ? "" : "s"}`, amount: round2(cls.dailyRate * days) }];
  (coverages || []).forEach((c) => {
    const p = Number(c.pricePerDay) || 0;
    lines.push({ label: `${c.name} (${money(p, true)} \u00d7 ${days})`, amount: round2(p * days) });
  });
  const subtotal = round2(lines.reduce((s, l) => s + l.amount, 0));
  const taxLines = (Array.isArray(taxes) ? taxes : [])
    .filter((t) => t && Number(t.rate) > 0)
    .map((t) => ({ label: `${t.name} (${Number(t.rate)}%)`, amount: round2(subtotal * Number(t.rate) / 100) }));
  const total = round2(subtotal + taxLines.reduce((s, l) => s + l.amount, 0));
  return { lines, subtotal, taxLines, total };
}

function quoteLines(q) {
  return h("div", { class: "lines" },
    q.lines.map((l) => h("div", { class: "line" }, h("span", { class: "lbl" }, l.label), h("span", null, money(l.amount, true)))),
    q.taxLines.length
      ? q.taxLines.map((l) => h("div", { class: "line muted" }, h("span", null, l.label), h("span", null, money(l.amount, true))))
      : h("div", { class: "line muted" }, h("span", null, "Taxes"), h("span", null, "None")),
    h("div", { class: "line total" }, h("span", null, "Total"), h("span", null, money(q.total, true))));
}

// ─── Listing helpers ─────────────────────────────────────────────────────────
const cityOf = (b) => (b.citiesServed && b.citiesServed[0]) || (b.airportCodes && b.airportCodes[0]) || "";
function perksOf(b) {
  const out = [];
  if (b.airportPickup) out.push({ icon: "plane", name: "Airport pickup", text: b.airportCodes && b.airportCodes.length ? `At ${b.airportCodes.join(", ")}` : "Picked up at the airport" });
  if (b.delivery) out.push({ icon: "delivery", name: "Delivery", text: "They can bring the vehicle to you" });
  if (b.afterHoursDropoff) out.push({ icon: "moon", name: "After-hours drop-off", text: "Return outside opening hours" });
  return out;
}
const HOURS_DAYS = [["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"], ["thu", "Thursday"], ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"]];
function todayKey(tz) {
  try {
    const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz || "America/St_Johns" }).format(new Date());
    return wd.slice(0, 3).toLowerCase();
  } catch (e) { return ""; }
}
function photoBlock(b, cls) {
  const url = photoUrl(b.photoPath);
  const logo = photoUrl(b.logoPath);
  return h("div", { class: cls },
    url ? h("img", { src: url, alt: `${b.name}`, loading: "lazy" }) : h("div", { class: "placeholder-photo" }, icon("Car", "1")),
    logo && h("div", { class: "card-logo" }, h("img", { src: logo, alt: `${b.name} logo`, loading: "lazy" })));
}

// ─── Maps ────────────────────────────────────────────────────────────────────
function makeMap(el, centre, zoom) {
  if (!window.L) {
    el.append(h("p", { class: "muted", style: { padding: "24px" } }, "The map couldn't be loaded."));
    return null;
  }
  const map = window.L.map(el, { scrollWheelZoom: true }).setView(centre, zoom);
  // OpenStreetMap's own tiles, free with attribution. The light, quiet look is
  // a CSS filter on the tile layer (.map .leaflet-tile-pane in index.html).
  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  onCleanup(() => map.remove());
  return map;
}
const hasPin = (b) => b.latitude != null && b.longitude != null && Number.isFinite(Number(b.latitude)) && Number.isFinite(Number(b.longitude));

// ─── Router ──────────────────────────────────────────────────────────────────
const appEl = document.getElementById("app");
function parseHash() {
  const hash = location.hash.slice(1);
  const raw = hash.startsWith("/") ? hash : "/";
  const [path, qs] = raw.split("?");
  return { path: path || "/", q: new URLSearchParams(qs || "") };
}
function go(path, params) {
  const qs = params ? new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== "")).toString() : "";
  location.hash = `#${path}${qs ? "?" + qs : ""}`;
}
let lastPath = null;
function render() {
  runCleanups();
  const { path, q } = parseHash();
  let page;
  if (path === "/" || path === "") page = HomePage(q);
  else if (path === "/search") page = SearchPage(q);
  else if (path.startsWith("/branch/")) page = BranchPage(path.slice(8), q);
  else if (path.startsWith("/checkout/")) page = CheckoutPage(path.slice(10), q);
  else if (path === "/confirmed") page = ConfirmedPage();
  else if (path === "/rental-companies") page = RentalCompaniesPage(q);
  else if (path === "/dealerships") page = DealershipsPage();
  else page = NotFoundPage();
  set(appEl, page);
  reveal(appEl);
  const section = path.split("/")[1] || "";
  if (lastPath !== path) window.scrollTo(0, 0);
  lastPath = path;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const n = a.getAttribute("data-nav");
    a.classList.toggle("active", n === section || (n === "rent" && !["rental-companies", "dealerships"].includes(section)));
  });
  closeNavSheet();
}
window.addEventListener("hashchange", render);

// ─── Motion ──────────────────────────────────────────────────────────────────
const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)");

// Ported from 21st "Scroll Reveal": section heads, steps and cards fade up once
// as they come on screen, siblings a beat apart.
const REVEAL = ".band .split-head, .steps li, .statement, .point, .ink-band .grid";
function reveal(root) {
  if (!motionOK.matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    io.unobserve(el);
    el.classList.add("in");
    // Hand the element back to its own hover transitions once it has landed.
    el.addEventListener("transitionend", () => { el.classList.remove("reveal", "in"); el.style.transitionDelay = ""; }, { once: true });
  }), { rootMargin: "0px 0px -8% 0px" });
  root.querySelectorAll(REVEAL).forEach((el) => {
    const i = el.matches(".steps li, .point") ? [...el.parentElement.children].indexOf(el) : 0;
    el.classList.add("reveal");
    if (i) el.style.transitionDelay = `${i * 90}ms`;
    io.observe(el);
  });
  onCleanup(() => io.disconnect());
}

// Ported from 21st "Spotlight Card": the light on result photos, the step
// cards and the Why cards sits under the mouse. Touch never sees it.
document.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  const el = e.target.closest && e.target.closest(".card-photo, .point, .steps li");
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}, { passive: true });

function doneTick() {
  const t = document.createElement("template");
  t.innerHTML = '<svg class="done-tick" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26"/><path d="M17 29l7.5 7.5L39 21"/></svg>';
  return t.content.firstChild;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
const navBtn = document.querySelector(".nav-menu-btn");
const navSheet = document.getElementById("nav-sheet");
function closeNavSheet() { navSheet.classList.remove("open"); navBtn.setAttribute("aria-expanded", "false"); }
navBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = !navSheet.classList.contains("open");
  navSheet.classList.toggle("open", open);
  navBtn.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (e) => { if (!navSheet.contains(e.target)) closeNavSheet(); });
// The focus ring in the nav is for keyboard users only: a mouse or tap click
// (detail > 0) lets go of focus so no box is left behind.
document.querySelector(".nav").addEventListener("click", (e) => {
  const el = e.target.closest("a, button");
  if (el && e.detail > 0) el.blur();
});

// ─── Calendar ────────────────────────────────────────────────────────────────
// A two-month range picker with pick-up and return times. trip is changed in
// place; onChange is called after every change, onDone when Done is pressed.
function Calendar({ trip, focus, onChange, onDone }) {
  const today = ymd(new Date());
  let view = parseYmd(trip.puDate || today);
  view = new Date(view.getFullYear(), view.getMonth(), 1);
  let picking = focus || "start";
  const root = h("div", { class: "cal-pop", role: "dialog", "aria-label": "Choose dates" });
  root.addEventListener("click", (e) => e.stopPropagation());

  const month = (first) => {
    const y = first.getFullYear(), m = first.getMonth();
    const startDow = new Date(y, m, 1).getDay();
    const count = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(h("span"));
    for (let d = 1; d <= count; d++) {
      const s = ymd(new Date(y, m, d));
      const past = s < today;
      const isStart = s === trip.puDate, isEnd = s === trip.rtDate;
      const inRange = trip.puDate && trip.rtDate && s > trip.puDate && s < trip.rtDate;
      const cls = ["cal-day", isStart || isEnd ? "sel" : "", isStart ? "start" : "", isEnd ? "end" : "",
                   isStart && trip.rtDate && trip.rtDate !== trip.puDate ? "has-end" : "", inRange ? "in" : ""].join(" ");
      cells.push(h("button", {
        type: "button", class: cls, disabled: past, "aria-label": fmtDay(s, true),
        "aria-pressed": isStart || isEnd ? "true" : "false",
        onclick: () => pick(s),
      }, String(d)));
    }
    return h("div", { class: "cal-month" },
      h("h4", null, `${MONTHS[m]} ${y}`),
      h("div", { class: "cal-grid" }, DOW.map((d) => h("span", { class: "cal-dow" }, d.slice(0, 2))), cells));
  };

  const pick = (s) => {
    if (picking === "start" || !trip.puDate || s < trip.puDate) {
      trip.puDate = s;
      if (trip.rtDate && trip.rtDate < s) trip.rtDate = null;
      picking = "end";
    } else {
      trip.rtDate = s;
      picking = "start";
    }
    onChange && onChange();
    draw();
  };

  const timeSelect = (label, key) => h("label", null, label,
    h("select", { class: "select", onchange: (e) => { trip[key] = e.target.value; onChange && onChange(); draw(); } },
      TIMES.map((t) => h("option", { value: t, selected: trip[key] === t ? "selected" : null }, fmtTime(t)))));

  const draw = () => {
    const second = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    const atStart = view.getFullYear() === new Date().getFullYear() && view.getMonth() === new Date().getMonth();
    const wide = window.matchMedia("(min-width: 744px)").matches;
    set(root, 
      h("div", { class: "cal-head" },
        h("button", { type: "button", class: "cal-nav", "aria-label": "Previous month", disabled: atStart,
          onclick: () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); draw(); } }, icon("left", "2")),
        h("span", { class: "cal-hint" }, picking === "start" ? "Choose your pick-up date" : "Choose your return date"),
        h("button", { type: "button", class: "cal-nav", "aria-label": "Next month",
          onclick: () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); draw(); } }, icon("right", "2"))),
      h("div", { class: "cal-months" }, month(view), wide && month(second)),
      h("div", { class: "cal-times" }, timeSelect("Pick-up time", "puTime"), timeSelect("Return time", "rtTime")),
      h("div", { class: "cal-foot" },
        h("span", { class: "cal-hint" }, trip.puDate && trip.rtDate
          ? `${rentalDays(tripPu(trip), tripRt(trip))} day${rentalDays(tripPu(trip), tripRt(trip)) === 1 ? "" : "s"}`
          : "Times are the branch's local time"),
        h("button", { type: "button", class: "btn btn-line", style: { padding: "9px 20px" }, onclick: () => onDone && onDone() }, "Done")));
  };
  draw();
  root.setFocus = (f) => { picking = f; draw(); };
  return root;
}

// ─── Search pill ─────────────────────────────────────────────────────────────
function SearchPill({ where, trip, category, compact, onSearch }) {
  const state = { where: where || "", trip: { ...trip }, category: category || "" };
  const root = h("div", { class: `search${compact ? " compact" : ""}` });
  let cal = null, openSeg = null;
  const errorEl = h("div", { class: "search-error", role: "alert" });

  const whereInput = h("input", {
    id: compact ? "where-c" : "where", type: "text", placeholder: "City or airport code", autocomplete: "off",
    value: state.where, maxlength: "100", enterkeyhint: "search",
    oninput: (e) => { state.where = e.target.value; errorEl.textContent = ""; },
    onkeydown: (e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } },
  });
  const puValue = h("span", { class: "seg-value" });
  const rtValue = h("span", { class: "seg-value" });
  const paint = () => {
    const t = state.trip;
    puValue.textContent = t.puDate ? `${fmtShort(t.puDate)}, ${fmtTime(t.puTime)}` : "Add date";
    puValue.classList.toggle("empty", !t.puDate);
    rtValue.textContent = t.rtDate ? `${fmtShort(t.rtDate)}, ${fmtTime(t.rtTime)}` : "Add date";
    rtValue.classList.toggle("empty", !t.rtDate);
  };
  const close = () => {
    if (cal) { cal.remove(); cal = null; }
    if (openSeg) { openSeg.classList.remove("is-open"); openSeg.setAttribute("aria-expanded", "false"); openSeg = null; }
  };
  const open = (seg, focus) => {
    if (openSeg) openSeg.classList.remove("is-open");
    openSeg = seg; seg.classList.add("is-open"); seg.setAttribute("aria-expanded", "true");
    if (!cal) {
      cal = Calendar({ trip: state.trip, focus, onChange: () => { paint(); errorEl.textContent = ""; }, onDone: close });
      root.append(cal);
    } else cal.setFocus(focus);
  };
  const puSeg = h("button", { type: "button", class: "seg", "aria-haspopup": "dialog", "aria-expanded": "false",
    onclick: (e) => { e.stopPropagation(); openSeg === puSeg ? close() : open(puSeg, "start"); } },
    h("span", { class: "seg-label" }, "Pick-up"), puValue);
  const rtSeg = h("button", { type: "button", class: "seg", "aria-haspopup": "dialog", "aria-expanded": "false",
    onclick: (e) => { e.stopPropagation(); openSeg === rtSeg ? close() : open(rtSeg, "end"); } },
    h("span", { class: "seg-label" }, "Return"), rtValue);

  const submit = () => {
    const t = state.trip;
    if (!state.where.trim()) { errorEl.textContent = "Where are you renting? Enter a city or airport code."; whereInput.focus(); return; }
    if (!t.puDate || !t.rtDate) { errorEl.textContent = "Choose your pick-up and return dates."; open(t.puDate ? rtSeg : puSeg, t.puDate ? "end" : "start"); return; }
    if (tripRt(t) <= tripPu(t)) { errorEl.textContent = "Choose a return time after the pick-up."; open(rtSeg, "end"); return; }
    close();
    onSearch({ where: state.where.trim(), trip: { ...t }, category: state.category });
  };

  add(root,
    h("form", { class: "search-pill", role: "search", onsubmit: (e) => { e.preventDefault(); submit(); } },
      h("div", { class: "seg", onclick: () => whereInput.focus() },
        h("label", { class: "seg-label", for: whereInput.id }, "Where"), whereInput),
      puSeg, rtSeg,
      h("button", { type: "submit", class: "search-go", "aria-label": "Search" }, icon("search", "2.6"), h("span", { class: "go-text" }, "Search"))),
    errorEl);
  paint();
  // On a phone the results page shows a one-line summary until it is tapped.
  if (compact) {
    root.classList.add("collapsed");
    const t = state.trip;
    root.prepend(h("button", { type: "button", class: "search-summary", onclick: () => { root.classList.remove("collapsed"); whereInput.focus(); } },
      icon("search", "2.2"),
      h("span", null, h("b", null, state.where || "Where to?"), h("small", null, t.puDate && t.rtDate ? tripRange(t) : "Add dates"))));
  }
  const outside = (e) => { if (cal && !root.contains(e.target)) close(); };
  document.addEventListener("click", outside);
  onCleanup(() => document.removeEventListener("click", outside));
  root.setCategory = (c) => { state.category = c; };
  root.openDates = () => { root.classList.remove("collapsed"); open(puSeg, "start"); };
  root.focusWhere = () => { root.classList.remove("collapsed"); whereInput.focus(); whereInput.select(); };
  root.submit = submit;
  root.state = state;
  return root;
}

function searchParams({ where, trip, category }) {
  return { where, pu: tripPu(trip), rt: tripRt(trip), cat: category || null };
}

// ─── Home ────────────────────────────────────────────────────────────────────
function HomePage(q) {
  const trip = tripFrom(q);
  let cats = catList(q.get("cat"));
  const pill = SearchPill({ where: q.get("where") || "", trip, category: cats.join(","), onSearch: (s) => go("/search", searchParams(s)) });
  const catRow = h("div", { class: "cats", role: "group", "aria-label": "Vehicle type" });
  // Each type toggles on its own; the search button runs the search with them.
  const drawCats = () => {
    set(catRow, CATEGORIES.map((c, i) => {
      const on = cats.includes(c);
      return h("button", {
        type: "button", class: `cat${on ? " active" : ""}`, "aria-pressed": on ? "true" : "false",
        onclick: (e) => {
          cats = CATEGORIES.filter((x) => (x === c ? !on : cats.includes(x)));
          pill.setCategory(cats.join(","));
          drawCats();
          // Redrawing drops focus; give it back to a keyboard user (detail 0).
          if (!e.detail) catRow.children[i].focus();
        },
      }, icon(c, "1.5"), c);
    }));
  };
  drawCats();

  const stepItem = (n, ic, title, text) => h("li", null,
    h("span", { class: "step-icon", "aria-hidden": "true" }, icon(ic, "1.8")),
    h("span", { class: "step-n" }, "Step " + n), h("h3", null, title), h("p", null, text));
  const point = (title, text) => h("div", { class: "point" }, h("h3", null, title), h("p", null, text));

  return h("div", { class: "home" },
    h("section", { class: "hero" }, h("div", { class: "wrap" },
      h("div", { class: "hero-top" },
        h("div", null,
          h("span", { class: "kicker" }, "Rent a vehicle"),
          h("h1", { style: { marginTop: "22px" } }, "Book it here. Skip the counter."))),
      pill,
      h("div", { class: "types" }, h("span", { class: "types-label" }, "Browse by type"), catRow),
      h("div", { class: "hero-checkin" },
        h("a", { class: "btn btn-motion", href: APP_URL },
          h("span", { class: "bm-fill", "aria-hidden": "true" }),
          h("span", { class: "bm-icon" }, icon("phone", "1.8")),
          h("span", null, "Check in with the app"))))),

    h("section", { class: "band" }, h("div", { class: "wrap split" },
      h("div", { class: "split-head" },
        h("span", { class: "kicker" }, "How renting works"),
        h("h2", null, "Book in minutes. Pick up in minutes."),
        h("p", { class: "lead" }, "Booking and check-in happen on your phone. At the branch, you just pay and grab the keys.")),
      h("ol", { class: "steps" },
        stepItem("1", "search", "Search", "Tell us where and when. You'll only see locations with a vehicle available for your dates."),
        stepItem("2", "calendar", "Reserve", "Pick a vehicle and your coverages, confirm your number with a texted code, and you're booked."),
        stepItem("3", "phone", "Pick up", "At pickup, tap the link we text you, scan your licence, photograph any damage and sign.")))),

    h("section", { class: "band" }, h("div", { class: "wrap" },
      h("span", { class: "kicker kicker-plain" }, "Why book on fleetr"),
      h("p", { class: "statement" },
        "Check-in and return are where rentals slow down. With fleetr, ",
        h("span", { class: "hl" }, "you do both on your phone"), "."),
      h("div", { class: "points" },
        point("No line", "Your licence, coverages and signature are done on your phone, so pickup takes minutes, not a queue."),
        point("Return on your own", "Park, check in the vehicle on your phone and go. Your return time locks the moment you finish, so you never pay for waiting on staff."),
        point("Everything by text", "Your confirmation, reminders and check-in link all come by text. No app to download, no account to make.")))),

    h("section", { class: "ink-band" }, h("div", { class: "wrap grid" },
      h("div", null,
        h("span", { class: "kicker" }, "For businesses"),
        h("h2", { style: { marginTop: "18px" } }, "Run a rental company? Or a dealership that could be one?"),
        h("p", null, "fleetr automates the whole rental, from booking to return, and lists your vehicles here for renters to book. For dealerships, that means the cars on your lot can earn while they wait to sell.")),
      h("div", { class: "actions" },
        h("a", { class: "btn btn-primary", href: "#/rental-companies" }, "For Rental Companies"),
        h("a", { class: "btn btn-line", href: "#/dealerships" }, "For Dealerships")))));
}

// ─── Search results ──────────────────────────────────────────────────────────
// Skeletons stand in for the page while it loads. The words are still there
// for screen readers; the blocks are hidden from them.
const sk = (cls, width) => h("div", { class: `sk ${cls}`, style: width ? { width } : null });
function loadingShell(text, ...blocks) {
  return h("div", { class: "sk-page", role: "status" }, h("span", { class: "sr-only" }, text), h("div", { "aria-hidden": "true" }, ...blocks));
}
const skeletonResults = () => loadingShell("Finding vehicles\u2026",
  h("div", { class: "results-head" }, sk("sk-title", "62%"), sk("sk-line", "38%")),
  h("div", { class: "cards" }, [0, 1, 2, 3].map(() => h("div", null,
    h("div", { class: "sk card-photo" }), sk("sk-line", "70%"), sk("sk-line", "40%"), sk("sk-line", "100%")))));
const skeletonBranch = () => loadingShell("Loading\u2026",
  sk("sk-line", "120px"), sk("sk-title", "55%"), sk("sk-line", "30%"), h("div", { class: "sk hero-photo" }),
  h("div", { class: "branch-cols" },
    h("div", null, sk("sk-title", "40%"), [0, 1, 2, 3].map(() => sk("sk-row"))),
    h("div", null, sk("sk-box"))));
const skeletonCheckout = () => loadingShell("Loading\u2026",
  sk("sk-line", "70px"), sk("sk-title", "45%"),
  h("div", { class: "co-cols", style: { marginTop: "30px" } },
    h("div", { class: "field-grid" }, [0, 1, 2, 3].map(() => sk("sk-field"))),
    h("div", null, sk("sk-box"))));

// Where the searched place is, so the map can open on it even when nothing
// was found. OpenStreetMap's Nominatim, Canada and the US only, one lookup
// per place per visit. A three or four letter search is read as an airport
// code.
const ATLANTIC = [47.2, -61.0];
const geoCache = {};
async function geocode(place) {
  const key = place.trim().toLowerCase();
  if (!key) return null;
  if (key in geoCache) return geoCache[key];
  try { const s = sessionStorage.getItem(`fleetr.geo.${key}`); if (s) return (geoCache[key] = JSON.parse(s)); } catch (e) { /* private mode */ }
  const term = /^[a-z]{3,4}$/.test(key) ? `${key.toUpperCase()} airport` : place.trim();
  let hit = null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ca,us&q=${encodeURIComponent(term)}`,
      { headers: { "Accept-Language": "en-CA" } });
    const out = await res.json();
    if (Array.isArray(out) && out[0]) hit = [Number(out[0].lat), Number(out[0].lon)];
  } catch (e) { hit = null; }
  geoCache[key] = hit;
  try { sessionStorage.setItem(`fleetr.geo.${key}`, JSON.stringify(hit)); } catch (e) { /* private mode */ }
  return hit;
}
// How each vehicle type reads in a sentence.
const CATEGORY_NOUN = { Car: "car", SUV: "SUV", Truck: "truck", Van: "van", Luxury: "luxury vehicle", Other: "vehicle of that type" };
const CATEGORY_ONE  = { Car: "a car", SUV: "an SUV", Truck: "a truck", Van: "a van", Luxury: "a luxury vehicle", Other: "a vehicle of that type" };
// "a car", "a car or an SUV", "a car, an SUV or a van".
const orList = (words) => (words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} or ${words[words.length - 1]}`);
const placeName = (s) => (/^[a-z]{3,4}$/i.test(s.trim()) ? s.trim().toUpperCase() : s.trim());

function SearchPage(q) {
  const where = (q.get("where") || "").trim();
  const trip = tripFrom(q);
  const cats = catList(q.get("cat"));
  const category = cats.join(",");
  let sort = q.get("sort") || "recommended";
  const params = (extra) => ({ ...searchParams({ where, trip, category }), sort: sort === "recommended" ? null : sort, ...extra });
  const place = placeName(where);

  const pill = SearchPill({ where, trip, category, compact: true, onSearch: (s) => go("/search", { ...searchParams(s), sort: params().sort }) });
  const listEl = h("div", { class: "results-list" }, skeletonResults());
  const mapBox = h("div", { class: "map", role: "region", "aria-label": "Map" });
  const mapCol = h("div", { class: "results-map" }, mapBox);
  const layout = h("div", { class: "results" }, listEl, mapCol);
  const toggle = h("button", { type: "button", class: "map-toggle", style: { display: "none" } });

  const sortSel = h("select", { class: "select", "aria-label": "Sort", onchange: (e) => { sort = e.target.value; go("/search", params()); } },
    [["recommended", "Recommended"], ["price_asc", "Price, low to high"], ["price_desc", "Price, high to low"]]
      .map(([v, l]) => h("option", { value: v, selected: sort === v ? "selected" : null }, l)));
  const chips = h("div", { class: "filters", role: "group", "aria-label": "Vehicle type" },
    h("button", { type: "button", class: `chip plain${!cats.length ? " active" : ""}`, "aria-pressed": cats.length ? "false" : "true",
      onclick: () => go("/search", params({ cat: null })) }, "All types"),
    // Each type toggles on its own, so several can be on at once.
    CATEGORIES.map((c) => {
      const on = cats.includes(c);
      return h("button", { type: "button", class: `chip${on ? " active" : ""}`, "aria-pressed": on ? "true" : "false",
        onclick: () => go("/search", params({ cat: CATEGORIES.filter((x) => (x === c ? !on : cats.includes(x))).join(",") || null })) }, icon(c, "1.6"), c);
    }),
    h("label", { class: "sort" }, "Sort", sortSel));

  const page = h("div", null,
    h("div", { class: "results-top" }, h("div", { class: "wrap" }, pill, chips)),
    h("div", { class: "wrap" }, layout),
    toggle);

  // The map always shows real tiles: the branches when there are any, else
  // the searched place, else Atlantic Canada while that is looked up.
  const markers = {}, cards = {};
  const buildMap = (el, branches) => {
    const pinned = branches.filter(hasPin);
    const map = makeMap(el, ATLANTIC, 5);
    if (!map) return null;
    pinned.forEach((b) => {
      const pinEl = h("span", { class: "price-pin" }, money(b.lowestDailyRate));
      const marker = window.L.marker([Number(b.latitude), Number(b.longitude)], {
        icon: window.L.divIcon({ className: "pin-wrap", html: pinEl, iconSize: null }), keyboard: true, title: b.name,
      }).addTo(map);
      marker.bindPopup(() => h("div", { style: { minWidth: "190px" } },
        h("div", { style: { fontFamily: "var(--display)", fontSize: "18px" } }, b.name),
        h("div", { style: { color: "var(--ink-55)" } }, cityOf(b)),
        h("div", { style: { margin: "6px 0 10px" } }, "from ", h("b", null, money(b.lowestDailyRate)), " / day"),
        h("a", { href: branchHref(b.locationId, trip, category), class: "link-arrow" }, "See vehicles")));
      marker.on("mouseover", () => hot(b.locationId, true));
      marker.on("mouseout", () => hot(b.locationId, false));
      markers[b.locationId] = pinEl;
    });
    if (pinned.length > 1) map.fitBounds(pinned.map((b) => [Number(b.latitude), Number(b.longitude)]), { padding: [56, 56], maxZoom: 13 });
    else if (pinned.length === 1) map.setView([Number(pinned[0].latitude), Number(pinned[0].longitude)], 13);
    else if (where) {
      geocode(where).then((c) => {
        if (!c || !el.isConnected) return;
        map.setView(c, 11);
        window.L.marker(c, { icon: window.L.divIcon({ className: "pin-wrap", html: h("span", { class: "here-pin" }), iconSize: null }), title: place, keyboard: false }).addTo(map);
      });
    }
    setTimeout(() => map.invalidateSize(), 0);
    return map;
  };
  const hot = (id, on) => {
    if (markers[id]) markers[id].classList.toggle("hot", on);
    if (cards[id]) cards[id].classList.toggle("hot", on);
  };

  let sideMap = null;
  const wide = window.matchMedia("(min-width: 1140px)");
  const ensureSideMap = (branches) => {
    if (sideMap) { setTimeout(() => sideMap.invalidateSize(), 0); return; }
    sideMap = buildMap(mapBox, branches);
  };

  const emptyView = ({ kicker, title, text, branches }) => {
    const small = h("div", { class: "map" });
    const view = h("div", { class: "empty-state" },
      h("span", { class: "kicker" }, kicker),
      h("h1", null, title),
      h("p", null, text),
      h("div", { class: "empty-actions" },
        h("button", { type: "button", class: "btn btn-primary", onclick: () => { window.scrollTo({ top: 0, behavior: "smooth" }); pill.openDates(); } }, icon("calendar", "1.8"), "Try other dates"),
        h("button", { type: "button", class: "btn btn-line", onclick: () => { window.scrollTo({ top: 0, behavior: "smooth" }); pill.focusWhere(); } }, "Search somewhere else"),
        cats.length > 0 && h("button", { type: "button", class: "btn-text", onclick: () => go("/search", params({ cat: null })) }, "Show all vehicle types")),
      h("div", { class: "empty-map" }, small),
      h("p", { class: "empty-note" }, `Run a rental company${where ? ` in ${place}` : ""}? `,
        h("a", { class: "link-arrow", href: "#/rental-companies" }, "List your fleet on fleetr")));
    // A timeout, not an animation frame: frames are paused in a background
    // tab, which left the map unbuilt until the tab was looked at.
    setTimeout(() => {
      if (wide.matches) ensureSideMap(branches);
      else buildMap(small, branches);
    }, 0);
    return view;
  };

  if (!where) {
    set(listEl, emptyView({ kicker: "Search", title: "Where are you renting?", text: "Enter a city, a town or an airport code to see what's free for your dates.", branches: [] }));
    return page;
  }

  rpc("public_search_branches", { p_query: where, p_pickup: asTimestamp(tripPu(trip)), p_return: asTimestamp(tripRt(trip)), p_categories: cats.length ? cats : null })
    .then((res) => {
      if (!res || !res.ok) {
        set(listEl, emptyView({ kicker: "Check your search", title: "That search didn't work.", text: reasonText(res && res.reason), branches: [] }));
        return;
      }
      const all = res.branches || [];
      let open = all.filter((b) => b.available);
      if (sort === "price_asc") open = [...open].sort((a, b) => a.lowestDailyRate - b.lowestDailyRate);
      if (sort === "price_desc") open = [...open].sort((a, b) => b.lowestDailyRate - a.lowestDailyRate);
      const days = rentalDays(tripPu(trip), tripRt(trip));
      if (!open.length) {
        const reasons = [...new Set(all.map((b) => b.reason).filter(Boolean))];
        let copy;
        if (!all.length) {
          copy = { kicker: "Not here yet", title: `No rental companies in ${place} on fleetr yet.`,
                   text: "We're adding more companies. Try a nearby town or another airport, or come back soon." };
        } else if (reasons.length === 1 && reasons[0] !== "no_availability") {
          copy = { kicker: "Nothing available", title: `Nothing's free in ${place} for those times.`, text: reasonText(reasons[0]) };
        } else {
          copy = { kicker: "Fully booked", title: `Every ${cats.length ? orList(cats.map((c) => CATEGORY_NOUN[c])) : "vehicle"} in ${place} is taken for those dates.`,
                   text: `Nothing is free from ${tripRange(trip)}. A day earlier or later often opens things up${cats.length ? ", or try another vehicle type" : ""}.` };
        }
        set(listEl, emptyView({ ...copy, branches: all }));
        return;
      }
      set(listEl,
        h("div", { class: "results-head" },
          h("h1", null, `${open.length} ${open.length === 1 ? "company" : "companies"} with ${cats.length ? orList(cats.map((c) => CATEGORY_ONE[c])) : "vehicles"} free in ${place}`),
          h("p", null, `${tripRange(trip)} · ${days} day${days === 1 ? "" : "s"} · prices before tax`)),
        h("div", { class: "cards" }, open.map((b) => {
          const perks = perksOf(b);
          const card = h("a", { class: "card", href: branchHref(b.locationId, trip, category),
            onmouseenter: () => hot(b.locationId, true), onmouseleave: () => hot(b.locationId, false) },
            photoBlock(b, "card-photo"),
            h("div", { class: "card-body" },
              h("div", { class: "card-name" }, b.name),
              h("div", { class: "card-sub" }, cityOf(b)),
              perks.length > 0 && h("div", { class: "tags" }, perks.map((p) => h("span", { class: "tag" }, p.name))),
              h("div", { class: "card-price" },
                h("div", null, "from ", h("b", null, money(b.lowestDailyRate)), " / day"),
                h("span", null, `${money(b.total)} total`))));
          cards[b.locationId] = card;
          return card;
        })));
      if (wide.matches) setTimeout(() => ensureSideMap(open), 0);
      let mapOpen = false;
      const paintToggle = () => set(toggle, mapOpen ? "Show list" : "Show map", icon(mapOpen ? "list" : "map", "1.8"));
      toggle.style.display = "";
      paintToggle();
      toggle.onclick = () => {
        mapOpen = !mapOpen;
        layout.classList.toggle("map-open", mapOpen);
        paintToggle();
        if (mapOpen) setTimeout(() => ensureSideMap(open), 0); else window.scrollTo(0, 0);
      };
      const onWide = () => { if (wide.matches) { layout.classList.remove("map-open"); mapOpen = false; paintToggle(); ensureSideMap(open); } };
      wide.addEventListener("change", onWide);
      onCleanup(() => wide.removeEventListener("change", onWide));
    })
    .catch(() => set(listEl, emptyView({ kicker: "Connection", title: "We couldn't reach fleetr.", text: REASONS.network, branches: [] })));

  return page;
}

function branchHref(id, trip, category, cls) {
  const qs = new URLSearchParams({ pu: tripPu(trip), rt: tripRt(trip) });
  if (category) qs.set("cat", category);
  if (cls) qs.set("cls", cls);
  return `#/branch/${encodeURIComponent(id)}?${qs}`;
}

// A page-level message: something could not be shown at all.
function emptyState(kickerText, title, text, action) {
  return h("div", { class: "center-empty" }, h("span", { class: "kicker" }, kickerText), h("h1", null, title), h("p", null, text), action || null);
}

// ─── Branch ──────────────────────────────────────────────────────────────────
function BranchPage(id, q) {
  const trip = tripFrom(q);
  const root = h("div", { class: "branch" }, h("div", { class: "wrap" }, skeletonBranch()));
  rpc("public_branch_detail", { p_location_id: id, p_pickup: asTimestamp(tripPu(trip)), p_return: asTimestamp(tripRt(trip)), p_category: null })
    .then((res) => {
      if (!res || !res.ok) {
        set(root, h("div", { class: "wrap" }, emptyState("Branch", "This branch isn't available.", reasonText(res && res.reason),
          h("a", { class: "btn btn-primary", href: "#/" }, "Start a new search"))));
        return;
      }
      set(root, branchView(id, res, trip, q));
    })
    .catch(() => set(root, h("div", { class: "wrap" }, emptyState("Connection", "Something went wrong.", REASONS.network,
      h("button", { type: "button", class: "btn btn-primary", onclick: render }, "Try again")))));
  return root;
}

function branchView(id, res, trip, q) {
  const b = res.branch;
  const classes = res.classes || [];
  const wantCats = catList(q.get("cat"));
  const wantCat = wantCats.join(",");
  let chosen = classes.find((c) => c.classId === q.get("cls")) || null;
  const days = res.days || rentalDays(tripPu(trip), tripRt(trip));
  const taxes = b.salesTaxes || [];

  // Classes, the chosen categories first.
  const ordered = wantCats.length
    ? [...classes.filter((c) => wantCats.includes(c.category)), ...classes.filter((c) => !wantCats.includes(c.category))]
    : classes;
  const rows = {};
  const classList = h("div", { class: "classes" }, ordered.map((c) => {
    const row = h("button", { type: "button", class: "class-row", "aria-pressed": "false", onclick: () => choose(c) },
      h("div", { class: "class-icon" }, icon(c.category || "Other", "1.5")),
      h("div", null,
        h("div", { class: "class-name" }, c.name),
        h("div", { class: "class-meta" },
          c.category && h("span", null, c.category),
          c.seats != null && h("span", null, `${c.seats} seats`),
          c.bags != null && h("span", null, `${c.bags} bag${c.bags === 1 ? "" : "s"}`))),
      h("div", { class: "class-price" }, h("b", null, `${money(c.dailyRate)} / day`), h("span", null, `${money(c.total, true)} total`)));
    rows[c.classId] = row;
    return row;
  }));

  const box = h("aside", { class: "book-box", "aria-label": "Reserve" });
  const bar = h("div", { class: "book-bar" });
  const choose = (c) => {
    chosen = c;
    Object.entries(rows).forEach(([k, r]) => { r.classList.toggle("chosen", k === c.classId); r.setAttribute("aria-pressed", String(k === c.classId)); });
    history.replaceState(null, "", branchHref(id, trip, wantCat, c.classId));
    drawBox();
  };
  const reserve = () => {
    if (!chosen) { classList.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    go(`/checkout/${encodeURIComponent(id)}`, { pu: tripPu(trip), rt: tripRt(trip), cls: chosen.classId });
  };
  const draftTrip = { ...trip };
  let cal = null;
  const closeCal = () => { if (cal) { cal.remove(); cal = null; } };
  const applyDates = () => {
    closeCal();
    if (!draftTrip.puDate || !draftTrip.rtDate || tripRt(draftTrip) <= tripPu(draftTrip)) return;
    if (tripPu(draftTrip) === tripPu(trip) && tripRt(draftTrip) === tripRt(trip)) return;
    location.hash = branchHref(id, draftTrip, wantCat, chosen && chosen.classId);
  };
  const drawBox = () => {
    closeCal();
    const fields = h("div", { class: "bb-fields" },
      h("div", { class: "bb-dates" },
        h("button", { type: "button", class: "bb-field", onclick: (e) => openCal(e, "start") }, h("small", null, "Pick-up"), h("span", null, `${fmtShort(trip.puDate)}, ${fmtTime(trip.puTime)}`)),
        h("button", { type: "button", class: "bb-field", onclick: (e) => openCal(e, "end") }, h("small", null, "Return"), h("span", null, `${fmtShort(trip.rtDate)}, ${fmtTime(trip.rtTime)}`))),
      classes.length > 0 && h("label", { class: "bb-class" }, h("small", null, "Vehicle"),
        h("select", { onchange: (e) => { const c = classes.find((x) => x.classId === e.target.value); if (c) choose(c); } },
          !chosen && h("option", { value: "", selected: "selected" }, "Choose a vehicle"),
          classes.map((c) => h("option", { value: c.classId, selected: chosen && chosen.classId === c.classId ? "selected" : null }, `${c.name} \u00b7 ${money(c.dailyRate)}/day`)))));
    const openCal = (e, focus) => {
      e.stopPropagation();
      if (cal) { cal.setFocus(focus); return; }
      cal = Calendar({ trip: draftTrip, focus, onChange: () => {}, onDone: applyDates });
      fields.append(cal);
    };
    const qte = chosen && quote(chosen, days, [], taxes);
    const lowest = classes.length ? Math.min(...classes.map((c) => Number(c.dailyRate))) : null;
    set(box, 
      h("div", { class: "bb-price" }, chosen ? money(chosen.dailyRate) : (lowest != null ? `from ${money(lowest)}` : "Not available"), (chosen || lowest != null) && h("span", null, " / day")),
      fields,
      h("button", { type: "button", class: "btn btn-primary btn-block", disabled: !classes.length, onclick: reserve }, chosen ? "Reserve" : "Choose a vehicle"),
      h("p", { class: "bb-note" }, "You won't be charged now. Pay at pickup."),
      qte && quoteLines(qte),
      qte && h("p", { class: "bb-note", style: { fontSize: "13px" } }, "Coverages are chosen at checkout."));
    set(bar, 
      h("div", null,
        h("b", null, chosen ? `${money(qte.total, true)} total` : (lowest != null ? `from ${money(lowest)} / day` : "Not available")),
        h("small", null, tripRange(trip))),
      h("button", { type: "button", class: "btn btn-primary", disabled: !classes.length, onclick: reserve }, chosen ? "Reserve" : "Choose"));
  };
  const outside = (e) => { if (cal && !box.contains(e.target)) applyDates(); };
  document.addEventListener("click", outside);
  onCleanup(() => document.removeEventListener("click", outside));
  drawBox();
  if (chosen) choose(chosen);

  // Hours, today in the branch's own time zone first in weight.
  const hours = b.hours && typeof b.hours === "object" ? b.hours : null;
  const tk = todayKey(b.timeZone);
  const hoursEl = hours
    ? h("div", { class: "hours" }, HOURS_DAYS.map(([k, name]) => {
        const d = hours[k];
        const open = d && d.open && d.close;
        return [h("span", { class: k === tk ? "today" : null }, name),
                h("span", { class: `${k === tk ? "today" : ""} ${open ? "" : "closed"}` }, open ? `${fmtTime(String(d.open).slice(0, 5))} \u2013 ${fmtTime(String(d.close).slice(0, 5))}` : "Closed")];
      }))
    : h("p", null, "Open every day.");

  const otherPrices = classes.map((c) => Number(c.otherDriverPrice)).filter((n) => Number.isFinite(n) && n > 0);
  const otherDriverText = chosen && Number(chosen.otherDriverPrice) > 0
    ? `${money(chosen.otherDriverPrice, true)} per day for each additional driver on the ${chosen.name}, added at pickup.`
    : otherPrices.length
      ? `From ${money(Math.min(...otherPrices), true)} per day for each additional driver, added at pickup.`
      : "Additional drivers can be added at pickup.";
  const facts = [
    b.minimumAge != null && { icon: "id", name: "Minimum age", text: `${b.minimumAge} years old` },
    b.deposit != null && Number(b.deposit) > 0 && { icon: "deposit", name: "Deposit", text: `${money(b.deposit, true)}, held at pickup` },
    b.paymentMethods && b.paymentMethods.length && { icon: "card", name: "Payment", text: b.paymentMethods.join(", ") },
    { icon: "driver", name: "Additional drivers", text: otherDriverText },
  ].filter(Boolean);

  const mapEl = h("div", { class: "branch-map map" });
  const perks = perksOf(b);
  const content = h("div", null,
    res.reason && h("div", { class: "notice", role: "alert", style: { marginBottom: "28px" } }, `${reasonText(res.reason)}${res.reason === "too_soon" ? ` This branch needs ${b.minNoticeHours} hour${b.minNoticeHours === 1 ? "" : "s"} notice.` : ""}${res.reason === "too_long" ? ` The longest rental here is ${b.maxRentalDays} days.` : ""}`),
    h("section", { class: "sec", id: "vehicles" },
      h("h2", null, "Free for your dates"),
      h("p", { class: "sec-sub" }, `${tripRange(trip)} \u00b7 ${days} day${days === 1 ? "" : "s"} \u00b7 prices before tax`),
      classes.length ? classList : h("p", null, res.reason ? "Change your dates to see what's available." : "Nothing is free for these dates. Try different dates.")),
    b.description && h("section", { class: "sec" }, h("h2", null, "About this branch"), h("p", null, b.description)),
    perks.length > 0 && h("section", { class: "sec" }, h("h2", null, "What this branch offers"),
      h("div", { class: "perks two" }, perks.map((p) => h("div", { class: "perk" }, icon(p.icon, "1.5"), h("div", null, h("b", null, p.name), h("span", null, p.text)))))),
    h("section", { class: "sec" }, h("h2", null, "Hours"), hoursEl),
    h("section", { class: "sec" }, h("h2", null, "Requirements"),
      h("div", { class: "perks two" }, facts.map((f) => h("div", { class: "perk" }, icon(f.icon, "1.5"), h("div", null, h("b", null, f.name), h("span", null, f.text)))))),
    (hasPin(b) || b.address) && h("section", { class: "sec" }, h("h2", null, "Where you'll pick up"),
      b.address && h("p", { style: { marginBottom: "8px" } }, b.address),
      hasPin(b) && mapEl));

  const view = h("div", { class: "wrap" },
    h("div", { class: "branch-head" },
      h("span", { class: "kicker" }, cityOf(b) || "Branch"),
      h("h1", null, b.name),
      b.address && h("div", { class: "sub" }, b.address)),
    photoBlock(b, "hero-photo"),
    h("div", { class: "branch-cols" }, content, h("div", null, box)),
    bar);

  if (hasPin(b)) {
    setTimeout(() => {
      const map = makeMap(mapEl, [Number(b.latitude), Number(b.longitude)], 14);
      if (map) window.L.marker([Number(b.latitude), Number(b.longitude)], {
        title: b.name, icon: window.L.divIcon({ className: "pin-wrap", html: h("span", { class: "here-pin" }), iconSize: null }),
      }).addTo(map);
    }, 0);
  }
  return view;
}

// ─── Checkout ────────────────────────────────────────────────────────────────
function CheckoutPage(id, q) {
  const trip = tripFrom(q);
  const clsId = q.get("cls");
  const root = h("div", { class: "checkout" }, h("div", { class: "wrap" }, skeletonCheckout()));
  rpc("public_branch_detail", { p_location_id: id, p_pickup: asTimestamp(tripPu(trip)), p_return: asTimestamp(tripRt(trip)), p_category: null })
    .then((res) => {
      const backHref = branchHref(id, trip);
      const cls = res && res.ok && (res.classes || []).find((c) => c.classId === clsId);
      if (!res || !res.ok || !cls) {
        const why = !res || !res.ok ? reasonText(res && res.reason) : res.reason ? reasonText(res.reason) : "That vehicle is no longer available for these dates.";
        set(root, h("div", { class: "wrap" }, emptyState("Checkout", "This one can't be booked.", why,
          h("a", { class: "btn btn-primary", href: backHref }, "Choose another vehicle"))));
        return;
      }
      set(root, checkoutView(id, res.branch, cls, trip, res.days || rentalDays(tripPu(trip), tripRt(trip)), backHref));
    })
    .catch(() => set(root, h("div", { class: "wrap" }, emptyState("Connection", "Something went wrong.", REASONS.network,
      h("button", { type: "button", class: "btn btn-primary", onclick: render }, "Try again")))));
  return root;
}

const fmtPhone = (d) => (d && d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d || "");

function checkoutView(id, b, cls, trip, days, backHref) {
  const taxes = b.salesTaxes || [];
  const coverages = cls.coverages || [];
  const choice = {};   // productId -> true / false
  coverages.forEach((c) => { if (c.required) choice[c.productId] = true; });
  const form = { first: "", last: "", phone: "", email: "" };
  let agreed = false;
  // Phone verification: idle -> code -> verified.
  const v = { stage: "idle", verificationId: null, phoneToken: null, phone: null, sentTo: null, sentAt: 0, busy: false };

  const accepted = () => coverages.filter((c) => choice[c.productId] === true);
  const summary = h("aside", { class: "book-box" });
  const drawSummary = () => {
    set(summary, 
      h("div", { class: "summary-head" },
        h("div", { class: "thumb" }, photoUrl(b.photoPath) ? h("img", { src: photoUrl(b.photoPath), alt: "" }) : h("div", { class: "placeholder-photo" }, icon(cls.category || "Car", "1.2"))),
        h("div", null, h("b", null, cls.name), h("span", null, [cls.category, cls.seats != null && `${cls.seats} seats`, cls.bags != null && `${cls.bags} bags`].filter(Boolean).join(" \u00b7 ")),
          h("div", { style: { fontSize: "14px", marginTop: "2px" } }, b.name))),
      h("div", { class: "sum-dates" },
        h("div", null, h("small", null, "Pick-up"), fmtDay(trip.puDate), h("br"), fmtTime(trip.puTime)),
        h("div", null, h("small", null, "Return"), fmtDay(trip.rtDate), h("br"), fmtTime(trip.rtTime))),
      quoteLines(quote(cls, days, accepted(), taxes)),
      h("p", { class: "bb-note" }, "You won't be charged now. Pay at pickup."));
  };
  drawSummary();

  // The steps are numbered in order; Coverages only appears when there are any.
  let stepNo = 0;
  const stepHead = (title) => h("div", { class: "co-step-head" }, h("span", { class: "n", "aria-hidden": "true" }, String(++stepNo)), h("h2", null, title));

  // Details
  const errs = {};
  const field = (key, label, attrs) => {
    const err = h("span", { class: "err", role: "alert" });
    const input = h("input", { class: "input", ...attrs, oninput: (e) => {
      form[key] = e.target.value; err.textContent = ""; input.classList.remove("invalid");
      if (key === "phone" && v.stage !== "idle") resetVerify();
    } });
    errs[key] = (msg) => { err.textContent = msg || ""; input.classList.toggle("invalid", !!msg); };
    return h("label", { class: "field" }, h("span", null, label), input, err);
  };
  const details = h("section", { class: "co-step" },
    stepHead("Your details"),
    h("div", { class: "field-grid" },
      field("first", "First name", { autocomplete: "given-name", maxlength: "60" }),
      field("last", "Last name", { autocomplete: "family-name", maxlength: "60" }),
      field("phone", "Mobile phone", { type: "tel", autocomplete: "tel", inputmode: "tel", placeholder: "(709) 555-0100" }),
      field("email", "Email", { type: "email", autocomplete: "email", maxlength: "200" })),
    h("p", { class: "hint" }, "Use the name on your driver's licence. We'll text your confirmation to this number."));

  // Coverages
  const covErr = h("div", { class: "err", role: "alert", style: { marginTop: "12px" } });
  const covCards = coverages.map((c) => {
    const card = h("div", { class: "cov" });
    const draw = () => {
      set(card, 
        h("div", { class: "cov-head" }, h("b", null, c.name), h("span", null, `${money(c.pricePerDay, true)} / day`)),
        c.wording && h("p", null, c.wording),
        c.required
          ? h("span", { class: "included" }, "Included with this rental")
          : h("div", { class: "segs", role: "group", "aria-label": c.name },
              h("button", { type: "button", class: choice[c.productId] === true ? "on" : "", "aria-pressed": String(choice[c.productId] === true),
                onclick: () => { choice[c.productId] = true; covErr.textContent = ""; draw(); drawSummary(); } }, "Accept"),
              h("button", { type: "button", class: choice[c.productId] === false ? "on" : "", "aria-pressed": String(choice[c.productId] === false),
                onclick: () => { choice[c.productId] = false; covErr.textContent = ""; draw(); drawSummary(); } }, "Decline")));
    };
    draw();
    return card;
  });
  const protection = coverages.length > 0 && h("section", { class: "co-step" },
    stepHead("Coverages"),
    h("p", { class: "muted", style: { marginBottom: "18px" } }, "Choose what's covered. Each is charged per day, and you can still change your choices when you check in."),
    covCards, covErr);

  // Terms
  const termsErr = h("div", { class: "err", role: "alert", style: { marginTop: "10px" } });
  const terms = h("section", { class: "co-step" },
    stepHead("Before you book"),
    h("div", { class: "notice soft" }, h("b", null, "Free cancellation. "), "Cancel any time before pickup with the link in your confirmation text."),
    h("label", { class: "check" },
      h("input", { type: "checkbox", onchange: (e) => { agreed = e.target.checked; termsErr.textContent = ""; } }),
      h("span", null, `I agree to the fleetr booking terms: this is a reservation with ${b.name}, I'll sign their rental agreement and pay at pickup, and I meet their requirements${b.minimumAge != null ? ` (minimum age ${b.minimumAge})` : ""}.`)),
    termsErr);

  // Verify and reserve
  const verify = h("section", { class: "co-step" });
  const verifyHead = stepHead("Verify your phone and reserve");
  const tsBox = h("div", { class: "ts" });
  let tsWidget = null, tsToken = null, tsTimer = null;
  const mountTurnstile = () => {
    if (tsWidget != null) return;
    const tryMount = () => {
      if (!window.turnstile || !tsBox.isConnected) return false;
      tsWidget = window.turnstile.render(tsBox, {
        sitekey: TURNSTILE_KEY, action: "phone_send", theme: "light",
        callback: (t) => { tsToken = t; drawVerify(); },
        "expired-callback": () => { tsToken = null; drawVerify(); },
        "error-callback": () => { tsToken = null; drawVerify(); },
      });
      return true;
    };
    if (!tryMount()) {
      tsTimer = setInterval(() => { if (tryMount()) { clearInterval(tsTimer); tsTimer = null; } }, 250);
    }
  };
  onCleanup(() => {
    if (tsTimer) clearInterval(tsTimer);
    if (tsWidget != null && window.turnstile) { try { window.turnstile.remove(tsWidget); } catch (e) { /* ignore */ } }
  });
  const resetTurnstile = () => { tsToken = null; if (tsWidget != null && window.turnstile) window.turnstile.reset(tsWidget); };
  const resetVerify = () => { Object.assign(v, { stage: "idle", verificationId: null, phoneToken: null, phone: null }); resetTurnstile(); drawVerify(); };

  const verifyMsg = h("div", { role: "alert" });
  const say = (text, bad) => {
    set(verifyMsg, text ? h("div", { class: `notice${bad ? "" : " soft"}`, style: { marginTop: "14px" } }, text) : null);
  };

  const validate = () => {
    let ok = true, first = null;
    const fail = (key, msg) => { errs[key](msg); ok = false; first = first || key; };
    if (!form.first.trim()) fail("first", "Enter your first name.");
    if (!form.last.trim()) fail("last", "Enter your last name.");
    const digits = form.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
    if (digits.length !== 10) fail("phone", "Enter a 10-digit Canadian or US mobile number.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) fail("email", "Enter a valid email address.");
    const undecided = coverages.filter((c) => !c.required && choice[c.productId] == null);
    if (undecided.length) { covErr.textContent = `Choose Accept or Decline for ${undecided.map((c) => c.name).join(", ")}.`; if (ok) first = "cov"; ok = false; }
    if (!agreed) { termsErr.textContent = "Agree to the booking terms to continue."; if (ok) first = "terms"; ok = false; }
    if (!ok) {
      const target = first === "cov" ? protection : first === "terms" ? terms : details;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return ok;
  };

  const sendCode = async () => {
    if (v.busy || !validate()) return;
    if (!tsToken) { say("Finish the security check above, then try again.", true); return; }
    v.busy = true; say(""); drawVerify();
    let out;
    try { out = await worker("/phone/send", { phone: form.phone, turnstileToken: tsToken }); }
    catch (e) { out = { ok: false, message: REASONS.network }; }
    v.busy = false;
    resetTurnstile();
    if (!out.ok) {
      if (out.reason === "bad_phone") errs.phone(out.message);
      say(out.message || REASONS.try_again, true); drawVerify(); return;
    }
    Object.assign(v, { stage: "code", verificationId: out.verificationId, sentTo: form.phone, sentAt: Date.now() });
    drawVerify();
  };

  let codeValue = "";
  const confirmCode = async () => {
    if (v.busy) return;
    if (!/^\d{6}$/.test(codeValue)) { say("Enter the 6-digit code from the text.", true); return; }
    if (!validate()) return;
    v.busy = true; say(""); drawVerify();
    let out;
    try { out = await worker("/phone/verify", { verificationId: v.verificationId, code: codeValue }); }
    catch (e) { out = { ok: false, message: REASONS.network }; }
    if (!out.ok) {
      v.busy = false;
      if (["expired", "too_many_attempts", "invalid"].includes(out.reason)) { Object.assign(v, { stage: "idle", verificationId: null }); }
      codeValue = "";
      const left = out.attemptsLeft != null ? ` ${out.attemptsLeft} ${out.attemptsLeft === 1 ? "try" : "tries"} left.` : "";
      say((out.message || REASONS.try_again) + left, true); drawVerify(); return;
    }
    Object.assign(v, { stage: "verified", phoneToken: out.phoneToken, phone: out.phone });
    await book();
  };

  const book = async () => {
    v.busy = true; say(""); drawVerify();
    let res;
    try {
      res = await rpc("public_create_booking", {
        p_location_id: id, p_class_id: cls.classId,
        p_pickup: asTimestamp(tripPu(trip)), p_return: asTimestamp(tripRt(trip)),
        p_first_name: form.first.trim(), p_last_name: form.last.trim(), p_email: form.email.trim(),
        p_phone: v.phone, p_phone_token: v.phoneToken,
        p_coverages: accepted().filter((c) => !c.required).map((c) => c.productId),
      });
    } catch (e) { res = { ok: false, reason: "network" }; }
    v.busy = false;
    if (!res || !res.ok) {
      const reason = res && res.reason;
      if (reason === "phone_not_verified") Object.assign(v, { stage: "idle", verificationId: null, phoneToken: null, phone: null });
      if (["bad_name", "bad_email"].includes(reason)) errs[reason === "bad_name" ? "first" : "email"](reasonText(reason));
      say(reasonText(reason), true);
      drawVerify();
      return;
    }
    // Ask the worker to text the confirmation now rather than on its next
    // 30-minute run. The verified phone token is the proof; the worker's
    // claim stops a second text. Not awaited: the booking is already made.
    fetch(`${WORKER}/reservation-confirmation`, {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
      body: JSON.stringify({ resCode: res.resCode, phoneToken: v.phoneToken }),
    }).catch(() => { /* the 30-minute run still sends it */ });
    const qte = quote(cls, res.days || days, accepted(), taxes);
    saveConfirmation({
      resCode: res.resCode, appToken: res.appToken || null,
      branch: { name: b.name, address: b.address, city: cityOf(b), timeZone: b.timeZone, photoPath: b.photoPath, logoPath: b.logoPath },
      className: cls.name, category: cls.category, trip, days: res.days || days,
      lines: qte.lines, taxLines: qte.taxLines, total: qte.total,
      firstName: form.first.trim(), phone: v.phone, email: form.email.trim(),
    });
    go("/confirmed");
  };

  let countdown = null;
  onCleanup(() => { if (countdown) clearInterval(countdown); });
  const drawVerify = () => {
    if (countdown) { clearInterval(countdown); countdown = null; }
    const kids = [verifyHead];
    if (v.stage === "idle") {
      kids.push(
        h("p", { class: "muted" }, "We'll text you a 6-digit code to confirm it's your number. Message and data rates may apply."),
        tsBox,
        h("button", { type: "button", class: "btn btn-primary btn-block", disabled: v.busy, onclick: sendCode },
          v.busy ? "Sending\u2026" : "Text me a code"));
    } else {
      const waitLeft = () => Math.max(0, 60 - Math.floor((Date.now() - v.sentAt) / 1000));
      const wait = waitLeft();
      const codeInput = h("input", {
        class: "input code-input", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6",
        "aria-label": "6-digit code", value: codeValue, placeholder: "000000",
        oninput: (e) => { codeValue = e.target.value.replace(/\D/g, "").slice(0, 6); e.target.value = codeValue; if (codeValue.length === 6) confirmCode(); },
        onkeydown: (e) => { if (e.key === "Enter") confirmCode(); },
      });
      const resendBtn = h("button", { type: "button", class: "btn-text", disabled: wait > 0 || v.busy, onclick: () => { codeValue = ""; resetVerify(); } },
        wait > 0 ? `Resend code in ${wait}s` : "Send a new code");
      kids.push(
        h("div", { class: "verify-box" },
          h("p", null, `We texted a code to ${fmtPhone(form.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""))}. It expires in 10 minutes.`),
          h("div", { style: { margin: "14px 0" } }, codeInput),
          h("button", { type: "button", class: "btn btn-primary btn-block", disabled: v.busy, onclick: v.stage === "verified" ? book : confirmCode },
            v.busy ? "Reserving\u2026" : "Confirm and reserve"),
          v.stage === "code" && h("div", { style: { display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", fontSize: "14px" } },
            resendBtn,
            h("button", { type: "button", class: "btn-text", disabled: v.busy, onclick: () => { codeValue = ""; resetVerify(); details.scrollIntoView({ behavior: "smooth" }); } }, "Change number"))));
      if (v.stage === "code" && !v.busy) setTimeout(() => codeInput.isConnected && document.activeElement !== codeInput && codeValue === "" && codeInput.focus(), 0);
      // Only the resend link ticks, so typing in the code box is never interrupted.
      if (countdown) clearInterval(countdown);
      if (wait > 0 && v.stage === "code") {
        countdown = setInterval(() => {
          const left = waitLeft();
          resendBtn.textContent = left > 0 ? `Resend code in ${left}s` : "Send a new code";
          resendBtn.disabled = left > 0 || v.busy;
          if (left <= 0) { clearInterval(countdown); countdown = null; }
        }, 1000);
      }
    }
    kids.push(verifyMsg, h("p", { class: "bb-note" }, "You won't be charged now. Pay at pickup."));
    set(verify, ...kids);
    if (v.stage === "idle") mountTurnstile();
  };
  drawVerify();

  return h("div", { class: "wrap" },
    h("a", { class: "back", href: backHref }, icon("left", "2"), h("span", null, "Back")),
    h("h1", null, "Confirm and reserve"),
    h("div", { class: "co-cols" },
      h("div", null, details, protection, terms, verify),
      h("div", { class: "co-summary" }, summary)));
}

// ─── Confirmation ────────────────────────────────────────────────────────────
let confirmation = null;
function saveConfirmation(c) {
  confirmation = c;
  try { sessionStorage.setItem("fleetr.confirmation", JSON.stringify(c)); } catch (e) { /* private mode */ }
}
function loadConfirmation() {
  if (confirmation) return confirmation;
  try { const s = sessionStorage.getItem("fleetr.confirmation"); if (s) confirmation = JSON.parse(s); } catch (e) { /* ignore */ }
  return confirmation;
}

const icsStamp = (s) => s.replace(/[-:]/g, "") + "00";
const icsEscape = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
function calendarEvent(c) {
  const title = `${c.className} rental, ${c.branch.name}`;
  const details = `Reservation ${c.resCode}. Pick up ${fmtDay(c.trip.puDate)} at ${fmtTime(c.trip.puTime)}, return ${fmtDay(c.trip.rtDate)} at ${fmtTime(c.trip.rtTime)}. Check in before you arrive: ${appLink(c)}`;
  const where = [c.branch.name, c.branch.address].filter(Boolean).join(", ");
  return { title, details, where, start: icsStamp(tripPu(c.trip)), end: icsStamp(tripRt(c.trip)), tz: c.branch.timeZone || "America/St_Johns" };
}
const appLink = (c) => (c.appToken ? `${APP_URL}/#a=${encodeURIComponent(c.appToken)}` : APP_URL);
function googleLink(c) {
  const e = calendarEvent(c);
  const qs = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${e.start}/${e.end}`, ctz: e.tz, details: e.details, location: e.where });
  return `https://calendar.google.com/calendar/render?${qs}`;
}
function downloadIcs(c) {
  const e = calendarEvent(c);
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//fleetr//booking//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${c.resCode.replace(/\s/g, "")}@fleetr.ai`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=${e.tz}:${e.start}`,
    `DTEND;TZID=${e.tz}:${e.end}`,
    `SUMMARY:${icsEscape(e.title)}`,
    `DESCRIPTION:${icsEscape(e.details)}`,
    `LOCATION:${icsEscape(e.where)}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = h("a", { href: url, download: `fleetr-${c.resCode.replace(/\s/g, "")}.ics` });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function ConfirmedPage() {
  const c = loadConfirmation();
  if (!c) {
    return h("div", { class: "wrap" }, emptyState("Confirmation", "No booking to show here.", "Your confirmation was texted to you. Start a new search to book again.",
      h("a", { class: "btn btn-primary", href: "#/" }, "Rent a vehicle")));
  }
  let menu = null;
  const calWrap = h("div", { class: "cal-menu" });
  const calBtn = h("button", { type: "button", class: "btn btn-line", "aria-haspopup": "menu", onclick: (e) => {
    e.stopPropagation();
    if (menu) { menu.remove(); menu = null; return; }
    menu = h("div", { class: "cal-menu-list", role: "menu" },
      h("a", { href: googleLink(c), target: "_blank", rel: "noopener", role: "menuitem" }, "Google Calendar"),
      h("button", { type: "button", role: "menuitem", onclick: () => { downloadIcs(c); menu.remove(); menu = null; } }, "Apple or Outlook (.ics)"));
    calWrap.append(menu);
  } }, icon("calendar", "1.8"), "Add to calendar");
  calWrap.append(calBtn);
  const outside = () => { if (menu) { menu.remove(); menu = null; } };
  document.addEventListener("click", outside);
  onCleanup(() => document.removeEventListener("click", outside));

  return h("div", { class: "wrap" }, h("div", { class: "confirm" },
    h("div", null,
      doneTick(),
      h("span", { class: "kicker" }, "Reservation confirmed"),
      h("h1", null, `You're booked${c.firstName ? `, ${c.firstName}` : ""}.`),
      h("p", { class: "lead" }, `We've texted you at ${fmtPhone(c.phone)} with your confirmation, a link to check in, and a link to cancel if your plans change.`),
      h("div", { class: "code-block" },
        h("small", null, "Reservation code"),
        h("div", { class: "code" }, c.resCode)),
      h("div", { class: "confirm-actions" },
        h("a", { class: "btn btn-primary", href: appLink(c) }, icon("phone", "1.8"), "Check in with the app"),
        calWrap),
      h("p", { class: "hint", style: { maxWidth: "34em" } },
        "Check in before you arrive to add your licence and sign, so pickup takes minutes. You can also open the app with your reservation code and last name.")),
    h("aside", { class: "book-box", style: { position: "static" } },
      h("div", { class: "summary-head" },
        h("div", { class: "thumb" }, photoUrl(c.branch.photoPath) ? h("img", { src: photoUrl(c.branch.photoPath), alt: "" }) : h("div", { class: "placeholder-photo" }, icon(c.category || "Car", "1.2"))),
        h("div", null, h("b", null, c.className), h("span", null, c.branch.name),
          c.branch.address && h("div", { style: { fontSize: "14px", color: "var(--ink-55)" } }, c.branch.address))),
      h("div", { class: "sum-dates" },
        h("div", null, h("small", null, "Pick-up"), fmtDay(c.trip.puDate), h("br"), fmtTime(c.trip.puTime)),
        h("div", null, h("small", null, "Return"), fmtDay(c.trip.rtDate), h("br"), fmtTime(c.trip.rtTime))),
      quoteLines({ lines: c.lines, taxLines: c.taxLines || [], total: c.total }),
      h("p", { class: "bb-note" }, "You won't be charged now. Pay at pickup."))));
}

// ─── For Rental Companies, For Dealerships ───────────────────────────────────
// Demo requests post to Web3Forms; the access key routes them to Connor's inbox.
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = "fe9cd01b-a672-4405-8430-5449cfa31aa2";
const DEMO_ERROR = "Something went wrong. Please email connor@fleetr.ai directly.";

function openDemoForm(e) {
  e.preventDefault();
  const close = () => { dlg.close(); dlg.remove(); };
  const status = h("p", { class: "err", role: "status", "aria-live": "polite" });
  const submit = h("button", { type: "submit", class: "btn btn-primary btn-block" }, "Send Message");
  const field = (label, input) => h("label", { class: "field" }, h("span", null, label), input);
  const form = h("form", { class: "demo-form", action: WEB3FORMS_URL, method: "POST", onsubmit: send },
    h("input", { type: "hidden", name: "access_key", value: WEB3FORMS_KEY }),
    h("input", { type: "hidden", name: "subject", value: "Demo Request from fleetr.ai" }),
    h("input", { type: "hidden", name: "from_name", value: "fleetr.ai website" }),
    h("input", { type: "checkbox", name: "botcheck", class: "demo-honeypot", tabindex: "-1", autocomplete: "off" }),
    field("Name", h("input", { class: "input", type: "text", name: "name", autocomplete: "name", required: true })),
    field("Email", h("input", { class: "input", type: "email", name: "email", autocomplete: "email", required: true })),
    field("Message", h("textarea", { class: "input", name: "message", rows: "3", placeholder: "Anything you'd like to share? (optional)" })),
    status, submit);
  const body = h("div", { class: "demo-body" },
    h("span", { class: "kicker" }, "Book a demo"),
    h("h2", { id: "demo-title" }, "See fleetr with your own fleet."),
    h("p", { class: "demo-sub" }, "Book 30 minutes with us. We'll show you exactly how it works for your operation."),
    form);
  const dlg = h("dialog", { class: "demo-dialog", "aria-labelledby": "demo-title",
    onclick: (ev) => { if (ev.target === dlg) close(); },
    onclose: () => dlg.remove() },
    h("button", { type: "button", class: "demo-close", "aria-label": "Close", onclick: close }, icon("close", "2")),
    body);

  function send(ev) {
    ev.preventDefault();
    submit.disabled = true;
    submit.textContent = "Sending...";
    status.textContent = "";
    fetch(WEB3FORMS_URL, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then((res) => res.json())
      .then((result) => {
        if (!result.success) throw new Error("not sent");
        body.replaceChildren(doneTick(),
          h("h2", { id: "demo-title" }, "Thanks! Your request is in."),
          h("p", { class: "demo-sub" }, "We'll be in touch shortly."),
          h("button", { type: "button", class: "btn btn-line", onclick: close }, "Close"));
      })
      .catch(() => {
        status.textContent = DEMO_ERROR;
        submit.disabled = false;
        submit.textContent = "Send Message";
      });
  }

  document.body.append(dlg);
  dlg.showModal();
}

// A morning at the branch, ported from 21st "Timeline" (kuratlielia): each
// event sits on an icon node, the rail draws down to the next one and the
// events arrive one at a time while the clock in the header keeps up.
const feedRow = (time, ic, text) => h("li", { class: "feed-row", "data-time": time },
  h("span", { class: "feed-node", "aria-hidden": "true" }, icon(ic, "1.8")),
  h("p", null, text), h("time", null, time));

function playFeed(feed) {
  const rows = [...feed.querySelectorAll(".feed-row")];
  const clock = feed.querySelector(".feed-clock");
  const show = (i) => {
    rows[i].classList.add("on");
    if (i) rows[i - 1].classList.add("linked");
    clock.textContent = rows[i].dataset.time;
    clock.classList.remove("tick"); void clock.offsetWidth; clock.classList.add("tick");
  };
  if (!motionOK.matches || !("IntersectionObserver" in window)) {
    rows.forEach((_, i) => show(i));
    return feed;
  }
  feed.classList.add("playing");
  const timers = [];
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    rows.forEach((_, i) => timers.push(setTimeout(() => show(i), 500 + i * 850)));
  }, { threshold: 0.35 });
  io.observe(feed);
  onCleanup(() => { io.disconnect(); timers.forEach(clearTimeout); });
  return feed;
}

const featureRow = (title, text) => h("div", { class: "feature" }, h("h3", null, title), h("p", null, text));

// What it does, ported from 21st "Halo Reel" (ruixen.ui): feature cards ride
// an ellipse. One angle per card sets its place, size and stacking, so the
// near side of the ring is large and the far side small. The card at the
// front is the selected one and its description sits beside the ring. It
// turns on its own a card at a time; click a card or drag the ring to turn it.
function featureReel(items) {
  const n = items.length;
  const step = (Math.PI * 2) / n;
  const title = h("h3");
  const text = h("p");
  const badge = h("span", { class: "reel-panel-icon", "aria-hidden": "true" });
  const panel = h("div", { class: "reel-panel", "aria-live": "polite" }, badge, title, text);
  const cards = items.map(([ic, name], i) => h("button", { type: "button", class: "reel-card", "aria-label": name,
    onclick: () => { if (!dragged) { pick(i); hold(); } } },
    h("span", { class: "reel-icon", "aria-hidden": "true" }, icon(ic, "1.8")), h("b", null, name)));
  const ring = h("div", { class: "reel-ring" }, ...cards);
  const stage = h("div", { class: "reel" }, ring, panel);

  let pos = 0, target = 0, sel = -1, frame = 0, timer = 0, visible = false, held = false, dragged = false;
  const auto = motionOK.matches;
  const wrapIdx = (i) => ((Math.round(i) % n) + n) % n;

  function layout() {
    const w = ring.clientWidth, hgt = ring.clientHeight;
    const wide = w > 520;
    const cx = w * (wide ? 0.22 : 0.18), cy = hgt / 2, rx = w * (wide ? 0.56 : 0.6), ry = hgt * 0.37;
    cards.forEach((c, i) => {
      const a = (i - pos) * step;
      const cos = Math.cos(a);
      const near = (cos + 1) / 2;
      const x = cx + rx * cos, y = cy + ry * Math.sin(a);
      c.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(0.5 + 0.5 * near).toFixed(3)})`;
      c.style.zIndex = String(Math.round(near * 100));
      c.style.opacity = (0.15 + 0.85 * near * near).toFixed(3);
    });
    const now = wrapIdx(pos);
    if (now !== sel) select(now);
  }
  function select(i) {
    sel = i;
    const [ic, name, desc] = items[i];
    cards.forEach((c, j) => { c.classList.toggle("on", j === i); c.setAttribute("aria-pressed", String(j === i)); });
    badge.replaceChildren(icon(ic, "1.8"));
    title.textContent = name;
    text.textContent = desc;
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
  }
  function animate() {
    frame = 0;
    const d = target - pos;
    pos = Math.abs(d) < 0.001 ? target : pos + d * (auto ? 0.09 : 1);
    layout();
    if (pos !== target) frame = requestAnimationFrame(animate);
  }
  function pick(i) {
    let d = i - wrapIdx(target);
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    target = Math.round(target) + d;
    if (!frame) frame = requestAnimationFrame(animate);
  }
  function tick() {
    clearTimeout(timer);
    if (!auto || !visible || held) return;
    timer = setTimeout(() => { pick(wrapIdx(target) + 1); tick(); }, 3600);
  }
  // A click or drag pauses the turning for a while so the text can be read.
  let holdTimer = 0;
  function hold() {
    held = true; clearTimeout(timer); clearTimeout(holdTimer);
    holdTimer = setTimeout(() => { held = false; tick(); }, 9000);
  }

  let startX = 0, startPos = 0, dragging = false;
  ring.addEventListener("pointerdown", (e) => {
    dragging = true; dragged = false; startX = e.clientX; startPos = pos;
    cancelAnimationFrame(frame); frame = 0;
  });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  function onMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) dragged = true;
    if (!dragged) return;
    pos = target = startPos - dx / 90;
    layout();
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    if (dragged) { target = Math.round(pos); if (!frame) frame = requestAnimationFrame(animate); hold(); }
  }
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); pick(wrapIdx(target) + 1); hold(); cards[wrapIdx(target)].focus(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); pick(wrapIdx(target) - 1); hold(); cards[wrapIdx(target)].focus(); }
  });

  const ro = "ResizeObserver" in window ? new ResizeObserver(layout) : null;
  if (ro) ro.observe(ring);
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; tick(); }, { threshold: 0.3 }) : null;
  if (io) io.observe(stage);
  setTimeout(layout, 0);
  onCleanup(() => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if (ro) ro.disconnect();
    if (io) io.disconnect();
    cancelAnimationFrame(frame); clearTimeout(timer); clearTimeout(holdTimer);
  });
  return stage;
}

function salesClose(title, text) {
  return h("section", { class: "ink-band" }, h("div", { class: "wrap grid" },
    h("div", null, h("span", { class: "kicker" }, "Book a demo"), h("h2", { style: { marginTop: "18px" } }, title), h("p", null, text)),
    h("div", { class: "actions" },
      h("a", { class: "btn btn-primary", href: "#demo", "aria-haspopup": "dialog", onclick: openDemoForm }, "Get started"),
      h("a", { class: "btn btn-line", href: CHECKIN_LINK, onclick: toCheckin }, "See what customers see"))));
}

// "See what customers see" links land on the walkthrough on the For Rental
// Companies page, scrolling there directly when it's already on screen.
const CHECKIN_LINK = "#/rental-companies?to=check-in";
function toCheckin(e) {
  const target = document.getElementById("check-in");
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: motionOK.matches ? "smooth" : "auto" });
}

function RentalCompaniesPage(q) {
  if (q && q.get("to") === "check-in") setTimeout(() => { const t = document.getElementById("check-in"); if (t) t.scrollIntoView(); }, 0);
  return h("div", null,
    h("section", { class: "sales-hero" }, h("div", { class: "wrap grid" },
      h("div", null,
        h("span", { class: "kicker" }, "For rental companies"),
        h("h1", { class: "h1-lines" }, h("span", null, "Less clicking. "), h("span", null, "Fewer calls. "), h("span", null, "No paperwork.")),
        h("p", { class: "lead" }, "Booking, check-in, coverages, texts, returns, damage claims, and more, in one system your whole team uses. Customers check themselves in and out on their phone, so your staff aren't out on the lot with every customer while the phone rings at the counter."),
        h("div", { class: "actions" },
          h("a", { class: "btn btn-primary", href: "#demo", "aria-haspopup": "dialog", onclick: openDemoForm }, "Get started"))),
      playFeed(h("div", { class: "feed", "aria-label": "An example morning at a branch" },
        h("div", { class: "feed-head" },
          h("div", null, h("span", { class: "feed-title" }, "A morning at the branch"), h("span", { class: "feed-tag" }, "Example")),
          h("span", { class: "feed-clock", "aria-hidden": "true" }, "7:58")),
        h("ol", { class: "feed-list" },
          feedRow("7:58", "calendar", [h("b", null, "Booked on fleetr.ai. "), "Minivan for a 9:00 pickup, collision coverage added."]),
          feedRow("8:00", "phone", [h("b", null, "Texted. "), "Confirmation, check-in link and what to bring, sent automatically."]),
          feedRow("9:12", "id", [h("b", null, "Customer arrives. "), "Given the plate, they check in the minivan from their phone, photograph any damage and sign."]),
          feedRow("9:17", "key", [h("b", null, "Picked up. "), "Keys handed over. Odometer and fuel pulled from the vehicle's last return."]),
          feedRow("9:46", "fuel", [h("b", null, "Ready return. "), "A pickup truck back from a 3-day rental, quarter tank short. Gas charge added at your post-pay fuel price."]),
          feedRow("9:49", "alert", [h("b", null, "Damage flagged. "), "Return photos attached to a new claim."])))))),

    checkinWalkthrough(),

    h("section", { class: "band reel-band" }, h("div", { class: "wrap" },
      h("div", { class: "split-head reel-head" },
        h("span", { class: "kicker" }, "What it does"),
        h("h2", null, "The work that eats your team's day, handled.")),
      featureReel([
        ["globe", "Listed on fleetr.ai", "Renters find and book your vehicles on fleetr.ai. Every booking lands straight in your reservations."],
        ["phone", "Customer check-in and return", "Customers scan their licence, photograph the vehicle, and sign on their own phone at pickup. At return, they log it themselves and the time is locked in. Your staff don't have to be there for either."],
        ["chat", "Automatic texts", "Confirmations, reminders, and no-show follow-ups go out on their own, in your wording. Your team stops chasing customers by phone."],
        ["spark", "Just ask", "Type or say what you need, like adding a reservation, fixing an agreement, or updating a vehicle, and fleetr does it."],
        ["shieldCheck", "Coverages sold every time", "Your coverages, wording, and prices, offered the same way on every rental. Every choice the customer makes is recorded."],
        ["calendar", "Reservations", "Every booking, wherever it comes from, all in one place. Rates fill themselves in."],
        ["alert", "Damage claims", "Flag damage on any rental, with photos attached. Claims stay open until they're resolved."],
        ["fuel", "Gas charges", "Fuel is tracked from pickup to return. Anything short is charged at your post-pay fuel price."],
        ["document", "Closing rentals", "Close a rental in a tap. Anything owed keeps it pending until it's settled."]]))),

    h("section", { class: "band aurora-band" },
      h("div", { class: "aurora", "aria-hidden": "true" }),
      h("div", { class: "wrap pricing" },
      h("div", null,
        h("span", { class: "kicker" }, "Pricing"),
        h("h2", { style: { marginTop: "18px" } }, "You only pay when your vehicles are on rent."),
        h("p", { class: "lead", style: { marginTop: "18px" } }, "fleetr is priced as a share of your rental revenue. A slow month means a smaller bill, and adding features never raises it."),
        h("div", { style: { marginTop: "28px" } },
          h("a", { class: "btn btn-primary", href: "#demo", "aria-haspopup": "dialog", onclick: openDemoForm }, "Get started"))))));
}

function DealershipsPage() {
  return h("div", null,
    h("section", { class: "sales-hero" }, h("div", { class: "wrap grid" },
      h("div", null,
        h("span", { class: "kicker" }, "For dealerships"),
        h("h1", { class: "h1-lines" }, h("span", null, "Your inventory can earn until you're ready to sell it.")),
        h("p", { class: "lead" }, "fleetr gives your dealership everything it needs to rent vehicles out. Customers book online, check in and return on their own phone, so you don't need a rental counter or extra staff."),
        h("div", { class: "actions" },
          h("a", { class: "btn btn-primary", href: "#demo", "aria-haspopup": "dialog", onclick: openDemoForm }, "Get started"))),
      playFeed(h("div", { class: "feed", "aria-label": "An example day on the lot" },
        h("div", { class: "feed-head" },
          h("div", null, h("span", { class: "feed-title" }, "A day on the lot"), h("span", { class: "feed-tag" }, "Example")),
          h("span", { class: "feed-clock", "aria-hidden": "true" }, "8:58")),
        h("ol", { class: "feed-list" },
          feedRow("8:58", "calendar", [h("b", null, "Booked on fleetr.ai. "), "A sedan from your lot, picked up at noon."]),
          feedRow("9:00", "phone", [h("b", null, "Texted. "), "Confirmation, check-in link and what to bring, sent automatically."]),
          feedRow("12:02", "id", [h("b", null, "Customer arrives. "), "Given the plate, they check in the sedan from their phone, photograph any damage, and sign."]),
          feedRow("12:07", "key", [h("b", null, "Picked up. "), "Keys handed over. Odometer and fuel pulled from the vehicle's record."]),
          feedRow("4:40", "check", [h("b", null, "Returned. "), "An SUV back from a 5-day rental, checked in by the customer on their phone."]),
          feedRow("4:45", "document", [h("b", null, "Rental closed. "), "Rent the SUV out again, or take it off rent when you're ready to sell."])))))),

    checkinWalkthrough(),

    h("section", { class: "band reel-band" }, h("div", { class: "wrap" },
      h("div", { class: "split-head reel-head" },
        h("span", { class: "kicker" }, "What it does"),
        h("h2", null, "Everything you need to rent, without becoming a rental company.")),
      featureReel([
        ["globe", "Listed on fleetr.ai", "Renters find and book your vehicles on fleetr.ai. No advertising on your end."],
        ["phone", "Customer check-in and return", "Customers scan their licence, photograph the vehicle, and sign on their own phone at pickup. At return, they log it themselves and the time is locked in. Your staff don't have to be there for either."],
        ["document", "Contracts and signatures", "Every rental gets a proper agreement, signed on the customer's phone. No paper to file."],
        ["camera", "Damage protection", "Timestamped photos at pickup and return. Any damage becomes a claim with the photos attached."],
        ["key", "You choose what rents", "Pull a vehicle off rent the moment it sells or needs work."],
        ["chat", "Automatic texts", "Confirmations, reminders, and no-show follow-ups go out on their own, in your wording. Your team stops chasing customers by phone."],
        ["fuel", "Gas charges", "Fuel is tracked from pickup to return. Anything short is charged at your post-pay fuel price."]]))),

    h("section", { class: "band" }, h("div", { class: "wrap insurance" },
      h("div", null,
        h("span", { class: "kicker" }, "Insurance"),
        h("h2", null, "Not sure about rental insurance?")),
      h("div", null,
        h("p", { class: "lead" }, "Ask us and we'll point you in the right direction."),
        h("a", { class: "btn btn-line", href: "#demo", "aria-haspopup": "dialog", onclick: openDemoForm }, "Ask about insurance")))),

    h("section", { class: "band aurora-band" },
      h("div", { class: "aurora", "aria-hidden": "true" }),
      h("div", { class: "wrap pricing" },
      h("div", null,
        h("span", { class: "kicker" }, "Pricing"),
        h("h2", { style: { marginTop: "18px" } }, "You only pay when your vehicles are on rent."),
        h("p", { class: "lead", style: { marginTop: "18px" } }, "fleetr is priced as a share of your rental revenue. A slow month means a smaller bill."),
        h("div", { style: { marginTop: "28px" } },
          h("a", { class: "btn btn-primary", href: "#demo", "aria-haspopup": "dialog", onclick: openDemoForm }, "Get started"))))));
}

// ─── See what customers see ──────────────────────────────────────────────────
// The check-in app on a phone, ported from 21st "Container Scroll Animation"
// (manuarora700): the phone starts tilted back and flattens as it scrolls
// into view. Inside, a mock of the real check-in plays one screen at a time
// once the phone is on screen.
function checkinWalkthrough() {
  const SCREENS = 8;
  const el = (cls, ...kids) => h("div", { class: cls }, ...kids);
  const field = (label, value) => [h("span", { class: "ca-label" }, label), el("ca-input", value)];
  const btn = (text, cls = "ca-btn-primary") => el("ca-btn " + cls, text);
  const steps = (n) => [
    el("ca-back", "← Back"),
    el("ca-step-label", `Step ${n} of ${SCREENS}`),
    el("ca-step-bar", ...Array.from({ length: SCREENS }, (_, j) => h("span", { class: j < n ? "on" : null })))];
  const row = (label, value) => el("ca-row", h("span", null, label), h("b", null, value));
  const choice = (name, price, wording, picked) => el("ca-card",
    el("ca-card-head", h("b", null, name), h("span", null, price)),
    wording && h("p", null, wording),
    el("ca-choices", btn("Accept", picked === 0 ? "ca-btn-primary" : "ca-btn-line"), btn("Decline", picked === 1 ? "ca-btn-primary" : "ca-btn-line")));

  const screens = [
    ["Open the texted link", el("ca-screen",
      el("ca-wordmark", "fleetr"),
      ...field("Reservation Code", "KQT 482 913"),
      btn("Scan License"),
      el("ca-manual", "Enter details manually"),
      ...field("License Plate", "ABC123"),
      ...field("Plate Province / State", "NL - Newfoundland & Labrador"),
      el("ca-spacer"),
      btn("Start Rental Process"))],
    ["Scan the licence", el("ca-screen ca-camera",
      el("ca-frame",
        el("ca-licence", el("ca-lic-photo"), el("ca-lic-lines", h("span"), h("span"), h("span"), h("span"))),
        h("span", { class: "ca-scanline" })),
      el("ca-camera-text", "Scanning licence"))],
    ["Add drivers", el("ca-screen",
      ...steps(3),
      h("h4", null, "Drivers"),
      h("p", { class: "ca-sub" }, "Only drivers named on the rental agreement may drive the vehicle."),
      el("ca-card", el("ca-card-head", h("b", null, "Add another driver?"), h("span", null, "$10.00 per day")),
        el("ca-choices", btn("Yes", "ca-btn-line"), btn("No"))),
      el("ca-spacer"),
      btn("Continue →"))],
    ["Check the damage on file", el("ca-screen",
      ...steps(4),
      h("h4", null, "Pre-Existing Damage"),
      el("ca-vehicle", el("ca-plate", "ABC123"), el("ca-vdetail", "Make and model")),
      el("ca-info", "The following damage has been documented on this vehicle.", h("br"), "You are not responsible for it."),
      el("ca-damage", "Rear bumper: light scratch"),
      el("ca-damage", "Front passenger wheel: curb rash"),
      el("ca-spacer"),
      btn("I Understand, Continue →"))],
    ["Photograph anything new", el("ca-screen",
      ...steps(5),
      h("h4", null, "Photos of Concern"),
      el("ca-optional", "Optional"),
      h("p", { class: "ca-sub" }, "See any new damage that isn't listed? Photograph it now to protect yourself."),
      el("ca-photo", el("ca-photo-img"), el("ca-photo-text", h("b", null, "Photo 1"), h("span", null, "Driver door"))),
      btn("Add Photos", "ca-btn-line"),
      el("ca-spacer"),
      btn("Continue →"))],
    ["Choose coverages", el("ca-screen",
      ...steps(6),
      h("h4", null, "Coverages"),
      h("p", { class: "ca-sub" }, "Choose the coverages you want for this rental. Each one is charged per day."),
      choice("Collision Damage Waiver", "$29.99 per day", "Covers damage to the rental vehicle, less the deductible.", 0),
      choice("Supplemental Liability", "$16.99 per day", null, 1),
      el("ca-spacer"),
      btn("Continue →"))],
    ["Sign the contract", el("ca-screen",
      ...steps(7),
      h("h4", null, "Contract"),
      h("p", { class: "ca-sub" }, "Review your rental agreement, then sign below to confirm it."),
      el("ca-summary", row("Vehicle", "Make and model"), row("Out", "October 8, 2026"), row("Due", "October 11, 2026"), row("Daily rate", "$89.00")),
      (() => {
        const t = document.createElement("template");
        t.innerHTML = '<svg class="ca-sig" viewBox="0 0 300 110" aria-hidden="true"><path d="M22 74c14-30 26-46 32-40 7 8-14 42-6 44 9 3 18-34 28-32 8 2-2 28 6 29 10 1 14-22 24-21 9 1 2 21 12 21 12 0 20-30 31-28 8 2-3 26 6 27 14 2 30-22 44-18 9 3 4 14 14 14 18 0 40-12 62-16"/></svg>';
        return el("ca-sig-wrap", t.content.firstChild);
      })(),
      el("ca-spacer"),
      btn("Clear Signature", "ca-btn-line"),
      btn("Confirm"))],
    ["Ready to go", el("ca-screen ca-done",
      el("ca-spacer"),
      doneTick(),
      h("h4", null, "You're Good to Go!"),
      h("p", { class: "ca-sub" }, "Your inspection is complete and on file. Enjoy your rental."),
      el("ca-summary", row("Vehicle", "Make and model"), row("Plate", "ABC123"), row("Return by", "Oct 11, 9:00 AM")),
      el("ca-spacer"),
      btn("Done"))],
  ];
  // How long each screen stays up before its button is tapped.
  const holds = [2600, 2400, 2200, 2600, 2400, 2600, 3200, 3200];

  const track = el("ca-track", ...screens.map(([, s]) => s));
  const caption = h("p", { class: "cs-caption", "aria-live": "polite" });
  const dots = screens.map(([label], i) => h("button", { type: "button", class: "cs-dot", "aria-label": label, onclick: () => { show(i); restart(); } }));
  const phone = el("cs-phone",
    el("cs-screen",
      el("ca",
        el("ca-status", h("span", null, "9:12"), h("span", { class: "ca-status-icons", "aria-hidden": "true" }, h("i"), h("i"), h("i"))),
        track)),
    h("span", { class: "cs-island", "aria-hidden": "true" }));

  let idx = 0, timer = 0, tapTimer = 0, visible = false;
  function show(i) {
    idx = (i + screens.length) % screens.length;
    track.style.setProperty("--i", idx);
    screens.forEach(([, s], j) => s.classList.toggle("on", j === idx));
    track.querySelectorAll(".tap").forEach((b) => b.classList.remove("tap"));
    dots.forEach((d, j) => d.setAttribute("aria-current", j === idx ? "step" : "false"));
    caption.textContent = `${idx + 1}. ${screens[idx][0]}`;
  }
  const auto = motionOK.matches;
  function restart() {
    clearTimeout(timer); clearTimeout(tapTimer);
    if (!auto || !visible) return;
    timer = setTimeout(() => {
      const cta = [...screens[idx][1].querySelectorAll(".ca-btn-primary")].pop();
      if (cta) cta.classList.add("tap");
      tapTimer = setTimeout(() => { show(idx + 1); restart(); }, 380);
    }, holds[idx]);
  }
  show(0);

  const head = el("cs-head",
    h("span", { class: "kicker" }, "See what customers see"),
    h("h2", null, "Check-in happens on their phone."),
    h("p", { class: "lead" }, "Every pickup starts with a texted link. This is the check-in your customers walk through, one screen at a time."));
  const card = el("cs-card", phone);
  const stage = el("cs-stage", head, card,
    el("cs-controls", el("cs-dots", ...dots), caption));
  const section = h("section", { class: "cs", id: "check-in" }, stage);

  // Scroll progress: 0 as the section's top enters the bottom of the screen,
  // 1 once it has risen most of the way up, so the phone is flat by the time
  // it's in full view.
  let frame = 0;
  const narrow = window.matchMedia("(max-width: 768px)");
  const paint = () => {
    frame = 0;
    const r = section.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.85)));
    const [s0, s1] = narrow.matches ? [0.9, 1] : [1.05, 1];
    section.style.setProperty("--rot", `${20 - 20 * p}deg`);
    section.style.setProperty("--scale", (s0 + (s1 - s0) * p).toFixed(4));
    section.style.setProperty("--lift", `${-100 * p}px`);
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(paint); };
  if (auto) {
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    setTimeout(paint, 0);
  }
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    restart();
  }, { threshold: 0.4 }) : null;
  if (io) io.observe(phone); else { visible = true; restart(); }
  onCleanup(() => {
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", queue);
    if (frame) cancelAnimationFrame(frame);
    if (io) io.disconnect();
    clearTimeout(timer); clearTimeout(tapTimer);
  });
  return section;
}

function NotFoundPage() {
  return h("div", { class: "wrap" }, emptyState("Not found", "That page doesn't exist.", "The link may be old. Start a search instead.",
    h("a", { class: "btn btn-primary", href: "#/" }, "Rent a vehicle")));
}

render();
