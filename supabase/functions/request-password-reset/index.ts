import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 requests per hour per email

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const { email, redirectUrl } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ message: "If this email exists, a reset link has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      // Don't reveal validation failure - always generic message
      return new Response(
        JSON.stringify({ message: "If this email exists, a reset link has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting: check recent requests for this email
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("password_reset_logs")
      .select("*", { count: "exact", head: true })
      .eq("email", trimmedEmail)
      .gte("created_at", oneHourAgo);

    if (!countError && (count ?? 0) >= RATE_LIMIT_MAX) {
      // Log the rate-limited attempt
      await supabaseAdmin.from("password_reset_logs").insert({
        email: trimmedEmail,
        status: "rate_limited",
      });

      // Still return generic message
      return new Response(
        JSON.stringify({ message: "If this email exists, a reset link has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Log the request
    await supabaseAdmin.from("password_reset_logs").insert({
      email: trimmedEmail,
      status: "requested",
    });

    // Send the reset email via Supabase Auth
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: redirectUrl || "https://litaiproductions.lovable.app/reset-password",
    });

    if (error) {
      // Log failure but don't reveal to user
      await supabaseAdmin.from("password_reset_logs").insert({
        email: trimmedEmail,
        status: "failed",
      });
      console.error("Password reset error:", error.message);
    }

    // Always return generic message
    return new Response(
      JSON.stringify({ message: "If this email exists, a reset link has been sent." }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err: any) {
    console.error("Error in request-password-reset:", err.message);
    return new Response(
      JSON.stringify({ message: "If this email exists, a reset link has been sent." }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
