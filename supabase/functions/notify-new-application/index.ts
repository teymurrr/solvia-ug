import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotifyRequest {
  applicantName: string;
  applicantEmail: string;
  vacancyTitle: string;
  vacancyInstitution?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicantName, applicantEmail, vacancyTitle, vacancyInstitution, message }: NotifyRequest = await req.json();

    if (!applicantName || !vacancyTitle) {
      throw new Error("Missing required fields: applicantName, vacancyTitle");
    }

    const messageBlock = message
      ? `<div style="background:#f4f4f5;padding:12px 16px;border-radius:8px;margin-top:12px"><p style="margin:0;font-size:14px;color:#3f3f46"><strong>Message from applicant:</strong></p><p style="margin:8px 0 0;font-size:14px;color:#52525b;white-space:pre-wrap">${message}</p></div>`
      : "";

    const emailResponse = await resend.emails.send({
      from: "Solvia Notifications <noreply@thesolvia.com>",
      to: ["David.rehrl@thesolvia.com"],
      subject: `New Application: ${applicantName} → ${vacancyTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 16px;color:#18181b">New Vacancy Application</h2>
          <table style="font-size:14px;color:#3f3f46;border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Applicant</td><td>${applicantName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Email</td><td><a href="mailto:${applicantEmail}">${applicantEmail}</a></td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Vacancy</td><td>${vacancyTitle}</td></tr>
            ${vacancyInstitution ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600">Institution</td><td>${vacancyInstitution}</td></tr>` : ""}
          </table>
          ${messageBlock}
          <p style="margin-top:20px;font-size:13px;color:#a1a1aa">
            <a href="https://solvia-flexkapg.lovable.app/admin/applications" style="color:#6366f1">View all applications →</a>
          </p>
        </div>
      `,
    });

    console.log("Notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
