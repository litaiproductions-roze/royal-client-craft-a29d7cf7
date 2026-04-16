import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 requests per hour per email
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const GENERIC_RESPONSE = JSON.stringify({
  message: "If this email exists, a reset link has been sent.",
});

function buildEmailHtml(resetUrl: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1033;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:linear-gradient(135deg,#1a0b3d 0%,#2d1b69 100%);border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(45,27,105,0.25);">
          <tr>
            <td style="padding:40px 40px 24px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Lit AI Productions
              </h1>
              <div style="width:60px;height:3px;background:linear-gradient(90deg,#c9a961,#f4d03f);margin:16px auto 0;border-radius:2px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 40px 40px;background-color:#ffffff;margin:0 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;padding:32px;margin-top:-8px;">
                <tr>
                  <td>
                    <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:600;color:#1a0b3d;">
                      Reset Your Password
                    </h2>
                    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#4a4a6a;">
                      We received a request to reset the password for your Lit AI Productions account. Click the button below to create a new password. This link will expire in 1 hour.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;">
                      <tr>
                        <td style="border-radius:8px;background:linear-gradient(135deg,#2d1b69 0%,#4b2e8c 100%);">
                          <a href="${resetUrl}"
                             style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b6b8a;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin:0 0 24px 0;font-size:12px;color:#2d1b69;word-break:break-all;background:#f5f3fa;padding:12px;border-radius:6px;border-left:3px solid #c9a961;">
                      ${resetUrl}
                    </p>
                    <hr style="border:none;border-top:1px solid #ece8f5;margin:24px 0;" />
                    <p style="margin:0;font-size:13px;color:#6b6b8a;line-height:1.5;">
                      If you didn't request this password reset, you can safely ignore this email — your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;text-align:center;background:linear-gradient(135deg,#1a0b3d 0%,#2d1b69 100%);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">
                © ${new Date().getFullYear()} Lit AI Productions. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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
      return new Response(GENERIC_RESPONSE, {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      return new Response(GENERIC_RESPONSE, {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("password_reset_logs")
      .select("*", { count: "exact", head: true })
      .eq("email", trimmedEmail)
      .gte("created_at", oneHourAgo);

    if (!countError && (count ?? 0) >= RATE_LIMIT_MAX) {
      await supabaseAdmin.from("password_reset_logs").insert({
        email: trimmedEmail,
        status: "rate_limited",
      });
      return new Response(GENERIC_RESPONSE, {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    await supabaseAdmin.from("password_reset_logs").insert({
      email: trimmedEmail,
      status: "requested",
    });

    const finalRedirect = redirectUrl || "https://litaiproductions.lovable.app/reset-password";

    // Generate a recovery link via Supabase Admin API (does NOT auto-send email)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: trimmedEmail,
      options: { redirectTo: finalRedirect },
    });

    if (linkError || !linkData?.properties?.action_link) {
      // User likely doesn't exist - log but return generic
      await supabaseAdmin.from("password_reset_logs").insert({
        email: trimmedEmail,
        status: "failed",
      });
      if (linkError) console.error("generateLink error:", linkError.message);
      return new Response(GENERIC_RESPONSE, {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const resetUrl = linkData.properties.action_link;

    // Send branded email via Resend through connector gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY_1") || Deno.env.get("RESEND_API_KEY");

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.error("Missing email credentials");
      await supabaseAdmin.from("password_reset_logs").insert({
        email: trimmedEmail,
        status: "failed",
      });
      return new Response(GENERIC_RESPONSE, {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailResponse = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Lit AI Productions <onboarding@resend.dev>",
        to: [trimmedEmail],
        subject: "Reset your Lit AI Productions password",
        html: buildEmailHtml(resetUrl),
      }),
    });

    if (!emailResponse.ok) {
      const errBody = await emailResponse.text();
      console.error(`Resend send failed [${emailResponse.status}]: ${errBody}`);
      await supabaseAdmin.from("password_reset_logs").insert({
        email: trimmedEmail,
        status: "failed",
      });
    } else {
      await supabaseAdmin.from("password_reset_logs").insert({
        email: trimmedEmail,
        status: "sent",
      });
    }

    return new Response(GENERIC_RESPONSE, {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Error in request-password-reset:", err.message);
    return new Response(GENERIC_RESPONSE, {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
