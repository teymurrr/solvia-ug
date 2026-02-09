import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type SupportedLang = "en" | "es" | "de" | "fr" | "ru";

const templates: Record<SupportedLang, {
  subject: string;
  greeting: (name: string) => string;
  body: string;
  cta: string;
  closing: string;
}> = {
  en: {
    subject: "Welcome to Solvia – Your medical career in Europe starts here",
    greeting: (n) => `Hi ${n},`,
    body: "Thank you for signing up with Solvia! We're here to help you navigate your path to a medical career in Europe — from homologation to job placement.",
    cta: "Get started by completing your profile and exploring open positions.",
    closing: "Best regards,<br/>The Solvia Team",
  },
  es: {
    subject: "Bienvenido/a a Solvia – Tu carrera médica en Europa comienza aquí",
    greeting: (n) => `Hola ${n},`,
    body: "¡Gracias por registrarte en Solvia! Estamos aquí para ayudarte en tu camino hacia una carrera médica en Europa — desde la homologación hasta la colocación laboral.",
    cta: "Empieza completando tu perfil y explorando las vacantes disponibles.",
    closing: "Saludos cordiales,<br/>El equipo de Solvia",
  },
  de: {
    subject: "Willkommen bei Solvia – Deine medizinische Karriere in Europa beginnt hier",
    greeting: (n) => `Hallo ${n},`,
    body: "Vielen Dank für deine Registrierung bei Solvia! Wir helfen dir auf deinem Weg zu einer medizinischen Karriere in Europa — von der Anerkennung bis zur Jobvermittlung.",
    cta: "Lege los, indem du dein Profil vervollständigst und offene Stellen erkundest.",
    closing: "Beste Grüße,<br/>Das Solvia-Team",
  },
  fr: {
    subject: "Bienvenue chez Solvia – Votre carrière médicale en Europe commence ici",
    greeting: (n) => `Bonjour ${n},`,
    body: "Merci de vous être inscrit(e) chez Solvia ! Nous sommes là pour vous accompagner dans votre parcours vers une carrière médicale en Europe — de l'homologation au placement professionnel.",
    cta: "Commencez en complétant votre profil et en explorant les postes disponibles.",
    closing: "Cordialement,<br/>L'équipe Solvia",
  },
  ru: {
    subject: "Добро пожаловать в Solvia – Ваша медицинская карьера в Европе начинается здесь",
    greeting: (n) => `Здравствуйте, ${n},`,
    body: "Спасибо за регистрацию в Solvia! Мы здесь, чтобы помочь вам на пути к медицинской карьере в Европе — от признания диплома до трудоустройства.",
    cta: "Начните с заполнения профиля и изучения открытых вакансий.",
    closing: "С уважением,<br/>Команда Solvia",
  },
};

function buildWelcomeHtml(lang: SupportedLang, firstName: string): string {
  const t = templates[lang] || templates.en;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://solvia-flexkapg.lovable.app/lovable-uploads/Solvia_Logo-6.png" alt="Solvia" style="height: 40px;" />
  </div>
  <p>${t.greeting(firstName)}</p>
  <p>${t.body}</p>
  <p>${t.cta}</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://solvia-flexkapg.lovable.app/login" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      ${lang === "es" ? "Iniciar sesión" : lang === "de" ? "Anmelden" : lang === "fr" ? "Se connecter" : lang === "ru" ? "Войти" : "Log in"}
    </a>
  </div>
  <p>${t.closing}</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
  <p style="font-size: 12px; color: #999; text-align: center;">Solvia GmbH · Vienna, Austria</p>
</body>
</html>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, language, firstName } = await req.json();

    if (!email) {
      throw new Error("Missing email");
    }

    const lang: SupportedLang = ["en", "es", "de", "fr", "ru"].includes(language) ? language : "en";
    const name = firstName || email.split("@")[0];

    if (type === "welcome") {
      const t = templates[lang] || templates.en;
      const html = buildWelcomeHtml(lang, name);

      const result = await resend.emails.send({
        from: "Solvia <team@thesolvia.com>",
        to: [email],
        subject: t.subject,
        html,
      });

      console.log("Welcome email sent:", result);

      return new Response(JSON.stringify({ success: true, id: result?.data?.id }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown email type" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-auth-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
