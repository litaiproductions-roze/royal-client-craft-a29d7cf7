import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import logo from "@/assets/logo.png";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr_1fr] md:items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="LIT Productions" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="text-lg font-bold text-white">LIT PRODUCTIONS</h3>
                <p className="text-xs tracking-wider text-white/75">Building Digital Excellence</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/80">
              Follow LIT Productions across social media and explore our latest work, updates, and launches.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-sm text-white/85">Ready to build something amazing?</p>
            <Link
              to="/contact"
              className="text-lg font-semibold text-accent underline-offset-4 transition-colors hover:text-accent/80 hover:underline"
            >
              Get in Touch →
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
            <p className="text-xs text-white/75">
              © {new Date().getFullYear()} LIT Productions. All rights reserved.
            </p>
            <p className="text-xs text-white/65">
              We do not collect IP addresses or sell your data. Your privacy is protected.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
