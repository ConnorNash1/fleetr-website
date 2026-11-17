// fleetr.ai's static pages (Nov 17, SEO). Everything a reader or a search
// engine needs is already in the HTML; this adds the parts that act:
//   - Book a demo opens the form (Web3Forms, as on the home page's app);
//   - a city page's search goes to the fleetr.ai search for that city;
//   - a city page lists the companies live there now, with their schema, or
//     says more cars are coming and takes an email for updates.
const SB_URL = "https://hzcatlecvwpqxedrzfog.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Y2F0bGVjdndwcXhlZHJ6Zm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzQzMTMsImV4cCI6MjA5MzY1MDMxM30.mfqwWQh54hPsRunAVB6RDf_IrvwKmhSYWWJ4sMy0rcw";
const SITE = "https://fleetr.ai";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

async function rpc(fn, args) {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`${fn} ${res.status}`);
  return res.json();
}
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ── Book a demo ──
const dialog = document.getElementById("demo");
document.querySelectorAll("[data-demo]").forEach((a) => a.addEventListener("click", (e) => {
  if (!dialog || typeof dialog.showModal !== "function") return; // the link's #demo still lands on the form
  e.preventDefault();
  dialog.showModal();
  const first = dialog.querySelector("input[name=name]");
  if (first) first.focus();
}));
if (dialog) {
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dialog.close()));
  const form = dialog.querySelector("form");
  const status = dialog.querySelector("[data-status]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Sending...";
    status.textContent = "";
    try {
      const res = await fetch(WEB3FORMS_URL, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      const out = await res.json();
      if (!out.success) throw new Error("not sent");
      form.replaceWith(Object.assign(document.createElement("p"), { className: "lead", textContent: "Thanks. Your request is in, and we'll be in touch shortly." }));
    } catch (err) {
      status.textContent = "Something went wrong. Please email connor@fleetr.ai directly.";
      btn.disabled = false; btn.textContent = "Book a demo";
    }
  });
}

// ── A city page ──
const city = document.querySelector("[data-city]");
if (city) {
  const { city: slug, name, lat, lng, place } = city.dataset;
  const form = document.getElementById("find");
  if (form) {
    form.pu.value = form.pu.value || iso(addDays(1));
    form.rt.value = form.rt.value || iso(addDays(4));
    form.pu.min = iso(new Date());
    form.addEventListener("change", () => { if (form.rt.value <= form.pu.value) { const d = new Date(`${form.pu.value}T12:00:00`); d.setDate(d.getDate() + 1); form.rt.value = iso(d); } });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new URLSearchParams({ where: place, lat, lng, pu: `${form.pu.value}T${form.put.value || "10:00"}`, rt: `${form.rt.value}T${form.rtt.value || "10:00"}` });
      window.location.href = `/#/search?${q.toString()}`;
    });
  }
  const out = document.getElementById("listings");
  const pu = `${iso(addDays(1))} 10:00`, rt = `${iso(addDays(4))} 10:00`;
  rpc("public_search_near", { p_lat: Number(lat), p_lng: Number(lng), p_place: place, p_pickup: pu, p_return: rt, p_categories: null })
    .then((res) => {
      // Only companies in or near this city. When none is close, the search
      // offers the nearest ones anywhere (nearest: true); a city page says
      // "more cars coming" instead (found on staging: Halifax listed Corner
      // Brook, 642 km away).
      const radius = Number(res && res.radiusKm) || 50;
      const list = (res && res.ok && !res.nearest && Array.isArray(res.branches)) ? res.branches.filter((b) => b.distanceKm == null || Number(b.distanceKm) <= radius) : [];
      if (!list.length) return soon();
      out.innerHTML = `<h3>Companies renting in ${esc(name)} on fleetr.ai</h3>` + list.map((b) => `
        <a class="listing" href="/#/branch/${encodeURIComponent(b.locationId)}">
          <strong>${esc(b.company)}</strong>
          <span>${esc(b.name)}${b.address ? `, ${esc(b.address)}` : ""}</span>
          <span>${b.lowestDailyRate != null ? `<span class="from">From $${Math.round(Number(b.lowestDailyRate))} a day</span>` : ""}${b.minimumAge ? ` · Drivers ${esc(b.minimumAge)}+` : ""}${b.airportPickup ? " · Airport pickup" : ""}</span>
        </a>`).join("");
      addListingSchema(list);
    })
    .catch(() => soon());

  function soon() {
    out.innerHTML = `<div class="soon" id="soon">
      <h3>More cars are coming to ${esc(name)}</h3>
      <p>Local rental companies are joining fleetr.ai. Leave your email and we'll tell you when you can book in ${esc(name)}. One email when it's ready, nothing else.</p>
      <form id="waitlist" novalidate>
        <label class="sr-only" for="waitlist-email">Email</label>
        <input class="input" id="waitlist-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.ca" required>
        <button class="btn btn-primary" type="submit">Tell me</button>
      </form>
      <p class="note" role="status" aria-live="polite" data-wl-status></p>
    </div>`;
    const wl = document.getElementById("waitlist"), st = out.querySelector("[data-wl-status]");
    wl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = wl.email.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { st.textContent = "Check the email address."; wl.email.focus(); return; }
      const btn = wl.querySelector("button"); btn.disabled = true;
      try {
        const r = await rpc("public_join_waitlist", { p_city: slug, p_email: email });
        if (r && r.ok) { wl.remove(); st.textContent = `You're on the list. We'll email you when cars are ready to book in ${name}.`; }
        else { st.textContent = r && r.reason === "rate_limited" ? "Too many sign-ups from here just now. Try again in an hour." : "Check the email address."; btn.disabled = false; }
      } catch (err) { st.textContent = "That didn't go through. Try again in a moment."; btn.disabled = false; }
    });
  }

  // The listed companies as structured data: each branch a LocalBusiness
  // (an AutoRental) with its address and a Product offer from its lowest rate.
  function addListingSchema(list) {
    const items = list.map((b, i) => ({
      "@type": "ListItem", position: i + 1,
      item: {
        "@type": "AutoRental", name: `${b.company}, ${b.name}`,
        url: `${SITE}/#/branch/${b.locationId}`,
        address: b.address ? { "@type": "PostalAddress", streetAddress: b.address, addressLocality: name, addressCountry: "CA" } : undefined,
        geo: b.latitude != null ? { "@type": "GeoCoordinates", latitude: b.latitude, longitude: b.longitude } : undefined,
        makesOffer: b.lowestDailyRate != null ? {
          "@type": "Offer", priceCurrency: "CAD", price: Number(b.lowestDailyRate).toFixed(2),
          priceSpecification: { "@type": "UnitPriceSpecification", price: Number(b.lowestDailyRate).toFixed(2), priceCurrency: "CAD", unitText: "DAY" },
          itemOffered: { "@type": "Product", name: `Car rental in ${name} from ${b.company}`, category: "Car rental" },
        } : undefined,
      },
    }));
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: `Car rental companies in ${name}`, itemListElement: items });
    document.head.appendChild(s);
  }
}
