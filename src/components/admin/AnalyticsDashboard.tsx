import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, MousePointerClick, Users as UsersIcon, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPageName } from "@/lib/pageNames";

interface AnalyticsEvent {
  id: string;
  event_type: "page_view" | "link_click";
  path: string | null;
  url: string | null;
  label: string | null;
  session_id: string | null;
  created_at: string;
}

export default function AnalyticsDashboard() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: async () => {
      const since = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as AnalyticsEvent[];
    },
  });

  const stats = useMemo(() => {
    const pageViews = events.filter((e) => e.event_type === "page_view");
    const clicks = events.filter((e) => e.event_type === "link_click");
    const sessions = new Set(events.map((e) => e.session_id).filter(Boolean));
    const todayStart = startOfDay(new Date()).toISOString();
    const today = events.filter((e) => e.created_at >= todayStart);

    const pathCounts = new Map<string, number>();
    pageViews.forEach((e) => {
      const p = e.path || "/";
      pathCounts.set(p, (pathCounts.get(p) ?? 0) + 1);
    });
    const topPages = Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const linkCounts = new Map<string, number>();
    clicks.forEach((e) => {
      const key = e.url || e.label || "(unknown)";
      linkCounts.set(key, (linkCounts.get(key) ?? 0) + 1);
    });
    const topLinks = Array.from(linkCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalPageViews: pageViews.length,
      totalClicks: clicks.length,
      sessions: sessions.size,
      today: today.length,
      topPages,
      topLinks,
    };
  }, [events]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Eye className="h-4 w-4" />} label="Page Views (30d)" value={stats.totalPageViews} />
        <StatCard icon={<MousePointerClick className="h-4 w-4" />} label="Link Clicks (30d)" value={stats.totalClicks} />
        <StatCard icon={<UsersIcon className="h-4 w-4" />} label="Sessions (30d)" value={stats.sessions} />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Events Today" value={stats.today} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg p-4 border border-border">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Top Pages</h3>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No page views yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-muted-foreground">Path</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topPages.map(([path, count]) => (
                  <TableRow key={path}>
                    <TableCell className="font-medium">{getPageName(path)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[180px]">{path}</TableCell>
                    <TableCell className="text-right">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="bg-background rounded-lg p-4 border border-border">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Top Link Clicks</h3>
          {stats.topLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No link clicks yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topLinks.map(([url, count]) => (
                  <TableRow key={url}>
                    <TableCell className="font-mono text-xs truncate max-w-[260px]">{url}</TableCell>
                    <TableCell className="text-right">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <div className="bg-background rounded-lg p-4 border border-border">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Recent Activity</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Path / URL</TableHead>
                <TableHead>Label</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.slice(0, 50).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(e.created_at), "MMM d, h:mm a")}
                  </TableCell>
                  <TableCell className="text-xs capitalize">{e.event_type.replace("_", " ")}</TableCell>
                  <TableCell className="text-xs font-medium">{getPageName(e.path)}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[220px]">
                    {e.event_type === "page_view" ? e.path : e.url}
                  </TableCell>
                  <TableCell className="text-xs truncate max-w-[200px]">{e.label || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-background rounded-lg p-4 border border-border">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
