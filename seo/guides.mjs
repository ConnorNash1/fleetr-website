// Guides 4 to 12 (Nov 17): the rest of the content plan in seo-nov17-report.md.
// Same standards as the first three: plain language for Canadian rental
// operators, Canadian spelling (but "license"), "fleetr" in lower case, no
// figure we can't stand behind, and the hedge where rules vary by province.
export const GUIDES = [
  {
    slug: "car-rental-pricing", navLabel: "How to price car rentals", keyword: "car rental pricing strategy",
    title: "How to Price Car Rentals: Daily, Weekly and Monthly",
    h1: "How to price car rentals: daily, weekly and monthly rates",
    description: "A car rental pricing strategy for independents: daily rates by class, weekly and monthly discounts, peak dates and agreed rates for insurers.",
    lead: "Rental pricing is a balance between filling cars and not giving away your best days. Here's a practical way to set and adjust rates as an independent rental company in Canada.",
    ctaTitle: "Rates that fill themselves in.", ctaText: "Set your rates by class and source once, with seasons and discounts, and every booking is priced the same way.",
    toc: [["start", "Start from what a car costs you"], ["classes", "Price by class, not by car"], ["sources", "Price by who's booking"], ["longer", "Weekly and monthly rentals"], ["peaks", "Peaks and quiet weeks"], ["extras", "Coverages, fuel and kilometres"], ["review", "Review every month"]],
    html: `<p>Most independent rental companies set prices by looking at the competition and coming in a little lower. That's a reasonable start, but it leaves money on the table on busy days and doesn't protect you on slow ones. A better approach starts with your own costs.</p>
      <h2 id="start">Start from what a car costs you</h2>
      <p>Add up what each car costs you in a month: financing or the value it loses, insurance, maintenance, cleaning, registration and a share of your rent and staff. Divide by the days you expect it to be on rent. If a car costs $900 a month and rents 20 days, every rental day has to bring in at least $45 before you make anything. That number is your floor, not your price.</p>
      <p>The days it rents matter as much as the rate. The same car at 25 days a month only needs $36 a day to cover itself. This is why <a href="/resources/fleet-utilisation/">utilisation</a> and pricing have to be looked at together.</p>
      <h2 id="classes">Price by class, not by car</h2>
      <p>Renters book a class (small car, mid-size SUV, minivan), not a particular car. Set one daily rate per class, with clear steps between them, so moving a renter up a class is an easy upsell. Keep the number of classes small enough that every class has several cars in it; a class with one car sells out the moment it's booked.</p>
      <h2 id="sources">Price by who's booking</h2>
      <p>Different customers pay differently, and your rates should reflect it:</p>
      <ul><li><strong>Walk-in and online renters</strong> pay your retail rate. Keep online and walk-in prices the same, so nobody books online and then argues at the counter.</li>
      <li><strong>Insurers</strong> usually approve a daily limit for a claim. Know the common limits and keep a class that fits each one.</li>
      <li><strong>Body shops and dealerships</strong> often pay a negotiated rate in return for steady volume.</li>
      <li><strong>Corporate accounts</strong> trade a lower rate for a commitment, often with invoicing on terms.</li></ul>
      <h2 id="longer">Weekly and monthly rentals</h2>
      <p>Longer rentals cost you less per day: one cleaning, one check-in, no gaps between renters. Pass some of that on. A common pattern is a weekly rate worth five or six daily rates, and a monthly rate well below four weekly rates. Make sure the system applies the cheaper rate when it's better for the renter; nothing loses goodwill faster than a renter finding they'd have paid less by booking a longer rental.</p>
      <h2 id="peaks">Peaks and quiet weeks</h2>
      <p>Summer weekends, long weekends, holidays and big local events sell out. Raise rates for those dates in advance, rather than discovering on the Thursday that you're full. In quiet weeks, hold your rate and fill cars with insurance and body shop work instead of discounting retail; discounts train regular customers to wait for them. Watch your availability a few weeks out: when a class is close to selling out, that's the moment to raise its price, not lower it.</p>
      <h2 id="extras">Coverages, fuel and kilometres</h2>
      <p>Coverages are a large share of many independents' profit. Offer them the same way, with the same wording, on every rental, and price them per day. For fuel, decide between "return it full or pay our price per litre" and selling a prepaid tank. For kilometres, unlimited is simplest for local rentals; a daily allowance with a per-kilometre charge protects you on long trips.</p>
      <h2 id="review">Review every month</h2>
      <p>Once a month, look at revenue per class, utilisation per class and the bookings you turned away. If a class is always full, it's underpriced or you need more of it. If a class sits at 50%, lower the rate, sell some cars or move them to a busier branch.</p>`,
    faq: [
      ["How much should I charge per day for a rental car?", "Start from what the car costs you each month divided by the days it rents, then set a rate above that by class, and compare with what nearby companies charge for the same class."],
      ["Should weekly rentals be cheaper per day?", "Usually, yes. Longer rentals cost less to handle, and a weekly rate worth five or six daily rates is common."],
      ["Should I discount in slow periods?", "Hold your retail rate where you can and fill cars with insurance, body shop and corporate work instead; frequent discounts teach customers to wait for them."],
    ],
  },
  {
    slug: "insurance-replacement-rentals", navLabel: "Insurance replacement rentals", keyword: "insurance replacement rental",
    title: "Insurance Replacement Rentals: A Guide for Operators",
    h1: "Insurance replacement rentals: working with body shops and adjusters",
    description: "How independent rental companies win and run insurance replacement rentals in Canada: body shops, adjusters, claim numbers, daily limits and invoices.",
    lead: "Insurance replacement work is the steadiest business an independent rental company can have. Here's how it works, how to win it, and how to keep it running without paperwork piling up.",
    ctaTitle: "Make it easy for shops and adjusters.", ctaText: "Partners book in their own portal with the claim or repair order number, and you invoice them on terms.",
    toc: [["how", "How replacement rentals work"], ["win", "Winning the work"], ["booking", "Taking the booking right"], ["during", "During the rental"], ["extend", "When the repair runs long"], ["billing", "Billing and getting paid"], ["mistakes", "Common mistakes"]],
    html: `<p>When a driver's car is damaged in a covered accident, their policy often pays for a replacement vehicle while it's repaired. Insurers, adjusters and body shops send those renters to rental companies they trust. For an independent, that can mean steady weekday business all year.</p>
      <h2 id="how">How replacement rentals work</h2>
      <p>The insurer approves a rental for a claim, usually with a <strong>daily limit</strong> (the most it pays per day) and sometimes a class. The renter picks up a car, and the rental runs until the repair is done. The insurer pays the approved daily amount, normally on account; the renter pays anything above it, plus anything not covered, such as fuel or coverages they choose to add.</p>
      <p>Some rentals are booked by the adjuster, some by the body shop, and some by the renter with a claim number in hand. Your process needs to handle all three.</p>
      <h2 id="win">Winning the work</h2>
      <ul><li><strong>Visit every body shop nearby.</strong> Shops want their customers in a car quickly, so the car doesn't sit waiting for parts while the customer calls them every day.</li>
      <li><strong>Be quick.</strong> Same-day cars, delivered or ready when the customer drops off their own car, win more referrals than a lower rate.</li>
      <li><strong>Know the limits.</strong> Keep a class that fits the common daily limits, so nobody is surprised at the counter.</li>
      <li><strong>Make booking easy.</strong> A portal where a shop or adjuster books a car with the claim or repair order number saves everyone a phone call.</li>
      <li><strong>Send clean invoices.</strong> Insurers and shops come back to companies whose invoices match the claim the first time.</li></ul>
      <h2 id="booking">Taking the booking right</h2>
      <p>Get these details on every replacement booking before the car goes out: the claim number (or repair order number), the adjuster or shop contact, the approved daily limit or class, the estimated repair days and who pays what. A missing claim number is the most common reason an invoice comes back unpaid.</p>
      <h2 id="during">During the rental</h2>
      <p>Treat the renter like any other: check their license, photograph the car, record their coverage choices and get a signature. They're often stressed after an accident, so a quick, phone-based check-in helps. Make clear at pickup what the insurer pays and what they pay.</p>
      <h2 id="extend">When the repair runs long</h2>
      <p>Repairs run over all the time: parts are late, the damage is worse than the estimate. Extensions need the insurer's approval, and an extension without approval can become the renter's bill. Make it easy for the shop or adjuster to ask for an extension and for you to approve it, with the new return date on the rental.</p>
      <h2 id="billing">Billing and getting paid</h2>
      <p>Invoice the insurer or shop when the rental closes, with the claim number, renter, dates, days and daily rate on the invoice. Charge the renter's share separately, at return. Track what each insurer and shop owes by age (0 to 30 days, 31 to 60 and so on) and follow up on anything past your terms. Replacement work is only profitable if it's paid.</p>
      <h2 id="mistakes">Common mistakes</h2>
      <ul><li><strong>Putting the renter in a class above the limit</strong> without telling them they'll pay the difference.</li>
      <li><strong>Extending without approval</strong>, then finding the insurer won't pay the extra days.</li>
      <li><strong>Invoicing late</strong>, or with the claim number missing, so the invoice sits unpaid.</li>
      <li><strong>Treating shops as an afterthought.</strong> The shop decides where its customers rent; a quick thank-you and a reliable car keep the referrals coming.</li></ul>`,
    faq: [
      ["Who pays for an insurance replacement rental?", "The insurer pays the approved daily amount for the covered days, usually on account. The renter pays anything above the limit and extras such as fuel or added coverages."],
      ["What is a daily limit?", "The most an insurer will pay per day for the rental on a claim. Booking a class that fits the limit avoids a bill for the renter."],
      ["How do I get body shops to send me renters?", "Visit them, have cars ready quickly, make booking and extensions easy, and send invoices that match the claim the first time."],
    ],
  },
  {
    slug: "fleet-utilisation", navLabel: "Rental fleet utilisation", keyword: "fleet utilisation rate car rental",
    title: "Rental Fleet Utilisation: How to Measure and Raise It",
    h1: "Rental fleet utilisation: how to measure it and raise it",
    description: "How to measure fleet utilisation at a car rental company and raise it: faster turnaround, the right mix of cars, transfers and the bookings you lose.",
    lead: "Utilisation is the share of the time your cars are earning. It's the number that most decides whether a rental company makes money, and most independents don't track it.",
    ctaTitle: "See utilisation without a spreadsheet.", ctaText: "fleetr works it out from the rentals you already run, by class and branch, against the period before.",
    toc: [["measure", "How to measure it"], ["example", "A worked example"], ["good", "What a good rate looks like"], ["turnaround", "Faster turnaround"], ["mix", "The right mix of cars"], ["move", "Move cars to the demand"], ["lost", "Count the bookings you lose"]],
    html: `<h2 id="measure">How to measure it</h2>
      <p>Time utilisation is simple: <strong>days on rent divided by days available</strong>, for a period. A car that was on rent 21 of 30 days ran at 70%. Measure it per class and per branch, not just for the whole fleet, because a fleet average hides the class that's always sold out and the one that sits.</p>
      <p>Decide what counts as available. Most operators leave out days a car spent in maintenance or a body shop, and track those separately, because they're a different problem with a different fix.</p>
      <h2 id="example">A worked example</h2>
      <p>Take a branch with 20 cars over a 30-day month: 600 car-days. Two cars spent five days each in the body shop, so 590 days were available. The cars were on rent for 413 days in total. Utilisation is 413 divided by 590, or 70%.</p>
      <p>Split by class, the picture changes. The six small SUVs ran at 88% and turned away bookings on three weekends. The eight compact cars ran at 55%. The fleet average of 70% hid both: the SUVs needed a higher rate or another car, and two of the compacts could be sold or moved to a busier branch. Raising the SUVs to full and the compacts to 65% would add about 40 rental days a month without buying a single car.</p>
      <p>Do the same split by month and you'll see your seasons, which tells you when to add cars and when to sell them.</p>
      <h2 id="good">What a good rate looks like</h2>
      <p>There's no single right number; it depends on your market and season. Tourism fleets swing from near 100% in summer to far less in winter, while insurance replacement fleets run steadier. What matters is your trend, and how each class compares with the others. A class well above the rest is underpriced or too small. A class well below is overpriced, too big or in the wrong place.</p>
      <h2 id="turnaround">Faster turnaround</h2>
      <p>Every hour a car spends between renters is an hour it can't earn. Common culprits: returns that aren't logged until someone walks the lot, cleaning done in the order cars came back rather than the order they're needed, and cars waiting for a check-in agent. Letting renters log their own return, and cleaning first the cars needed for the next pickups, both shorten the gap.</p>
      <h2 id="mix">The right mix of cars</h2>
      <p>Look at utilisation by class over a few months. If minivans are full every weekend while compact cars sit, shift the next purchases towards minivans and sell the oldest compacts. Small changes in mix move utilisation more than any amount of discounting.</p>
      <h2 id="move">Move cars to the demand</h2>
      <p>With more than one branch, the same class can be sold out at one location and idle at the other. Transferring cars between branches ahead of a busy week is cheaper than turning renters away. Plan transfers from your availability a week or two out, not on the day.</p>
      <h2 id="lost">Count the bookings you lose</h2>
      <p>Utilisation only tells you about the cars you had. Lost demand tells you about the cars you didn't: the searches for dates when a class was sold out, the calls you turned away. If a class is losing bookings every weekend, you know exactly what to buy next. Track it alongside utilisation.</p>`,
    faq: [
      ["How do you calculate fleet utilisation?", "Divide the days your cars were on rent by the days they were available in the period. Most operators leave out days in maintenance and track those separately."],
      ["What is a good utilisation rate for a car rental company?", "It depends on your market and season. Watch your trend and compare classes; the class far above or below the others tells you what to change."],
      ["Does lowering prices raise utilisation?", "Sometimes, but changing your fleet mix, turnaround and transfers often raises it more without lowering your revenue per day."],
    ],
  },
  {
    slug: "rental-damage-claims", navLabel: "Damage claims at a rental company", keyword: "rental car damage claim process",
    title: "Rental Car Damage Claims: From Return to Payment",
    h1: "Damage claims at a rental company, from return to payment",
    description: "A damage claim process for rental companies: photos at pickup and return, opening a claim, estimates, recovering the cost and tracking it to payment.",
    lead: "Damage is where rental companies most often lose money they're owed. A clear process, from the photos at pickup to the final payment, recovers far more of it.",
    ctaTitle: "Claims that never go missing.", ctaText: "Photos at pickup and return, each claim on its rental, open until it's settled.",
    toc: [["pickup", "It starts at pickup"], ["return", "At return"], ["open", "Opening the claim"], ["estimate", "Getting the estimate"], ["recover", "Recovering the cost"], ["talk", "Talking to the renter"], ["track", "Tracking it to the end"]],
    html: `<h2 id="pickup">It starts at pickup</h2>
      <p>You can't prove new damage without proof of the old. Photograph every car at every pickup, all four sides and anything already damaged, with the time recorded. Damage already on file should carry forward to the next rental, so the next renter isn't blamed for it and the record stays honest. Renter self check-in on a phone does this without tying up your staff.</p>
      <h2 id="return">At return</h2>
      <p>Photograph the car again at return, in the same way. Compare with pickup before the renter leaves if you can; a conversation at the counter settles far more than an email a week later. If the renter returns the car after hours, their own return photos, with the time locked in, are your evidence.</p>
      <h2 id="open">Opening the claim</h2>
      <p>Open a claim on the rental straight away, while it's fresh: what the damage is, where on the car, the pickup and return photos, and the renter's coverage choice from the agreement. Note whether the car can still be rented or has to come off the road. A claim that lives in someone's notebook is a claim that gets forgotten.</p>
      <h2 id="estimate">Getting the estimate</h2>
      <p>Get a repair estimate from a body shop. For small damage, some operators use a published price list for common repairs (a chip, a scuff, a small dent), which is faster and easier to explain to the renter. Keep the estimate with the claim.</p>
      <h2 id="recover">Recovering the cost</h2>
      <p>Who pays depends on what the renter chose and what they're covered by:</p>
      <ul><li><strong>The renter accepted your damage waiver:</strong> they pay up to the waiver's terms (often nothing, or a deductible), and you absorb or claim the rest as your waiver allows.</li>
      <li><strong>The renter declined it:</strong> they're responsible under your agreement. Charge the card on file for the amount your terms allow, or send an invoice, with the photos and estimate attached.</li>
      <li><strong>Their own insurance or credit card covers rentals:</strong> give them what they need to claim (the agreement, photos, estimate and invoice), but don't wait on it to get paid if your terms let you charge them.</li>
      <li><strong>Your own fleet policy:</strong> for large damage, a claim on your policy may make sense, weighed against the deductible and your premiums.</li></ul>
      <p>Charging a card without the renter's agreement to your terms invites a chargeback, so make sure your rental terms, signed at pickup, cover damage charges and the deposit. Our guide to <a href="/resources/rental-deposits-card-holds/">deposits and card holds</a> covers this.</p>
      <h2 id="talk">Talking to the renter</h2>
      <p>How you tell a renter about damage decides whether they pay or dispute it. Show them, don't tell them: the pickup photo of that corner of the car, then the return photo. Explain what happens next (an estimate, then a charge or invoice under the terms they signed) and when. Stay calm and factual; most renters accept clear evidence, and the ones who don't will dispute however you put it.</p>
      <p>Put it in writing the same day: what was found, the photos, what the agreement says about damage, and what you'll charge once you have an estimate. A written record made at the time is worth far more than a phone call remembered weeks later, if the charge is ever disputed with the card issuer.</p>
      <h2 id="track">Tracking it to the end</h2>
      <p>Keep every claim open until it's paid or written off, and look at open claims every week. Once a month, check the total recovered against the total repaired. If you're recovering much less than you spend, the gap is usually missing pickup photos, unsigned coverage choices or claims that were never followed up.</p>`,
    faq: [
      ["Can a rental company charge my card for damage?", "If the rental agreement you signed allows it and the damage is documented, usually yes, up to what the agreement and your coverage choice allow."],
      ["What proof do I need for a rental damage claim?", "Timestamped photos at pickup and return, the signed agreement with the renter's coverage choice, and a repair estimate."],
      ["What if the renter's credit card covers rental damage?", "Give them the agreement, photos, estimate and invoice to claim with, but collect under your own terms rather than waiting on their claim."],
    ],
  },
  {
    slug: "rental-deposits-card-holds", navLabel: "Deposits and card holds", keyword: "car rental deposit hold",
    title: "Car Rental Deposits and Card Holds in Canada",
    h1: "Deposits and card holds for car rentals in Canada",
    description: "How car rental deposits and card holds work in Canada: authorizations, how long holds last, debit cards, charging at return and avoiding chargebacks.",
    lead: "A card hold protects you against damage, fuel and late returns without charging the renter up front. Here's how holds work, where they go wrong, and how to set your deposit.",
    ctaTitle: "Hold at pickup, charge at return.", ctaText: "Save a card at booking, hold the estimate and your deposit at pickup, and charge the final total when the rental closes.",
    toc: [["what", "What a hold is"], ["howlong", "How long holds last"], ["size", "Setting your deposit"], ["debit", "Debit cards and cash"], ["close", "Charging at return"], ["chargebacks", "Avoiding chargebacks"], ["tell", "What to tell renters"]],
    html: `<h2 id="what">What a hold is</h2>
      <p>A hold, or authorization, asks the renter's card issuer to set aside an amount without charging it. The renter's available credit goes down, but nothing is taken. At return you either charge some or all of it (capture), or let it go (release). Most rental companies hold the rental's estimated total plus a deposit at pickup, then charge the final total at return and release the rest.</p>
      <h2 id="howlong">How long holds last</h2>
      <p>Holds don't last forever. Many card authorizations expire after about seven days if they aren't captured, though some card networks and payment processors allow longer holds for car rental businesses (Stripe, for example, offers extended authorizations to eligible businesses). Check your processor's rules. For a rental longer than the hold, plan to charge part of it during the rental, or to place a new hold, rather than finding the authorization gone at return.</p>
      <h2 id="size">Setting your deposit</h2>
      <p>The deposit is there to cover what the rental's price doesn't: a damage deductible, fuel, a late return, a lost key. Too small and it doesn't protect you; too large and it puts off renters, especially those near their card limit. Many independents set a deposit by class, higher for trucks and luxury cars. Whatever you choose, show it before the renter books, so it's no surprise at the counter.</p>
      <h2 id="debit">Debit cards and cash</h2>
      <p>Holds on debit cards take real money out of the renter's bank account until they're released, which can take days and causes anger when it does. Some debit cards can't be held at all. Many rental companies require a credit card for the hold and accept debit or cash for the final payment only. If you do accept debit for holds, say clearly how long the money may be held.</p>
      <h2 id="close">Charging at return</h2>
      <p>At return, work out the final total (days, extensions, fuel, kilometres, coverages, taxes), charge it against the hold, and release the rest straight away. Send the renter a receipt the same day. If damage needs an estimate first, charge the rental itself now and the damage separately once you have the estimate, under your terms, rather than holding the whole amount for weeks.</p>
      <h2 id="chargebacks">Avoiding chargebacks</h2>
      <ul><li>Have the renter agree to your terms for the deposit and damage charges at pickup, with their signature.</li>
      <li>Keep pickup and return photos and the agreement with every charge.</li>
      <li>Charge promptly, and send an itemized receipt.</li>
      <li>Answer disputes quickly with the agreement, photos and receipt; your processor will ask for them.</li></ul>
      <h2 id="tell">What to tell renters</h2>
      <p>Most complaints about holds come from surprise, not the hold itself. Tell renters three things before pickup, ideally in the booking confirmation:</p>
      <ol><li><strong>How much will be held:</strong> the estimated rental plus your deposit, as one figure.</li>
      <li><strong>When it's released:</strong> right after return, and that their bank may take a few days to show it.</li>
      <li><strong>What it can be used for:</strong> fuel, extra days, damage under the agreement, and nothing else.</li></ol>
      <p>For example: "At pickup we'll hold $420 on your card: your rental estimate of $270 and a $150 deposit. At return we charge the final total and release the rest straight away; your bank may take a few days to show it." Renters who know that number at booking rarely argue about it at the counter.</p>`,
    faq: [
      ["How much is a typical car rental deposit in Canada?", "It varies by company and class. Many independents set a few hundred dollars for cars and more for trucks and luxury vehicles, shown before booking."],
      ["How long does a car rental hold stay on my card?", "Until the company charges or releases it at return. Unused authorizations also expire on their own, often after about seven days, though rules vary by card and processor."],
      ["Can I rent a car with a debit card?", "Some companies accept debit for payment but want a credit card for the hold. Each listing on fleetr.ai shows the payment methods the company takes."],
    ],
  },
  {
    slug: "when-to-sell-rental-cars", navLabel: "When to sell a rental car", keyword: "when to sell rental fleet vehicles",
    title: "When to Sell a Rental Car: Depreciation and Rotation",
    h1: "When to sell a rental car: depreciation and fleet rotation",
    description: "How rental companies decide when to sell a car: depreciation, monthly value loss against rental income, kilometres, repair costs and planning fleet rotation.",
    lead: "Every rental car has a point where keeping it costs more than it earns. Selling just before that point, rather than after, is one of the biggest levers on a rental company's profit.",
    ctaTitle: "Know what every car is worth to you.", ctaText: "Purchase price, market value, depreciation and net income per car, from the rentals you already run.",
    toc: [["value", "Watch what each car loses"], ["earns", "Against what it earns"], ["example", "A worked example"], ["signals", "The signals to sell"], ["timing", "Timing the sale"], ["rotation", "Planning rotation"]],
    html: `<h2 id="value">Watch what each car loses</h2>
      <p>A car's biggest cost is usually the value it loses, not fuel or repairs. Record what you paid for each car and check its market value every few months. The difference, spread over the months you've owned it, is what it's costing you just to keep it. That loss is steep in the first year or two of a car's life and flattens after, which is why many independents buy cars that are already a couple of years old.</p>
      <h2 id="earns">Against what it earns</h2>
      <p>For each car, compare its rental income over the last few months against its running costs (insurance, maintenance, repairs, cleaning) and the value it lost. That gives a net figure per month. A car that's positive and steady is worth keeping. A car whose net is falling, because it rents less or costs more to keep running, is telling you something.</p>
      <h2 id="example">A worked example</h2>
      <p>A mid-size SUV was bought for $32,000 two years ago and is worth about $23,000 today: it has lost $9,000, or $375 a month. Over the last three months it brought in $1,250 a month in rentals and cost $420 a month in insurance, maintenance and cleaning. Its net is $1,250 minus $420 minus $375, or $455 a month. Worth keeping.</p>
      <p>A compact bought at the same time tells a different story. It now rents 14 days a month instead of 22, brings in $690 a month, and needed $600 of brakes and tires last month on top of its usual $350. Its value loss is smaller, around $250 a month, but its net is close to zero and falling. Selling it this spring, and putting the money into another SUV, is the better use of the cash.</p>
      <p>Doing this for every car once a quarter takes minutes when the figures come from your rentals rather than a spreadsheet.</p>
      <h2 id="signals">The signals to sell</h2>
      <ul><li><strong>Rising repair costs.</strong> Brakes, tires and a list of small faults, every few weeks, eat the margin quickly.</li>
      <li><strong>High kilometres.</strong> Resale value drops at certain thresholds, and renters notice a tired car. Many fleets sell somewhere between 60,000 and 120,000 km, depending on the car.</li>
      <li><strong>Falling demand for the class.</strong> If the class sits while others sell out, sell cars in it and buy what's in demand.</li>
      <li><strong>Damage history.</strong> A car with repeated damage claims may be worth selling before the next one.</li>
      <li><strong>Warranty ending.</strong> Many operators sell before the manufacturer's warranty runs out, to avoid uncovered repairs.</li></ul>
      <h2 id="timing">Timing the sale</h2>
      <p>Used car prices move with the season. Selling in spring, ahead of your own quiet period, often gets a better price than selling in late fall, and frees cash before you buy for summer. Don't sell a car in the middle of your busiest weeks unless it's costing you more than a lost rental would.</p>
      <h2 id="rotation">Planning rotation</h2>
      <p>Rather than deciding car by car, plan a rotation: sell a few of the oldest cars each quarter and buy a few newer ones. Your fleet's average age stays steady, you avoid selling many cars at once in a weak market, and buying is spread across the year. Take each car off rent the day you decide to sell, so it isn't booked out while you're showing it to buyers.</p>`,
    faq: [
      ["How many kilometres before a rental company sells a car?", "It varies with the car and market, but many fleets sell somewhere between 60,000 and 120,000 km, and earlier if repair costs climb."],
      ["Should rental companies buy new or used cars?", "Many independents buy cars two to three years old, after the steepest drop in value, so less of their money is lost to depreciation."],
      ["How do I know if a rental car is losing money?", "Compare its rental income with its running costs and the value it loses each month. If the net is falling or negative, it's time to sell."],
    ],
  },
  {
    slug: "winter-rental-fleet-canada", navLabel: "Winter operations for rental fleets", keyword: "winter tires rental fleet canada",
    title: "Winter Operations for Rental Fleets in Canada",
    h1: "Winter operations for rental fleets in Canada",
    description: "Running a rental fleet through a Canadian winter: winter tires and provincial rules, preparing cars, storm days, late returns, salt and keeping renters safe.",
    lead: "Canadian winters test rental fleets: tires, storms, cancelled flights and salt. Here's how independent rental companies keep cars safe and rentals running from November to April.",
    ctaTitle: "Know which cars have winter tires.", ctaText: "Mark each car's winter tires and keep storm-day changes to every rental in one place.",
    toc: [["tires", "Winter tires and the rules"], ["prep", "Preparing the cars"], ["storms", "Storm days"], ["late", "Late returns and extensions"], ["salt", "Salt and spring"], ["checklist", "A season checklist"]],
    html: `<h2 id="tires">Winter tires and the rules</h2>
      <p>Winter tires matter more than any other winter decision, for renters' safety and your liability. The rules differ by province: Quebec requires winter tires on passenger vehicles in winter, British Columbia requires them (or chains) on many highways in the colder months, and most other provinces, including the Atlantic provinces, don't require them but strongly recommend them. Rules on studded tires also vary by province and season. Check the current rules wherever your cars are registered and driven.</p>
      <p>Whatever the law, renters expect winter tires. Many independents put winter tires on the whole fleet from November to April; others keep a set of classes on them. Record which cars have them, so staff and renters know before pickup, and mention it when you confirm a winter booking.</p>
      <h2 id="prep">Preparing the cars</h2>
      <ul><li>A snow brush and ice scraper in every car, checked at each turnaround.</li>
      <li>Winter washer fluid, topped up at every turnaround; renters run through it quickly.</li>
      <li>Batteries tested before the cold sets in. A dead battery on a 7:00 pickup costs you the rental and the renter's goodwill.</li>
      <li>Wipers replaced in the fall.</li>
      <li>Cars cleared of snow before pickup. A car buried in a drift is not "ready".</li></ul>
      <p>At pickup, take a minute to tell winter renters what visitors often don't know: that the car has winter tires (or doesn't), where the brush is, to clear the whole roof and lights before driving, and to leave extra time and distance on icy roads. Renters from places without real winters, and people renting while their own car is in the shop after a winter crash, are the ones who most need it. A short note in the booking text helps too.</p>
      <h2 id="storms">Storm days</h2>
      <p>A big storm moves everything at once: pickups delayed, flights cancelled, returns stuck at the airport, staff who can't get in. Prepare for it:</p>
      <ul><li><strong>Text early.</strong> Tell renters with pickups and returns on the storm day what to do before they ask.</li>
      <li><strong>Make changes easy.</strong> Let renters move their pickup or return from a link, rather than all calling at once.</li>
      <li><strong>Waive what's fair.</strong> Many operators don't charge extra days for returns delayed by a road closure or a cancelled flight. Decide your policy before the storm, not during it.</li>
      <li><strong>Watch the next days.</strong> Storms push demand into the following days; check your availability for them.</li></ul>
      <h2 id="late">Late returns and extensions</h2>
      <p>In winter, more renters are late through no fault of their own. Keep your overdue process firm but fair: an automatic text after the return time, a grace period, then a call. A renter who replies "stuck in the storm, back tomorrow" is not the same as one who's gone quiet, and your system should show the difference.</p>
      <h2 id="salt">Salt and spring</h2>
      <p>Road salt corrodes brakes, lines and bodywork. Wash cars regularly through the winter, including underneath, and check brakes at every service. In spring, swap tires back, inspect for corrosion and chips, and fix them before the summer rush, when every car needs to be on the road.</p>
      <h2 id="checklist">A season checklist</h2>
      <p><strong>October:</strong> book tire changes early, before every shop is full; test batteries; replace wipers; stock brushes, scrapers and winter washer fluid; write down your storm-day policy and share it with staff.</p>
      <p><strong>November:</strong> winter tires on, and marked on each car's record; check block heater cords where you have them; tell renters in your booking texts which cars have winter tires.</p>
      <p><strong>Through the winter:</strong> clear snow before every pickup, wash regularly to fight salt, and check the forecast every evening for the next day's pickups and returns.</p>
      <p><strong>April:</strong> summer tires back on once the risk of snow has passed, a corrosion and chip inspection, and repairs done before the summer rush.</p>`,
    faq: [
      ["Do rental cars in Canada have winter tires?", "Many do from November to April, and Quebec requires them in winter. Ask the company, or check the listing, which cars have them."],
      ["Are winter tires mandatory in Atlantic Canada?", "Not in most Atlantic provinces, but they're strongly recommended. Rules change, so check the current provincial rules."],
      ["What happens if a storm delays my rental return?", "Contact the company as soon as you can. Many operators don't charge extra for returns delayed by road closures or cancelled flights."],
    ],
  },
  {
    slug: "no-shows-late-returns", navLabel: "Cutting no-shows and late returns", keyword: "car rental no-show policy",
    title: "Cutting No-Shows and Late Returns at a Rental Company",
    h1: "Cutting no-shows and late returns",
    description: "Cut no-shows and late returns at a rental company: text confirmations and reminders, a clear no-show policy, grace periods and overdue follow-up.",
    lead: "No-shows leave cars empty that someone else would have rented, and late returns wreck the next pickup. A few habits, mostly automatic, cut both.",
    ctaTitle: "Reminders that send themselves.", ctaText: "Confirmations, return reminders, no-show follow-ups and overdue texts, in your wording, without anyone remembering to send them.",
    toc: [["why", "Why renters don't show"], ["remind", "Confirm and remind"], ["policy", "A clear no-show policy"], ["late", "Late returns"], ["grace", "Grace periods and overdue follow-up"], ["wording", "Wording that works"], ["measure", "Measure it"]],
    html: `<h2 id="why">Why renters don't show</h2>
      <p>Most no-shows aren't deliberate. People book with more than one company, plans change, flights are cancelled, or they simply forget. Very few call to cancel, because it's awkward and nobody makes it easy. Make cancelling easy, and remind people, and most no-shows become cancellations you can rebook.</p>
      <h2 id="remind">Confirm and remind</h2>
      <ul><li><strong>Confirm by text straight away,</strong> with the pickup time, the address and what to bring.</li>
      <li><strong>Remind the day before</strong>, with a link to change the time or cancel.</li>
      <li><strong>Verify the phone number at booking.</strong> A text code at booking means your reminders reach a real person.</li></ul>
      <p>Texts work far better than email for this; they're read within minutes.</p>
      <h2 id="policy">A clear no-show policy</h2>
      <p>Decide how long you'll hold a car past the pickup time, then follow up: a text a couple of hours after a missed pickup asking whether they still need the car, and a cutoff after which the booking is cancelled and the car goes back on sale. Tell renters the policy when they book. Some companies charge a no-show fee or keep a deposit taken at booking; that cuts no-shows but also puts off some renters, so weigh it against your market.</p>
      <h2 id="late">Late returns</h2>
      <p>Late returns cost you twice: the car isn't ready for the next renter, and the next renter waits or goes elsewhere. A reminder the day before the return, with the time and how to extend, prevents most of them. Make extensions easy to ask for, so renters who need more time say so before the return time rather than after it.</p>
      <h2 id="grace">Grace periods and overdue follow-up</h2>
      <p>Allow a short grace period (many companies use about half an hour) before a return counts as late. After that, follow up in steps: an automatic text, then, if there's no reply after a reasonable wait, a call. Flag a rental for a person to chase only after the automatic steps have had a chance; your staff's time is better spent on the renters who don't reply. Keep a record of every attempt, which you'll need if a car is truly missing.</p>
      <h2 id="wording">Wording that works</h2>
      <p>Short, friendly texts that tell the renter exactly what to do get the most replies. Examples:</p>
      <ul><li><strong>The day before pickup:</strong> "Hi Sam, your car is booked for tomorrow at 10:00 AM at 1 Main St. Bring your license and a credit card. Need a different time? Change it here: [link]."</li>
      <li><strong>After a missed pickup:</strong> "Hi Sam, we're holding your car until 2:00 PM. Still need it? Reply YES, or cancel here so we can free it up: [link]."</li>
      <li><strong>The day before return:</strong> "Hi Sam, your car is due back tomorrow at 10:00 AM. Need longer? Reply and we'll extend it."</li>
      <li><strong>Once overdue:</strong> "Hi Sam, your car was due back at 10:00 AM. Please call us at [number] to arrange the return."</li></ul>
      <p>Always say who the text is from, and keep a way to opt out.</p>
      <h2 id="measure">Measure it</h2>
      <p>Track your no-show rate and late return rate by month and by where the booking came from. Online bookings without a verified phone number often have the highest no-show rate; insurance replacements the lowest. If one source is far worse, change how you take its bookings.</p>`,
    faq: [
      ["What is a typical car rental no-show policy?", "Most companies hold the car for a set time after pickup, follow up with the renter, then cancel at a cutoff and put the car back on sale. Some charge a no-show fee."],
      ["How do I stop customers returning rental cars late?", "Remind them the day before with the time and how to extend, make extensions easy, and follow up automatically once the return is overdue."],
      ["How long is the grace period for returning a rental car?", "It varies by company; about half an hour is common. Check your rental agreement."],
    ],
  },
  {
    slug: "car-rental-bookings-online", navLabel: "Getting bookings online", keyword: "car rental bookings online",
    title: "How Independent Rental Companies Get Bookings Online",
    h1: "How independent rental companies get bookings online",
    description: "How independent car rental companies get more bookings online: Google Business Profile, reviews, a marketplace listing, a simple website and partners.",
    lead: "Big brands spend heavily on advertising. Independents can win local bookings for far less, by being easy to find, easy to trust and easy to book.",
    ctaTitle: "Get listed on fleetr.ai.", ctaText: "Your branch, your cars and your rates on fleetr.ai, with every booking straight into your reservations.",
    toc: [["google", "Your Google Business Profile"], ["reviews", "Reviews"], ["marketplace", "List where renters search"], ["website", "A simple website"], ["answer", "Answer fast"], ["partners", "Partners who send renters"], ["measure", "Measure what works"]],
    html: `<h2 id="google">Your Google Business Profile</h2>
      <p>For "car rental near me" and "car rental" plus your city, Google's map results are often the first thing renters see. A complete Google Business Profile is free and is the highest-value hour you can spend:</p>
      <ul><li>The right business category, your exact address and a phone number that's answered.</li>
      <li>Accurate hours, including holidays. Nothing loses a renter faster than a closed door during "open" hours.</li>
      <li>Real photos of your cars, your lot and your counter.</li>
      <li>A link to where renters can book.</li></ul>
      <h2 id="reviews">Reviews</h2>
      <p>Renters choose between local companies largely on reviews. Ask every happy renter for one, ideally by text right after the return, with a direct link. Reply to every review, good and bad, politely and quickly; future renters read your replies. A few honest replies to complaints build more trust than a perfect score.</p>
      <h2 id="marketplace">List where renters search</h2>
      <p>Renters compare companies on marketplaces before they book. Listing your fleet on one puts you in front of renters searching your city and dates, without building a booking engine yourself. On <a href="/">fleetr.ai</a>, renters search by city and dates, see your real availability, rates and requirements, and book; the booking lands in your reservations with a verified phone number, and renters check in on their phone at pickup. See the city pages for <a href="/car-rental/st-johns/">St. John's</a>, <a href="/car-rental/halifax/">Halifax</a>, <a href="/car-rental/moncton/">Moncton</a>, <a href="/car-rental/charlottetown/">Charlottetown</a> and <a href="/car-rental/fredericton/">Fredericton</a>.</p>
      <h2 id="website">A simple website</h2>
      <p>You don't need a big site. You need one that loads fast on a phone and answers what renters ask: where you are, your hours, your classes and prices from, what to bring, your minimum age and deposit, and how to book. Put your city and "car rental" in the page title and first heading. Link to your listing so renters can book in one tap.</p>
      <h2 id="answer">Answer fast</h2>
      <p>Same-day renters call several companies and book with the first one that answers. Answer the phone, reply to messages within minutes, and keep a few cars free for walk-ins and same-day calls when you can. The companies that answer fastest win the bookings the others never knew they missed.</p>
      <h2 id="partners">Partners who send renters</h2>
      <p>Online bookings aren't only from renters. Body shops, dealerships and insurance adjusters book replacement cars every day. Give them an easy way to book online with the claim or repair order number, and they'll come back. Our guide to <a href="/resources/insurance-replacement-rentals/">insurance replacement rentals</a> covers winning that work.</p>
      <h2 id="measure">Measure what works</h2>
      <p>Record where every booking came from: walk-in, phone, your website, a marketplace, a body shop, an insurer, a corporate account. Once a month, look at bookings and revenue by source. You'll quickly see which efforts pay and which don't.</p>
      <p>Your Google Business Profile shows how many people found you, called or asked for directions, and the searches they used. If calls are high but bookings low, the problem is at your end of the phone. If profile views are low, work on photos, reviews and your categories. Ask walk-in renters how they heard of you; the answer is often a body shop or a friend, which tells you where to spend your time.</p>
      <p>Give each change a month before judging it, and change one thing at a time, so you know what made the difference.</p>`,
    faq: [
      ["How can a small car rental company compete with big brands online?", "Be easy to find locally (a complete Google Business Profile), easy to trust (reviews and replies) and easy to book (a marketplace listing and fast answers)."],
      ["Does a car rental company need its own booking website?", "Not necessarily. Listing on a marketplace such as fleetr.ai lets renters book your cars online without you building a booking engine."],
      ["How do I get more reviews for my rental company?", "Ask every happy renter, ideally by text right after the return with a direct link, and reply to every review."],
    ],
  },
];
