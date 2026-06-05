import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  title = "Ready to start your project?",
  subtitle = "Book a free 15-minute discovery call and let's map out what your site or AI automation could do.",
  primaryLabel = "Book a Discovery Call",
  primaryHref = "/contact",
  secondaryLabel = "Request a Quote",
  secondaryHref = "/contact",
}: Props) {
  return (
    <section className="py-20 px-6 gradient-dark">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-lg text-white/80 mb-8">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="hero" size="lg">
            <Link to={primaryHref}>
              {primaryLabel}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link to={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
