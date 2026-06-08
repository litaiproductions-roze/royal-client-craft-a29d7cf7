import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";

export default function Blog() {
  return (
    <Layout>
      <SEO
        title="Web Design & AI Automation Insights | Lit AI Productions Blog"
        description="Articles and guides on web design, local SEO, AI automation, and growing small businesses online from Lit AI Productions."
        path="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Lit AI Productions Blog",
          url: "https://www.imagineitlit.com/blog",
          description:
            "Insights on web design, local SEO, and AI automation for small businesses.",
        }}
      />

      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />

      <section className="px-6 pt-10 pb-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Web Design & AI Automation Insights
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Practical articles on building modern websites, ranking locally on Google,
          and using AI automation to grow your business. New posts coming soon.
        </p>

        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Want our first articles delivered?
          </h2>
          <p className="text-muted-foreground mb-4">
            Reach out and we'll send our launch posts on local SEO, AI for small business,
            and conversion-focused web design.
          </p>
        </div>
      </section>

      <CTASection
        title="Have a project in mind?"
        subtitle="Skip the reading list — book a free consultation."
        primaryLabel="Book a Discovery Call"
      />
    </Layout>
  );
}
