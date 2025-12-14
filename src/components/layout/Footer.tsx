import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

export function Footer() {
  return (
    <footer className="gradient-dark text-sidebar-foreground">
      <div className="container mx-auto px-6 py-12 lg:pl-80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="LIT Productions" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="text-lg font-bold text-primary-foreground">LIT PRODUCTIONS</h3>
                <p className="text-xs text-sidebar-foreground/60 tracking-wider">Building Digital Excellence</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-sm font-semibold text-primary-foreground uppercase tracking-wider">Quick Links</h4>
            <ul className="flex gap-6">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-sidebar-foreground hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-sm text-sidebar-foreground/80">Ready to build something amazing?</p>
            <Link
              to="/contact"
              className="text-accent hover:text-accent/80 font-semibold transition-colors"
            >
              Get in Touch →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-sidebar-border text-center">
          <p className="text-xs text-sidebar-foreground/50">
            © {new Date().getFullYear()} LIT Productions. All rights reserved. | Premium Web Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
