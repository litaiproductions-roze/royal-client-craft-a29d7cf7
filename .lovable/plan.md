# Lit AI Productions — SEO & Conversion Overhaul Plan

This is a large, multi-area build. Below is the proposed scope. Confirm or trim before I start; I'll execute in the order shown.

## 1. Site architecture (new routes)

Add the following routes under `src/App.tsx` with per-route SEO via the existing `<SEO>` component, breadcrumbs, internal links, and a contact/quote form embedded on every service & location page.

**Services (`/services/*`)**
- `/services` — services hub
- `/services/website-design`
- `/services/business-websites`
- `/services/ai-automation`
- `/services/ecommerce-development`
- `/services/landing-pages`
- `/services/seo-optimization`
- `/services/website-maintenance`
- `/services/cloudflare-hosting-security`
- `/services/custom-business-solutions`

**Locations (`/locations/*`)**
- `/locations/long-island-ny`
- `/locations/farmingdale-ny`
- `/locations/suffolk-county-ny`
- `/locations/nassau-county-ny`
- `/locations/new-york`

**Other**
- `/blog` — index shell ready for future posts (no posts yet; just structure + JSON-LD)
- Keep existing Home, About, Portfolio, Contact, Privacy.

## 2. Technical SEO

- Per-route `<title>`, `<meta description>`, canonical, `og:*`, `twitter:*` (already wired via `SEO.tsx` — extend to all new pages).
- Structured data: Organization, WebSite, LocalBusiness (Farmingdale, NY address — I'll use placeholder geo unless you give exact), Service (per service page), FAQPage (per service page), BreadcrumbList (every nested route).
- Update `public/sitemap.xml` with all new routes (priorities tuned).
- `public/robots.txt` already correct — leave as-is.
- Update `public/llms.txt` with new service/location summaries.
- Heading hierarchy: one H1 per page, H2 for sections, H3 for sub-items.

## 3. Local SEO

- LocalBusiness schema with serviceArea covering Long Island, Suffolk, Nassau, NYC.
- Each location page: localized H1, intro, services-offered list, "why local businesses choose us", FAQ, CTA, internal links to relevant services.
- Naturally weave target phrases (e.g. "Long Island web designer", "Farmingdale web design") — no stuffing.

## 4. Content & conversion

- Reusable `<ServicePageTemplate>` component: Hero → Problem/Solution → What's Included → Process (4–5 steps) → Pricing-tier teaser (optional) → FAQ → Trust strip (portfolio + testimonials) → embedded contact form → final CTA.
- Reusable `<LocationPageTemplate>` similar.
- CTAs everywhere: "Get a Free Consultation", "Request a Quote", "Book a Discovery Call", "Start Your Project" → all anchor to `/contact` with a `?intent=` query param the contact page can pre-fill.
- Add a `<Breadcrumbs>` component (visual + JSON-LD).
- Homepage rewrite: tighter value prop, who/what/who-we-help/why-us/how-to-start sections, services grid linking to service pages, locations strip, testimonials placeholder, FAQ accordion, final CTA.

## 5. Internal linking

- Footer: column for Services (all 9), column for Locations (all 5), column for Company.
- Each service page links to 2–3 related services + relevant locations.
- Each location page links to all services.
- Breadcrumbs on every nested page.

## 6. Performance

- Existing logo already has `width`/`height`/`fetchPriority`. I'll keep new images dimensioned and lazy-loaded except the LCP hero.
- Service/location pages are static markup — fast by default.

## 7. What I will NOT do (flag for follow-up)

- I won't invent testimonials or pricing — placeholders with TODO comments, or I'll omit. Tell me if you want me to draft sample copy you can edit.
- I won't add a blog CMS — just an empty `/blog` shell with schema. Real posts later.
- I won't change brand colors / visual theme (royal purple stays).
- LocalBusiness schema needs your real NAP (Name/Address/Phone). I'll use: name "Lit AI Productions", area "Farmingdale, NY 11735", phone TBD. **Reply with the exact address + phone or I'll leave phone blank and city-only address.**

## Deliverables

~25 new/edited files. Estimated chunks:
1. New `ServicePageTemplate`, `LocationPageTemplate`, `Breadcrumbs`, `FAQ`, `CTASection` components + shared service/location data files.
2. 9 service pages + services hub.
3. 5 location pages.
4. Homepage rewrite + Footer link expansion + sitemap + llms.txt update + App.tsx routes.

---

**Approve to proceed**, or tell me what to cut (e.g. skip locations, skip blog, fewer services). Also send NAP details if you want full LocalBusiness schema.
