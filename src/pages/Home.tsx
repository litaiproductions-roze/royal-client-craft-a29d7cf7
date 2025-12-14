import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const features = [
  {
    icon: Globe,
    title: "Custom Websites",
    description: "Tailored designs that capture your unique brand identity and vision.",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "High-end development with attention to every detail and pixel.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Quick turnaround without compromising on quality or performance.",
  },
];

export default function Home() {
  return (
    <>
      {/* SEO */}
      <title>LIT Productions | Premium Custom Website Design & Development</title>
      <meta
        name="description"
        content="LIT Productions creates stunning custom websites for individuals and businesses. Premium web design services that elevate your digital presence."
      />

      {/* Hero Section */}
      <section className="min-h-screen gradient-royal flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="animate-fade-in mb-8">
            <img
              src={logo}
              alt="LIT Productions Logo"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto animate-float"
            />
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-delay text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            LIT PRODUCTIONS
          </h1>

          <p className="animate-fade-in-delay text-xl md:text-2xl text-primary-foreground/80 mb-4 font-light">
            Premium Web Design & Development
          </p>

          <p className="animate-fade-in-delay-2 text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            We craft stunning, custom websites that elevate your brand and captivate your audience.
            From personal portfolios to enterprise solutions.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="gold" size="lg">
              <Link to="/contact">
                Request a Website
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4 animate-fade-in">
            Why Choose <span className="text-primary">LIT Productions</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            We don't just build websites — we create digital experiences that leave lasting impressions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl gradient-royal flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-lg text-sidebar-foreground mb-10 max-w-2xl mx-auto">
            Let's create something extraordinary together. Get in touch and let us bring your vision to life.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
