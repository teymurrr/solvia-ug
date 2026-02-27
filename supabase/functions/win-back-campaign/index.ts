import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Win-Back Campaign
 * 
 * Targets leads who never received ANY email (email_sequence_day = 0, no records in email_sends).
 * Sends a single compelling personalized email based on their wizard data.
 */

type Language = 'es' | 'en' | 'de' | 'fr' | 'ru';

const spanishCountries = [
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia',
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'spain', 'españa'
];
const germanCountries = ['germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz'];
const frenchCountries = ['france', 'belgium', 'belgique', 'canada', 'morocco', 'algeria', 'tunisia'];
const russianCountries = ['russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan', 'kyrgyzstan'];

const spanishTLDs = ['.es', '.ar', '.mx', '.co', '.cl', '.pe', '.ve', '.ec', '.uy', '.py', '.bo', '.cr', '.gt', '.hn', '.sv', '.ni', '.pa', '.do', '.cu'];
const germanTLDs = ['.de', '.at', '.ch'];
const frenchTLDs = ['.fr', '.be'];
const russianTLDs = ['.ru', '.by', '.kz', '.uz'];

function detectLanguage(lead: { preferred_language?: string | null; study_country?: string | null; email: string }): Language {
  if (lead.preferred_language) {
    const pref = lead.preferred_language.toLowerCase();
    if (['es', 'de', 'en', 'fr', 'ru'].includes(pref)) return pref as Language;
  }
  const study = (lead.study_country || '').toLowerCase();
  if (spanishCountries.some(c => study.includes(c))) return 'es';
  if (germanCountries.some(c => study.includes(c))) return 'de';
  if (frenchCountries.some(c => study.includes(c))) return 'fr';
  if (russianCountries.some(c => study.includes(c))) return 'ru';
  
  const domain = lead.email.toLowerCase().split('@')[1] || '';
  if (spanishTLDs.some(tld => domain.endsWith(tld))) return 'es';
  if (germanTLDs.some(tld => domain.endsWith(tld))) return 'de';
  if (frenchTLDs.some(tld => domain.endsWith(tld))) return 'fr';
  if (russianTLDs.some(tld => domain.endsWith(tld))) return 'ru';
  
  return 'en';
}

const winBackTemplate = {
  subject: {
    es: 'Tu plan de carrera médica sigue esperándote',
    en: 'Your medical career plan is still waiting',
    de: 'Dein medizinischer Karriereplan wartet noch',
    fr: 'Ton plan de carrière médicale t\'attend toujours',
    ru: 'Твой план медицинской карьеры всё ещё ждёт',
  },
  body: {
    es: `Hace un tiempo completaste nuestro análisis de homologación y quería hacer un seguimiento.

Tu situación no ha cambiado — pero cada mes que pasa es un mes de salario como médico que pierdes.

He preparado un plan personalizado basado en tu perfil. Puedes verlo aquí:
{{RESULTS_LINK}}

Si estás listo para dar el primer paso, puedes empezar desde €39 con nuestro paquete Digital:
{{PAYMENT_LINK}}

Incluye tu hoja de ruta completa, análisis de documentos con IA y soporte por email.

Si tienes alguna duda, simplemente responde a este email.`,
    en: `A while ago you completed our homologation assessment and I wanted to follow up.

Your situation hasn't changed — but every month that passes is a month of doctor's salary you're missing out on.

I've prepared a personalized plan based on your profile. You can see it here:
{{RESULTS_LINK}}

If you're ready to take the first step, you can start from €39 with our Digital package:
{{PAYMENT_LINK}}

It includes your complete roadmap, AI document analysis, and email support.

If you have any questions, just reply to this email.`,
    de: `Vor einiger Zeit hast du unsere Anerkennungsanalyse abgeschlossen und ich wollte nachfragen.

Deine Situation hat sich nicht geändert — aber jeder Monat, der vergeht, ist ein Monat Arztgehalt, den du verpasst.

Ich habe einen personalisierten Plan basierend auf deinem Profil erstellt. Du kannst ihn hier sehen:
{{RESULTS_LINK}}

Wenn du bereit bist, den ersten Schritt zu machen, kannst du ab €39 mit unserem Digital-Paket starten:
{{PAYMENT_LINK}}

Es enthält deinen vollständigen Fahrplan, KI-Dokumentenanalyse und E-Mail-Support.

Bei Fragen antworte einfach auf diese E-Mail.`,
    fr: `Il y a quelque temps, tu as complété notre analyse d'homologation et je voulais faire un suivi.

Ta situation n'a pas changé — mais chaque mois qui passe est un mois de salaire de médecin que tu perds.

J'ai préparé un plan personnalisé basé sur ton profil. Tu peux le voir ici :
{{RESULTS_LINK}}

Si tu es prêt(e) à faire le premier pas, tu peux commencer à partir de €39 avec notre forfait Digital :
{{PAYMENT_LINK}}

Il inclut ta feuille de route complète, l'analyse de documents par IA et le support par email.

Si tu as des questions, réponds simplement à cet email.`,
    ru: `Некоторое время назад ты прошёл наш анализ гомологации, и я хотел узнать, как дела.

Твоя ситуация не изменилась — но каждый месяц, который проходит, это месяц врачебной зарплаты, который ты теряешь.

Я подготовил персонализированный план на основе твоего профиля. Ты можешь увидеть его здесь:
{{RESULTS_LINK}}

Если ты готов сделать первый шаг, можешь начать от €39 с нашим Digital пакетом:
{{PAYMENT_LINK}}

Он включает полный план, анализ документов ИИ и поддержку по email.

Если есть вопросы, просто ответь на это письмо.`,
  },
  greeting: {
    es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,',
  },
  signature: {
    es: 'Saludos,\n\nDavid', en: 'Best,\n\nDavid', de: 'Beste Grüße,\n\nDavid', fr: 'Cordialement,\n\nDavid', ru: 'С уважением,\n\nDavid',
  },
};

function generatePlainEmail(greeting: string, body: string, signature: string): string {
  const bodyHtml = body
    .split('\n\n')
    .map(p => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;background-color:#ffffff}p{margin:0 0 16px 0}</style></head><body><p style="margin:0 0 16px 0;">${greeting}</p>${bodyHtml}<p style="margin:24px 0 0 0;white-space:pre-line;">${signature}</p></body></html>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const body = await req.json().catch(() => ({}));
    const testMode = body.testMode === true;
    const testEmail = body.testEmail;

    console.log(`[win-back] Starting${testMode ? ' (TEST)' : ''}...`);

    // Find leads who never received any email
    const { data: coldLeads, error } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name, study_country, target_country, doctor_type, language_level, preferred_language')
      .eq('status', 'new')
      .eq('email_sequence_day', 0)
      .is('last_email_sent', null)
      .not('email', 'is', null)
      .limit(100);

    if (error) throw error;

    const results = { sent: 0, skipped: 0, failed: 0 };
    const baseUrl = 'https://solvia-flexkapg.lovable.app';

    for (const lead of coldLeads || []) {
      // Dedup check
      const { data: existing } = await supabase
        .from('email_sends')
        .select('id')
        .ilike('email', lead.email)
        .eq('template_id', 'winBack')
        .limit(1);

      if (existing && existing.length > 0) {
        results.skipped++;
        continue;
      }

      if (testMode && testEmail && lead.email !== testEmail) {
        results.skipped++;
        continue;
      }

      const lang = detectLanguage(lead);
      const targetCountry = lead.target_country || 'germany';
      const utmSource = 'email_winBack';

      let emailBody = winBackTemplate.body[lang]
        .replace(/\{\{RESULTS_LINK\}\}/g, `${baseUrl}/homologation-result?country=${encodeURIComponent(targetCountry)}&utm_source=${utmSource}`)
        .replace(/\{\{PAYMENT_LINK\}\}/g, `${baseUrl}/payment?country=${encodeURIComponent(targetCountry)}&utm_source=${utmSource}`);

      const html = generatePlainEmail(
        winBackTemplate.greeting[lang],
        emailBody,
        winBackTemplate.signature[lang]
      );

      try {
        const emailResponse = await resend.emails.send({
          from: "David from Solvia <david@thesolvia.com>",
          to: [lead.email],
          subject: winBackTemplate.subject[lang],
          html,
          reply_to: "David.rehrl@thesolvia.com",
        });

        await supabase.from('email_sends').insert({
          email: lead.email.toLowerCase(),
          template_id: 'winBack',
          language: lang,
          lead_id: lead.id,
          source_table: 'leads',
          resend_email_id: emailResponse?.data?.id || null,
          status: 'sent',
        });

        await supabase
          .from('leads')
          .update({
            email_sequence_day: 1,
            last_email_sent: new Date().toISOString(),
            email_campaign: 'winBack',
          })
          .eq('id', lead.id);

        results.sent++;
        console.log(`[win-back] Sent to ${lead.email} in ${lang}`);
      } catch (emailErr: any) {
        console.error(`[win-back] Error sending to ${lead.email}:`, emailErr);
        results.failed++;
      }
    }

    console.log(`[win-back] Complete:`, results);

    return new Response(
      JSON.stringify({ success: true, ...results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("[win-back] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
