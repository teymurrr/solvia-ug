import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const templates: Record<string, { subject: string; heading: string; body: string; cta: string }> = {
  en: {
    subject: "Your Medical German Starter Kit is ready! 🇩🇪",
    heading: "Welcome to your journey to Germany!",
    body: "Thank you for your purchase! Below you'll find your Starter Kit materials. Download them and start preparing today.",
    cta: "Book Your Free 15-min Consultation",
  },
  es: {
    subject: "¡Tu Kit de Inicio de Alemán Médico está listo! 🇩🇪",
    heading: "¡Bienvenido a tu camino hacia Alemania!",
    body: "¡Gracias por tu compra! A continuación encontrarás los materiales de tu Kit de Inicio. Descárgalos y empieza a prepararte hoy.",
    cta: "Reserva tu Consulta Gratuita de 15 min",
  },
  de: {
    subject: "Ihr Medical German Starter Kit ist bereit! 🇩🇪",
    heading: "Willkommen auf Ihrem Weg nach Deutschland!",
    body: "Vielen Dank für Ihren Kauf! Unten finden Sie Ihre Starter-Kit-Materialien. Laden Sie sie herunter und beginnen Sie noch heute mit der Vorbereitung.",
    cta: "Buchen Sie Ihre kostenlose 15-min Beratung",
  },
  fr: {
    subject: "Votre Kit de Démarrage d'Allemand Médical est prêt ! 🇩🇪",
    heading: "Bienvenue dans votre parcours vers l'Allemagne !",
    body: "Merci pour votre achat ! Vous trouverez ci-dessous les documents de votre Kit de Démarrage. Téléchargez-les et commencez à vous préparer dès aujourd'hui.",
    cta: "Réservez votre Consultation Gratuite de 15 min",
  },
  ru: {
    subject: "Ваш стартовый набор медицинского немецкого готов! 🇩🇪",
    heading: "Добро пожаловать на путь в Германию!",
    body: "Спасибо за покупку! Ниже вы найдёте материалы вашего стартового набора. Скачайте их и начните подготовку уже сегодня.",
    cta: "Забронируйте бесплатную 15-мин консультацию",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, language = "en" } = await req.json();
    if (!email) throw new Error("Email is required");

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const t = templates[language] || templates.en;

    // TODO: Replace placeholder links with real Supabase Storage URLs once PDFs are uploaded
    const downloadLinks = [
      { name: "50 Essential Medical German Phrases", url: "#" },
      { name: "FSP Exam Structure & Timeline Guide", url: "#" },
      { name: "A1 to Approbation Roadmap", url: "#" },
      { name: "Medical Term Pronunciation Audio", url: "#" },
      { name: "Document Checklist for Approbation", url: "#" },
    ];

    const linksHtml = downloadLinks
      .map(l => `<li style="margin-bottom:8px;"><a href="${l.url}" style="color:#0974f1;text-decoration:underline;">${l.name}</a></li>`)
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="text-align:center;margin-bottom:24px;">
    <img src="https://solvia-flexkapg.lovable.app/lovable-uploads/Solvia_Logo-6.png" alt="Solvia" width="120" />
  </div>
  <h1 style="font-size:24px;color:#0974f1;">${t.heading}</h1>
  <p style="font-size:16px;line-height:1.6;">${t.body}</p>
  <h2 style="font-size:18px;margin-top:24px;">📦 Your Materials</h2>
  <ul style="padding-left:20px;line-height:1.8;">${linksHtml}</ul>
  <div style="text-align:center;margin:32px 0;">
    <a href="https://solvia-flexkapg.lovable.app/contact" style="background:#0974f1;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">${t.cta}</a>
  </div>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;" />
  <p style="font-size:12px;color:#888;">Solvia GmbH — Your partner for medical careers in Europe</p>
</body>
</html>`;

    const emailResponse = await resend.emails.send({
      from: "Solvia <team@thesolvia.com>",
      to: [email],
      subject: t.subject,
      html,
    });

    console.log("[DELIVER-STARTER-KIT] Email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[DELIVER-STARTER-KIT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
