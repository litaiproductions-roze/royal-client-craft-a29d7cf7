import { useContactSubmissions } from "@/hooks/useContactSubmissions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Loader2,
  Users,
  CalendarDays,
  Building,
  Phone,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Clock,
  Search,
} from "lucide-react";
import { format, startOfMonth, isAfter } from "date-fns";
import { useMemo, useState } from "react";
import type { ContactSubmission } from "@/hooks/useContactSubmissions";

function useClipboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  };

  return { copied, copy };
}

export default function ContactSubmissionsTable() {
  const { submissions, isLoading } = useContactSubmissions();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const { copied, copy } = useClipboard();

  const stats = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const thisMonth = submissions.filter((s) =>
      isAfter(new Date(s.created_at), monthStart)
    );
    const uniqueEmails = new Set(submissions.map((s) => s.email)).size;
    const withCompany = submissions.filter((s) => s.company).length;
    const withPhone = submissions.filter((s) => s.phone).length;

    return {
      total: submissions.length,
      thisMonth: thisMonth.length,
      uniqueContacts: uniqueEmails,
      withCompany,
      withPhone,
    };
  }, [submissions]);

  const filtered = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q)) ||
        (s.company && s.company.toLowerCase().includes(q)) ||
        s.message.toLowerCase().includes(q)
    );
  }, [submissions, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Mail className="h-4 w-4" />}
          label="Total Requests"
          value={stats.total}
        />
        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="This Month"
          value={stats.thisMonth}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Unique Contacts"
          value={stats.uniqueContacts}
        />
        <StatCard
          icon={<Building className="h-4 w-4" />}
          label="With Company"
          value={stats.withCompany}
        />
        <StatCard
          icon={<Phone className="h-4 w-4" />}
          label="With Phone"
          value={stats.withPhone}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, phone, company, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Mail className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>{search ? "No matching submissions." : "No contact submissions yet."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="min-w-[200px]">Message Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow
                  key={sub.id}
                  className="cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => setSelected(sub)}
                >
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {format(new Date(sub.created_at), "MMM d, yyyy")}
                    <div className="text-xs opacity-70">
                      {format(new Date(sub.created_at), "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${sub.email}`}
                      className="text-primary hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {sub.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.phone ? (
                      <a
                        href={`tel:${sub.phone.replace(/\s/g, "")}`}
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {sub.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.company || (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm max-w-xs">
                    <p className="line-clamp-2 text-muted-foreground">
                      {sub.message}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(sub);
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Contact Submission
                </SheetTitle>
                <SheetDescription>
                  Submitted on {format(new Date(selected.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-4">
                {/* Contact Info Card */}
                <div className="bg-muted/40 rounded-xl p-5 border border-border space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    Contact Info
                  </h3>

                  <div className="space-y-3">
                    <DetailRow label="Name" value={selected.name} />
                    <DetailRow
                      label="Email"
                      value={selected.email}
                      action={
                        <div className="flex gap-1">
                          <IconButton
                            icon={<ExternalLink className="h-3.5 w-3.5" />}
                            label="Open email"
                            onClick={() =>
                              window.open(`mailto:${selected.email}`, "_blank")
                            }
                          />
                          <IconButton
                            icon={
                              copied === "email" ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )
                            }
                            label="Copy email"
                            onClick={() => copy(selected.email, "email")}
                          />
                        </div>
                      }
                    />
                    <DetailRow
                      label="Phone"
                      value={
                        selected.phone ? (
                          <a
                            href={`tel:${selected.phone.replace(/\s/g, "")}`}
                            className="text-primary hover:underline"
                          >
                            {selected.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground/40 italic">
                            Not provided
                          </span>
                        )
                      }
                      action={
                        selected.phone ? (
                          <div className="flex gap-1">
                            <IconButton
                              icon={<Phone className="h-3.5 w-3.5" />}
                              label="Call"
                              onClick={() =>
                                window.open(
                                  `tel:${selected.phone!.replace(/\s/g, "")}`,
                                  "_blank"
                                )
                              }
                            />
                            <IconButton
                              icon={
                                copied === "phone" ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )
                              }
                              label="Copy phone"
                              onClick={() =>
                                selected.phone && copy(selected.phone, "phone")
                              }
                            />
                          </div>
                        ) : undefined
                      }
                    />
                    <DetailRow
                      label="Company"
                      value={
                        selected.company || (
                          <span className="text-muted-foreground/40 italic">
                            Not provided
                          </span>
                        )
                      }
                    />
                  </div>
                </div>

                {/* Message Card */}
                <div className="bg-muted/40 rounded-xl p-5 border border-border space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Project Details
                  </h3>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    Quick Reach-Out
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() =>
                        window.open(`mailto:${selected.email}`, "_blank")
                      }
                    >
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      Send Email
                    </Button>
                    {selected.phone && (
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() =>
                          window.open(
                            `tel:${selected.phone.replace(/\s/g, "")}`,
                            "_blank"
                          )
                        }
                      >
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        Call Now
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() =>
                        copy(
                          `${selected.name}\n${selected.email}${selected.phone ? "\n" + selected.phone : ""}${selected.company ? "\n" + selected.company : ""}\n\n${selected.message}`,
                          "all"
                        )
                      }
                    >
                      {copied === "all" ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2 text-primary" />
                      )}
                      Copy All Info
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
                  <Clock className="h-3 w-3" />
                  First seen {format(new Date(selected.created_at), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
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

function DetailRow({
  label,
  value,
  action,
}: {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7"
      title={label}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
}
