import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Shared booking CTA constants
const CALENDLY_URL = 'https://calendly.com/david-rehrl-thesolvia/30min';
const WHATSAPP_URL = 'https://wa.me/4915259018297';

interface HomologationPlanRequest {
  email: string;
  targetCountry: string;
  doctorType?: string;
  studyCountry?: string;
  languageLevel?: string;
  language?: string;
  browserLanguage?: string;
}

const countryNames: Record<string, Record<string, string>> = {
  germany: { en: 'Germany', es: 'Alemania', de: 'Deutschland', fr: 'Allemagne', ru: 'Германия' },
  austria: { en: 'Austria', es: 'Austria', de: 'Österreich', fr: 'Autriche', ru: 'Австрия' },
  spain: { en: 'Spain', es: 'España', de: 'Spanien', fr: 'Espagne', ru: 'Испания' },
  italy: { en: 'Italy', es: 'Italia', de: 'Italien', fr: 'Italie', ru: 'Италия' },
  france: { en: 'France', es: 'Francia', de: 'Frankreich', fr: 'France', ru: 'Франция' },
};

const doctorTypeNames: Record<string, Record<string, string>> = {
  general: { en: 'General Practitioner', es: 'Médico General', de: 'Allgemeinarzt', fr: 'Médecin Généraliste', ru: 'Врач общей практики' },
  specialist: { en: 'Specialist Doctor', es: 'Médico Especialista', de: 'Facharzt', fr: 'Médecin Spécialiste', ru: 'Врач-специалист' },
  nurse: { en: 'Nurse', es: 'Enfermero/a', de: 'Krankenpfleger/in', fr: 'Infirmier/ière', ru: 'Медсестра/Медбрат' },
  dentist: { en: 'Dentist', es: 'Dentista', de: 'Zahnarzt', fr: 'Dentiste', ru: 'Стоматолог' },
  other: { en: 'Medical Professional', es: 'Profesional Médico', de: 'Medizinischer Fachmann', fr: 'Professionnel Médical', ru: 'Медицинский специалист' },
};

const spanishSpeakingCountries = [
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia',
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico',
  'spain', 'españa'
];
const germanSpeakingCountries = ['germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz'];
const frenchSpeakingCountries = ['france', 'belgium', 'belgique', 'morocco', 'algeria', 'tunisia'];
const russianSpeakingCountries = ['russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan'];

const detectLanguageFromCountry = (country: string | undefined): string | null => {
  if (!country) return null;
  const c = country.toLowerCase();
  if (spanishSpeakingCountries.some(sc => c.includes(sc))) return 'es';
  if (germanSpeakingCountries.some(sc => c.includes(sc))) return 'de';
  if (frenchSpeakingCountries.some(sc => c.includes(sc))) return 'fr';
  if (russianSpeakingCountries.some(sc => c.includes(sc))) return 'ru';
  return null;
};

const bookingCTALabels: Record<string, { call: string; whatsapp: string }> = {
  en: { call: 'Want to talk to someone? Book a free 15-min call', whatsapp: 'Or message us directly on WhatsApp' },
  es: { call: '¿Quieres hablar con alguien? Reserva una llamada gratuita de 15 minutos', whatsapp: 'O escríbenos directamente por WhatsApp' },
  de: { call: 'Möchtest du mit jemandem sprechen? Buche ein kostenloses 15-Min-Gespräch', whatsapp: 'Oder schreib uns direkt auf WhatsApp' },
  fr: { call: 'Tu veux parler à quelqu\'un ? Réserve un appel gratuit de 15 min', whatsapp: 'Ou écris-nous directement sur WhatsApp' },
  ru: { call: 'Хочешь поговорить? Запиши на бесплатный 15-мин звонок', whatsapp: 'Или напиши нам в WhatsApp' },
};

const getEmailContent = (data: HomologationPlanRequest) => {
  let lang = data.language || 'en';
  if (lang === 'en') {
    const detected = detectLanguageFromCountry(data.studyCountry);
    if (detected) {
      lang = detected;
    } else if (data.browserLanguage) {
      const browserLang = data.browserLanguage.toLowerCase().split('-')[0];
      const langMap: Record<string, string> = { es: 'es', de: 'de', fr: 'fr', ru: 'ru' };
      if (langMap[browserLang]) lang = langMap[browserLang];
    }
  }
  const countryName = countryNames[data.targetCountry]?.[lang] || data.targetCountry;
  const professionName = doctorTypeNames[data.doctorType || 'general']?.[lang] || data.doctorType;
  
  const baseUrl = Deno.env.get("SITE_URL") || "https://thesolvia.com";
  const planUrl = `${baseUrl}/homologation-result?country=${data.targetCountry}&doctorType=${data.doctorType}&studyCountry=${encodeURIComponent(data.studyCountry || '')}&languageLevel=${encodeURIComponent(data.languageLevel || '')}`;

  const ctaLabels = bookingCTALabels[lang] || bookingCTALabels.en;

  const subjects: Record<string, string> = {
    en: `Your Personalized Homologation Plan for ${countryName}`,
    es: `Tu Plan de Homologación Personalizado para ${countryName}`,
    de: `Ihr Personalisierter Homologationsplan für ${countryName}`,
    fr: `Votre Plan d'Homologation Personnalisé pour ${countryName}`,
    ru: `Ваш Персональный План Гомологации для ${countryName}`,
  };

  const guidedHomologationLabel: Record<string, string> = {
    en: 'Start your Guided Homologation — €379',
    es: 'Comienza tu Homologación Guiada — €379',
    de: 'Starte deine Begleitete Homologation — €379',
    fr: 'Commence ton Homologation Guidée — 379 €',
    ru: 'Начни Сопровождаемую Гомологацию — €379',
  };

  const guidedHomologationDesc: Record<string, string> = {
    en: 'Get step-by-step expert guidance, personal document review, and priority support to navigate your homologation with confidence.',
    es: 'Obtén guía experta paso a paso, revisión personal de documentos y soporte prioritario para navegar tu homologación con confianza.',
    de: 'Erhalte Schritt-für-Schritt Expertenbegleitung, persönliche Dokumentenprüfung und Priority-Support für deine Anerkennung.',
    fr: 'Bénéficie d\'un accompagnement expert étape par étape, d\'une révision personnelle des documents et d\'un support prioritaire.',
    ru: 'Получи пошаговое экспертное сопровождение, персональную проверку документов и приоритетную поддержку.',
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subjects[lang] || subjects.en}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://thesolvia.com/lovable-uploads/Solvia_Logo-6.png" alt="Solvia" style="height: 40px; max-width: 150px; width: auto;">
  </div>
  
  <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h1 style="margin: 0 0 10px 0; font-size: 24px;">🎉 ${lang === 'es' ? '¡Tu plan está listo!' : lang === 'de' ? 'Dein Plan ist fertig!' : lang === 'fr' ? 'Ton plan est prêt!' : 'Your Plan is Ready!'}</h1>
    <p style="margin: 0; opacity: 0.9;">${professionName} → ${countryName}</p>
  </div>

  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #4F46E5;">${lang === 'es' ? 'Tu Perfil' : lang === 'de' ? 'Dein Profil' : lang === 'fr' ? 'Ton Profil' : 'Your Profile'}</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${lang === 'es' ? 'País Destino' : lang === 'de' ? 'Zielland' : lang === 'fr' ? 'Pays Cible' : 'Target Country'}</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${countryName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${lang === 'es' ? 'Profesión' : lang === 'de' ? 'Beruf' : lang === 'fr' ? 'Profession' : 'Profession'}</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${professionName}</td>
      </tr>
      ${data.studyCountry ? `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${lang === 'es' ? 'País de Estudio' : lang === 'de' ? 'Studienland' : lang === 'fr' ? 'Pays d\'Études' : 'Study Country'}</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${data.studyCountry}</td>
      </tr>
      ` : ''}
      ${data.languageLevel ? `
      <tr>
        <td style="padding: 8px 0;"><strong>${lang === 'es' ? 'Nivel de Idioma' : lang === 'de' ? 'Sprachniveau' : lang === 'fr' ? 'Niveau de Langue' : 'Language Level'}</strong></td>
        <td style="padding: 8px 0; text-align: right;">${data.languageLevel}</td>
      </tr>
      ` : ''}
    </table>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${planUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
      ${lang === 'es' ? 'Ver Mi Plan Completo' : lang === 'de' ? 'Meinen vollständigen Plan ansehen' : lang === 'fr' ? 'Voir Mon Plan Complet' : 'View My Full Plan'}
    </a>
  </div>

  <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #0369a1;">🚀 ${guidedHomologationLabel[lang] || guidedHomologationLabel.en}</h3>
    <p style="margin-bottom: 15px; color: #0c4a6e;">
      ${guidedHomologationDesc[lang] || guidedHomologationDesc.en}
    </p>
    <a href="${planUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
      ${guidedHomologationLabel[lang] || guidedHomologationLabel.en} →
    </a>
  </div>

  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 0 0 12px 0; font-weight: bold;">${ctaLabels.call}:</p>
    <p style="margin: 0 0 16px 0;"><a href="${CALENDLY_URL}" style="color: #4F46E5;">${CALENDLY_URL}</a></p>
    <p style="margin: 0 0 12px 0; font-weight: bold;">${ctaLabels.whatsapp}:</p>
    <p style="margin: 0;"><a href="${WHATSAPP_URL}" style="color: #4F46E5;">${WHATSAPP_URL}</a></p>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <div style="text-align: center; color: #666; font-size: 14px;">
    <p>Solvia - ${lang === 'es' ? 'Tu socio en la homologación médica' : lang === 'de' ? 'Dein Partner für medizinische Anerkennung' : lang === 'fr' ? 'Ton partenaire en homologation médicale' : 'Your Partner in Medical Homologation'}</p>
    <p style="margin-top: 10px;">
      <a href="https://thesolvia.com" style="color: #4F46E5; text-decoration: none;">thesolvia.com</a>
    </p>
  </div>
</body>
</html>
  `;

  return {
    subject: subjects[lang] || subjects.en,
    html: htmlContent,
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: HomologationPlanRequest = await req.json();

    if (!data.email || !data.targetCountry) {
      return new Response(
        JSON.stringify({ error: "Email and target country are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { subject, html } = getEmailContent(data);

    const emailResponse = await resend.emails.send({
      from: "Solvia <team@thesolvia.com>",
      to: [data.email],
      subject,
      html,
    });

    console.log("Homologation plan email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending homologation plan email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
