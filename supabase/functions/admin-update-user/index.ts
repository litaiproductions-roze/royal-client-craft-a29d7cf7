import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPER_ADMIN_EMAIL = "litaiproductions@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const callerId = claimsData.claims.sub as string;
    const callerEmail = (claimsData.claims.email as string | undefined)?.toLowerCase();

    // Hard gate: only the super-admin email may perform these actions
    if (callerEmail !== SUPER_ADMIN_EMAIL) {
      return json({ error: "Only the primary admin can manage users." }, 403);
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRows } = await admin
      .from("user_roles").select("role").eq("user_id", callerId).eq("role", "admin");
    if (!roleRows || roleRows.length === 0) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const { action, user_id } = body as { action?: string; user_id?: string };

    if (!user_id || typeof user_id !== "string") return json({ error: "user_id required" }, 400);
    if (user_id === callerId) return json({ error: "You cannot modify your own account here." }, 400);

    // Protect the super-admin account from being modified
    const { data: targetUser } = await admin.auth.admin.getUserById(user_id);
    if (targetUser?.user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return json({ error: "The primary admin account cannot be modified." }, 400);
    }

    switch (action) {
      case "delete": {
        const { error } = await admin.auth.admin.deleteUser(user_id);
        if (error) throw error;
        return json({ ok: true });
      }
      case "restrict": {
        // Ban for 100 years (effectively permanent until unrestricted)
        const { error } = await admin.auth.admin.updateUserById(user_id, {
          ban_duration: "876000h",
        });
        if (error) throw error;
        return json({ ok: true });
      }
      case "unrestrict": {
        const { error } = await admin.auth.admin.updateUserById(user_id, {
          ban_duration: "none",
        });
        if (error) throw error;
        return json({ ok: true });
      }
      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (e: any) {
    console.error("admin-update-user error:", e?.message);
    return json({ error: e?.message || "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
