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
  { key: "instagram" as const, icon: FaInstagram, label: "Instagram", hoverClass: "hover:text-pink-500" },
  { key: "x" as const, icon: FaXTwitter, label: "X", hoverClass: "hover:text-primary-foreground" },
  { key: "tiktok" as const, icon: FaTiktok, label: "TikTok", hoverClass: "hover:text-primary-foreground" },
];

export function Footer() {
  const { links } = useSocialLinks();

  return (
    <footer
      className="text-white"
      style={{
        background:
          "linear-gradient(180deg, hsl(270 50% 8%) 0%, hsl(270 40% 15%) 100%)",
      }}
    >
      <div className="container mx-auto px-6 py-12 lg:pl-80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="LIT Productions" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="text-lg font-bold text-white">LIT PRODUCTIONS</h3>
                <p className="text-xs text-white/70 tracking-wider">Building Digital Excellence</p>
              </div>
            </div>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-2">
              {socialIcons.map(({ key, icon: Icon, label, hoverClass }) => {
                const url = links[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`text-white/80 ${hoverClass} transition-colors`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/90 hover:text-accent transition-colors"
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
              className="text-accent hover:text-accent/80 font-semibold transition-colors"
            >
              Get in Touch →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/15 text-center space-y-2">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} LIT Productions. All rights reserved.
          </p>
          <p className="text-xs text-white/60">
            We do not collect IP addresses or sell your data. Your privacy is protected.
          </p>
        </div>
      </div>
    </footer>
  );
}
