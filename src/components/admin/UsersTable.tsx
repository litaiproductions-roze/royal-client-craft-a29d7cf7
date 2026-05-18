import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Shield, UserCircle, Trash2, Ban, ShieldOff } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SUPER_ADMIN_EMAIL = "litaiproductions@gmail.com";

interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  roles: string[];
}

type PendingAction = { type: "delete" | "restrict" | "unrestrict"; user: UserRow } | null;

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);
  const [busy, setBusy] = useState(false);
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const isSuperAdmin = authUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-list-users");
      if (error) throw error;
      return (data?.users ?? []) as UserRow[];
    },
  });

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.roles.includes("admin")).length;
    return { total: users.length, admins, guests: users.length - admins };
  }, [users]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.email?.toLowerCase().includes(q) || u.display_name?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const runAction = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-update-user", {
        body: { action: pending.type, user_id: pending.user.id },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Done", description: `User ${pending.type}ed successfully.` });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setPending(null);
    } catch (e: any) {
      toast({ title: "Action failed", description: e?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive text-sm">
        Failed to load users. {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<Users className="h-4 w-4" />} label="Total Users" value={stats.total} />
        <StatCard icon={<Shield className="h-4 w-4" />} label="Admins" value={stats.admins} />
        <StatCard icon={<UserCircle className="h-4 w-4" />} label="Guests" value={stats.guests} />
      </div>

      <Input
        placeholder="Search by email or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last sign-in</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => {
              const isAdmin = u.roles.includes("admin");
              const isSelf = u.id === authUser?.id;
              const isProtected = u.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
              const restricted = u.banned_until && new Date(u.banned_until) > new Date();
              const canManage = isSuperAdmin && !isSelf && !isProtected;
              return (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell className="text-muted-foreground">{u.display_name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={isAdmin ? "default" : "secondary"}>
                      {isAdmin ? "Admin" : "Guest"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {restricted ? (
                      <Badge variant="destructive">Restricted</Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(u.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {u.last_sign_in_at ? format(new Date(u.last_sign_in_at), "MMM d, yyyy h:mm a") : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    {canManage ? (
                      <div className="flex justify-end gap-2 flex-wrap">
                        {restricted ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPending({ type: "unrestrict", user: u })}
                          >
                            <ShieldOff className="h-3.5 w-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Unrestrict</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPending({ type: "restrict", user: u })}
                          >
                            <Ban className="h-3.5 w-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Restrict</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setPending({ type: "delete", user: u })}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {isProtected ? "Primary admin" : isSelf ? "You" : "—"}
                      </span>
                    )}
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        All new users are guests. Admin privileges are reserved for {SUPER_ADMIN_EMAIL} only.
        Only the primary admin can restrict, unrestrict, or delete user profiles.
      </p>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && !busy && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.type === "delete" && "Delete this user?"}
              {pending?.type === "restrict" && "Restrict this user?"}
              {pending?.type === "unrestrict" && "Unrestrict this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.type === "delete" &&
                `This permanently removes ${pending?.user.email}'s account and profile. This cannot be undone.`}
              {pending?.type === "restrict" &&
                `${pending?.user.email} will be blocked from signing in until you unrestrict them.`}
              {pending?.type === "unrestrict" &&
                `${pending?.user.email} will be allowed to sign in again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                runAction();
              }}
              disabled={busy}
              className={pending?.type === "delete" ? "bg-destructive hover:bg-destructive/90" : undefined}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
