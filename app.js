// fleetr.ai public booking site.
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

// ─── Icons ───────────────────────────────────────────────────────────────────
const SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const ICONS = {
  Car:      '<path d="M3 15v-2.5l2.2-4.6A2 2 0 0 1 7 7h10a2 2 0 0 1 1.8 1.1L21 12.5V15a1 1 0 0 1-1 1h-1M5 16H4a1 1 0 0 1-1-1"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/><path d="M9 16h6M3.5 12h17"/>',
  SUV:      '<path d="M3 16v-5l2-5h11l3 5h1a1 1 0 0 1 1 1v4"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/><path d="M9 16.5h6M3 11h16M10.5 6v5"/>',
  Truck:    '<path d="M2 15v-4h9V7h5l3 4h2a1 1 0 0 1 1 1v3"/><circle cx="6" cy="16" r="2"/><circle cx="17" cy="16" r="2"/><path d="M8 16h7M14 7v4h5"/>',
  Van:      '<path d="M3 16V7a1 1 0 0 1 1-1h11l4 4 2 1.5V16"/><path d="M3 11h18M10 6v5"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/><path d="M9 16.5h6"/>',
  Luxury:   '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9.5 4L12 20M14.5 4L12 20"/>',
  Other:    '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  search:   '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  map:      '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  list:     '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  plane:    '<path d="M10.5 13.5L3 11l1.5-1.5 7.5 1L16 6.5a2.1 2.1 0 0 1 3 3l-4 4 1 7.5-1.5 1.5L12 14.5l-3 3V20l-1.5 1.5-1-3.5L3 17l1.5-1.5H7l3-3"/>',
  delivery: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  moon:     '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  check:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  left:     '<path d="M15 5l-7 7 7 7"/>',
  right:    '<path d="M9 5l7 7-7 7"/>',
  seat:     '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  bag:      '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8"/>',
  card:     '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
  id:       '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16a3 3 0 0 1 6 0M14.5 10h4M14.5 13.5h3"/>',
  driver:   '<circle cx="10" cy="8" r="3.5"/><path d="M3 20a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  deposit:  '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  pin:      '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  phone:    '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
};
function icon(name, strokeWidth) {
  const t = document.createElement("template");
  t.innerHTML = (SVG_OPEN + (ICONS[name] || ICONS.Other) + "</svg>").trim();
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
  bad_coverages:        "One of the protections is no longer offered. Go back and choose again.",
  try_again:            "Something went wrong. Try again.",
  network:              "We couldn't reach fleetr.ai. Check your connection and try again.",
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
    url ? h("img", { src: url, alt: `${b.name}`, loading: "lazy" }) : h("div", { class: "placeholder-photo" }, icon("Car", "1.2")),
    logo && h("div", { class: "card-logo" }, h("img", { src: logo, alt: `${b.name} logo`, loading: "lazy" })));
}

// ─── Maps ────────────────────────────────────────────────────────────────────
function makeMap(el, centre, zoom) {
  if (!window.L) {
    el.append(h("div", { class: "empty", style: { padding: "40px 16px" } }, h("p", null, "The map couldn't be loaded.")));
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
  else if (path === "/rental-companies") page = ForPage("rental-companies");
  else if (path === "/dealerships") page = ForPage("dealerships");
  else page = NotFoundPage();
  set(appEl, page);
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
document.getElementById("year").textContent = String(new Date().getFullYear());

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
        h("button", { type: "button", class: "btn btn-outline", style: { padding: "10px 20px" }, onclick: () => onDone && onDone() }, "Done")));
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
  const puSeg = h("button", { type: "button", class: "search-seg", "aria-haspopup": "dialog", "aria-expanded": "false",
    onclick: (e) => { e.stopPropagation(); openSeg === puSeg ? close() : open(puSeg, "start"); } },
    h("span", { class: "seg-label" }, "Pick-up"), puValue);
  const rtSeg = h("button", { type: "button", class: "search-seg", "aria-haspopup": "dialog", "aria-expanded": "false",
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
      h("div", { class: "search-seg", onclick: () => whereInput.focus() },
        h("label", { for: whereInput.id }, "Where"), whereInput),
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
  let category = CATEGORIES.includes(q.get("cat")) ? q.get("cat") : "";
  const pill = SearchPill({ where: q.get("where") || "", trip, category, onSearch: (s) => go("/search", searchParams(s)) });
  const catRow = h("div", { class: "cats", role: "group", "aria-label": "Vehicle type" });
  const drawCats = () => {
    set(catRow, ...CATEGORIES.map((c) => h("button", {
      type: "button", class: `cat${category === c ? " active" : ""}`, "aria-pressed": category === c ? "true" : "false",
      onclick: () => {
        category = category === c ? "" : c;
        pill.setCategory(category);
        drawCats();
        if (pill.state.where.trim()) pill.submit();
      },
    }, icon(c, "1.4"), c)));
  };
  drawCats();
  return h("div", null,
    h("section", { class: "hero" },
      h("div", { class: "wrap" },
        h("h1", null, "Rent from local companies"),
        h("p", { class: "lead" }, "Cars, SUVs, trucks and vans from rental companies near you. Reserve in minutes and pay at pickup."),
        pill,
        catRow)),
    h("section", { class: "home-band" },
      h("div", { class: "wrap" },
        h("div", { class: "home-steps" },
          step(1, "Search", "Tell us where and when. We show the branches with a vehicle free for your dates."),
          step(2, "Reserve", "Pick a vehicle and your protection. Verify your phone and you're booked."),
          step(3, "Pick up", "Check in with the app before you arrive, then pay at the counter.")))));
}
const step = (n, title, text) => h("div", { class: "step-card" }, h("div", { class: "num" }, String(n)), h("h3", null, title), h("p", null, text));

// ─── Search results ──────────────────────────────────────────────────────────
function loadingBlock(text) { return h("div", { class: "loading" }, h("div", { class: "spinner" }), text || "Loading\u2026"); }

function SearchPage(q) {
  const where = (q.get("where") || "").trim();
  const trip = tripFrom(q);
  const category = CATEGORIES.includes(q.get("cat")) ? q.get("cat") : "";
  let sort = q.get("sort") || "recommended";
  const params = (extra) => ({ ...searchParams({ where, trip, category }), sort: sort === "recommended" ? null : sort, ...extra });

  const pill = SearchPill({ where, trip, category, compact: true, onSearch: (s) => go("/search", { ...searchParams(s), sort: params().sort }) });
  const listEl = h("div", { class: "results-list" }, loadingBlock("Finding vehicles\u2026"));
  const mapBox = h("div", { class: "map", role: "region", "aria-label": "Map of branches" });
  const mapCol = h("div", { class: "results-map" }, mapBox);
  const layout = h("div", { class: "results" }, listEl, mapCol);
  const toggle = h("button", { type: "button", class: "map-toggle", style: { display: "none" } });

  const sortSel = h("select", { class: "select", "aria-label": "Sort", onchange: (e) => { sort = e.target.value; go("/search", params()); } },
    [["recommended", "Recommended"], ["price_asc", "Price: low to high"], ["price_desc", "Price: high to low"]]
      .map(([v, l]) => h("option", { value: v, selected: sort === v ? "selected" : null }, l)));
  const chips = h("div", { class: "filters", role: "group", "aria-label": "Vehicle type" },
    h("button", { type: "button", class: `chip${!category ? " active" : ""}`, onclick: () => go("/search", params({ cat: null })) }, "All"),
    CATEGORIES.map((c) => h("button", { type: "button", class: `chip${category === c ? " active" : ""}`,
      onclick: () => go("/search", params({ cat: category === c ? null : c })) }, icon(c, "1.6"), c)),
    sortSel);

  const page = h("div", null,
    h("div", { class: "results-top" }, h("div", { class: "wrap" }, pill, chips)),
    h("div", { class: "wrap" }, layout),
    toggle);

  if (!where) {
    set(listEl, emptyState("search", "Where are you renting?", "Enter a city or airport code to see what's available."));
    return page;
  }

  let map = null, markers = {}, cards = {};
  const ensureMap = (branches) => {
    if (map || !branches.length) { if (map) setTimeout(() => map.invalidateSize(), 0); return; }
    const pinned = branches.filter(hasPin);
    map = makeMap(mapBox, pinned.length ? [Number(pinned[0].latitude), Number(pinned[0].longitude)] : DEFAULT_CENTRE, 11);
    if (!map) return;
    pinned.forEach((b) => {
      const el = h("span", { class: "price-pin" }, money(b.lowestDailyRate));
      const marker = window.L.marker([Number(b.latitude), Number(b.longitude)], {
        icon: window.L.divIcon({ className: "pin-wrap", html: el, iconSize: null }),
        keyboard: true, title: b.name,
      }).addTo(map);
      marker.bindPopup(() => h("div", { style: { minWidth: "180px" } },
        h("b", null, b.name), h("div", { style: { color: "rgba(31,30,29,.62)" } }, cityOf(b)),
        h("div", { style: { margin: "6px 0 8px" } }, h("b", null, `from ${money(b.lowestDailyRate)}`), " / day"),
        h("a", { href: branchHref(b.locationId, trip, category), style: { fontWeight: "600" } }, "View vehicles")));
      marker.on("mouseover", () => hot(b.locationId, true));
      marker.on("mouseout", () => hot(b.locationId, false));
      markers[b.locationId] = el;
    });
    if (pinned.length > 1) map.fitBounds(pinned.map((b) => [Number(b.latitude), Number(b.longitude)]), { padding: [48, 48], maxZoom: 13 });
    setTimeout(() => map && map.invalidateSize(), 0);
  };
  const hot = (id, on) => {
    if (markers[id]) markers[id].classList.toggle("hot", on);
    if (cards[id]) cards[id].classList.toggle("hot", on);
  };

  rpc("public_search_branches", { p_query: where, p_pickup: asTimestamp(tripPu(trip)), p_return: asTimestamp(tripRt(trip)), p_category: category || null })
    .then((res) => {
      if (!res || !res.ok) { set(listEl, emptyState("search", "Check your search", reasonText(res && res.reason))); return; }
      const all = res.branches || [];
      let open = all.filter((b) => b.available);
      if (sort === "price_asc") open = [...open].sort((a, b) => a.lowestDailyRate - b.lowestDailyRate);
      if (sort === "price_desc") open = [...open].sort((a, b) => b.lowestDailyRate - a.lowestDailyRate);
      if (!open.length) {
        const reasons = [...new Set(all.map((b) => b.reason).filter(Boolean))];
        let title = "No vehicles available", text;
        if (!all.length) { title = `We're not in ${where} yet`; text = "No rental companies on fleetr.ai serve that city or airport yet. Try a nearby city, or an airport code like YYT."; }
        else if (reasons.length === 1 && reasons[0] !== "no_availability") text = reasonText(reasons[0]);
        else text = `Nothing is free ${category ? `in ${category} ` : ""}for ${tripRange(trip)}. Try different dates${category ? " or another vehicle type" : ""}.`;
        set(listEl, emptyState("calendar", title, text,
          category ? h("button", { type: "button", class: "btn btn-outline btn-pill", onclick: () => go("/search", params({ cat: null })) }, "Show all vehicle types") : null));
        return;
      }
      const days = rentalDays(tripPu(trip), tripRt(trip));
      set(listEl, 
        h("div", { class: "results-count" }, `${open.length} ${open.length === 1 ? "branch" : "branches"} with vehicles for ${days} day${days === 1 ? "" : "s"}`),
        h("div", { class: "cards" }, open.map((b) => {
          const perks = perksOf(b).map((p) => p.name).join(" \u00b7 ");
          const card = h("a", { class: "card", href: branchHref(b.locationId, trip, category),
            onmouseenter: () => hot(b.locationId, true), onmouseleave: () => hot(b.locationId, false) },
            photoBlock(b, "card-photo"),
            h("div", { class: "card-body" },
              h("div", { class: "card-title" }, h("span", null, b.name)),
              h("div", { class: "card-sub" }, cityOf(b)),
              perks && h("div", { class: "card-sub" }, perks),
              h("div", { class: "card-price" }, "from ", h("strong", null, money(b.lowestDailyRate)), " / day"),
              h("div", { class: "card-total" }, `${money(b.total)} total before tax`)));
          cards[b.locationId] = card;
          return card;
        })));
      const wide = window.matchMedia("(min-width: 1128px)");
      if (wide.matches) ensureMap(open);
      let mapOpen = false;
      const paintToggle = () => set(toggle, mapOpen ? "Show list" : "Show map", icon(mapOpen ? "list" : "map", "2"));
      toggle.style.display = "";
      paintToggle();
      toggle.onclick = () => {
        mapOpen = !mapOpen;
        layout.classList.toggle("map-open", mapOpen);
        paintToggle();
        if (mapOpen) ensureMap(open); else window.scrollTo(0, 0);
      };
      const onWide = () => { if (wide.matches) { layout.classList.remove("map-open"); mapOpen = false; paintToggle(); ensureMap(open); } };
      wide.addEventListener("change", onWide);
      onCleanup(() => wide.removeEventListener("change", onWide));
    })
    .catch(() => set(listEl, emptyState("search", "Something went wrong", REASONS.network,
      h("button", { type: "button", class: "btn btn-outline btn-pill", onclick: render }, "Try again"))));

  return page;
}

function branchHref(id, trip, category, cls) {
  const qs = new URLSearchParams({ pu: tripPu(trip), rt: tripRt(trip) });
  if (category) qs.set("cat", category);
  if (cls) qs.set("cls", cls);
  return `#/branch/${encodeURIComponent(id)}?${qs}`;
}

function emptyState(iconName, title, text, action) {
  return h("div", { class: "empty" }, icon(iconName, "1.4"), h("h2", null, title), h("p", null, text), action || null);
}

// ─── Branch ──────────────────────────────────────────────────────────────────
function BranchPage(id, q) {
  const trip = tripFrom(q);
  const root = h("div", { class: "branch" }, h("div", { class: "wrap" }, loadingBlock()));
  rpc("public_branch_detail", { p_location_id: id, p_pickup: asTimestamp(tripPu(trip)), p_return: asTimestamp(tripRt(trip)), p_category: null })
    .then((res) => {
      if (!res || !res.ok) {
        set(root, h("div", { class: "wrap" }, emptyState("pin", "Branch not available", reasonText(res && res.reason),
          h("a", { class: "btn btn-outline btn-pill", href: "#/" }, "Start a new search"))));
        return;
      }
      set(root, branchView(id, res, trip, q));
    })
    .catch(() => set(root, h("div", { class: "wrap" }, emptyState("pin", "Something went wrong", REASONS.network,
      h("button", { type: "button", class: "btn btn-outline btn-pill", onclick: render }, "Try again")))));
  return root;
}

function branchView(id, res, trip, q) {
  const b = res.branch;
  const classes = res.classes || [];
  const wantCat = q.get("cat");
  let chosen = classes.find((c) => c.classId === q.get("cls")) || null;
  const days = res.days || rentalDays(tripPu(trip), tripRt(trip));
  const taxes = b.salesTaxes || [];

  // Classes, the chosen category first.
  const ordered = wantCat ? [...classes.filter((c) => c.category === wantCat), ...classes.filter((c) => c.category !== wantCat)] : classes;
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
      qte && h("p", { class: "bb-note", style: { fontSize: "13px" } }, "Protection is chosen at checkout."));
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
    res.reason && h("div", { class: "notice error", role: "alert" }, `${reasonText(res.reason)}${res.reason === "too_soon" ? ` This branch needs ${b.minNoticeHours} hour${b.minNoticeHours === 1 ? "" : "s"} notice.` : ""}${res.reason === "too_long" ? ` The longest rental here is ${b.maxRentalDays} days.` : ""}`),
    h("section", { class: "sec", id: "vehicles" },
      h("h2", null, `Available vehicles`),
      h("p", { style: { color: "var(--muted)", marginTop: "-8px", marginBottom: "16px" } }, `${tripRange(trip)} \u00b7 ${days} day${days === 1 ? "" : "s"} \u00b7 prices before tax`),
      classes.length ? classList : h("p", null, res.reason ? "Change your dates to see what's available." : "Nothing is free for these dates. Try different dates.")),
    b.description && h("section", { class: "sec" }, h("h2", null, "About this branch"), h("p", null, b.description)),
    perks.length > 0 && h("section", { class: "sec" }, h("h2", null, "What this branch offers"),
      h("div", { class: "perks" }, perks.map((p) => h("div", { class: "perk" }, icon(p.icon, "1.5"), h("div", null, h("b", null, p.name), h("span", null, p.text)))))),
    h("section", { class: "sec" }, h("h2", null, "Hours"), hoursEl),
    h("section", { class: "sec" }, h("h2", null, "Requirements"),
      h("div", { class: "facts" }, facts.map((f) => h("div", { class: "perk" }, icon(f.icon, "1.5"), h("div", { class: "fact" }, h("b", null, f.name), h("span", null, f.text)))))),
    (hasPin(b) || b.address) && h("section", { class: "sec" }, h("h2", null, "Where you'll pick up"),
      b.address && h("p", { style: { marginBottom: "8px" } }, b.address),
      hasPin(b) && mapEl));

  const view = h("div", { class: "wrap" },
    h("div", { class: "branch-head" }, h("h1", null, b.name), h("div", { class: "sub" }, [cityOf(b), b.address].filter(Boolean).join(" \u00b7 "))),
    photoBlock(b, "hero-photo"),
    h("div", { class: "branch-cols" }, content, h("div", null, box)),
    bar);

  if (hasPin(b)) {
    requestAnimationFrame(() => {
      const map = makeMap(mapEl, [Number(b.latitude), Number(b.longitude)], 14);
      if (map) window.L.marker([Number(b.latitude), Number(b.longitude)], { title: b.name }).addTo(map);
    });
  }
  return view;
}

// ─── Checkout ────────────────────────────────────────────────────────────────
function CheckoutPage(id, q) {
  const trip = tripFrom(q);
  const clsId = q.get("cls");
  const root = h("div", { class: "checkout" }, h("div", { class: "wrap" }, loadingBlock()));
  rpc("public_branch_detail", { p_location_id: id, p_pickup: asTimestamp(tripPu(trip)), p_return: asTimestamp(tripRt(trip)), p_category: null })
    .then((res) => {
      const backHref = branchHref(id, trip);
      const cls = res && res.ok && (res.classes || []).find((c) => c.classId === clsId);
      if (!res || !res.ok || !cls) {
        const why = !res || !res.ok ? reasonText(res && res.reason) : res.reason ? reasonText(res.reason) : "That vehicle is no longer available for these dates.";
        set(root, h("div", { class: "wrap" }, emptyState("calendar", "Can't book this one", why,
          h("a", { class: "btn btn-outline btn-pill", href: backHref }, "Choose another vehicle"))));
        return;
      }
      set(root, checkoutView(id, res.branch, cls, trip, res.days || rentalDays(tripPu(trip), tripRt(trip)), backHref));
    })
    .catch(() => set(root, h("div", { class: "wrap" }, emptyState("calendar", "Something went wrong", REASONS.network,
      h("button", { type: "button", class: "btn btn-outline btn-pill", onclick: render }, "Try again")))));
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
  const details = h("section", { class: "sec" },
    h("h2", null, "Your details"),
    h("div", { class: "field-grid" },
      field("first", "First name", { autocomplete: "given-name", maxlength: "60" }),
      field("last", "Last name", { autocomplete: "family-name", maxlength: "60" }),
      field("phone", "Mobile phone", { type: "tel", autocomplete: "tel", inputmode: "tel", placeholder: "(709) 555-0100" }),
      field("email", "Email", { type: "email", autocomplete: "email", maxlength: "200" })),
    h("p", { style: { fontSize: "14px", color: "var(--muted)", marginTop: "10px" } },
      "Use the name on your driver's licence. We'll text your confirmation to this number."));

  // Protection
  const covErr = h("div", { class: "err", role: "alert", style: { color: "var(--bad)", fontSize: "14px", fontWeight: "500" } });
  const covCards = coverages.map((c) => {
    const card = h("div", { class: "cov" });
    const draw = () => {
      set(card, 
        h("div", { class: "cov-head" }, h("b", null, c.name), h("span", null, `${money(c.pricePerDay, true)} / day`)),
        c.wording && h("p", null, c.wording),
        c.required
          ? h("span", { class: "tag" }, "Included with this rental")
          : h("div", { class: "seg", role: "group", "aria-label": c.name },
              h("button", { type: "button", class: choice[c.productId] === true ? "on" : "", "aria-pressed": String(choice[c.productId] === true),
                onclick: () => { choice[c.productId] = true; covErr.textContent = ""; draw(); drawSummary(); } }, "Accept"),
              h("button", { type: "button", class: choice[c.productId] === false ? "on" : "", "aria-pressed": String(choice[c.productId] === false),
                onclick: () => { choice[c.productId] = false; covErr.textContent = ""; draw(); drawSummary(); } }, "Decline")));
    };
    draw();
    return card;
  });
  const protection = coverages.length > 0 && h("section", { class: "sec" },
    h("h2", null, "Protection"),
    h("p", { style: { color: "var(--muted)", marginBottom: "16px" } }, "Choose what's covered. You can't change this online after booking."),
    covCards, covErr);

  // Terms
  const termsErr = h("div", { role: "alert", style: { color: "var(--bad)", fontSize: "14px", fontWeight: "500", marginTop: "8px" } });
  const terms = h("section", { class: "sec" },
    h("h2", null, "Before you book"),
    h("div", { class: "notice" }, h("b", null, "Free cancellation. "), "Cancel any time before pickup from the link in your confirmation text."),
    h("label", { class: "check" },
      h("input", { type: "checkbox", onchange: (e) => { agreed = e.target.checked; termsErr.textContent = ""; } }),
      h("span", null, `I agree to the fleetr.ai booking terms: this is a reservation with ${b.name}, I'll sign their rental agreement and pay at pickup, and I meet their requirements${b.minimumAge != null ? ` (minimum age ${b.minimumAge})` : ""}.`)),
    termsErr);

  // Verify and reserve
  const verify = h("section", { class: "sec" });
  const tsBox = h("div", { class: "ts" });
  let tsWidget = null, tsToken = null, tsTimer = null;
  const mountTurnstile = () => {
    if (tsWidget != null) return;
    const tryMount = () => {
      if (!window.turnstile || !tsBox.isConnected) return false;
      tsWidget = window.turnstile.render(tsBox, {
        sitekey: TURNSTILE_KEY, action: "phone_send",
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
    set(verifyMsg, text ? h("div", { class: `notice${bad ? " error" : ""}`, style: { marginTop: "14px", marginBottom: "0" } }, text) : "");
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
    const kids = [h("h2", null, "Verify your phone and reserve")];
    if (v.stage === "idle") {
      kids.push(
        h("p", { style: { color: "var(--muted)" } }, "We'll text you a 6-digit code to confirm it's your number. Message and data rates may apply."),
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
      const resendBtn = h("button", { type: "button", class: "btn-ghost", disabled: wait > 0 || v.busy, onclick: () => { codeValue = ""; resetVerify(); } },
        wait > 0 ? `Resend code in ${wait}s` : "Send a new code");
      kids.push(
        h("div", { class: "verify-box" },
          h("p", null, `We texted a code to ${fmtPhone(form.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""))}. It expires in 10 minutes.`),
          h("div", { style: { margin: "14px 0" } }, codeInput),
          h("button", { type: "button", class: "btn btn-primary btn-block", disabled: v.busy, onclick: v.stage === "verified" ? book : confirmCode },
            v.busy ? "Reserving\u2026" : "Confirm and reserve"),
          v.stage === "code" && h("div", { style: { display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", fontSize: "14px" } },
            resendBtn,
            h("button", { type: "button", class: "btn-ghost", disabled: v.busy, onclick: () => { codeValue = ""; resetVerify(); details.scrollIntoView({ behavior: "smooth" }); } }, "Change number"))));
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
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//fleetr ai//booking//EN", "CALSCALE:GREGORIAN",
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
    return h("div", { class: "wrap" }, emptyState("calendar", "No booking to show", "Your confirmation was texted to you. Start a new search to book again.",
      h("a", { class: "btn btn-outline btn-pill", href: "#/" }, "Rent a vehicle")));
  }
  let menu = null;
  const calWrap = h("div", { class: "cal-menu" });
  const calBtn = h("button", { type: "button", class: "btn btn-outline", "aria-haspopup": "menu", onclick: (e) => {
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
    h("div", { class: "confirm-badge" }, icon("check", "2.4")),
    h("h1", null, `You're booked${c.firstName ? `, ${c.firstName}` : ""}!`),
    h("p", { class: "lead" }, `We've texted you at ${fmtPhone(c.phone)} with your confirmation and a link to cancel if your plans change.`),
    h("div", { class: "code-card" },
      h("small", null, "Reservation code"),
      h("div", { class: "code" }, c.resCode),
      h("div", { class: "summary-head", style: { marginTop: "20px", borderTop: "1px solid var(--line)", paddingTop: "18px" } },
        h("div", { class: "thumb" }, photoUrl(c.branch.photoPath) ? h("img", { src: photoUrl(c.branch.photoPath), alt: "" }) : h("div", { class: "placeholder-photo" }, icon(c.category || "Car", "1.2"))),
        h("div", null, h("b", null, c.className), h("span", null, c.branch.name), c.branch.address && h("div", { style: { fontSize: "14px", color: "var(--muted)" } }, c.branch.address))),
      h("div", { class: "sum-dates" },
        h("div", null, h("small", null, "Pick-up"), fmtDay(c.trip.puDate), h("br"), fmtTime(c.trip.puTime)),
        h("div", null, h("small", null, "Return"), fmtDay(c.trip.rtDate), h("br"), fmtTime(c.trip.rtTime))),
      quoteLines({ lines: c.lines, taxLines: c.taxLines || [], total: c.total }),
      h("p", { class: "bb-note" }, "You won't be charged now. Pay at pickup.")),
    h("div", { class: "confirm-actions" },
      h("a", { class: "btn btn-primary", href: appLink(c) }, icon("phone", "1.8"), "Check in with the app"),
      calWrap),
    h("p", { style: { color: "var(--muted)", fontSize: "14px", marginTop: "16px" } },
      "Check in before you arrive to add your licence and speed up pickup. You can also open the app with your reservation code and last name.")));
}

// ─── Other pages ─────────────────────────────────────────────────────────────
function ForPage(kind) {
  const copy = kind === "dealerships"
    ? { title: "For Dealerships", text: "Rent out your loaners and courtesy vehicles through fleetr.ai. We're getting this ready now." }
    : { title: "For Rental Companies", text: "List your branches on fleetr.ai and take bookings straight into your fleet. We're getting this ready now." };
  return h("div", { class: "wrap" }, h("div", { class: "simple" },
    h("h1", null, copy.title),
    h("p", null, copy.text),
    h("a", { class: "btn btn-primary", href: "https://internal.fleetr.ai" }, "fleetr Log In")));
}
function NotFoundPage() {
  return h("div", { class: "wrap" }, emptyState("search", "Page not found", "That page doesn't exist.", h("a", { class: "btn btn-outline btn-pill", href: "#/" }, "Rent a vehicle")));
}

render();
