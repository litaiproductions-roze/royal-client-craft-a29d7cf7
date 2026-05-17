import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

// Sanitize HTML to prevent XSS
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 per hour per IP

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + "|contact-form-salt");
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Persistent IP-hashed rate limiting
    const ipHash = await hashIp(getClientIp(req));
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count: recentCount } = await supabaseAdmin
      .from("contact_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);

    if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    await supabaseAdmin.from("contact_rate_limits").insert({ ip_hash: ipHash });

    const { name, email, phone, company, message }: ContactFormRequest = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate input lengths
    if (name.length > 100 || message.length > 5000 || (company && company.length > 200) || (phone && phone.length > 50)) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize all inputs for XSS prevention
    const safeName = sanitizeHtml(name.trim());
    const safeEmail = email.trim().toLowerCase();
    const safePhone = phone ? sanitizeHtml(phone.trim()) : null;
    const safeCompany = company ? sanitizeHtml(company.trim()) : null;
    const safeMessage = sanitizeHtml(message.trim());

    // Log only non-PII for debugging (no email or personal data)
    console.log("Processing contact form submission");

    // Check monthly email limit (one submission per email per calendar month)

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: existingSubmissions, error: checkError } = await supabaseAdmin
      .from("contact_submissions")
      .select("id")
      .eq("email", safeEmail)
      .gte("created_at", monthStart);

    if (checkError) {
      console.error("Error checking existing submissions:", checkError.message);
    }

    if (existingSubmissions && existingSubmissions.length > 0) {
      return new Response(
        JSON.stringify({ error: "You have already submitted a request this month. You can submit again next month." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Store submission in database
    const { error: dbError } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name: name.trim(),
        email: safeEmail,
        phone: safePhone,
        company: company?.trim() || null,
        message: message.trim(),
      });

    if (dbError) {
      console.error("Failed to store submission:", dbError.message);
    }

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "LIT Productions Contact <onboarding@resend.dev>",
      to: ["litaiproductions@gmail.com"],
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            New Contact Form Submission
          </h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
            ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Project Details</h2>
            <p style="line-height: 1.6;">${safeMessage}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the LIT Productions contact form.
          </p>
        </div>
      `,
      reply_to: safeEmail,
    });

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    // Log error without exposing details to client
    console.error("Error in send-contact-email function:", error.message);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
