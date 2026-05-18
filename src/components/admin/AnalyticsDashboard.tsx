import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, MousePointerClick, Users as UsersIcon, TrendingUp, ShieldCheck, ShieldAlert, KeyRound, ExternalLink, Link as LinkIcon } from "lucide-react";
import { useMemo } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPageName } from "@/lib/pageNames";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface AnalyticsEvent {
  id: string;
  event_type: "page_view" | "link_click";
  path: string | null;
  url: string | null;
  label: string | null;
  session_id: string | null;
  user_id: string | null;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

interface ResetLog {
  id: string;
  email: string;
  status: string;
  ip_hint: string | null;
  created_at: string;
}

interface RateLimit {
  id: string;
  ip_hash: string;
  created_at: string;
}

const DAYS = 30;

function classifyLink(url: string): "internal" | "external" | "mailto" | "tel" | "anchor" {
  if (!url) return "anchor";
  if (url.startsWith("mailto:")) return "mailto";
  if (url.startsWith("tel:")) return "tel";
  if (url.startsWith("#")) return "anchor";
  if (url.startsWith("http://") || url.startsWith("https://")) return "external";
  return "internal";
}

export default function AnalyticsDashboard() {
  const since = useMemo(() => subDays(new Date(), DAYS).toISOString(), []);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["analytics-events", since],
    queryFn: async () => {
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

  const { data: resetLogs = [] } = useQuery({
    queryKey: ["reset-logs-audit", since],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("password_reset_logs")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as ResetLog[];
    },
  });

  const { data: rateLimits = [] } = useQuery({
    queryKey: ["rate-limits-audit", since],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_rate_limits")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as RateLimit[];
    },
  });

  const stats = useMemo(() => {
    const pageViews = events.filter((e) => e.event_type === "page_view");
    const clicks = events.filter((e) => e.event_type === "link_click");
    const sessions = new Set(events.map((e) => e.session_id).filter(Boolean));
    const signedInUsers = new Set(events.map((e) => e.user_id).filter(Boolean));
    const todayStart = startOfDay(new Date()).toISOString();
    const today = events.filter((e) => e.created_at >= todayStart);
    const todayViews = today.filter((e) => e.event_type === "page_view").length;
    const todaySessions = new Set(today.map((e) => e.session_id).filter(Boolean)).size;

    // Daily series — last 30 days
    const dayMap = new Map<string, { date: string; views: number; clicks: number; visitors: Set<string> }>();
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "MMM d");
      dayMap.set(d, { date: d, views: 0, clicks: 0, visitors: new Set() });
    }
    events.forEach((e) => {
      const d = format(new Date(e.created_at), "MMM d");
      const entry = dayMap.get(d);
      if (!entry) return;
      if (e.event_type === "page_view") entry.views += 1;
      if (e.event_type === "link_click") entry.clicks += 1;
      if (e.session_id) entry.visitors.add(e.session_id);
    });
    const daily = Array.from(dayMap.values()).map((d) => ({
      date: d.date,
      views: d.views,
      clicks: d.clicks,
      visitors: d.visitors.size,
    }));

    // Top pages
    const pathCounts = new Map<string, { views: number; visitors: Set<string> }>();
    pageViews.forEach((e) => {
      const p = e.path || "/";
      const entry = pathCounts.get(p) ?? { views: 0, visitors: new Set() };
      entry.views += 1;
      if (e.session_id) entry.visitors.add(e.session_id);
      pathCounts.set(p, entry);
    });
    const topPages = Array.from(pathCounts.entries())
      .map(([path, v]) => ({ path, views: v.views, visitors: v.visitors.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 15);

    // Top links — full URL + classification
    const linkMap = new Map<string, { url: string; label: string; clicks: number; kind: string; lastClicked: string }>();
    clicks.forEach((e) => {
      const url = e.url || "(unknown)";
      const entry = linkMap.get(url) ?? {
        url,
        label: e.label || url,
        clicks: 0,
        kind: classifyLink(url),
        lastClicked: e.created_at,
      };
      entry.clicks += 1;
      if (e.created_at > entry.lastClicked) entry.lastClicked = e.created_at;
      if (!entry.label && e.label) entry.label = e.label;
      linkMap.set(url, entry);
    });
    const topLinks = Array.from(linkMap.values()).sort((a, b) => b.clicks - a.clicks).slice(0, 20);

    // Top referrers
    const refMap = new Map<string, number>();
    pageViews.forEach((e) => {
      if (!e.referrer) return;
      try {
        const host = new URL(e.referrer).hostname;
        if (host && !host.includes("lovable")) {
          refMap.set(host, (refMap.get(host) ?? 0) + 1);
        }
      } catch {
        /* ignore */
      }
    });
    const topReferrers = Array.from(refMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return {
      totalPageViews: pageViews.length,
      totalClicks: clicks.length,
      sessions: sessions.size,
      signedInUsers: signedInUsers.size,
      todayViews,
      todaySessions,
      daily,
      topPages,
      topLinks,
      topReferrers,
    };
  }, [events]);

  const security = useMemo(() => {
    const todayStart = startOfDay(new Date()).toISOString();
    const last7 = subDays(new Date(), 7).toISOString();

    const resetsToday = resetLogs.filter((r) => r.created_at >= todayStart).length;
    const resets7d = resetLogs.filter((r) => r.created_at >= last7).length;
    const contactsToday = rateLimits.filter((r) => r.created_at >= todayStart).length;
    const contacts7d = rateLimits.filter((r) => r.created_at >= last7).length;

    // Rate-limit abuse: any IP hash with >=5 contact attempts in last hour
    const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const ipCounts = new Map<string, number>();
    rateLimits.filter((r) => r.created_at >= lastHour).forEach((r) => {
      ipCounts.set(r.ip_hash, (ipCounts.get(r.ip_hash) ?? 0) + 1);
    });
    const abusiveIps = Array.from(ipCounts.entries()).filter(([, c]) => c >= 5).length;

    return { resetsToday, resets7d, contactsToday, contacts7d, abusiveIps };
  }, [resetLogs, rateLimits]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<Eye className="h-4 w-4" />} label="Views (30d)" value={stats.totalPageViews} />
        <StatCard icon={<UsersIcon className="h-4 w-4" />} label="Visitors (30d)" value={stats.sessions} />
        <StatCard icon={<MousePointerClick className="h-4 w-4" />} label="Clicks (30d)" value={stats.totalClicks} />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Views Today" value={stats.todayViews} />
        <StatCard icon={<UsersIcon className="h-4 w-4" />} label="Visitors Today" value={stats.todaySessions} />
        <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="Signed-in Users" value={stats.signedInUsers} />
      </div>

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-4 h-auto">
          <TabsTrigger value="traffic" className="shrink-0 whitespace-nowrap">Traffic</TabsTrigger>
          <TabsTrigger value="links" className="shrink-0 whitespace-nowrap">Link Clicks</TabsTrigger>
          <TabsTrigger value="security" className="shrink-0 whitespace-nowrap">Security Audit</TabsTrigger>
          <TabsTrigger value="activity" className="shrink-0 whitespace-nowrap">Live Activity</TabsTrigger>
        </TabsList>


        {/* TRAFFIC */}
        <TabsContent value="traffic" className="space-y-6 mt-4">
          <Panel title="Daily Visitors & Page Views (last 30 days)">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={stats.daily} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} interval="preserveStartEnd" />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <RTooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" name="Page Views" stroke="hsl(var(--accent))" fill="url(#gViews)" strokeWidth={2} />
                  <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="hsl(var(--primary))" fill="url(#gVisitors)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel title="Top Pages">
              {stats.topPages.length === 0 ? (
                <Empty>No page views yet.</Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Visitors</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topPages.map((p) => (
                      <TableRow key={p.path}>
                        <TableCell>
                          <div className="font-medium text-sm">{getPageName(p.path)}</div>
                          <div className="font-mono text-[10px] text-muted-foreground truncate max-w-[220px]">{p.path}</div>
                        </TableCell>
                        <TableCell className="text-right">{p.visitors}</TableCell>
                        <TableCell className="text-right font-medium">{p.views}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Panel>

            <Panel title="Top Referrers">
              {stats.topReferrers.length === 0 ? (
                <Empty>No external referrals tracked yet.</Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Visits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topReferrers.map(([host, count]) => (
                      <TableRow key={host}>
                        <TableCell className="text-sm font-mono">{host}</TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Panel>
          </div>
        </TabsContent>

        {/* LINKS */}
        <TabsContent value="links" className="space-y-6 mt-4">
          <Panel title="Clicks per Day (last 30 days)">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={stats.daily} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} interval="preserveStartEnd" />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <RTooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="clicks" name="Link Clicks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="All Tracked Link Clicks">
            {stats.topLinks.length === 0 ? (
              <Empty>No link clicks yet.</Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Last Clicked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topLinks.map((l) => (
                    <TableRow key={l.url}>
                      <TableCell className="max-w-[360px]">
                        <div className="flex items-center gap-2">
                          {l.kind === "external" ? (
                            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                          ) : (
                            <LinkIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm truncate">{l.label}</div>
                            <div className="font-mono text-[10px] text-muted-foreground truncate">{l.url}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {l.kind}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{l.clicks}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(l.lastClicked), "MMM d, h:mm a")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<KeyRound className="h-4 w-4" />} label="Password Resets (24h)" value={security.resetsToday} />
            <StatCard icon={<KeyRound className="h-4 w-4" />} label="Password Resets (7d)" value={security.resets7d} />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="Contact Submits (24h)" value={security.contactsToday} />
            <StatCard
              icon={<ShieldAlert className="h-4 w-4" />}
              label="Abusive IPs (1h)"
              value={security.abusiveIps}
              tone={security.abusiveIps > 0 ? "warn" : "ok"}
            />
          </div>

          <Panel title="Recent Password Reset Attempts">
            {resetLogs.length === 0 ? (
              <Empty>No password reset activity in the last 30 days.</Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Hint</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resetLogs.slice(0, 20).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(r.created_at), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-xs font-mono">{r.email}</TableCell>
                      <TableCell className="text-xs capitalize">{r.status}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{r.ip_hint || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>

          <Panel title="Contact Submission Rate-Limit Audit">
            {rateLimits.length === 0 ? (
              <Empty>No contact submissions tracked in the last 30 days.</Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>IP Hash (anonymized)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateLimits.slice(0, 20).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(r.created_at), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-xs font-mono truncate max-w-[420px]">{r.ip_hash}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </TabsContent>

        {/* ACTIVITY */}
        <TabsContent value="activity" className="mt-4">
          <Panel title="Recent Activity (latest 100 events)">
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
                  {events.slice(0, 100).map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(e.created_at), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-xs capitalize">{e.event_type.replace("_", " ")}</TableCell>
                      <TableCell className="text-xs font-medium">{getPageName(e.path)}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[260px]">
                        {e.event_type === "page_view" ? e.path : e.url}
                      </TableCell>
                      <TableCell className="text-xs truncate max-w-[200px]">{e.label || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "default" | "ok" | "warn";
}) {
  const toneClass =
    tone === "warn"
      ? "border-destructive/40 bg-destructive/5"
      : tone === "ok"
        ? "border-border bg-background"
        : "border-border bg-background";
  return (
    <div className={`rounded-lg p-4 border ${toneClass}`}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-background rounded-lg p-3 sm:p-4 border border-border">
      <h3 className="text-sm font-semibold mb-3 text-foreground">{title}</h3>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}


function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
