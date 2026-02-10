import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Find users who signed up 3+ days ago with incomplete profiles and haven't been emailed this template
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: profiles, error: profileError } = await supabase
      .from("professional_profiles")
      .select("id, first_name, email, profession, specialty, about, location, target_country, created_at")
      .lt("created_at", threeDaysAgo.toISOString());

    if (profileError) throw profileError;

    const results = { sent: 0, skipped: 0, errors: 0 };

    for (const profile of profiles || []) {
      if (!profile.email) {
        results.skipped++;
        continue;
      }

      // Check if profile is incomplete
      const isIncomplete = !profile.about || !profile.location || !profile.specialty;
      if (!isIncomplete) {
        results.skipped++;
        continue;
      }

      // Check deduplication
      const { data: existingSend } = await supabase
        .from("email_sends")
        .select("id")
        .eq("email", profile.email)
        .eq("template_id", "reengagement-incomplete-profile")
        .limit(1);

      if (existingSend && existingSend.length > 0) {
        results.skipped++;
        continue;
      }

      // Determine language
      const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
      const preferredLang = userData?.user?.user_metadata?.preferred_language || "en";

      const subjects: Record<string, string> = {
        en: `${profile.first_name}, your profile is almost ready`,
        es: `${profile.first_name}, tu perfil está casi listo`,
        de: `${profile.first_name}, Ihr Profil ist fast fertig`,
      };

      const bodies: Record<string, string> = {
        en: `Hi ${profile.first_name},\n\nYou signed up a few days ago — welcome! I noticed your profile isn't complete yet.\n\nA complete profile helps hospitals find you and makes your applications stand out. It only takes 5 minutes.\n\nComplete your profile: ${supabaseUrl.replace('.supabase.co', '.lovable.app')}/dashboard/professional\n\nIf you have any questions about the process, just reply to this email.\n\nBest,\nDavid`,
        es: `Hola ${profile.first_name},\n\nTe registraste hace unos días — ¡bienvenido/a! Noté que tu perfil aún no está completo.\n\nUn perfil completo ayuda a que los hospitales te encuentren y hace que tus solicitudes destaquen. Solo toma 5 minutos.\n\nCompleta tu perfil: ${supabaseUrl.replace('.supabase.co', '.lovable.app')}/dashboard/professional\n\nSi tienes alguna pregunta sobre el proceso, solo responde a este correo.\n\nSaludos,\nDavid`,
        de: `Hallo ${profile.first_name},\n\nSie haben sich vor einigen Tagen registriert — willkommen! Mir ist aufgefallen, dass Ihr Profil noch nicht vollständig ist.\n\nEin vollständiges Profil hilft Krankenhäusern, Sie zu finden. Es dauert nur 5 Minuten.\n\nProfil vervollständigen: ${supabaseUrl.replace('.supabase.co', '.lovable.app')}/dashboard/professional\n\nBei Fragen antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen,\nDavid`,
      };

      const lang = preferredLang in subjects ? preferredLang : "en";

      try {
        const emailResult = await resend.emails.send({
          from: "David <david.rehrl@thesolvia.com>",
          reply_to: "David.rehrl@thesolvia.com",
          to: [profile.email],
          subject: subjects[lang],
          text: bodies[lang],
        });

        // Record the send
        await supabase.from("email_sends").insert({
          email: profile.email,
          template_id: "reengagement-incomplete-profile",
          language: lang,
          status: "sent",
          lead_id: null,
          source_table: "professional_profiles",
          resend_email_id: emailResult?.data?.id || null,
        });

        // Also create an in-app notification
        await supabase.from("notifications").insert({
          user_id: profile.id,
          type: "tip",
          title: lang === "es" ? "Completa tu perfil" : lang === "de" ? "Profil vervollständigen" : "Complete your profile",
          message: lang === "es" ? "Un perfil completo te ayuda a destacar ante los hospitales." 
            : lang === "de" ? "Ein vollständiges Profil hilft Ihnen, von Krankenhäusern gefunden zu werden."
            : "A complete profile helps hospitals find you and makes your applications stand out.",
          link: "/dashboard/professional",
        });

        results.sent++;
      } catch (emailError) {
        console.error("Error sending email to", profile.email, emailError);
        results.errors++;
      }
    }

    console.log("Re-engagement results:", results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-reengagement-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
