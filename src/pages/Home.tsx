import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Globe, Zap, Bot, Search, ShoppingCart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteLogo } from "@/hooks/useSiteLogo";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/FAQAccordion";
import { services } from "@/data/services";
import { locations } from "@/data/locations";

const whyUs = [
  {
    icon: Globe,
    title: "Custom Websites",
    description: "Hand-crafted designs tailored to your brand — never templates.",
  },
  {
    icon: Bot,
    title: "AI Automation",
    description: "Practical AI tools that capture leads and save your team hours.",
  },
  {
    icon: Search,
    title: "Local & AI SEO",
    description: "Found on Google and recommended by AI assistants like ChatGPT.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Cloudflare-powered hosting tuned for Core Web Vitals.",
  },
  {
    icon: ShoppingCart,
    title: "Built to Convert",
    description: "Every page engineered around clear calls to action.",
  },
  {
    icon: Sparkles,
    title: "Long Island Local",
    description: "Based on Long Island, NY — serving local businesses and beyond.",
  },
];

const homeFAQs = [
  {
    q: "What does Lit AI Productions do?",
    a: "Lit AI Productions is a Long Island web design and AI automation agency. We build custom websites, e-commerce stores, AI chatbots, automations, and local SEO programs for small businesses, creators, and startups.",
  },
  {
    q: "Do you work with local Long Island and New York businesses?",
    a: "Yes. We work with businesses across Long Island — Farmingdale, Suffolk County, Nassau County — and across New York, plus remote clients nationwide.",
  },
  {
    q: "How much does a custom website cost?",
    a: "Most small business websites range from $1,500 to $8,000 depending on scope. Landing pages start lower, custom apps and AI tools start higher. We quote every project after a free discovery call.",
  },
  {
    q: "How fast can you launch a website?",
    a: "Landing pages can go live in under a week. Most small business websites launch in 2 to 6 weeks.",
  },
  {
    q: "Do you offer AI automation services?",
    a: "Yes. We build AI chatbots, lead capture flows, document and email automation, and custom AI tools tailored to your business.",
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Lit AI Productions",
  url: "https://litaiproductions.lovable.app",
  description:
    "Lit AI Productions is a Long Island, NY web design and AI automation agency building custom websites, AI tools, and local SEO programs for small businesses.",
  image: "https://litaiproductions.lovable.app/og-image.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Farmingdale",
    addressRegion: "NY",
    postalCode: "11735",
    addressCountry: "US",
  },
  areaServed: [
    "Long Island, NY",
    "Farmingdale, NY",
    "Suffolk County, NY",
    "Nassau County, NY",
    "New York",
  ],
  priceRange: "$$",
  sameAs: [] as string[],
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lit AI Productions",
  url: "https://litaiproductions.lovable.app",
  description:
    "Web design and AI automation agency for small businesses, creators, and startups.",
};

export default function Home() {
  const { logoUrl } = useSiteLogo();

  return (
    <>
      <SEO
        title="Lit AI Productions — Long Island Web Design & AI Automation Agency"
        description="Lit AI Productions is a Long Island, NY web design and AI automation agency. Custom websites, AI tools, local SEO, and Cloudflare hosting for small businesses."
        path="/"
        jsonLd={[orgSchema, localBusinessSchema]}
      />

      {/* Hero */}
      <section className="min-h-[90vh] gradient-royal flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in mb-8">
            <img
              src={logoUrl}
              alt="Lit AI Productions Logo"
              width={160}
              height={160}
              fetchPriority="high"
              decoding="async"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto animate-float"
            />
          </div>

          <h1 className="animate-fade-in-delay text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Long Island Web Design & AI Automation Agency
          </h1>

          <p className="animate-fade-in-delay text-xl md:text-2xl text-primary-foreground/85 mb-4 font-light">
            Custom websites, AI tools, and local SEO for small businesses.
          </p>

          <p className="animate-fade-in-delay-2 text-base md:text-lg text-primary-foreground/75 mb-10 max-w-2xl mx-auto">
            We help local businesses, entrepreneurs, creators, and startups on Long Island, NY
            and beyond launch modern websites and AI-powered systems that bring in real customers.
          </p>

          <div className="animate-fade-in-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="gold" size="lg">
              <Link to="/contact">
                Get a Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Who we are / What we do */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who we are
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Lit AI Productions is a web design and AI automation agency based on Long Island, NY.
              We partner with small businesses, local shops, creators, streamers, artists, and startups
              who need a website that actually performs — and AI tools that actually help.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              One small team. Senior-level work. No outsourcing. No template-shop shortcuts.
            </p>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What we do
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Custom websites, e-commerce, landing pages, AI chatbots and automation,
              local SEO, Cloudflare hosting and security, and custom business tools.
            </p>
            <Button asChild variant="outline">
              <Link to="/services">See all services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Services
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to compete and convert online — design, AI, SEO, hosting, and ongoing support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{s.summary}</p>
                <span className="inline-flex items-center text-sm font-semibold text-primary">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Who we help</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            From Main Street local businesses to creators building an audience — if you need a
            modern web presence and smarter automation, we're built for you.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {[
              "Local Long Island businesses",
              "Contractors & home services",
              "Restaurants & retail",
              "Creators, streamers & artists",
              "Coaches & professional services",
              "Startups & founders",
            ].map((w) => (
              <div key={w} className="p-4 bg-card border border-border rounded-xl">
                <span className="text-foreground font-medium">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Choose <span className="text-primary">Lit AI Productions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyUs.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <div className="w-12 h-12 rounded-xl gradient-royal flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Serving Long Island & New York
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Local web design and AI automation for businesses across Long Island and NY.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {locations.map((l) => (
              <Link
                key={l.slug}
                to={`/locations/${l.slug}`}
                className="flex items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors"
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{l.region}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How to get started */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            How to get started
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "Book a free call", detail: "Tell us what you're working on. 15 minutes, no pitch." },
              { step: "Get a clear quote", detail: "Scope, timeline, and price — all in plain English." },
              { step: "We build, you launch", detail: "Hands-on work, weekly check-ins, fast launch." },
            ].map((s, i) => (
              <li key={s.step} className="bg-card border border-border rounded-xl p-6">
                <div className="w-10 h-10 rounded-full gradient-royal text-primary-foreground font-bold flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-foreground mb-1">{s.step}</h3>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
            Frequently Asked Questions
          </h2>
          <FAQAccordion faqs={homeFAQs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 gradient-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Project
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Book a free 15-minute discovery call and let's map out your website or AI automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/contact">Book a Discovery Call <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
