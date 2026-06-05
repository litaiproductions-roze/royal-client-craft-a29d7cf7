import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import logo from "@/assets/logo.png";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { services } from "@/data/services";
import { locations } from "@/data/locations";

const companyLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Services", path: "/services" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
];

const socialIcons = [
  { key: "instagram" as const, icon: FaInstagram, label: "Instagram" },
  { key: "x" as const, icon: FaXTwitter, label: "X" },
  { key: "tiktok" as const, icon: FaTiktok, label: "TikTok" },
];

export function Footer() {
  const { links } = useSocialLinks();

  return (
    <footer className="gradient-dark text-white md:pl-72">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Lit AI Productions" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="text-base font-bold text-white">LIT AI PRODUCTIONS</h3>
                <p className="text-xs tracking-wider text-white/75">Web Design & AI Automation</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/80">
              Long Island web design and AI automation for small businesses, creators, and startups.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-sm text-white/85 hover:text-accent hover:underline underline-offset-4"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Locations</h4>
            <ul className="space-y-2">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link
                    to={`/locations/${l.slug}`}
                    className="text-sm text-white/85 hover:text-accent hover:underline underline-offset-4"
                  >
                    {l.region}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((c) => (
                <li key={c.path}>
                  <Link
                    to={c.path}
                    className="text-sm text-white/85 hover:text-accent hover:underline underline-offset-4"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-block text-base font-semibold text-accent hover:underline underline-offset-4"
            >
              Get a Free Consultation →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 space-y-5 border-t border-white/15 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialIcons.map(({ key, icon: Icon, label }) => {
              const url = links[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:border-accent/70 hover:bg-white/15 hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
          <div className="space-y-2 text-center">
            <p className="text-xs text-white/90">
              © {new Date().getFullYear()} Lit AI Productions. All rights reserved.
            </p>
            <p className="text-xs text-white/85">
              We do not collect IP addresses or sell your data. Your privacy is protected.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
