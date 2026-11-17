// fleetr.ai's static pages (Nov 17, SEO): what each says and the search it
// is written for. seo/build.mjs turns these into HTML. Plain language for
// rental operators and renters, Canadian spelling (but "license"), "fleetr"
// in lower case, and no claims the product does not make good on.
import { GUIDES } from "./guides.mjs";

export const ORG = {
  "@type": "Organization", "@id": "https://fleetr.ai/#org", name: "fleetr", legalName: "fleetr Technologies Corp.",
  url: "https://fleetr.ai", logo: "https://fleetr.ai/icon-512.png", email: "connor@fleetr.ai",
  areaServed: { "@type": "Country", name: "Canada" },
};

const DATE = "2026-11-17";
const hero = ({ kicker, h1, lead, demo = true, extra = "" }) => `<section class="hero"><div class="wrap">
      <span class="kicker">${kicker}</span>
      <h1>${h1}</h1>
      <p class="lead">${lead}</p>
      ${demo ? `<div class="actions"><a class="btn btn-primary" href="#demo" data-demo>Book a demo</a>${extra}</div>` : extra}
    </div></section>`;
const band = (title, inner, lead = "") => `<section class="band"><div class="wrap"><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}${inner}</div></section>`;
const cards = (items, cls = "grid-3") => `<div class="${cls}">${items.map(([t, p]) => `<div class="card"><h3>${t}</h3><p>${p}</p></div>`).join("")}</div>`;
const links = (items) => `<div class="grid-3">${items.map(([href, t, p]) => `<a class="card" href="${href}"><h3>${t}</h3><p>${p}</p><span class="more">Read more</span></a>`).join("")}</div>`;
const steps = (items) => `<ol class="steps">${items.map(([t, p]) => `<li><strong>${t}</strong>${p}</li>`).join("")}</ol>`;
const prose = (html) => `<div class="prose">${html}</div>`;
const OPS = (here) => [
  ["/car-rental-software/", "Car rental software", "Reservations, check-in, returns, damage and billing in one system."],
  ["/car-rental-software-canada/", "Built for Canadian rental companies", "HST and GST, kilometres and litres, every time zone, Canadian provinces."],
  ["/rental-fleet-management-software/", "Rental fleet management", "Every vehicle's status, maintenance, transfers and what it earns."],
  ["/car-rental-booking-system/", "Online booking system", "Take bookings on fleetr.ai and your phone line, in one list."],
  ["/rental-agreement-software/", "Digital rental agreements", "Signed on the customer's phone, with photos, coverages and the fuel level."],
  ["/dealership-loaner-software/", "Dealership loaners and rentals", "Run service loaners and rent out inventory without a rental counter."],
].filter(([h]) => h !== here);
const crumbsOp = (label, path) => [["/", "fleetr"], ["/rental-companies/", "For rental companies"], [path, label]];

// ── For rental companies ──
const operator = [
  {
    path: "/rental-companies/", group: "hub", navActive: "/rental-companies/",
    title: "Software for Independent Car Rental Companies | fleetr",
    ogTitle: "fleetr for rental companies",
    description: "Run an independent car rental company in one system: online bookings, phone check-in, digital agreements, damage claims, billing and reports.",
    keyword: "car rental management software",
    crumbs: [["/", "fleetr"], ["/rental-companies/", "For rental companies"]],
    features: ["Online booking on fleetr.ai", "Customer check-in and return on their phone", "Digital rental agreements", "Automatic texts", "Damage claims with photos", "Card on file", "Invoicing for insurers and body shops", "Reports"],
    body: hero({ kicker: "For rental companies", h1: "Run your rental company from one system, not five.",
      lead: "fleetr is rental software for independent car rental companies. Bookings, check-in, rental agreements, coverages, texts, returns, damage claims, billing and reports, in one place your whole team uses. Customers check themselves in and out on their own phone, so your staff aren't stuck on the lot while the counter phone rings." })
      + band("What changes on day one", cards([
        ["Bookings come to you", "Renters find and book your cars on fleetr.ai. Every booking lands in your reservations next to the walk-ins, phone calls and insurance replacements."],
        ["Check-in takes a minute", "The customer scans their license, photographs the car and signs the agreement on their phone. Your agent hands over the keys."],
        ["Paperwork is gone", "Every agreement is signed, stored and searchable. Damage photos, fuel and kilometres are on the rental, not on a clipboard."],
        ["Texts go out on their own", "Confirmations, return reminders, overdue notices and no-show follow-ups, in your own wording."],
        ["You get paid", "Save a card at booking, hold the estimate at pickup and charge the final total at close. Invoice insurers and body shops on terms."],
        ["You see the business", "Utilisation, revenue, money owed and what each car earns against what it loses in value."],
      ]))
      + band("Pick the part you came for", links(OPS("/rental-companies/")), "Each page goes deeper on one job.")
      + band("Who it's for", prose(`<p>fleetr is built for <strong>independent and regional rental companies</strong>: a single branch with twenty cars, or several branches with a few hundred. It suits companies that rent to the public, take insurance replacement work from body shops and adjusters, and look after corporate accounts, all at once.</p>
        <p>It was built in Atlantic Canada around the way rental counters actually work: the phone ringing, a body shop asking for a car today, a customer late for their flight, and a car that came back a quarter tank short.</p>`)),
    faq: [
      ["Do I have to stop using my current system on the first day?", "No. Most companies move their fleet, rates and upcoming reservations in first, run a few rentals on fleetr, then switch over. We help you move the data."],
      ["Do renters need to download an app?", "No. Check-in and return open in the phone's browser from a text link. Nothing to install."],
      ["Can I keep my own rates and coverages?", "Yes. You set your rates by class and source, your seasons and discounts, and your own coverages with your own wording."],
      ["How much does it cost?", "It depends on your fleet size and branches. Book a demo and we'll walk through pricing for your operation."],
    ],
  },
  {
    path: "/car-rental-software/", group: "operator", navLabel: "Car rental software", navActive: "/rental-companies/",
    title: "Car Rental Software for Independent Operators | fleetr",
    description: "Car rental software for reservations, phone check-in, digital agreements, damage claims, fuel and payments in one system, for independent operators.",
    keyword: "car rental software",
    crumbs: crumbsOp("Car rental software", "/car-rental-software/"),
    features: ["Reservations", "Online booking", "Customer self check-in", "Digital agreements", "Damage claims", "Fuel charges", "Card payments", "Reports"],
    body: hero({ kicker: "Car rental software", h1: "Car rental software your counter staff will actually like.",
      lead: "fleetr handles the full rental, from the booking to the final charge, without the clicking. One system for reservations, check-in, agreements, returns, damage, fuel and payments, made for independent rental companies rather than airport chains." })
      + band("The whole rental, in order", steps([
        ["Booked", "Online on fleetr.ai, by phone or at the counter. The rate fills itself in from the class and where the booking came from."],
        ["Confirmed", "The customer gets a text with their booking, what to bring and a link to check in."],
        ["Picked up", "They scan their license, photograph the car, choose coverages and sign on their phone. You hand over the keys."],
        ["Out", "Return reminders go out the day before. Extensions update the agreement and the charges."],
        ["Returned", "The customer logs the return, the time is locked in, and fuel and kilometres are compared with pickup."],
        ["Closed", "Charges are worked out, the card on file is charged or an invoice is sent, and any damage becomes a claim with photos."],
      ]), "Every step leaves a record, so nothing depends on someone remembering.")
      + band("What sets it apart", cards([
        ["Your customers do the data entry", "License details, damage photos and signatures come from the customer's phone, not your keyboard."],
        ["Just ask", "Type or say what you need, like moving a pickup to 3:00 or adding a driver, and fleetr does it."],
        ["Charges that add up", "Days, discounts, coverages, fuel, kilometres and taxes are worked out the same way everywhere in the system."],
        ["Damage you can prove", "Timestamped photos at pickup and return. Damage that was already there is carried forward, so nobody is billed twice."],
        ["Insurance and body shop work", "Bill-to accounts, claim numbers, repair orders and invoices on terms are built in, not bolted on."],
        ["A fleetr agent", "It watches the day for you: which car to clean next for the next pickup, and what needs a person."],
      ]))
      + band("Read on", links(OPS("/car-rental-software/"))),
    faq: [
      ["What is car rental software?", "It's the system a rental company runs on: reservations, rental agreements, check-in and return, vehicle status, payments and reports. fleetr also lists your fleet for renters on fleetr.ai."],
      ["How long does it take to set up?", "A guided setup walks through your branches, classes, rates, coverages and fleet, and you can take a test booking as soon as it's done."],
      ["Does it work on a tablet or phone?", "Yes. The staff app works in any modern browser on a computer, tablet or phone, and customers use their own phone for check-in and return."],
      ["Can I take payments through it?", "Yes. Cards are taken through Stripe on your own account: save a card at booking, hold the estimate at pickup and charge at close, or send a payment link."],
    ],
  },
  {
    path: "/car-rental-software-canada/", group: "operator", navLabel: "Car rental software in Canada", navActive: "/rental-companies/",
    title: "Car Rental Software Built for Canada | fleetr",
    description: "Car rental software built for Canada: HST and GST by branch, kilometres and litres, every Canadian time zone, and invoices for Canadian insurers.",
    keyword: "car rental software canada",
    crumbs: crumbsOp("Car rental software in Canada", "/car-rental-software-canada/"),
    audience: "Canadian car rental companies",
    features: ["HST and GST per branch", "Kilometres and litres", "Canadian time zones", "Canadian provinces on licenses and plates", "Insurer and body shop invoicing"],
    body: hero({ kicker: "Made in Canada", h1: "Car rental software built for Canada, not adapted for it.",
      lead: "Most rental software is built for the United States and then patched. fleetr was built in Atlantic Canada for Canadian rental companies: taxes by province, kilometres and litres, and time zones down to Newfoundland's half hour." })
      + band("The Canadian details, handled", cards([
        ["Sales tax by branch", "Each branch charges its own sales taxes, HST or GST and PST, and they print correctly on agreements, receipts and invoices."],
        ["Kilometres and litres", "Set your company's units once. Tank sizes, fuel prices, odometers and maintenance intervals all follow them."],
        ["Every time zone", "Pickup and return times are kept in the branch's own time zone, including Newfoundland Standard Time."],
        ["Canadian plates and licenses", "Provinces and territories on plates and licenses, and license checks that match how Canadian licenses read."],
        ["Canadian insurance work", "Replacement rentals for Canadian insurers and body shops, with claim numbers, adjusters, daily limits and invoices on terms."],
        ["Prices in dollars", "Whole-dollar rates, Canadian dollars throughout, and card payments through Stripe in CAD."],
      ]))
      + band("Built in Atlantic Canada", prose(`<p>fleetr was built in Newfoundland and Labrador, around the way rentals work in Atlantic Canada, where most are local: insurance replacements, a car while yours is in the shop, a weekend in Gros Morne or on the Cabot Trail. The software reflects that. It is quick at the counter, it handles a body shop asking for three cars today, and it copes with a February storm moving every return.</p>
        <p>Renters in <a href="/car-rental/st-johns/">St. John's</a>, <a href="/car-rental/halifax/">Halifax</a>, <a href="/car-rental/moncton/">Moncton</a>, <a href="/car-rental/charlottetown/">Charlottetown</a> and <a href="/car-rental/fredericton/">Fredericton</a> can find listed companies on fleetr.ai, and listed companies get those bookings straight into their reservations.</p>`))
      + band("Read on", links(OPS("/car-rental-software-canada/"))),
    faq: [
      ["Does fleetr charge HST correctly in every province?", "Each branch is set up with the sales taxes it charges, so a branch in Nova Scotia and one in Ontario each apply their own rates on every rental."],
      ["Can I use miles instead of kilometres?", "Yes. Units are a company setting, and figures already on file are converted for display, never changed."],
      ["Is it only for Atlantic Canada?", "No. It works anywhere in Canada. It started in Atlantic Canada, and that's where fleetr.ai's renter pages are live first."],
      ["Who do I talk to?", "Book a demo and you'll speak with the fleetr team directly."],
    ],
  },
  {
    path: "/rental-fleet-management-software/", group: "operator", navLabel: "Rental fleet management", navActive: "/rental-companies/",
    title: "Rental Fleet Management Software | fleetr",
    description: "See every rental vehicle's status, what's due back, maintenance by kilometres, transfers between branches and what each car earns, in one live view.",
    keyword: "rental fleet management software",
    crumbs: crumbsOp("Rental fleet management", "/rental-fleet-management-software/"),
    features: ["Vehicle status board", "Availability by class for a year", "Preventative maintenance by kilometres", "Branch transfers", "Utilisation and vehicle economics"],
    body: hero({ kicker: "Rental fleet management", h1: "Know where every car is, and what it's earning.",
      lead: "fleetr keeps your rental fleet in one live view: what's available, what's out and due back, what needs cleaning, what's in for maintenance and what's damaged. Then it shows you which cars are paying their way." })
      + band("Your fleet, live", cards([
        ["Every status at a glance", "Available, needs cleaning, ready returns, maintenance, damaged and on rent, with each car's plate, class and what it needs next."],
        ["Availability ahead", "A calm grid of free cars by class for the next 30 days and beyond, so you see a sold-out weekend before it happens."],
        ["Maintenance by the kilometre", "Set each car's service interval. fleetr flags it when it's due and keeps it off rent until the service is logged."],
        ["Transfers between branches", "Send a car to the branch that needs it, and receive it at the other end, with a record of both."],
        ["Clean next", "The fleetr agent looks at the next 24 hours of pickups and tells your team which car to clean first."],
        ["What each car earns", "Rental income against costs and the value it loses each month, so you know which cars to keep and which to sell."],
      ]))
      + band("Decisions, not spreadsheets", prose(`<p>Fleet management at a rental company comes down to a few questions asked every day: <strong>do we have the cars for tomorrow's pickups, which ones are earning, and which are costing us money?</strong> fleetr answers them from the rentals you already run, so there is nothing extra to keep up to date.</p>
        <ul><li><strong>Utilisation</strong> by class and branch, against the period before.</li>
        <li><strong>Lost demand</strong>: the searches and requests you couldn't fill, by class and date.</li>
        <li><strong>Vehicle economics</strong>: depreciation so far, value lost a month and net a month for each car.</li></ul>`))
      + band("Read on", links(OPS("/rental-fleet-management-software/"))),
    faq: [
      ["Does fleetr track maintenance?", "Yes. Each vehicle has a service interval in kilometres. When it's due, fleetr flags it and moves it to maintenance once it's next back, until someone marks the service done."],
      ["Can I see availability for a holiday weekend months ahead?", "Yes. Availability looks a full year ahead by class, with sold-out and running-low dates called out."],
      ["Does it handle more than one branch?", "Yes. Each branch has its own fleet, and executives can see one branch or the whole company."],
      ["Can it tell me when to sell a car?", "It shows each car's depreciation, monthly value loss and net income, which is what that decision rests on."],
    ],
  },
  {
    path: "/car-rental-booking-system/", group: "operator", navLabel: "Car rental booking system", navActive: "/rental-companies/",
    title: "Car Rental Booking System with Online Booking | fleetr",
    description: "Take online bookings on fleetr.ai alongside phone and walk-in bookings, priced from your rates, with verified renters who check in on their phone.",
    keyword: "car rental booking system",
    crumbs: crumbsOp("Car rental booking system", "/car-rental-booking-system/"),
    features: ["Online booking on fleetr.ai", "Phone-verified bookings", "Rates by class, source and season", "Free cancellation links", "No-show handling"],
    body: hero({ kicker: "Car rental booking system", h1: "Take bookings online without building a website.",
      lead: "fleetr lists your fleet on fleetr.ai, where renters search by city and dates, see your real availability and book in minutes. Every booking lands in your reservations with the rate, the coverages they chose and a verified phone number." })
      + band("How a renter books", steps([
        ["They search", "By city, address or airport code, with their dates. fleetr.ai shows companies with cars free for those dates."],
        ["They choose", "A class, with your daily rate, the total and your coverages, before tax. Your hours, minimum age and payment methods are on the page."],
        ["They verify their phone", "A text code confirms the number, so your bookings come from real people you can reach."],
        ["You get the booking", "It's in your reservations straight away, and they get a confirmation text with a check-in link and a link to cancel."],
      ]), "No booking engine to configure, no website to maintain.")
      + band("Bookings from everywhere, in one list", cards([
        ["Online and walk-in", "fleetr.ai bookings sit next to phone and counter bookings, each marked with where it came from."],
        ["Rates that fill themselves in", "By class and source, with seasons and weekly or monthly discounts. Staff don't look anything up."],
        ["Availability that holds", "fleetr.ai only offers what you actually have free, counting cars out, due back and your turnaround time."],
        ["Partners book too", "Body shops, insurers and dealerships book replacement rentals in their own portal with claim or repair order numbers."],
        ["No-shows handled", "A missed pickup gets a follow-up text, and the booking is cancelled at your cutoff if nobody moves it."],
        ["Cancellations without calls", "Renters cancel or change their pickup time from a link in their text, and the car goes back on sale."],
      ]))
      + band("Read on", links(OPS("/car-rental-booking-system/"))),
    faq: [
      ["Do I need my own website to take online bookings?", "No. Your branch gets its own page on fleetr.ai with your cars, rates, hours and requirements, and renters book there."],
      ["Do renters pay when they book?", "Not by default. Renters reserve without paying and pay at pickup. You can ask them to save a card for pickup if your company takes saved cards."],
      ["Can I stop taking online bookings for a while?", "Yes. Your listing can be switched off, and each class can be taken off sale on its own."],
      ["How do I avoid double bookings?", "fleetr.ai checks your live availability, including cars out and due back, at the moment of booking."],
    ],
  },
  {
    path: "/rental-agreement-software/", group: "operator", navLabel: "Digital rental agreements", navActive: "/rental-companies/",
    title: "Rental Agreement Software for Car Rentals | fleetr",
    description: "Digital car rental agreements signed on the renter's phone, with their license, damage photos, coverage choices, fuel and kilometres on file.",
    keyword: "rental agreement software",
    crumbs: crumbsOp("Digital rental agreements", "/rental-agreement-software/"),
    features: ["Agreements built from the booking", "Signed on the renter's phone", "License scan", "Damage photos", "Coverage choices recorded", "Searchable history"],
    body: hero({ kicker: "Rental agreement software", h1: "Every rental agreement signed, complete and easy to find.",
      lead: "fleetr turns the booking into the rental agreement, has the renter sign it on their own phone, and keeps it with the license, damage photos, coverage choices, fuel and kilometres. No paper, no missing initials, no filing cabinet." })
      + band("What's on every agreement", cards([
        ["The renter, checked", "License details scanned from the card, with the name matched against the booking. A mismatch is flagged for a person to look at."],
        ["The vehicle, photographed", "Timestamped photos at pickup, and damage that was already there carried forward from earlier rentals."],
        ["Coverages, accepted or declined", "Your coverages in your own wording, with the renter's choice recorded on each, every time."],
        ["Fuel and kilometres", "Pulled from the vehicle's last return, so pickup readings are never guessed."],
        ["Your terms", "Your rental terms and acknowledgements, shown before the renter signs."],
        ["The signature", "Signed on the renter's phone at pickup, with the time it was signed."],
      ]))
      + band("Why companies drop paper", prose(`<p>Paper agreements fail in the same few ways: a missing initial on the coverage box, a damage diagram nobody can read, a fuel level written as "3/4?" and a filing cabinet nobody can search when the claim arrives three weeks later. Each of those costs money when a renter disputes a charge.</p>
        <p>With fleetr, the agreement can't be finished with a field missing, the photos prove what the car looked like, and any agreement is found in seconds by name, plate or code. Read our guide to <a href="/resources/replace-paper-rental-agreements/">replacing paper rental agreements</a> for a step-by-step switch.</p>`))
      + band("Read on", links(OPS("/rental-agreement-software/"))),
    faq: [
      ["Are electronic rental agreements legally valid in Canada?", "Every province has electronic commerce legislation that recognizes electronic signatures and records. Have your lawyer review your rental terms either way; fleetr records who signed, what they saw and when."],
      ["What if the renter doesn't have a smartphone?", "Your agent can run the same check-in on a tablet at the counter, and the renter signs there."],
      ["Can I change my terms?", "Yes. You set your own terms and acknowledgements, and each agreement keeps the version the renter signed."],
      ["Can renters get a copy?", "Yes. The agreement is available to the renter from their rental link, and receipts go by text or email."],
    ],
  },
  {
    path: "/dealership-loaner-software/", group: "operator", navLabel: "Dealership loaner software", navActive: "/dealership-loaner-software/",
    title: "Dealership Loaner Software for Service and Rentals | fleetr",
    description: "Hand out service loaners and rent out inventory with agreements signed on the customer's phone, damage photos and fuel tracked, and no rental counter.",
    keyword: "dealership loaner software",
    audience: "Car dealerships",
    crumbs: crumbsOp("Dealership loaner software", "/dealership-loaner-software/"),
    features: ["Service loaner agreements", "Customer check-in on their phone", "Damage photos", "Fuel and kilometres", "Rent out inventory on fleetr.ai", "Take vehicles off rent when sold"],
    body: hero({ kicker: "For dealerships", h1: "Loaners and rentals, handled without a rental counter.",
      lead: "fleetr gives your service department a proper loaner process and lets your inventory earn while it waits to sell. Customers check out and return on their own phone, every loaner gets a signed agreement, and nothing depends on a clipboard at the service desk." })
      + band("Service loaners, done properly", cards([
        ["A signed agreement for every loaner", "Built from the repair order, signed on the customer's phone, with your terms and their license on file."],
        ["Photos at both ends", "Timestamped photos when the loaner goes out and comes back, so new damage is never a guess."],
        ["Fuel and kilometres", "Recorded at pickup and return. Anything short can be charged at your fuel price."],
        ["Bill the right party", "Charge the customer, or bill a warranty provider or insurer on account, with the repair order number on the invoice."],
        ["Texts on their own", "A reminder before the loaner is due back, and a follow-up if it's late."],
        ["Fewer keys at the desk", "The customer checks themselves out from a text link. Your advisor hands over the keys and moves on."],
      ]))
      + band("Let inventory earn until it sells", prose(`<p>Used inventory and demonstrators lose value every month they sit on the lot. With fleetr, you can rent them out on <a href="/">fleetr.ai</a> to renters searching nearby, with your own rates and rules, and <strong>take any vehicle off rent the moment it sells or needs work.</strong></p>
        <p>You don't need to become a rental company to do it: no counter, no extra staff, no rental website. Bookings, agreements, check-in and returns run the same way as your loaners.</p>`))
      + band("Read on", links(OPS("/dealership-loaner-software/"))),
    faq: [
      ["What is dealership loaner software?", "It's how a dealership hands out and tracks courtesy cars and service loaners: who has which car, the signed agreement, its condition, fuel and kilometres, and when it's due back."],
      ["Can we use our own vehicles?", "Yes. Add your loaners and any inventory you want to rent, and choose which are listed for public rental."],
      ["Do we need rental insurance?", "Renting to the public usually needs coverage beyond a dealer policy. Talk to your broker; we're happy to point you in the right direction."],
      ["Can body shops and insurers book with us?", "Yes. Partners can book replacement rentals in their own portal with claim or repair order numbers, and you invoice them on terms."],
    ],
  },
];

// ── Car rental by city ──
const cityPage = (c) => ({
  path: `/car-rental/${c.slug}/`, group: "city", short: c.short, cityFull: c.name, province: c.province, navActive: "/",
  title: `Car Rental ${c.short}: Rent from Local Companies | fleetr`,
  ogTitle: `Car rental in ${c.short}`,
  description: c.description,
  keyword: c.keyword,
  crumbs: [["/", "fleetr"], ["/car-rental/", "Car rental"], [`/car-rental/${c.slug}/`, c.short]],
  faq: c.faq,
  body: `<div data-city="${c.slug}" data-name="${c.short}" data-lat="${c.lat}" data-lng="${c.lng}" data-place="${c.place}"></div>
    <section class="hero"><div class="wrap">
      <span class="kicker">${c.province}</span>
      <h1>Car rental in ${c.short}</h1>
      <p class="lead">${c.lead}</p>
      <form class="find" id="find" aria-label="Search for a car in ${c.short}">
        <label class="field"><span>Pickup date</span><input class="input" type="date" name="pu" required></label>
        <label class="field"><span>Time</span><input class="input" type="time" name="put" value="10:00" step="900"></label>
        <label class="field"><span>Return date</span><input class="input" type="date" name="rt" required></label>
        <label class="field"><span>Time</span><input class="input" type="time" name="rtt" value="10:00" step="900"></label>
        <button class="btn btn-primary" type="submit">Search ${c.short}</button>
      </form>
      <div id="listings" aria-live="polite"><p class="loading">Looking for companies in ${c.short}...</p></div>
      <noscript><p class="note">Search all of fleetr.ai on the <a href="/">home page</a>.</p></noscript>
    </div></section>`
    + band(`Picking up in ${c.short}`, cards(c.pickup, "grid-3 grid-2"))
    + band("How booking on fleetr.ai works", steps([
      ["Search your dates", `Pick your dates above. fleetr.ai shows companies with cars free in ${c.short} for exactly those days, with the total before tax.`],
      ["Book in minutes", "Choose a car and any coverages, then confirm your mobile number with a text code. You won't be charged when you book."],
      ["Check in on your phone", "Your confirmation text has a check-in link. At pickup you scan your license, photograph the car and sign, which takes a few minutes."],
      ["Pay at pickup", "Pay the company directly when you pick up. Some companies let you save a card ahead of time. Cancel free before pickup from the link in your text."],
    ]))
    + band(`What to know before you drive in ${c.short}`, prose(c.know))
    + band("Other cities", `<div class="grid-3">${CITIES.filter((x) => x.slug !== c.slug).map((x) => `<a class="card" href="/car-rental/${x.slug}/"><h3>Car rental ${x.short}</h3><p>${x.teaser}</p><span class="more">See ${x.short}</span></a>`).join("")}</div>`),
});

const CITIES = [
  {
    slug: "st-johns", short: "St. John's", name: "St. John's", province: "Newfoundland and Labrador", place: "St. John's, Newfoundland and Labrador",
    lat: 47.5615, lng: -52.7126, keyword: "car rental st. john's",
    description: "Car rental in St. John's, NL from local companies, downtown or near St. John's International Airport (YYT). Book in minutes and pay at pickup.",
    teaser: "Downtown, near the airport, and the Avalon Peninsula.",
    lead: "Rent a car from local St. John's companies, for a week on the Avalon or while yours is in the shop. See real availability for your dates, book in minutes and pay when you pick up.",
    pickup: [
      ["Near St. John's International Airport (YYT)", "The airport is about 10 to 15 minutes from downtown by car. Some companies meet you at the airport or nearby; each listing says whether it offers airport pickup."],
      ["Downtown and the east end", "Companies in town are handy if you're staying downtown, near Water Street, or swapping cars while your own is being repaired."],
      ["Opening hours matter", "Local branches keep their own hours, often closed or short on Sundays. Your pickup and return need to fall inside them; fleetr.ai only offers times that work."],
      ["Winter tires", "From late fall to spring, ask for a car with winter tires. Each company lists which of its cars have them."],
    ],
    know: `<p><strong>Plan for the weather.</strong> St. John's weather changes fast, with fog, wind and snow from November into April. Leave extra time, and keep the headlights on in fog.</p>
      <p><strong>Watch for moose.</strong> Outside the city, especially on the Trans-Canada Highway and rural roads at dawn and dusk, moose are a real hazard. Slow down after dark.</p>
      <p><strong>Day trips.</strong> Signal Hill and Quidi Vidi are minutes from downtown, Cape Spear (the most easterly point in North America) is about 20 minutes away, and the Irish Loop and Witless Bay make a full day. Gros Morne is a long drive across the island, so plan an overnight.</p>
      <p><strong>Bring your license and a card.</strong> You'll need a valid driver's license, and most companies take a credit card for the rental and any deposit. Each listing shows its minimum age and the payment methods it takes.</p>`,
    faq: [
      ["How old do you have to be to rent a car in St. John's?", "It depends on the company. Many set the minimum at 21 or 25. Each listing on fleetr.ai shows its minimum age before you book."],
      ["Can I pick up a rental car at St. John's airport?", "Some local companies offer airport pickup, and others are a short drive away. Each listing says whether it picks up at the airport."],
      ["Do I pay when I book?", "No. Booking on fleetr.ai doesn't charge you. You pay the rental company at pickup, and you can cancel free before then."],
    ],
  },
  {
    slug: "halifax", short: "Halifax", name: "Halifax", province: "Nova Scotia", place: "Halifax, Nova Scotia",
    lat: 44.6488, lng: -63.5752, keyword: "rent a car halifax",
    description: "Rent a car in Halifax from local companies, downtown, in Dartmouth or near Halifax Stanfield (YHZ). See real availability and pay at pickup.",
    teaser: "Downtown, Dartmouth, and the drive in from Stanfield.",
    lead: "Rent a car in Halifax from local companies, for a trip to Peggy's Cove or a week while your car is in the body shop. See what's actually free for your dates, book in minutes and pay at pickup.",
    pickup: [
      ["Halifax Stanfield International Airport (YHZ)", "The airport is about 35 km from downtown, roughly 30 to 45 minutes by car. A local company near your hotel can be cheaper than renting at the airport; each listing says whether it offers airport pickup."],
      ["Downtown, the North End and Dartmouth", "Companies across the harbour are close to the bridges and the ferry. Pick the side you're staying on to save the crossing."],
      ["Bridge tolls", "The Macdonald and MacKay bridges between Halifax and Dartmouth charge a small toll each way. Ask the company how it's handled."],
      ["Opening hours", "Local branches keep their own hours. fleetr.ai only offers pickup and return times inside them."],
    ],
    know: `<p><strong>Getting around.</strong> Downtown Halifax is compact and hilly, with paid parking on most streets. Highways 102 and 103 take you out of the city quickly for day trips.</p>
      <p><strong>Day trips.</strong> Peggy's Cove is about 45 minutes away, Lunenburg about an hour and a quarter, and the Annapolis Valley around an hour. The Cabot Trail on Cape Breton is a weekend, not a day.</p>
      <p><strong>Winter driving.</strong> From December to March, snow and freezing rain are common. Ask for a car with winter tires; each company lists which of its cars have them.</p>
      <p><strong>Bring your license and a card.</strong> You'll need a valid driver's license, and most companies take a credit card. Each listing shows its minimum age and the payment methods it takes.</p>`,
    faq: [
      ["Is it cheaper to rent a car at Halifax airport or downtown?", "Often downtown, because airport rentals can carry extra fees. Compare totals on fleetr.ai for your dates; prices shown are before tax."],
      ["How far is Halifax Stanfield airport from downtown?", "About 35 km, which is 30 to 45 minutes by car depending on traffic."],
      ["Can I cancel a Halifax booking?", "Yes. Cancel free any time before pickup with the link in your confirmation text."],
    ],
  },
  {
    slug: "moncton", short: "Moncton", name: "Moncton", province: "New Brunswick", place: "Moncton, New Brunswick",
    lat: 46.0878, lng: -64.7782, keyword: "car rental moncton",
    description: "Car rental in Moncton, NB from local companies, downtown or near the Moncton airport (YQM). See real availability, book in minutes, pay at pickup.",
    teaser: "The airport in Dieppe, downtown, and Shediac and the shore.",
    lead: "Rent a car in Moncton from local companies, for the Hopewell Rocks, Shediac's beaches, or while your car is being repaired. See real availability for your dates and pay at pickup.",
    pickup: [
      ["Greater Moncton Roméo LeBlanc International Airport (YQM)", "The airport is about 10 km east of downtown, around 15 minutes by car. Each listing says whether the company offers airport pickup."],
      ["Downtown, Dieppe and Riverview", "Moncton, Dieppe and Riverview sit side by side. Choose the company closest to where you're staying."],
      ["A bilingual city", "Moncton is officially bilingual. Many local companies serve customers in English and French."],
      ["Opening hours", "Local branches keep their own hours. fleetr.ai only offers pickup and return times inside them."],
    ],
    know: `<p><strong>Day trips.</strong> The Hopewell Rocks on the Bay of Fundy are about 40 minutes south; check the tide times before you go. Shediac and Parlee Beach are about 25 minutes east, and Fundy National Park is just over an hour.</p>
      <p><strong>Crossroads of the Maritimes.</strong> Moncton is a natural starting point: Halifax is about two and a half hours away, and the Confederation Bridge to Prince Edward Island about an hour.</p>
      <p><strong>Winter driving.</strong> Snow is regular from December to March. Ask for a car with winter tires; each company lists which of its cars have them.</p>
      <p><strong>Bring your license and a card.</strong> You'll need a valid driver's license, and most companies take a credit card. Each listing shows its minimum age and the payment methods it takes.</p>`,
    faq: [
      ["Can I drive a Moncton rental car to Prince Edward Island?", "Usually, yes, but check with the company first. The Confederation Bridge charges a toll when you leave the Island."],
      ["How far is Moncton airport from downtown?", "About 10 km, around 15 minutes by car."],
      ["Do I need to pay when I book?", "No. Reserve on fleetr.ai without paying and pay the company at pickup."],
    ],
  },
  {
    slug: "charlottetown", short: "Charlottetown", name: "Charlottetown", province: "Prince Edward Island", place: "Charlottetown, Prince Edward Island",
    lat: 46.2382, lng: -63.1311, keyword: "car rental charlottetown",
    description: "Car rental in Charlottetown, PEI from local companies, downtown or near Charlottetown Airport (YYG). Book in minutes and pay at pickup.",
    teaser: "Downtown, the airport, and the whole Island within reach.",
    lead: "Rent a car in Charlottetown from local companies and see the Island your way, from the North Shore beaches to the red cliffs. Real availability for your dates, booked in minutes, paid at pickup.",
    pickup: [
      ["Charlottetown Airport (YYG)", "The airport is just north of the city, about 10 minutes from downtown. Each listing says whether the company offers airport pickup."],
      ["Downtown and the waterfront", "Handy if you're staying downtown or arriving by bus or ferry."],
      ["Book ahead in summer", "July and August are busy across the Island, and cars sell out. Book as early as you can."],
      ["Opening hours", "Local branches keep their own hours. fleetr.ai only offers pickup and return times inside them."],
    ],
    know: `<p><strong>The whole Island is close.</strong> Cavendish and the North Shore beaches are about 40 minutes away, and nowhere on the Island is more than a few hours' drive.</p>
      <p><strong>Leaving the Island.</strong> The Confederation Bridge to New Brunswick is about 45 minutes west of Charlottetown. There's a toll when you leave the Island, not when you arrive. Check that your rental company allows travel off the Island.</p>
      <p><strong>Rural roads.</strong> Many scenic roads are narrow, and some are red clay. Take your time, and watch for cyclists in summer.</p>
      <p><strong>Bring your license and a card.</strong> You'll need a valid driver's license, and most companies take a credit card. Each listing shows its minimum age and the payment methods it takes.</p>`,
    faq: [
      ["Do I need a car on Prince Edward Island?", "For most visitors, yes. Public transit is limited outside Charlottetown and Summerside, and the beaches and villages are spread out."],
      ["Is there a toll on the Confederation Bridge?", "Yes, paid when you leave the Island. Arriving is free."],
      ["How early should I book a car in Charlottetown in summer?", "As early as you can. July and August are the busiest months, and local fleets fill up."],
    ],
  },
  {
    slug: "fredericton", short: "Fredericton", name: "Fredericton", province: "New Brunswick", place: "Fredericton, New Brunswick",
    lat: 45.9636, lng: -66.6431, keyword: "car rental fredericton",
    description: "Car rental in Fredericton, NB from local companies, downtown or near Fredericton International Airport (YFC). Book in minutes and pay at pickup.",
    teaser: "Downtown, the north side, and the airport in Lincoln.",
    lead: "Rent a car in Fredericton from local companies, for a trip up the Saint John River valley or while your car is in the shop. See real availability for your dates and pay at pickup.",
    pickup: [
      ["Fredericton International Airport (YFC)", "The airport is about 15 km southeast of downtown, around 20 minutes by car. Each listing says whether the company offers airport pickup."],
      ["Downtown and the north side", "The city sits on both banks of the Saint John River. Pick a company on the side you're staying on."],
      ["University terms", "Demand rises around the start and end of university terms. Book early in late August, September and April."],
      ["Opening hours", "Local branches keep their own hours. fleetr.ai only offers pickup and return times inside them."],
    ],
    know: `<p><strong>Day trips.</strong> Kings Landing is about 30 minutes west, Saint John and the Bay of Fundy about an hour south, and Moncton about two hours east.</p>
      <p><strong>Winter driving.</strong> Fredericton gets plenty of snow from December to March. Ask for a car with winter tires; each company lists which of its cars have them.</p>
      <p><strong>Wildlife.</strong> Deer and moose cross highways outside the city, most often at dawn and dusk.</p>
      <p><strong>Bring your license and a card.</strong> You'll need a valid driver's license, and most companies take a credit card. Each listing shows its minimum age and the payment methods it takes.</p>`,
    faq: [
      ["How far is Fredericton airport from downtown?", "About 15 km, around 20 minutes by car."],
      ["Can I rent a car in Fredericton for a one-way trip?", "Some companies allow it, often for a fee. Ask the company before you book."],
      ["What do I need to rent a car in Fredericton?", "A valid driver's license, a payment method the company takes, and to meet its minimum age. Each listing shows both."],
    ],
  },
];

const cityHub = {
  path: "/car-rental/", group: "hub", navActive: "/",
  title: "Car Rental in Atlantic Canada from Local Companies | fleetr",
  ogTitle: "Car rental in Atlantic Canada",
  description: "Rent a car from local companies in St. John's, Halifax, Moncton, Charlottetown and Fredericton. Real availability, booked in minutes, paid at pickup.",
  keyword: "car rental atlantic canada",
  crumbs: [["/", "fleetr"], ["/car-rental/", "Car rental"]],
  cta: false,
  body: hero({ kicker: "Car rental", h1: "Rent from local companies across Atlantic Canada.", demo: false,
    lead: "fleetr.ai lists local rental companies, so you see their real availability, book in minutes and pay at pickup. Pick a city, or search any address on the home page.",
    extra: `<div class="actions"><a class="btn btn-primary" href="/">Search fleetr.ai</a></div>` })
    + band("Cities", `<div class="grid-3">${CITIES.map((x) => `<a class="card" href="/car-rental/${x.slug}/"><h3>Car rental ${x.short}</h3><p>${x.teaser}</p><span class="more">See ${x.short}</span></a>`).join("")}</div>`)
    + band("Run a rental company?", prose(`<p>List your fleet on fleetr.ai and take bookings straight into your reservations. <a href="/rental-companies/">See how fleetr works for rental companies</a>.</p>`)),
};

// ── Guides ──
const toc = (items) => `<nav class="toc" aria-label="On this page"><strong>On this page</strong><ol>${items.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("")}</ol></nav>`;
const article = (a) => ({
  path: `/resources/${a.slug}/`, group: "article", navLabel: a.navLabel, navActive: "/rental-companies/", date: DATE,
  title: `${a.title} | fleetr`, ogTitle: a.title, description: a.description, keyword: a.keyword, h1: a.h1,
  crumbs: [["/", "fleetr"], ["/resources/", "Guides"], [`/resources/${a.slug}/`, a.navLabel]],
  ctaTitle: a.ctaTitle, ctaText: a.ctaText, faq: a.faq,
  body: `<article><div class="wrap"><header class="hero" style="padding-bottom:0"><span class="kicker">Guide</span><h1>${a.h1}</h1><p class="lead">${a.lead}</p>
      <p class="article-meta">By the fleetr team. <time datetime="${DATE}">November 17, 2026</time>.</p></header>
      ${toc(a.toc)}
      <div class="prose" style="padding:40px 0 56px">${a.html}</div></div></article>`,
});

const ARTICLES = [
  article({
    slug: "start-a-car-rental-business-canada", navLabel: "Start a car rental business in Canada", keyword: "how to start a car rental business in canada",
    title: "How to Start a Car Rental Business in Canada",
    h1: "How to start a car rental business in Canada",
    description: "Start a car rental business in Canada: choose a niche, register, insure the fleet, register for GST/HST, buy the first cars, set rates and get bookings.",
    lead: "A step-by-step guide for anyone thinking about renting out cars in Canada, from choosing your customers to taking your first booking, written by people who build rental software with Canadian operators.",
    ctaTitle: "Starting out? Start organized.", ctaText: "We'll show you how a new rental company runs on fleetr, from the first car to the first booking.",
    toc: [["niche", "Choose who you rent to"], ["register", "Register the business"], ["insurance", "Get commercial fleet insurance"], ["tax", "Register for GST and HST"], ["fleet", "Buy the first cars"], ["rates", "Set your rates and rules"], ["paper", "Agreements, coverages and deposits"], ["software", "Pick your software"], ["bookings", "Get your first bookings"]],
    html: `<p>Car rental looks simple from the counter: cars, keys, a form. Behind it is insurance that most brokers don't write every day, cars that lose value every month, and a cash cycle that starts with buying the vehicles. Here is how to start one in Canada without the expensive surprises.</p>
      <h2 id="niche">1. Choose who you rent to</h2>
      <p>The big brands own the airport counters. Independent companies win somewhere else, and choosing where shapes every decision after this one.</p>
      <ul><li><strong>Insurance replacement.</strong> Drivers whose car is in the body shop after a claim, booked by adjusters and shops. Steady, weekday-heavy, paid on account.</li>
      <li><strong>Local and neighbourhood rentals.</strong> People whose own car is in for service, students, families with visitors. Price-sensitive, often booked the same day.</li>
      <li><strong>Tourism.</strong> Strongly seasonal in most of Canada, with summer peaks that can sell out a fleet, and quiet winters.</li>
      <li><strong>Trucks and vans.</strong> Moves, contractors and small businesses. Higher rates, more wear.</li></ul>
      <p>Most successful independents mix two: insurance work fills weekdays and the off-season, retail fills weekends and summer.</p>
      <h2 id="register">2. Register the business</h2>
      <p>Register your business name provincially, or incorporate federally or provincially, and get a CRA business number. Check your municipality for a business license and zoning on your lot; some municipalities treat a car rental lot differently from an ordinary office. Ask your accountant whether to incorporate before you buy vehicles, because who owns the cars matters for financing, insurance and tax.</p>
      <h2 id="insurance">3. Get commercial fleet insurance</h2>
      <p>This is the step that sinks the most start-ups. A personal or ordinary commercial auto policy does not cover renting cars to the public. You need a <strong>rental fleet policy</strong> from an insurer that writes rental risk, usually through a broker who knows it. Expect underwriters to ask about your rental agreement, how you check drivers' licenses, your minimum age and how you handle damage.</p>
      <p>Third-party liability minimums are set by each province. In Atlantic Canada, most sources put the minimum at $200,000 in Newfoundland and Labrador, New Brunswick and Prince Edward Island, and $500,000 in Nova Scotia; many rental fleets carry well above the minimum. Confirm current figures with your broker and provincial regulator. Our guide to <a href="/resources/insurance-rental-fleet-canada/">insurance for rental fleets in Canada</a> goes further.</p>
      <h2 id="tax">4. Register for GST and HST</h2>
      <p>Once your taxable revenue passes $30,000 over four consecutive calendar quarters, you must register for GST/HST with the CRA, and most rental companies register from day one so they can claim back the tax on the cars they buy. Rentals are taxable at the rate where the car is picked up, which is HST in the Atlantic provinces and Ontario, and GST plus provincial tax elsewhere. Some provinces add their own levies on short-term vehicle rentals; ask your accountant what applies to you.</p>
      <h2 id="fleet">5. Buy the first cars</h2>
      <p>Start smaller than you think. Ten well-chosen cars that rent 70% of the time beat thirty that sit. A few rules from operators:</p>
      <ul><li><strong>Buy what your customers book.</strong> For insurance work that's mid-size sedans and small SUVs, matched to what people drive. For tourism it's SUVs and minivans.</li>
      <li><strong>Buy two to three years old.</strong> The steepest depreciation is gone, and the cars still look and drive new.</li>
      <li><strong>Plan the exit.</strong> Know roughly when you'll sell each car. Track what each one earns against what it loses in value each month.</li>
      <li><strong>Winter tires.</strong> In most of Canada, renters expect them from November to April, and Quebec requires them in winter.</li></ul>
      <h2 id="rates">6. Set your rates and rules</h2>
      <p>Price by class and by who's booking: a retail daily rate, weekly and monthly discounts, and agreed rates for insurers and corporate accounts. Raise prices for peak dates, and decide your rules in writing before the first customer: minimum age, deposit, kilometre allowance, fuel policy, where the car may go, late returns and smoking.</p>
      <h2 id="paper">7. Agreements, coverages and deposits</h2>
      <p>Your rental agreement is your protection when something goes wrong. Have a lawyer review it, record the renter's license, photograph the car at pickup and return, and record which coverages the renter accepted or declined every time. A card on file with a hold at pickup protects you against damage and fuel shortfalls. Our guide to <a href="/resources/replace-paper-rental-agreements/">replacing paper rental agreements</a> covers doing this without paper.</p>
      <h2 id="software">8. Pick your software</h2>
      <p>Spreadsheets break at about five cars. Look for software that handles reservations from every source, check-in and return, signed agreements with photos, payments, damage claims, invoices for insurers and body shops, and reports on utilisation and what each car earns. <a href="/car-rental-software/">See how fleetr does it</a>.</p>
      <h2 id="bookings">9. Get your first bookings</h2>
      <ul><li><strong>Visit every body shop and dealership nearby.</strong> They need replacement cars for customers every day.</li>
      <li><strong>Introduce yourself to insurance adjusters</strong> with your rates, your fleet and how quickly you can deliver a car.</li>
      <li><strong>List online.</strong> Your Google Business Profile, and a marketplace like <a href="/">fleetr.ai</a> where renters search by city and dates.</li>
      <li><strong>Answer the phone.</strong> Same-day rentals go to whoever picks up.</li></ul>
      <p>Start with a niche, insure properly, keep the fleet earning, and let the software carry the paperwork.</p>`,
    faq: [
      ["How much does it cost to start a car rental business in Canada?", "Most of the cost is the cars and insurance. A small fleet of ten used cars plus a year of fleet insurance, a lot and software is a six-figure commitment, so many operators finance the vehicles and start with a niche such as insurance replacement."],
      ["Do I need a special license to rent cars in Canada?", "There's no national car rental license. You need to register the business, meet municipal licensing and zoning, register for GST/HST once you pass the threshold, and carry commercial rental fleet insurance."],
      ["Is a car rental business profitable?", "It can be, when the cars rent often enough. Utilisation, the share of days each car is on rent, is the number that decides it, alongside what each car loses in value."],
    ],
  }),
  article({
    slug: "insurance-rental-fleet-canada", navLabel: "Insurance for rental fleets in Canada", keyword: "insurance for rental fleets canada",
    title: "Insurance for Rental Fleets in Canada",
    h1: "Insurance for rental fleets in Canada",
    description: "Fleet insurance for Canadian car rental companies: rental fleet policies, liability minimums by province, damage waivers, claims and lower premiums.",
    lead: "Insurance is the biggest risk and one of the biggest costs in running a rental fleet. Here is how it works for Canadian rental companies, and what underwriters look for.",
    ctaTitle: "Show underwriters a tighter operation.", ctaText: "License checks, photos at pickup and return, and a record of every coverage choice, on every rental.",
    toc: [["policy", "Why a rental fleet policy"], ["liability", "Liability minimums by province"], ["coverages", "Coverages you sell to renters"], ["own", "Renters' own insurance"], ["claims", "When a car comes back damaged"], ["premiums", "Keeping premiums down"]],
    html: `<p>This guide explains the moving parts in plain language. It is not insurance or legal advice: talk to a broker who writes rental fleet risk, and confirm figures with your provincial regulator.</p>
      <h2 id="policy">Why you need a rental fleet policy</h2>
      <p>A rental company's cars are driven by strangers, every day, for short periods. Ordinary commercial auto policies are not written for that, and many exclude renting to the public outright. A <strong>rental fleet policy</strong> covers the fleet while it's rented and while it sits on your lot, and is priced on your fleet size, where you operate, who you rent to and how you control the risk.</p>
      <p>Expect a rental fleet policy to bring together third-party liability, accident benefits as your province requires, and physical damage to your own vehicles (collision and comprehensive), with a deductible you choose. Some insurers also offer garage or premises coverage for your lot.</p>
      <h2 id="liability">Third-party liability minimums by province</h2>
      <p>Every province sets a minimum amount of third-party liability for vehicles on its roads. Most provinces set it at $200,000; Nova Scotia is higher at $500,000, and Quebec's system works differently. In Atlantic Canada that typically means:</p>
      <ul><li>Newfoundland and Labrador: $200,000 minimum</li><li>Nova Scotia: $500,000 minimum</li><li>New Brunswick: $200,000 minimum</li><li>Prince Edward Island: $200,000 minimum</li></ul>
      <p>These are minimums. Most rental fleets carry $1 million or $2 million, because a serious claim can far exceed the minimum, and corporate and insurance customers often require it. Confirm current limits with your broker; regulations change.</p>
      <h2 id="coverages">The coverages you sell to renters</h2>
      <p>Most rental companies offer renters optional protection products: a damage waiver that limits what the renter pays if the car is damaged, and sometimes supplementary liability, personal accident or roadside cover. How you can sell these, and what you must disclose, varies by province, so have your wording reviewed.</p>
      <p>Whatever you offer, two things protect you: <strong>the same offer, worded the same way, on every rental</strong>, and <strong>a record of what the renter accepted or declined</strong>. Disputes about coverage almost always come down to "nobody told me". fleetr shows your coverages in your own wording and records each choice on the agreement.</p>
      <h2 id="own">Renters' own insurance and credit cards</h2>
      <p>Many renters decline your damage waiver because their personal auto policy or credit card covers rental cars. Sometimes it does, often with limits, exclusions for trucks and luxury cars, or a requirement to pay first and claim later. Ask renters who decline to confirm it, and keep a card on file so a damage charge doesn't depend on chasing them.</p>
      <p>For insurance replacement rentals, the claimant's insurer usually pays the daily rate up to a limit, and the renter remains responsible for damage unless coverage says otherwise. Record the claim number, the adjuster and the approved limit on the booking.</p>
      <h2 id="claims">When a car comes back damaged</h2>
      <ol><li><strong>Compare with pickup.</strong> Timestamped photos at pickup and return settle most disputes before they start.</li>
      <li><strong>Open a claim on the rental</strong> with the photos, the agreement and the renter's coverage choice attached.</li>
      <li><strong>Get an estimate</strong> from a body shop and decide whether to charge the renter, claim on their coverage, or claim on your own policy.</li>
      <li><strong>Track it to resolution.</strong> Unresolved claims are money left on the table. fleetr keeps each claim open until it's settled.</li></ol>
      <h2 id="premiums">Keeping premiums down</h2>
      <ul><li><strong>Check every driver.</strong> Scan the license, match the name to the booking, enforce your minimum age.</li>
      <li><strong>Photograph every pickup and return.</strong> Underwriters like evidence; it lowers the cost of claims.</li>
      <li><strong>Hold a deposit or card.</strong> Fewer unpaid damage and fuel charges.</li>
      <li><strong>Keep the fleet maintained.</strong> Track service by kilometres and keep cars due for maintenance off rent.</li>
      <li><strong>Show your record.</strong> Clean, organized records of agreements, claims and maintenance help at renewal.</li></ul>`,
    faq: [
      ["Can I rent out my car under a personal auto policy?", "Generally no. Personal policies exclude renting to the public. Speak to a broker about a rental fleet or peer-to-peer policy before renting any car."],
      ["What liability coverage do Canadian rental companies carry?", "Each province sets a minimum, $200,000 in most provinces and $500,000 in Nova Scotia, but most rental fleets carry $1 million or more."],
      ["Do renters have to buy the rental company's damage waiver?", "No, it's optional. Renters often rely on their own auto policy or credit card instead, so record each decision on the agreement."],
    ],
  }),
  article({
    slug: "replace-paper-rental-agreements", navLabel: "Replace paper rental agreements", keyword: "replace paper rental agreements",
    title: "How to Replace Paper Rental Agreements with Digital Ones",
    h1: "How to replace paper rental agreements",
    description: "Move from paper car rental agreements to digital ones signed on the renter's phone: what to include, the law in Canada and how to switch.",
    lead: "Paper rental agreements cost more than the printer ink: missing initials, unreadable damage diagrams and files nobody can find when a claim arrives. Here's how to switch to digital agreements without disrupting the counter.",
    ctaTitle: "Go paperless in a week.", ctaText: "We'll set up your terms, coverages and fleet, and you'll run your first digital agreement the same day.",
    toc: [["cost", "What paper really costs"], ["include", "What a digital agreement should include"], ["law", "Are digital agreements valid in Canada?"], ["choose", "Choosing a system"], ["switch", "Switching over, week by week"], ["counter", "At the counter"], ["objections", "What your team will ask"], ["old", "What to do with the old paper"]],
    html: `<h2 id="cost">What paper really costs</h2>
      <p>Most rental companies don't add up what paper costs them, because it shows up as other problems:</p>
      <ul><li><strong>Disputed charges you can't win.</strong> A renter says the scratch was already there, and the damage diagram on the paper copy is a few pen marks.</li>
      <li><strong>Coverage arguments.</strong> The box is ticked, but not initialled, and the renter says nobody explained it.</li>
      <li><strong>Lost time.</strong> Filling in the same details the renter gave on the phone, then filing it, then finding it again for a claim weeks later.</li>
      <li><strong>Wrong numbers.</strong> Fuel written as a guess, kilometres misread, a return time rounded in the renter's favour.</li></ul>
      <h2 id="include">What a digital agreement should include</h2>
      <p>A digital agreement should be at least as complete as your paper one, and it can't be left half-finished:</p>
      <ul><li>The renter's details and their driver's license, scanned rather than typed, with the name matched to the booking.</li>
      <li>Any additional drivers, with their licenses.</li>
      <li>The vehicle: plate, make, model, kilometres and fuel at pickup.</li>
      <li>Timestamped photos of the vehicle at pickup, and damage already on record carried forward.</li>
      <li>Each coverage you offer, with the renter's decision recorded.</li>
      <li>The rate, the expected charges, taxes and the deposit.</li>
      <li>Your terms and any acknowledgements, shown before signing.</li>
      <li>The renter's signature and the time they signed.</li></ul>
      <h2 id="law">Are digital rental agreements valid in Canada?</h2>
      <p>Every province and territory has electronic commerce legislation that gives electronic signatures and records legal effect, with a few exceptions such as wills and some land transactions that don't affect rental agreements. What matters in a dispute is showing <strong>who signed, what they saw, and when</strong>. A good system records all three. As with paper, have a lawyer review your terms.</p>
      <h2 id="choose">Choosing a system</h2>
      <p>A PDF form with a signature box is not a digital rental agreement. Look for a system where the agreement is built from the reservation and the vehicle record, so nobody types the same details twice, and where it is tied to the rest of the rental:</p>
      <ul><li><strong>It starts from the booking.</strong> Renter, dates, rate, class and coverages come across without retyping.</li>
      <li><strong>The renter can do it on their own phone</strong>, from a text link, with no app to install and no account to create.</li>
      <li><strong>Readings come from the vehicle.</strong> Kilometres and fuel at pickup are pulled from the car's last return, not guessed.</li>
      <li><strong>Damage carries forward.</strong> Damage already on record shows on the next agreement, so a renter is never blamed for an old scratch.</li>
      <li><strong>Return closes the loop.</strong> The return is logged against the same agreement, and charges are worked out from it.</li>
      <li><strong>It's searchable.</strong> Find any agreement in seconds by renter, plate or reservation code when a claim or a dispute arrives.</li></ul>
      <h2 id="switch">Switching over, week by week</h2>
      <ol><li><strong>Week one: set up.</strong> Load your terms, coverages and their wording, your rates and your fleet. Run a few test rentals with staff as the renters.</li>
      <li><strong>Week two: run both.</strong> Use digital agreements for new rentals while paper ones already out are closed the old way. Don't convert open paper agreements; let them finish.</li>
      <li><strong>Week three: digital only.</strong> Remove the paper forms from the counter, so nobody falls back on habit.</li>
      <li><strong>Then: tidy up.</strong> Move upcoming reservations in and retire the old system once the last paper rental closes.</li></ol>
      <h2 id="counter">At the counter</h2>
      <p>The biggest change is who does the typing. With renter self check-in, the renter receives a text link, scans their license, photographs the car and signs on their own phone, often before they reach the counter. Your agent confirms the photo matches the person and hands over the keys. For renters without a smartphone, the same check-in runs on a tablet at the counter.</p>
      <p>At return, the renter logs it on their phone, the return time is locked in, and fuel and kilometres are compared with pickup. Any new damage becomes a claim with photos attached.</p>
      <h2 id="objections">What your team will ask</h2>
      <p><strong>"Older customers won't do it on their phone."</strong> Some won't, and that's fine: run the same check-in on a counter tablet. Most renters prefer skipping the paperwork, and the ones who check in ahead of time free your agents for the ones who need help.</p>
      <p><strong>"What if the internet goes down?"</strong> Keep a small stack of paper agreements for real emergencies, and enter them afterwards. In practice, the renter's own phone data keeps check-in working even when the branch connection doesn't.</p>
      <p><strong>"It'll slow the counter down."</strong> The first week is slower while everyone learns. After that, agents stop copying details from the booking onto a form, and a pickup becomes a license check and a set of keys.</p>
      <h2 id="old">What to do with the old paper</h2>
      <p>Keep paper agreements as long as your lawyer and accountant advise; tax records generally need to be kept for six years in Canada. Store them by month so they can be found. Once your digital agreements cover that period, you can stop adding to the boxes for good.</p>
      <p><a href="/rental-agreement-software/">See how fleetr's digital rental agreements work</a>.</p>`,
    faq: [
      ["Do renters need to download an app to sign?", "Not with fleetr. The agreement opens in the phone's browser from a text link."],
      ["Can I still print an agreement?", "Yes. Agreements can be viewed and printed, and renters get a copy."],
      ["How long should I keep rental agreements?", "Ask your lawyer and accountant. Tax records in Canada generally need to be kept for six years."],
    ],
  }),
];

// Guides 4 to 12, in their own file.
ARTICLES.push(...GUIDES.map(article));

const resourcesHub = {
  path: "/resources/", group: "hub", navActive: "/rental-companies/",
  title: "Guides for Car Rental Companies in Canada | fleetr",
  ogTitle: "Guides for rental companies",
  description: "Practical guides for Canadian car rental operators: starting out, insurance, pricing, damage claims, deposits, winter, no-shows and getting bookings.",
  keyword: "car rental business guides",
  crumbs: [["/", "fleetr"], ["/resources/", "Guides"]],
  body: hero({ kicker: "Guides", h1: "Guides for running a rental company in Canada.",
    lead: "Plain-language guides from the fleetr team, written with Canadian operators: insurance, paperwork, pricing and growing a fleet." })
    + band("Latest guides", links(ARTICLES.map((a) => [a.path, a.ogTitle, a.description]))),
};

export const PAGES = [...operator, cityHub, ...CITIES.map(cityPage), resourcesHub, ...ARTICLES];
export { CITIES };
