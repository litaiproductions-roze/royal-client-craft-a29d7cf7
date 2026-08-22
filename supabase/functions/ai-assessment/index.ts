import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "litaiproductions@gmail.com";

function esc(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + "|ai-assessment-salt");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

serve(async (req) => {
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
    const body = await req.json();

    const name = str(body?.name, 100);
    const email = str(body?.email, 255).toLowerCase();
    const phone = str(body?.phone, 50);
    const company = str(body?.company, 200);
    const industry = str(body?.industry, 100);
    const teamSize = str(body?.teamSize, 50);
    const tier = str(body?.tier, 50) || "Exploring";
    const score = Number.isFinite(Number(body?.score))
      ? Math.max(0, Math.min(100, Math.round(Number(body.score))))
      : 0;

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Please enter a valid name and email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const rawAnswers = Array.isArray(body?.answers) ? body.answers.slice(0, 40) : [];
    const answers = rawAnswers.map((a: Record<string, unknown>) => ({
      id: str(a?.id, 60),
      question: str(a?.question, 300),
      answer: str(a?.answer, 300),
      points: Number.isFinite(Number(a?.points)) ? Number(a.points) : 0,
    }));

    const recommendations = (Array.isArray(body?.recommendations) ? body.recommendations : [])
      .slice(0, 10)
      .map((r: unknown) => str(r, 200))
      .filter(Boolean);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Rate limit by hashed IP
    const ipHash = await hashIp(getClientIp(req));
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count } = await supabaseAdmin
      .from("contact_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }
    await supabaseAdmin.from("contact_rate_limits").insert({ ip_hash: ipHash });

    const { error: dbError } = await supabaseAdmin.from("ai_assessment_leads").insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      industry: industry || null,
      team_size: teamSize || null,
      answers,
      score,
      tier,
      recommendations,
    });

    if (dbError) {
      console.error("Failed to store assessment lead:", dbError.message);
      return new Response(JSON.stringify({ error: "Could not save your results. Please try again." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let emailed = false;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const resend = new Resend(resendKey);
      const answersHtml = answers
        .map(
          (a) =>
            `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;">${esc(a.question)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;"><strong>${esc(a.answer)}</strong></td></tr>`,
        )
        .join("");
      const recsHtml = recommendations.map((r) => `<li>${esc(r)}</li>`).join("");

      try {
        // Notify admin
        await resend.emails.send({
          from: "LIT Productions <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          reply_to: email,
          subject: `New AI Assessment Lead — ${name} (${score}/100, ${tier})`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
              <h1 style="color:#1a1a2e;border-bottom:2px solid #d4af37;padding-bottom:10px;">New AI Readiness Assessment Lead</h1>
              <div style="background:#f5f5f5;padding:16px;border-radius:8px;">
                <p><strong>Name:</strong> ${esc(name)}</p>
                <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
                ${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ""}
                ${company ? `<p><strong>Business:</strong> ${esc(company)}</p>` : ""}
                ${industry ? `<p><strong>Industry:</strong> ${esc(industry)}</p>` : ""}
                ${teamSize ? `<p><strong>Team size:</strong> ${esc(teamSize)}</p>` : ""}
                <p><strong>Score:</strong> ${score}/100 — ${esc(tier)}</p>
              </div>
              ${recsHtml ? `<h2 style="color:#333;">Top recommendations</h2><ul>${recsHtml}</ul>` : ""}
              <h2 style="color:#333;">Answers</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">${answersHtml}</table>
            </div>`,
        });

        // Send results to the lead
        await resend.emails.send({
          from: "LIT Productions <onboarding@resend.dev>",
          to: [email],
          reply_to: ADMIN_EMAIL,
          subject: `Your AI Readiness Score: ${score}/100 (${tier})`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
              <h1 style="color:#1a1a2e;border-bottom:2px solid #d4af37;padding-bottom:10px;">Your AI Readiness Results</h1>
              <p>Hi ${esc(name)}, thanks for taking the AI Readiness Assessment.</p>
              <p style="font-size:20px;"><strong>Score: ${score}/100</strong> — ${esc(tier)}</p>
              ${recsHtml ? `<h2 style="color:#333;">Where to start</h2><ul>${recsHtml}</ul>` : ""}
              <p>Want help putting this into action? Reply to this email or book a free consultation at
                <a href="https://www.imagineitlit.com/contact">imagineitlit.com/contact</a>.</p>
              <p style="color:#666;font-size:12px;">— Lit AI Productions, Long Island, NY</p>
            </div>`,
        });
        emailed = true;
      } catch (e) {
        console.error("Assessment email failed:", (e as Error).message);
      }
    }

    return new Response(JSON.stringify({ success: true, emailed }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in ai-assessment function:", (error as Error).message);
    return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
