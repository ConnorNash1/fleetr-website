// Builds fleetr.ai's static pages (Nov 17, SEO) from seo/content.mjs:
// every page as plain HTML, so search engines read all of it with no script,
// each with its own title, description, canonical URL, social card and
// schema, plus sitemap.xml and robots.txt. The output is committed, so the
// site still publishes as plain files (GitHub Pages for fleetr.ai, Cloudflare
// Pages for staging, where prepare_site.sh adds noindex to every page).
//   node seo/build.mjs
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, ORG } from "./content.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SITE = "https://fleetr.ai";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const url = (p) => `${SITE}${p}`;
// Each asset's link carries a hash of its contents, so a changed file is
// fetched fresh and an unchanged one stays cached.
const ver = (f) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, f))).digest("hex").slice(0, 10);

const NAV = [["/", "Rent a Vehicle"], ["https://app.fleetr.ai", "Check in"], ["/rental-companies/", "For Rental Companies"], ["/dealership-loaner-software/", "For Dealerships"]];
const FOOT = (pages) => [
  ["Rent a car", [["/", "Search fleetr.ai"], ...pages.filter((p) => p.group === "city").map((p) => [p.path, `Car rental ${p.short}`])]],
  ["For rental companies", pages.filter((p) => p.group === "operator").map((p) => [p.path, p.navLabel])],
  ["Guides", [["/resources/", "All guides"], ...pages.filter((p) => p.group === "article").map((p) => [p.path, p.navLabel])]],
  ["fleetr", [["https://app.fleetr.ai", "Check in"], ["https://internal.fleetr.ai", "Staff Sign In"], ["/#/privacy", "Privacy Policy"], ["/#/terms", "Terms of Use"]]],
];

const menuIcon = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 5h12M2 11h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

function header(page) {
  const here = (href) => (page.navActive === href ? ' aria-current="page"' : "");
  return `<header class="nav">
    <div class="wrap">
      <a href="/" class="logo" aria-label="fleetr, home"><img class="fleetr-logo" src="/fleetr-logo-terracotta-on-white.svg" alt="fleetr" width="156" height="28"></a>
      <nav class="nav-links" aria-label="Main">
        ${NAV.map(([h, l]) => `<a href="${h}"${here(h)}>${l}</a>`).join("\n        ")}
        <a href="https://internal.fleetr.ai">Staff Sign In</a>
      </nav>
      <details class="nav-menu">
        <summary aria-label="Menu">${menuIcon} Menu</summary>
        <div class="nav-sheet">
          ${NAV.map(([h, l]) => `<a href="${h}"${here(h)}>${l}</a>`).join("\n          ")}
          <hr>
          <a href="https://internal.fleetr.ai">Staff Sign In</a>
        </div>
      </details>
    </div>
  </header>`;
}

function footer(pages) {
  return `<footer class="footer">
    <div class="wrap">
      <a href="/" class="logo" aria-label="fleetr, home"><img class="fleetr-logo" src="/fleetr-logo-terracotta-on-white.svg" alt="fleetr" width="156" height="28"></a>
      <div class="footer-cols">
        ${FOOT(pages).map(([title, links]) => `<nav aria-label="${esc(title)}"><h2>${esc(title)}</h2><ul>${links.map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join("")}</ul></nav>`).join("\n        ")}
      </div>
      <small>&copy; 2026 fleetr Technologies Corp.</small>
    </div>
  </footer>`;
}

// The Book a demo form, in every operator page and guide. Without script the
// "Book a demo" links jump to it at #demo; with script it opens as a dialog.
const demoDialog = `<dialog class="demo-dialog" id="demo" aria-labelledby="demo-title">
    <div class="demo-body">
      <button type="button" class="demo-close" aria-label="Close" data-close>&times;</button>
      <span class="kicker">Book a demo</span>
      <h2 id="demo-title">See fleetr with your own fleet.</h2>
      <p class="muted" style="margin-top:10px">Book 30 minutes with us. We'll show you exactly how it works for your operation.</p>
      <form action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="fe9cd01b-a672-4405-8430-5449cfa31aa2">
        <input type="hidden" name="subject" value="Demo Request from fleetr.ai">
        <input type="hidden" name="from_name" value="fleetr.ai website">
        <input type="checkbox" name="botcheck" class="honey" tabindex="-1" autocomplete="off">
        <label class="field"><span>Name</span><input class="input" type="text" name="name" autocomplete="name" required></label>
        <label class="field"><span>Email</span><input class="input" type="email" name="email" autocomplete="email" required></label>
        <label class="field"><span>Company and fleet size (optional)</span><input class="input" type="text" name="company" autocomplete="organization"></label>
        <label class="field"><span>Anything you'd like to share? (optional)</span><textarea class="input" name="message" rows="3"></textarea></label>
        <p class="note" role="status" aria-live="polite" data-status></p>
        <button type="submit" class="btn btn-primary">Book a demo</button>
      </form>
    </div>
  </dialog>`;

function crumbs(page) {
  if (!page.crumbs) return "";
  return `<nav aria-label="Breadcrumb"><ol class="crumbs">${page.crumbs.map(([h, l], i, a) => i === a.length - 1
    ? `<li><span aria-current="page">${esc(l)}</span></li>` : `<li><a href="${h}">${esc(l)}</a></li>`).join("")}</ol></nav>`;
}

function schemaFor(page) {
  const graph = [ORG];
  if (page.crumbs) graph.push({ "@type": "BreadcrumbList", itemListElement: page.crumbs.map(([h, l], i) => ({ "@type": "ListItem", position: i + 1, name: l, item: url(h) })) });
  if (page.group === "operator" || page.path === "/rental-companies/") graph.push({
    "@type": "SoftwareApplication", name: "fleetr", applicationCategory: "BusinessApplication", operatingSystem: "Web, iOS, Android",
    description: page.description, url: url(page.path), publisher: { "@id": `${SITE}/#org` },
    audience: { "@type": "BusinessAudience", audienceType: page.audience || "Car rental companies" },
    featureList: page.features || undefined,
  });
  if (page.group === "city") graph.push({
    "@type": "WebPage", name: page.title, url: url(page.path), description: page.description,
    about: { "@type": "City", name: page.cityFull, containedInPlace: { "@type": "AdministrativeArea", name: page.province } },
  });
  if (page.group === "article") graph.push({
    "@type": "Article", headline: page.h1, description: page.description, url: url(page.path), datePublished: page.date, dateModified: page.date,
    author: { "@type": "Organization", name: "fleetr" }, publisher: { "@id": `${SITE}/#org` }, mainEntityOfPage: url(page.path), inLanguage: "en-CA",
  });
  if (page.faq && page.faq.length) graph.push({ "@type": "FAQPage", mainEntity: page.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

export function render(page, pages) {
  const ogTitle = page.ogTitle || page.title.replace(/ \| fleetr$/, "");
  const faq = page.faq && page.faq.length ? `<section class="band" aria-labelledby="faq-h"><div class="wrap"><h2 id="faq-h">Questions people ask</h2><div class="faq">${page.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>` : "";
  const cta = page.cta === false ? "" : page.group === "city"
    ? ""
    : `<div class="wrap"><section class="cta" aria-labelledby="cta-h"><h2 id="cta-h">${esc(page.ctaTitle || "See fleetr with your own fleet")}</h2><p>${esc(page.ctaText || "Thirty minutes, on a call, with your vehicles and your rates. No commitment.")}</p><a class="btn btn-primary" href="#demo" data-demo>Book a demo</a></section></div>`;
  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <link rel="canonical" href="${url(page.path)}">
  <meta property="og:site_name" content="fleetr">
  <meta property="og:type" content="${page.group === "article" ? "article" : "website"}">
  <meta property="og:title" content="${esc(ogTitle)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:url" content="${url(page.path)}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="fleetr">
  <meta property="og:locale" content="en_CA">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(ogTitle)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${SITE}/og-image.png">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#F9F9F7">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css?v=${ver("assets/site.css")}">
  <script type="application/ld+json">${schemaFor(page)}</script>
</head>
<body>
  <a class="sr-only" href="#main">Skip to the content</a>
  ${header(page)}
  <main id="main">
    <div class="wrap">${crumbs(page)}</div>
    ${page.body}
    ${faq}
    ${cta}
  </main>
  ${footer(pages)}
  ${page.group === "city" ? "" : demoDialog}
  <script src="/assets/site.js?v=${ver("assets/site.js")}" defer></script>
</body>
</html>
`;
}

export function build() {
  const written = [];
  for (const page of PAGES) {
    const file = path.join(ROOT, page.path, "index.html");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, render(page, PAGES));
    written.push(page.path);
  }
  const today = "2026-11-17";
  const all = ["/", ...PAGES.map((p) => p.path)];
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url><loc>${url(p)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
  fs.writeFileSync(path.join(ROOT, "robots.txt"), `# fleetr.ai. The booking steps (checkout, confirmation) live behind the
# home page's #/ routes, which search engines do not crawl as pages.
User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
  return written;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const w = build();
  console.log(`Built ${w.length} pages, sitemap.xml and robots.txt.`);
}
