import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

// Country-based language detection
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

const getEmailContent = (data: HomologationPlanRequest) => {
  // Priority: explicit non-default language > study country detection > browser language > 'en'
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
  const consultationUrl = "https://calendly.com/david-rehrl-thesolvia/30min";

  const subjects: Record<string, string> = {
    en: `Your Personalized Homologation Plan for ${countryName}`,
    es: `Tu Plan de Homologación Personalizado para ${countryName}`,
    de: `Ihr Personalisierter Homologationsplan für ${countryName}`,
    fr: `Votre Plan d'Homologation Personnalisé pour ${countryName}`,
    ru: `Ваш Персональный План Гомологации для ${countryName}`,
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
    <h1 style="margin: 0 0 10px 0; font-size: 24px;">🎉 ${lang === 'es' ? '¡Tu plan está listo!' : lang === 'de' ? 'Ihr Plan ist fertig!' : lang === 'fr' ? 'Votre plan est prêt!' : 'Your Plan is Ready!'}</h1>
    <p style="margin: 0; opacity: 0.9;">${professionName} → ${countryName}</p>
  </div>

  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #4F46E5;">${lang === 'es' ? 'Tu Perfil' : lang === 'de' ? 'Ihr Profil' : lang === 'fr' ? 'Votre Profil' : 'Your Profile'}</h2>
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

  <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #856404;">🚀 ${lang === 'es' ? 'Oferta especial: €39 por tiempo limitado' : lang === 'de' ? 'Einführungsangebot: €39 begrenzte Zeit' : lang === 'fr' ? 'Offre de Lancement: €39 Durée Limitée' : lang === 'ru' ? 'Вводное предложение: €39 ограниченное время' : 'Limited Time: €39 Introductory Offer'}</h3>
    <p style="margin-bottom: 15px; color: #856404;">
      ${lang === 'es' ? 'Desbloquea tu guía digital completa con análisis de documentos por IA, videos explicativos y lista de verificación paso a paso.' : lang === 'de' ? 'Schalten Sie Ihren vollständigen Digital Guide mit KI-Dokumentenanalyse, Erklärungsvideos und Schritt-für-Schritt-Checkliste frei.' : lang === 'fr' ? 'Déverrouillez votre Guide Digital complet avec analyse de documents par IA, vidéos explicatives et liste de contrôle étape par étape.' : lang === 'ru' ? 'Откройте свой полный Цифровой Гид с ИИ-анализом документов, обучающими видео и пошаговым чек-листом.' : 'Unlock your complete Digital Guide with AI document analysis, explanation videos, and step-by-step checklist.'}
    </p>
    <a href="${planUrl}" style="display: inline-block; background: #FF6B35; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
      ${lang === 'es' ? 'Desbloquear Guía - €39' : lang === 'de' ? 'Guide Freischalten - €39' : lang === 'fr' ? 'Débloquer Guide - €39' : lang === 'ru' ? 'Открыть Гид - €39' : 'Unlock Digital Guide - €39'} →
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <div style="text-align: center; color: #666; font-size: 14px;">
    <p>Solvia - ${lang === 'es' ? 'Tu socio en la homologación médica' : lang === 'de' ? 'Ihr Partner für medizinische Homologation' : lang === 'fr' ? 'Votre partenaire en homologation médicale' : 'Your Partner in Medical Homologation'}</p>
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
