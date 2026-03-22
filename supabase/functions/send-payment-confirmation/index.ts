import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Lang = 'es' | 'en' | 'de' | 'fr' | 'ru';

const CALENDLY_URL = 'https://calendly.com/david-rehrl-thesolvia/30min';
const WHATSAPP_URL = 'https://wa.me/4915259018297';
const APP_URL = 'https://solvia-flexkapg.lovable.app';

const templates: Record<Lang, {
  subject: string;
  heading: string;
  receiptTitle: string;
  product: string;
  country: string;
  amount: string;
  nextStepsTitle: string;
  steps: string[];
  ctaOnboarding: string;
  ctaCall: string;
  ctaWhatsApp: string;
  docsTitle: string;
  signature: string;
  signatureTitle: string;
}> = {
  en: {
    subject: '🎉 Payment Confirmed — Welcome to Solvia!',
    heading: 'Your payment was successful!',
    receiptTitle: 'Payment Summary',
    product: 'Package',
    country: 'Country',
    amount: 'Amount Paid',
    nextStepsTitle: 'What happens next',
    steps: [
      'Complete your onboarding profile',
      'Upload your documents for review',
      'Our team contacts you within 24 hours',
    ],
    ctaOnboarding: '🚀 Start Your Onboarding',
    ctaCall: '📞 Book a Free Call',
    ctaWhatsApp: '💬 Message us on WhatsApp',
    docsTitle: 'Documents You\'ll Need',
    signature: 'David Rehrl',
    signatureTitle: 'Head of Talent Partnerships — Solvia',
  },
  es: {
    subject: '🎉 Pago Confirmado — ¡Bienvenido a Solvia!',
    heading: '¡Tu pago se ha procesado correctamente!',
    receiptTitle: 'Resumen del Pago',
    product: 'Paquete',
    country: 'País',
    amount: 'Importe Pagado',
    nextStepsTitle: 'Próximos pasos',
    steps: [
      'Completa tu perfil de onboarding',
      'Sube tus documentos para revisión',
      'Nuestro equipo te contactará en 24 horas',
    ],
    ctaOnboarding: '🚀 Iniciar Onboarding',
    ctaCall: '📞 Reservar llamada gratuita',
    ctaWhatsApp: '💬 Escríbenos por WhatsApp',
    docsTitle: 'Documentos que necesitarás',
    signature: 'David Rehrl',
    signatureTitle: 'Director de Alianzas de Talento — Solvia',
  },
  de: {
    subject: '🎉 Zahlung bestätigt — Willkommen bei Solvia!',
    heading: 'Ihre Zahlung war erfolgreich!',
    receiptTitle: 'Zahlungsübersicht',
    product: 'Paket',
    country: 'Land',
    amount: 'Bezahlter Betrag',
    nextStepsTitle: 'Nächste Schritte',
    steps: [
      'Vervollständigen Sie Ihr Onboarding-Profil',
      'Laden Sie Ihre Dokumente zur Prüfung hoch',
      'Unser Team kontaktiert Sie innerhalb von 24 Stunden',
    ],
    ctaOnboarding: '🚀 Onboarding starten',
    ctaCall: '📞 Kostenloses Gespräch buchen',
    ctaWhatsApp: '💬 Schreib uns auf WhatsApp',
    docsTitle: 'Benötigte Dokumente',
    signature: 'David Rehrl',
    signatureTitle: 'Leiter Talent-Partnerschaften — Solvia',
  },
  fr: {
    subject: '🎉 Paiement confirmé — Bienvenue chez Solvia !',
    heading: 'Votre paiement a été traité avec succès !',
    receiptTitle: 'Résumé du Paiement',
    product: 'Forfait',
    country: 'Pays',
    amount: 'Montant payé',
    nextStepsTitle: 'Prochaines étapes',
    steps: [
      'Complétez votre profil d\'onboarding',
      'Téléchargez vos documents pour examen',
      'Notre équipe vous contacte sous 24 heures',
    ],
    ctaOnboarding: '🚀 Commencer l\'onboarding',
    ctaCall: '📞 Réserver un appel gratuit',
    ctaWhatsApp: '💬 Écris-nous sur WhatsApp',
    docsTitle: 'Documents nécessaires',
    signature: 'David Rehrl',
    signatureTitle: 'Responsable Partenariats Talents — Solvia',
  },
  ru: {
    subject: '🎉 Оплата подтверждена — Добро пожаловать в Solvia!',
    heading: 'Ваш платёж успешно обработан!',
    receiptTitle: 'Итоги платежа',
    product: 'Пакет',
    country: 'Страна',
    amount: 'Оплаченная сумма',
    nextStepsTitle: 'Что дальше',
    steps: [
      'Заполните профиль при онбординге',
      'Загрузите документы на проверку',
      'Наша команда свяжется с вами в течение 24 часов',
    ],
    ctaOnboarding: '🚀 Начать онбординг',
    ctaCall: '📞 Записаться на звонок',
    ctaWhatsApp: '💬 Написать в WhatsApp',
    docsTitle: 'Необходимые документы',
    signature: 'David Rehrl',
    signatureTitle: 'Руководитель партнёрских программ — Solvia',
  },
};

const productNames: Record<string, Record<Lang, string>> = {
  digital_starter: { en: 'DIY / Digital', es: 'Digital', de: 'DIY', fr: 'Digital', ru: 'Цифровой' },
  complete: { en: 'Assisted', es: 'Asistido', de: 'Begleitet', fr: 'Assisté', ru: 'С сопровождением' },
  personal_mentorship: { en: 'Full + German Classes', es: 'Completo + Visa', de: 'Komplett + Deutschkurse', fr: 'Complet + Cours d\'Allemand', ru: 'Полный + Курсы немецкого' },
};

const countryNames: Record<string, Record<Lang, string>> = {
  germany: { en: 'Germany', es: 'Alemania', de: 'Deutschland', fr: 'Allemagne', ru: 'Германия' },
  austria: { en: 'Austria', es: 'Austria', de: 'Österreich', fr: 'Autriche', ru: 'Австрия' },
  spain: { en: 'Spain', es: 'España', de: 'Spanien', fr: 'Espagne', ru: 'Испания' },
  france: { en: 'France', es: 'Francia', de: 'Frankreich', fr: 'France', ru: 'Франция' },
  switzerland: { en: 'Switzerland', es: 'Suiza', de: 'Schweiz', fr: 'Suisse', ru: 'Швейцария' },
  italy: { en: 'Italy', es: 'Italia', de: 'Italien', fr: 'Italie', ru: 'Италия' },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, language = 'en', productType, targetCountry, amountPaid, paymentId, documentRequirements } = await req.json();
    if (!email) throw new Error("Email is required");

    const lang: Lang = (['es','en','de','fr','ru'].includes(language) ? language : 'en') as Lang;
    const t = templates[lang];
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const productLabel = productNames[productType]?.[lang] || productType;
    const countryLabel = countryNames[targetCountry?.toLowerCase()]?.[lang] || targetCountry || 'Germany';
    const amountFormatted = amountPaid ? `€${(amountPaid / 100).toFixed(2)}` : '—';

    // Build document checklist HTML
    let docsHtml = '';
    if (documentRequirements && documentRequirements.length > 0) {
      const docItems = documentRequirements
        .map((d: any) => {
          const name = d[`document_name_${lang}`] || d.document_name_en;
          return `<li style="margin-bottom:6px;font-size:14px;color:#374151;">${name}</li>`;
        })
        .join('');
      docsHtml = `
        <tr><td style="padding:16px 40px 8px 40px;">
          <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${t.docsTitle}</p>
        </td></tr>
        <tr><td style="padding:0 40px 24px 40px;">
          <ul style="margin:8px 0 0 0;padding-left:20px;">${docItems}</ul>
        </td></tr>`;
    }

    const stepsHtml = t.steps.map((s, i) => `
      <tr><td style="padding:4px 40px;">
        <p style="margin:0;font-size:15px;color:#374151;"><span style="display:inline-block;width:24px;height:24px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:13px;font-weight:700;margin-right:10px;">${i + 1}</span>${s}</p>
      </td></tr>`).join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">

<!-- Header -->
<tr><td style="padding:32px 40px 16px 40px;background:#16a34a;text-align:center;">
  <img src="${APP_URL}/lovable-uploads/Solvia_Logo-6.png" alt="Solvia" width="100" style="margin-bottom:16px;" />
  <h1 style="margin:0;font-size:22px;color:#ffffff;">${t.heading}</h1>
</td></tr>

<!-- Receipt -->
<tr><td style="padding:24px 40px 8px 40px;">
  <p style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#1a1a1a;">${t.receiptTitle}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:6px;padding:16px;">
    <tr><td style="padding:8px 16px;font-size:14px;color:#6b7280;">${t.product}</td><td style="padding:8px 16px;font-size:14px;color:#1a1a1a;font-weight:600;text-align:right;">${productLabel}</td></tr>
    <tr><td style="padding:8px 16px;font-size:14px;color:#6b7280;">${t.country}</td><td style="padding:8px 16px;font-size:14px;color:#1a1a1a;font-weight:600;text-align:right;">${countryLabel}</td></tr>
    <tr><td style="padding:8px 16px;font-size:14px;color:#6b7280;border-top:1px solid #e5e7eb;">${t.amount}</td><td style="padding:8px 16px;font-size:18px;color:#16a34a;font-weight:700;text-align:right;border-top:1px solid #e5e7eb;">${amountFormatted}</td></tr>
  </table>
</td></tr>

<!-- Next Steps -->
<tr><td style="padding:24px 40px 8px 40px;">
  <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${t.nextStepsTitle}</p>
</td></tr>
${stepsHtml}

<!-- Onboarding CTA -->
<tr><td style="padding:24px 40px;" align="center">
  <a href="${APP_URL}/onboarding" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#16a34a;color:#ffffff;text-decoration:none;border-radius:6px;font-size:16px;font-weight:600;">${t.ctaOnboarding}</a>
</td></tr>

<!-- Document Checklist -->
${docsHtml}

<!-- Contact CTAs -->
<tr><td style="padding:8px 40px 32px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding-right:8px;" width="50%">
      <a href="${CALENDLY_URL}" target="_blank" style="display:block;text-align:center;padding:12px 8px;background-color:#ffffff;color:#16a34a;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;border:2px solid #16a34a;">${t.ctaCall}</a>
    </td>
    <td style="padding-left:8px;" width="50%">
      <a href="${WHATSAPP_URL}" target="_blank" style="display:block;text-align:center;padding:12px 8px;background-color:#ffffff;color:#16a34a;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;border:2px solid #16a34a;">${t.ctaWhatsApp}</a>
    </td>
  </tr>
  </table>
</td></tr>

<!-- Signature -->
<tr><td style="padding:0 40px;"><div style="border-top:1px solid #e4e4e7;"></div></td></tr>
<tr><td style="padding:24px 40px 40px 40px;">
  <p style="margin:0;font-size:15px;line-height:1.5;color:#1a1a1a;font-weight:600;">${t.signature}</p>
  <p style="margin:2px 0 0 0;font-size:14px;line-height:1.5;color:#71717a;">${t.signatureTitle}</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    const emailResponse = await resend.emails.send({
      from: "Solvia <team@thesolvia.com>",
      to: [email],
      subject: t.subject,
      html,
    });

    console.log("✅ [SEND-PAYMENT-CONFIRMATION] Email sent:", emailResponse);

    // Track in email_sends
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseClient.from('email_sends').insert({
      email,
      template_id: 'payment-confirmation',
      language: lang,
      status: 'sent',
      metadata: { productType, targetCountry, paymentId },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ [SEND-PAYMENT-CONFIRMATION] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
