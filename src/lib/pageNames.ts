// Map URL paths to friendly page names matching the navigation tabs
const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/about": "About Us",
  "/portfolio": "Portfolio",
  "/contact": "Contact Us",
  "/auth": "Sign In / Sign Up",
  "/reset-password": "Reset Password",
  "/admin": "Admin Dashboard",
  "/privacy": "Privacy Policy",
};

export function getPageName(path: string | null | undefined): string {
  if (!path) return "Unknown";
  // Strip query string
  const clean = path.split("?")[0].replace(/\/$/, "") || "/";
  if (PAGE_NAMES[clean]) return PAGE_NAMES[clean];
  // Fallback: title-case the last segment
  const seg = clean.split("/").filter(Boolean).pop();
  if (!seg) return "Home";
  return seg
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
