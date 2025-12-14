import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSiteLogo } from "@/hooks/useSiteLogo";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About Us", path: "/about", icon: Users },
  { name: "Contact Us", path: "/contact", icon: Mail },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { logoUrl } = useSiteLogo();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-lg bg-sidebar gradient-royal text-primary-foreground shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 gradient-dark z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Close button - mobile only */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-sidebar-foreground hover:text-primary-foreground lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
            <img src={logoUrl} alt="LIT Productions Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="text-lg font-bold text-primary-foreground">LIT</h2>
              <p className="text-xs text-sidebar-foreground tracking-widest">PRODUCTIONS</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group",
                      isActive
                        ? "gradient-royal text-primary-foreground shadow-lg"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      isActive && "text-primary-foreground"
                    )} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}

            {/* Admin Link */}
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group",
                    location.pathname === "/admin"
                      ? "gradient-royal text-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary-foreground"
                  )}
                >
                  <Settings className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    location.pathname === "/admin" && "text-primary-foreground"
                  )} />
                  <span className="font-medium">Admin</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            © 2024 LIT Productions
          </p>
        </div>
      </aside>
    </>
  );
}
