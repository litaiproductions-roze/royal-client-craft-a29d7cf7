import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Phone, Search, Sparkles, Trash2, RefreshCw } from "lucide-react";

interface AnswerItem {
  id: string;
  question: string;
  answer: string;
  points: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  industry: string | null;
  team_size: string | null;
  answers: AnswerItem[] | unknown;
  score: number;
  tier: string;
  recommendations: string[] | unknown;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUSES = ["new", "contacted", "qualified", "won", "closed"];

export default function AssessmentLeadsTable() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ai_assessment_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Couldn't load assessments", description: error.message, variant: "destructive" });
    } else {
      setLeads((data ?? []) as unknown as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      const matchesQuery =
        !q ||
        [l.name, l.email, l.phone, l.company, l.industry, l.tier]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "new").length;
    const avg = total ? Math.round(leads.reduce((s, l) => s + (l.score ?? 0), 0) / total) : 0;
    const hot = leads.filter((l) => (l.score ?? 0) >= 65).length;
    return { total, newCount, avg, hot };
  }, [leads]);

  const openLead = (lead: Lead) => {
    setSelected(lead);
    setNotes(lead.admin_notes ?? "");
  };

  const updateStatus = async (lead: Lead, status: string) => {
    const { error } = await supabase
      .from("ai_assessment_leads")
      .update({ status })
      .eq("id", lead.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    setSelected((prev) => (prev && prev.id === lead.id ? { ...prev, status } : prev));
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from("ai_assessment_leads")
      .update({ admin_notes: notes })
      .eq("id", selected.id);
    setSavingNotes(false);
    if (error) {
      toast({ title: "Couldn't save notes", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === selected.id ? { ...l, admin_notes: notes } : l)));
    toast({ title: "Notes saved" });
  };

  const deleteLead = async (lead: Lead) => {
    const { error } = await supabase.from("ai_assessment_leads").delete().eq("id", lead.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setSelected(null);
    toast({ title: "Lead deleted" });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const answers = Array.isArray(selected?.answers) ? (selected!.answers as AnswerItem[]) : [];
  const recs = Array.isArray(selected?.recommendations)
    ? (selected!.recommendations as string[])
    : [];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total assessments", value: stats.total },
          { label: "New / unworked", value: stats.newCount },
          { label: "Average score", value: `${stats.avg}/100` },
          { label: "High readiness (65+)", value: stats.hot },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, business, industry"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load}>
          <RefreshCw className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No assessment leads yet.
        </p>
      ) : (
        <div className="-mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Business</th>
                <th className="py-2 pr-4 font-medium">Score</th>
                <th className="py-2 pr-4 font-medium">Tier</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 font-medium">Reach out</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-border/60 hover:bg-accent/50 cursor-pointer"
                  onClick={() => openLead(l)}
                >
                  <td className="py-3 pr-4">
                    <span className="font-medium text-foreground">{l.name}</span>
                    <span className="block text-xs text-muted-foreground">{l.email}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{l.company || "—"}</td>
                  <td className="py-3 pr-4 font-semibold text-foreground">{l.score}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="secondary">{l.tier}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={l.status === "new" ? "default" : "outline"}>{l.status}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {new Date(l.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button asChild size="icon" variant="outline" title="Email">
                        <a href={`mailto:${l.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      {l.phone && (
                        <Button asChild size="icon" variant="outline" title="Call">
                          <a href={`tel:${l.phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {selected.name}
                </SheetTitle>
                <SheetDescription>
                  Submitted {new Date(selected.created_at).toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-3xl font-bold text-foreground">{selected.score}/100</p>
                  <p className="text-sm text-muted-foreground">Readiness tier: {selected.tier}</p>
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Email: </span>
                    <a className="text-primary underline" href={`mailto:${selected.email}`}>
                      {selected.email}
                    </a>
                  </p>
                  {selected.phone && (
                    <p>
                      <span className="text-muted-foreground">Phone: </span>
                      <a className="text-primary underline" href={`tel:${selected.phone}`}>
                        {selected.phone}
                      </a>
                    </p>
                  )}
                  {selected.company && (
                    <p>
                      <span className="text-muted-foreground">Business: </span>
                      {selected.company}
                    </p>
                  )}
                  {selected.industry && (
                    <p>
                      <span className="text-muted-foreground">Industry: </span>
                      {selected.industry}
                    </p>
                  )}
                  {selected.team_size && (
                    <p>
                      <span className="text-muted-foreground">Team size: </span>
                      {selected.team_size}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="flex-1">
                    <a href={`mailto:${selected.email}?subject=Your%20AI%20Readiness%20Results`}>
                      <Mail className="h-4 w-4 mr-2" /> Send email
                    </a>
                  </Button>
                  {selected.phone && (
                    <Button asChild variant="outline" className="flex-1">
                      <a href={`tel:${selected.phone}`}>
                        <Phone className="h-4 w-4 mr-2" /> Call now
                      </a>
                    </Button>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Follow-up status</p>
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected, v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {recs.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Recommendations given</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {recs.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {answers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Answers</p>
                    <div className="space-y-2">
                      {answers.map((a, i) => (
                        <div key={i} className="rounded-md border border-border p-3">
                          <p className="text-xs text-muted-foreground">{a.question}</p>
                          <p className="text-sm text-foreground font-medium">{a.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Admin notes</p>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Notes from your outreach…"
                  />
                  <Button className="mt-2" onClick={saveNotes} disabled={savingNotes}>
                    {savingNotes && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save notes
                  </Button>
                </div>

                <Button variant="destructive" onClick={() => deleteLead(selected)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete lead
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
