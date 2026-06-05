import { Link, useParams, Navigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { InlineLeadForm } from "@/components/InlineLeadForm";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { getLocation } from "@/data/locations";
import { services } from "@/data/services";

export default function LocationDetail() {
  const { slug = "" } = useParams();
  const loc = getLocation(slug);
  if (!loc) return <Navigate to="/" replace />;

  return (
    <Layout>
      <SEO
        title={loc.title}
        description={loc.description}
        path={`/locations/${loc.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Lit AI Productions",
            url: `https://litaiproductions.lovable.app/locations/${loc.slug}`,
            description: loc.description,
            areaServed: loc.region,
            address: {
              "@type": "PostalAddress",
              addressLocality: loc.name,
              addressRegion: "NY",
              addressCountry: "US",
            },
            priceRange: "$$",
          },
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Locations", path: "/" },
          { name: loc.region, path: `/locations/${loc.slug}` },
        ]}
      />

      <section className="gradient-royal px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            {loc.hero}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">
            {loc.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button asChild variant="gold" size="lg">
              <Link to="/contact">Get a Free Consultation <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <a href="#quote">Request a Quote</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Why {loc.region} Businesses Choose Lit AI Productions
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loc.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
              <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground">{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 py-12 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Services for {loc.region}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            {loc.region} FAQs
          </h2>
          <FAQAccordion faqs={loc.faqs} />
        </div>
      </section>

      <section id="quote" className="px-6 py-16 max-w-3xl mx-auto">
        <InlineLeadForm
          intent={`${loc.region} project`}
          heading={`Start Your ${loc.region} Project`}
          subheading="Tell us about your business and we'll reply within 24 hours."
        />
      </section>

      <CTASection />
    </Layout>
  );
}
