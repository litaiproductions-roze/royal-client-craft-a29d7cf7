import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

export interface Crumb {
  name: string;
  path: string;
}

const SITE_URL = "https://www.imagineitlit.com";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav
        aria-label="Breadcrumb"
        className="max-w-6xl mx-auto px-6 pt-6 text-sm text-muted-foreground"
      >
        <ol className="flex flex-wrap items-center gap-1">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-foreground font-medium">
                    {c.name}
                  </span>
                ) : (
                  <Link to={c.path} className="hover:text-primary transition-colors">
                    {c.name}
                  </Link>
                )}
                {!last && <ChevronRight className="h-4 w-4 opacity-60" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
