import { Loader2, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolio } from "@/hooks/usePortfolio";

export default function Portfolio() {
  const { items, loading } = usePortfolio();

  return (
    <>
      <title>Portfolio | LIT Productions - Our Work</title>
      <meta
        name="description"
        content="Browse the portfolio of websites designed and developed by LIT Productions. See our latest work and projects."
      />

      {/* Hero Section */}
      <section className="gradient-royal py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="animate-fade-in text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our <span className="text-gradient-gold">Portfolio</span>
          </h1>
          <p className="animate-fade-in-delay text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Explore the websites we've designed and built for our clients. Each project is crafted with care and precision.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="min-h-[50vh] bg-secondary/30 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card px-8 py-20 text-center shadow-card">
              <Globe className="mx-auto mb-4 h-16 w-16 text-muted-foreground/60" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">Portfolio coming soon</h3>
              <p className="text-base text-muted-foreground">
                We're preparing our showcase. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="aspect-video bg-muted overflow-hidden">
                    {item.screenshot_url ? (
                      <img
                        src={item.screenshot_url}
                        alt={`Screenshot of ${item.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <Button asChild variant="hero" size="sm" className="w-full">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
