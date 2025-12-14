import { Link } from "react-router-dom";
import { Target, Eye, Heart, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Mission",
    description:
      "To empower individuals and businesses with stunning, high-performance websites that drive success and leave lasting impressions in the digital world.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "To become the go-to premium web design partner for brands seeking excellence, innovation, and a truly personalized digital experience.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "We pour our hearts into every project, treating each website as a masterpiece that reflects both our client's vision and our commitment to excellence.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We never settle for ordinary. Every line of code, every design element, and every interaction is crafted to exceed expectations.",
  },
];

export default function About() {
  return (
    <>
      {/* SEO */}
      <title>About Us | LIT Productions - Our Story & Mission</title>
      <meta
        name="description"
        content="Learn about LIT Productions, a premium web design studio dedicated to creating exceptional digital experiences for individuals and businesses."
      />

      {/* Hero Section */}
      <section className="gradient-royal py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            About <span className="text-gradient-gold">LIT Productions</span>
          </h1>
          <p className="animate-fade-in-delay text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Where passion meets precision. We're not just web developers — we're digital craftsmen dedicated to building your success.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border">
            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-2 h-8 gradient-royal rounded-full" />
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                LIT Productions was born from a simple belief: every brand deserves a website that truly shines. 
                What started as a passion project has grown into a dedicated studio focused on delivering 
                premium digital experiences.
              </p>
              <p>
                We noticed that too many businesses settle for template-based, cookie-cutter websites 
                that fail to capture their unique identity. That's where we come in. We take the time 
                to understand your story, your goals, and your vision — then we bring it all to life 
                with pixel-perfect precision.
              </p>
              <p>
                From personal portfolios and startup landing pages to full-scale enterprise solutions, 
                we approach every project with the same level of care and dedication. Your success 
                is our success, and we won't rest until your website exceeds expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            What Drives Us
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Our core values shape everything we do, from the first consultation to the final launch.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl gradient-royal flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            What Makes Us Different
          </h2>
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-8 h-8 rounded-full gradient-royal flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Hands-On Approach</h3>
                <p className="text-muted-foreground">
                  We personally design and build every website. No outsourcing, no templates — just pure, custom craftsmanship.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-8 h-8 rounded-full gradient-royal flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Client-Centric Process</h3>
                <p className="text-muted-foreground">
                  Your vision drives everything. We collaborate closely with you at every stage to ensure the final product reflects your brand perfectly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-8 h-8 rounded-full gradient-royal flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Premium Results</h3>
                <p className="text-muted-foreground">
                  We deliver websites that look stunning, perform flawlessly, and help you achieve your business goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-lg text-sidebar-foreground mb-10 max-w-2xl mx-auto">
            Ready to take your digital presence to the next level? We'd love to hear about your project.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
