export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  name: string;
  title: string;
  description: string;
  summary: string;
  hero: string;
  problem: string;
  solution: string;
  includes: string[];
  process: { step: string; detail: string }[];
  faqs: ServiceFAQ[];
  related: string[]; // slugs
  keywords: string[];
}

export const services: Service[] = [
  {
    slug: "website-design",
    name: "Website Design",
    title: "Custom Website Design Services | Lit AI Productions",
    description:
      "Professional custom website design for businesses, startups, creators, and local brands. Modern, mobile-first websites built to convert visitors into customers.",
    summary:
      "Modern, conversion-focused custom website design for businesses, creators, and startups across Long Island, NYC, and beyond.",
    hero: "Custom Website Design That Converts",
    problem:
      "Most small business websites look outdated, load slowly, and quietly lose customers every day. A clunky site costs you trust, leads, and revenue.",
    solution:
      "We design fast, modern, mobile-first websites tailored to your brand and built around how real customers actually buy. Every page is optimized for clarity, speed, and conversion.",
    includes: [
      "Custom UI/UX design tailored to your brand",
      "Fully responsive mobile-first layouts",
      "On-page SEO and semantic HTML",
      "Lightning-fast Core Web Vitals performance",
      "Accessible, WCAG-aware components",
      "Lead capture forms and conversion tracking",
      "CMS or admin dashboard (optional)",
      "Launch support and post-launch tuning",
    ],
    process: [
      { step: "Discovery", detail: "We learn your business, goals, customers, and competition." },
      { step: "Design", detail: "Wireframes and high-fidelity mockups for your approval." },
      { step: "Build", detail: "Hand-crafted, accessible, performance-tuned code." },
      { step: "Launch", detail: "Deploy to Cloudflare with monitoring and analytics." },
      { step: "Optimize", detail: "Ongoing tuning based on real user data." },
    ],
    faqs: [
      {
        q: "How much does a custom website cost?",
        a: "Pricing depends on scope, but most small-business websites land between $1,500 and $8,000. We'll quote your exact project after a free discovery call.",
      },
      {
        q: "How long does a website take to build?",
        a: "Most projects launch in 2 to 6 weeks. Landing pages can launch in under a week; larger sites with custom features take longer.",
      },
      {
        q: "Do you design websites for local businesses on Long Island?",
        a: "Yes. We work with local businesses across Long Island, NYC, Suffolk County, and Nassau County, and we optimize every site for local SEO.",
      },
      {
        q: "Will my website be mobile-friendly and fast?",
        a: "Every site we build is mobile-first, accessible, and tuned for Google's Core Web Vitals so it ranks well and feels great on every device.",
      },
    ],
    related: ["business-websites", "landing-pages", "seo-optimization"],
    keywords: [
      "website designer near me",
      "custom website development",
      "Long Island web designer",
      "New York web design agency",
      "affordable web design services",
    ],
  },
  {
    slug: "business-websites",
    name: "Business Websites",
    title: "Small Business Website Development | Lit AI Productions",
    description:
      "Small business website development for local shops, service providers, and startups. Get a professional business website that ranks, converts, and scales.",
    summary:
      "Professional small business websites that show up in local search and turn visitors into paying customers.",
    hero: "Small Business Websites That Win Customers",
    problem:
      "Local customers are searching for your services on Google right now. If your website doesn't load fast, look credible, and make it easy to contact you, those leads go to a competitor.",
    solution:
      "We build business websites engineered for local SEO, fast load times, and obvious calls to action so the right customers find you and reach out.",
    includes: [
      "Service-focused homepage and pages",
      "Google Business Profile and local SEO setup",
      "Contact forms, click-to-call, and lead routing",
      "Trust elements (reviews, portfolio, FAQ)",
      "Schema markup for LocalBusiness",
      "Analytics and call tracking",
    ],
    process: [
      { step: "Strategy", detail: "Pick the right pages, keywords, and CTAs for your market." },
      { step: "Design & Copy", detail: "Conversion copy paired with on-brand design." },
      { step: "Build & Launch", detail: "Deploy a secure, fast site on modern hosting." },
      { step: "Grow", detail: "Local SEO, reviews, and content add-ons over time." },
    ],
    faqs: [
      {
        q: "Do you offer website builder services for local businesses?",
        a: "Yes. We build managed websites for local businesses without locking you into a clunky drag-and-drop builder.",
      },
      {
        q: "Can you help my business show up on Google Maps?",
        a: "Yes. We optimize your site and Google Business Profile together so local customers can find and contact you fast.",
      },
      {
        q: "Do you serve Farmingdale, Suffolk County, and Nassau County?",
        a: "Yes. Lit AI Productions serves businesses across Long Island, including Farmingdale, Suffolk County, Nassau County, and all of New York.",
      },
    ],
    related: ["website-design", "seo-optimization", "website-maintenance"],
    keywords: [
      "small business website development",
      "website builder for local businesses",
      "web design company",
      "Long Island web designer",
    ],
  },
  {
    slug: "ai-automation",
    name: "AI Automation",
    title: "AI Automation Services for Business | Lit AI Productions",
    description:
      "AI automation services for small businesses: chatbots, lead capture, workflow automation, and custom AI tools that save time and grow revenue.",
    summary:
      "Custom AI automation, chatbots, and workflow tools that save your team time and capture more leads.",
    hero: "AI Automation That Works for Your Business",
    problem:
      "Your team is buried in repetitive tasks: answering the same questions, following up with leads, copy-pasting data between tools. That work doesn't grow your business — it stalls it.",
    solution:
      "We design and deploy practical AI automations: smart chatbots, lead-capture workflows, document and email automation, and custom AI tools tailored to your operation.",
    includes: [
      "AI chatbot and assistant deployment",
      "Lead capture and qualification automation",
      "Email, CRM, and document workflow automation",
      "Custom AI tools built around your data",
      "Integrations with the tools you already use",
      "Training and handoff so your team stays in control",
    ],
    process: [
      { step: "Audit", detail: "Map the workflows and bottlenecks eating your team's time." },
      { step: "Design", detail: "Pick the right model, integrations, and guardrails." },
      { step: "Build & Test", detail: "Deploy in a controlled environment with real data." },
      { step: "Launch & Train", detail: "Roll it out, train your team, and measure ROI." },
    ],
    faqs: [
      {
        q: "What is AI business automation?",
        a: "AI business automation uses AI models and integrations to handle repeatable work — like answering questions, qualifying leads, summarizing documents, or routing tasks — so your team can focus on higher-value work.",
      },
      {
        q: "Do I need to be technical to use AI automation?",
        a: "No. We build, deploy, and train you on the tools. You get a working system, not a science project.",
      },
      {
        q: "Can AI automation work with my existing tools?",
        a: "Yes. We integrate with most CRMs, email platforms, spreadsheets, and databases.",
      },
    ],
    related: ["custom-business-solutions", "website-design", "seo-optimization"],
    keywords: [
      "AI automation services",
      "AI business automation",
      "AI agency",
      "custom AI tools",
    ],
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce Development",
    title: "E-commerce Website Development | Lit AI Productions",
    description:
      "Custom e-commerce website development for product brands and DTC startups. Fast, secure online stores built to convert browsers into buyers.",
    summary:
      "Custom e-commerce stores built for conversion, speed, and scale — from boutique brands to scaling DTC startups.",
    hero: "E-commerce Stores Built to Sell",
    problem:
      "Generic store templates feel cheap, load slow, and bleed conversion at every step of checkout.",
    solution:
      "We build custom e-commerce experiences with fast product pages, smart checkout, and integrations for payments, shipping, and inventory.",
    includes: [
      "Custom product and category pages",
      "Stripe, Shopify, or headless checkout",
      "Inventory, shipping, and tax integrations",
      "Conversion-focused PDP and cart UX",
      "SEO for product and collection pages",
      "Analytics, abandoned-cart recovery, and email flows",
    ],
    process: [
      { step: "Strategy", detail: "Define your catalog, audience, and conversion goals." },
      { step: "Design", detail: "Brand-true UI for storefront, PDP, and checkout." },
      { step: "Build", detail: "Headless or full-stack store, payments wired up." },
      { step: "Launch", detail: "QA, soft launch, and growth tuning." },
    ],
    faqs: [
      {
        q: "Do you build on Shopify or custom?",
        a: "Both. We recommend the right stack based on your catalog size, customization needs, and budget.",
      },
      {
        q: "Can you migrate my existing store?",
        a: "Yes. We migrate from Wix, Squarespace, WooCommerce, and Shopify with no downtime and clean SEO redirects.",
      },
    ],
    related: ["website-design", "seo-optimization", "landing-pages"],
    keywords: [
      "ecommerce website development",
      "custom online store",
      "Shopify developer",
    ],
  },
  {
    slug: "landing-pages",
    name: "Landing Pages",
    title: "High-Converting Landing Page Design | Lit AI Productions",
    description:
      "Custom landing page design and development for ads, launches, and lead capture. Built to convert paid traffic into qualified leads.",
    summary:
      "Custom landing pages purpose-built for ads, launches, and lead capture — engineered to convert paid traffic.",
    hero: "Landing Pages That Convert Paid Traffic",
    problem:
      "You're paying for clicks that hit a generic homepage and bounce. Every wasted click is wasted budget.",
    solution:
      "We design dedicated, fast-loading landing pages around a single offer with a single CTA — built to turn cold traffic into qualified leads.",
    includes: [
      "Single-offer, single-CTA design",
      "Persuasive copy and visuals",
      "A/B-ready structure",
      "Form, scheduler, or click-to-call CTA",
      "Conversion tracking and analytics",
      "Sub-2-second load times",
    ],
    process: [
      { step: "Offer", detail: "Sharpen the offer, audience, and CTA." },
      { step: "Design & Copy", detail: "Long- or short-form layout tuned to intent." },
      { step: "Build & Launch", detail: "Ship in days, not weeks." },
      { step: "Iterate", detail: "Optimize from real ad and form data." },
    ],
    faqs: [
      {
        q: "How quickly can a landing page launch?",
        a: "Most landing pages launch within 5 to 10 business days.",
      },
      {
        q: "Do you set up conversion tracking?",
        a: "Yes. We wire up GA4, pixel, and call tracking so every lead is attributed.",
      },
    ],
    related: ["website-design", "seo-optimization", "ai-automation"],
    keywords: [
      "landing page design",
      "high converting landing page",
      "PPC landing page",
    ],
  },
  {
    slug: "seo-optimization",
    name: "SEO Optimization",
    title: "SEO Services for Small Businesses | Lit AI Productions",
    description:
      "Local and technical SEO services for small businesses. Get found on Google with on-page SEO, local SEO, structured data, and Core Web Vitals optimization.",
    summary:
      "Local and technical SEO services that help your business show up when customers search on Google and AI assistants.",
    hero: "SEO That Brings Real Customers, Not Just Traffic",
    problem:
      "If your business doesn't show up on page one for the searches your customers actually run, you don't exist to them.",
    solution:
      "We combine technical SEO, local SEO, content strategy, and structured data so your site ranks, your business appears in Google's local pack, and AI search assistants can recommend you confidently.",
    includes: [
      "Full technical SEO audit",
      "On-page SEO and content optimization",
      "Local SEO and Google Business Profile",
      "Schema.org / structured data implementation",
      "Core Web Vitals and page speed tuning",
      "AI search optimization (AI Overviews, ChatGPT, Perplexity)",
    ],
    process: [
      { step: "Audit", detail: "Find what's blocking rankings today." },
      { step: "Fix", detail: "Technical fixes, schema, speed, and on-page." },
      { step: "Grow", detail: "Content, links, and local signals." },
      { step: "Report", detail: "Plain-English monthly results." },
    ],
    faqs: [
      {
        q: "How long until I see SEO results?",
        a: "Technical wins can show up in 2–4 weeks. Ranking gains for competitive local keywords typically take 3–6 months.",
      },
      {
        q: "Do you optimize for AI search and ChatGPT?",
        a: "Yes. We structure content with semantic HTML, schema, and concise summaries so AI search engines can understand and cite your site.",
      },
      {
        q: "Do you offer local SEO for Long Island businesses?",
        a: "Yes — local SEO for Long Island, Farmingdale, Suffolk County, Nassau County, and NYC is one of our core services.",
      },
    ],
    related: ["website-design", "business-websites", "website-maintenance"],
    keywords: [
      "SEO services",
      "local SEO",
      "small business SEO",
      "AI search optimization",
    ],
  },
  {
    slug: "website-maintenance",
    name: "Website Maintenance",
    title: "Website Maintenance & Support Plans | Lit AI Productions",
    description:
      "Ongoing website maintenance, updates, backups, and security monitoring. Keep your business website fast, secure, and current.",
    summary:
      "Ongoing updates, security, backups, and performance care so your website keeps working while you run your business.",
    hero: "Website Maintenance That Protects Your Investment",
    problem:
      "Websites aren't 'set it and forget it.' Without updates, plugins break, security holes open, and rankings slip.",
    solution:
      "We handle updates, backups, monitoring, and small content changes on a flat monthly plan — so your site stays fast, secure, and current.",
    includes: [
      "Software, plugin, and dependency updates",
      "Daily backups and 1-click restore",
      "Uptime and performance monitoring",
      "Security monitoring and patching",
      "Small content edits each month",
      "Priority response on issues",
    ],
    process: [
      { step: "Onboard", detail: "We audit and stabilize your existing site." },
      { step: "Protect", detail: "Backups, monitoring, and security baseline." },
      { step: "Maintain", detail: "Monthly updates, edits, and check-ins." },
      { step: "Improve", detail: "Quarterly recommendations for speed and SEO." },
    ],
    faqs: [
      {
        q: "Do you maintain websites you didn't build?",
        a: "Yes. We onboard and maintain WordPress, Shopify, Webflow, and custom sites.",
      },
      {
        q: "What's included each month?",
        a: "Updates, backups, monitoring, security patches, and a block of small content edits.",
      },
    ],
    related: ["cloudflare-hosting-security", "seo-optimization", "website-design"],
    keywords: [
      "website maintenance",
      "website support",
      "WordPress maintenance",
    ],
  },
  {
    slug: "cloudflare-hosting-security",
    name: "Cloudflare Hosting & Security",
    title: "Cloudflare Hosting & Website Security | Lit AI Productions",
    description:
      "Cloudflare hosting, CDN, and website security setup. DDoS protection, SSL, and global performance for fast, secure business websites.",
    summary:
      "Cloudflare-powered hosting, CDN, and security — globally fast and protected against bots, DDoS, and downtime.",
    hero: "Cloudflare Hosting & Security That Just Works",
    problem:
      "Cheap shared hosting is slow, insecure, and unpredictable. One traffic spike or attack and your site is down.",
    solution:
      "We deploy your site on Cloudflare's global edge network with full SSL, DDoS protection, smart caching, and bot mitigation baked in.",
    includes: [
      "Cloudflare Pages or Workers deployment",
      "Global CDN with edge caching",
      "Full SSL and HTTPS enforcement",
      "DDoS and bot protection",
      "WAF rules tuned to your stack",
      "DNS and email routing setup",
    ],
    process: [
      { step: "Plan", detail: "Pick the right Cloudflare plan and architecture." },
      { step: "Migrate", detail: "Zero-downtime DNS and content migration." },
      { step: "Harden", detail: "WAF, rate-limit, and bot rules." },
      { step: "Monitor", detail: "Performance, security, and analytics." },
    ],
    faqs: [
      {
        q: "Why Cloudflare instead of cheap shared hosting?",
        a: "Cloudflare's edge network makes your site fast everywhere, blocks attacks at the perimeter, and scales for free when you get a traffic spike.",
      },
      {
        q: "Can you migrate my existing site?",
        a: "Yes — we handle DNS, SSL, and content migration with no downtime.",
      },
    ],
    related: ["website-maintenance", "website-design", "seo-optimization"],
    keywords: [
      "Cloudflare hosting",
      "website security",
      "DDoS protection",
    ],
  },
  {
    slug: "custom-business-solutions",
    name: "Custom Business Solutions",
    title: "Custom Web & AI Business Solutions | Lit AI Productions",
    description:
      "Custom web apps, internal tools, dashboards, and AI integrations built for your business operation. From idea to launch.",
    summary:
      "Custom web apps, internal tools, dashboards, and AI integrations purpose-built for how your business actually runs.",
    hero: "Custom Solutions Built Around Your Business",
    problem:
      "Off-the-shelf software almost fits — but the gaps cost you hours every week and never quite match how you operate.",
    solution:
      "We design and build custom web apps, internal tools, dashboards, and AI integrations tailored to your workflows, your data, and your team.",
    includes: [
      "Custom web app and SaaS development",
      "Internal tools and admin dashboards",
      "Database design and API integration",
      "Authentication, roles, and permissions",
      "AI integrations and data pipelines",
      "Ongoing iteration and support",
    ],
    process: [
      { step: "Scope", detail: "Workshop to define what success looks like." },
      { step: "Prototype", detail: "Working prototype in weeks, not months." },
      { step: "Build", detail: "Production-grade, secure, scalable." },
      { step: "Iterate", detail: "Ship, measure, and improve." },
    ],
    faqs: [
      {
        q: "Can you build a custom internal tool for my team?",
        a: "Yes. Internal dashboards, CRMs, and workflow apps are a core part of what we do.",
      },
      {
        q: "Do you integrate with our existing systems?",
        a: "Yes — APIs, databases, CRMs, payment processors, and AI services.",
      },
    ],
    related: ["ai-automation", "website-design", "ecommerce-development"],
    keywords: [
      "custom web app",
      "custom business software",
      "internal tools",
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
