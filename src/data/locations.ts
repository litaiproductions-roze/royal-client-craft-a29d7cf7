export interface Location {
  slug: string;
  name: string;
  region: string;
  title: string;
  description: string;
  hero: string;
  intro: string;
  highlights: string[];
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const locations: Location[] = [
  {
    slug: "long-island-ny",
    name: "Long Island",
    region: "Long Island, NY",
    title: "Long Island Web Designer & AI Automation Agency | Lit AI Productions",
    description:
      "Lit AI Productions is a Long Island web design and AI automation agency. Custom websites, SEO, and AI tools for local businesses across Long Island, NY.",
    hero: "Web Design & AI Automation on Long Island",
    intro:
      "Lit AI Productions is a Long Island web design and AI automation agency working with local businesses, contractors, restaurants, creators, and startups from Montauk to Queens. We build modern, fast, mobile-first websites and AI tools that bring in real local customers.",
    highlights: [
      "Local SEO tuned for Long Island search results",
      "Mobile-first websites that load fast on every device",
      "AI chatbots and lead capture that work 24/7",
      "Cloudflare hosting and security included",
      "Transparent pricing, no long contracts",
    ],
    faqs: [
      {
        q: "Are you a local Long Island web design company?",
        a: "Yes. Lit AI Productions is based on Long Island and works with businesses across Suffolk County, Nassau County, and NYC.",
      },
      {
        q: "Do you offer in-person meetings on Long Island?",
        a: "Yes, for clients on Long Island we offer in-person discovery meetings in addition to video calls.",
      },
      {
        q: "What industries do you serve on Long Island?",
        a: "Contractors, restaurants, retail, professional services, creators, and local startups across Long Island, NY.",
      },
    ],
    keywords: [
      "Long Island web designer",
      "Long Island web design",
      "Long Island AI automation",
    ],
  },
  {
    slug: "farmingdale-ny",
    name: "Farmingdale",
    region: "Farmingdale, NY",
    title: "Farmingdale, NY Web Design & AI Agency | Lit AI Productions",
    description:
      "Local web design and AI automation services in Farmingdale, NY. Custom websites, SEO, and AI tools for Farmingdale small businesses and startups.",
    hero: "Web Design & AI Automation in Farmingdale, NY",
    intro:
      "Lit AI Productions serves Farmingdale, NY businesses with custom website design, local SEO, and AI automation. From Main Street shops to scaling startups, we help local Farmingdale businesses show up on Google and convert more customers online.",
    highlights: [
      "Hyper-local SEO for Farmingdale and 11735",
      "Google Business Profile optimization",
      "Click-to-call mobile websites",
      "AI-powered lead capture",
      "Personal, local service",
    ],
    faqs: [
      {
        q: "Do you build websites for Farmingdale small businesses?",
        a: "Yes — Farmingdale small businesses are our core focus, alongside the rest of Long Island.",
      },
      {
        q: "Can you help my Farmingdale business rank on Google Maps?",
        a: "Yes. We optimize your Google Business Profile, your website, and your local citations together.",
      },
    ],
    keywords: [
      "Farmingdale web designer",
      "Farmingdale NY web design",
      "Farmingdale SEO",
    ],
  },
  {
    slug: "suffolk-county-ny",
    name: "Suffolk County",
    region: "Suffolk County, NY",
    title: "Suffolk County Web Design & AI Automation | Lit AI Productions",
    description:
      "Suffolk County, NY web design and AI automation services. Custom websites, local SEO, and AI tools for businesses across Suffolk County.",
    hero: "Web Design & AI for Suffolk County Businesses",
    intro:
      "Lit AI Productions works with businesses across Suffolk County, NY — from Babylon and Brookhaven to Smithtown, Islip, and the East End. We build websites and AI automations that help local Suffolk County businesses compete and grow online.",
    highlights: [
      "Custom websites tuned for Suffolk County searches",
      "Local SEO and Google Business Profile",
      "AI chatbots, lead capture, and automation",
      "Cloudflare hosting and security",
      "Maintenance plans for peace of mind",
    ],
    faqs: [
      {
        q: "Do you serve all of Suffolk County?",
        a: "Yes — Babylon, Islip, Brookhaven, Smithtown, Riverhead, Southampton, East Hampton, and everywhere in between.",
      },
      {
        q: "Can you help me rank for searches in Suffolk County?",
        a: "Yes. Local SEO for Suffolk County is one of our core services.",
      },
    ],
    keywords: [
      "Suffolk County web designer",
      "Suffolk County SEO",
      "Suffolk County web design",
    ],
  },
  {
    slug: "nassau-county-ny",
    name: "Nassau County",
    region: "Nassau County, NY",
    title: "Nassau County Web Design & AI Agency | Lit AI Productions",
    description:
      "Nassau County, NY web design and AI automation services. Custom websites, SEO, and AI tools for Nassau County small businesses.",
    hero: "Web Design & AI for Nassau County Businesses",
    intro:
      "Lit AI Productions builds custom websites and AI automations for Nassau County, NY businesses — Garden City, Hempstead, Long Beach, Mineola, and across the county. We help local Nassau County businesses rank, convert, and scale online.",
    highlights: [
      "Local SEO for Nassau County keywords",
      "Conversion-focused design",
      "AI chatbots and CRM automation",
      "Fast Cloudflare hosting",
      "Flat, transparent pricing",
    ],
    faqs: [
      {
        q: "Do you build websites for Nassau County businesses?",
        a: "Yes. Nassau County is part of our core service area on Long Island.",
      },
      {
        q: "Can you help with Google rankings in Nassau County?",
        a: "Yes — we combine technical SEO, local SEO, and Google Business Profile work for Nassau County businesses.",
      },
    ],
    keywords: [
      "Nassau County web designer",
      "Nassau County web design",
      "Nassau County SEO",
    ],
  },
  {
    slug: "new-york",
    name: "New York",
    region: "New York",
    title: "New York Web Design Agency & AI Automation | Lit AI Productions",
    description:
      "New York web design agency offering custom websites, AI automation, and SEO services for businesses across NYC and New York State.",
    hero: "New York Web Design & AI Automation Agency",
    intro:
      "Lit AI Productions is a New York web design agency serving businesses across NYC, Long Island, and the wider New York region. We design, build, and automate websites that compete in one of the most demanding markets in the world.",
    highlights: [
      "NYC-grade design and execution",
      "Performance-first engineering",
      "AI automation for sales and ops",
      "Local SEO across New York markets",
      "Remote-first with on-site options",
    ],
    faqs: [
      {
        q: "Are you a New York web design agency?",
        a: "Yes. Lit AI Productions is a New York-based web design and AI automation agency.",
      },
      {
        q: "Do you work with NYC businesses?",
        a: "Yes — we work with NYC startups, agencies, and small businesses, in addition to clients across Long Island and the rest of New York.",
      },
    ],
    keywords: [
      "New York web design agency",
      "NYC web designer",
      "New York AI automation",
    ],
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
