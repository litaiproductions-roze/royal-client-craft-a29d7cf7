import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { services } from "@/data/services";

export default function ServicesHub() {
  return (
    <Layout>
      <SEO
        title="Web Design & AI Automation Services | Lit AI Productions"
        description="Explore Lit AI Productions services: custom website design, business websites, AI automation, e-commerce, SEO, hosting, and more for Long Island & NY businesses."
        path="/services"
        jsonLd={services.map((s) => ({
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          description: s.summary,
          url: `https://litaiproductions.lovable.app/services/${s.slug}`,
          provider: { "@type": "Organization", name: "Lit AI Productions" },
        }))}
      />

      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />

      <section className="px-6 pt-10 pb-12 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Web Design & AI Automation Services
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          From custom websites and e-commerce to AI automation, SEO, and Cloudflare hosting —
          everything you need to compete and convert online, built and supported by one team.
        </p>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}`}
              className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {s.name}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">{s.summary}</p>
              <span className="inline-flex items-center text-sm font-semibold text-primary">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection />
    </Layout>
  );
}
