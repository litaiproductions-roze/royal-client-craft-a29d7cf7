import { Link, useParams, Navigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { InlineLeadForm } from "@/components/InlineLeadForm";
import { CTASection } from "@/components/CTASection";
import { getService, services } from "@/data/services";
import { Button } from "@/components/ui/button";

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const service = getService(slug);
  if (!service) return <Navigate to="/services" replace />;

  const related = service.related.map(getService).filter(Boolean) as typeof services;

  return (
    <Layout>
      <SEO
        title={service.title}
        description={service.description}
        path={`/services/${service.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.summary,
            url: `https://litaiproductions.lovable.app/services/${service.slug}`,
            provider: {
              "@type": "Organization",
              name: "Lit AI Productions",
              url: "https://litaiproductions.lovable.app",
            },
            areaServed: [
              "Long Island, NY",
              "Farmingdale, NY",
              "Suffolk County, NY",
              "Nassau County, NY",
              "New York",
            ],
          },
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="gradient-royal px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            {service.hero}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">
            {service.summary}
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

      {/* Problem / Solution */}
      <section className="px-6 py-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-3">The problem</h2>
          <p className="text-muted-foreground leading-relaxed">{service.problem}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-3">How we help</h2>
          <p className="text-muted-foreground leading-relaxed">{service.solution}</p>
        </div>
      </section>

      {/* What's included */}
      <section className="px-6 py-12 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">What's Included</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Our Process</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.process.map((p, i) => (
            <li key={p.step} className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 rounded-full gradient-royal text-primary-foreground font-bold flex items-center justify-center mb-3">
                {i + 1}
              </div>
              <h3 className="font-bold text-foreground mb-1">{p.step}</h3>
              <p className="text-sm text-muted-foreground">{p.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <FAQAccordion faqs={service.faqs} />
        </div>
      </section>

      {/* Inline lead form */}
      <section id="quote" className="px-6 py-16 max-w-3xl mx-auto">
        <InlineLeadForm
          intent={`${service.name} quote`}
          heading={`Request a ${service.name} Quote`}
          subheading="Tell us a bit about your project and we'll get back to you within 24 hours."
        />
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/services/${r.slug}`}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">{r.name}</h3>
                <p className="text-sm text-muted-foreground">{r.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CTASection />
    </Layout>
  );
}
