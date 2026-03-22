import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { generateEmail } from "../_shared/email-template.ts";
import type { Language } from "../_shared/email-template.ts";
import { sendBrevoEmail } from "../_shared/brevo-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

Si estás listo para dar el primer paso, puedes empezar desde €250 con nuestro paquete Digital:
{{PAYMENT_LINK}}

Incluye guía experta paso a paso, revisión personal de documentos y soporte prioritario.

Si tienes alguna duda, simplemente responde a este email.`,
    en: `A while ago you completed our homologation assessment and I wanted to follow up.

Your situation hasn't changed — but every month that passes is a month of doctor's salary you're missing out on.

I've prepared a personalized plan based on your profile. You can see it here:
{{RESULTS_LINK}}

If you're ready to take the first step, you can start from €250 with our Digital package:
{{PAYMENT_LINK}}

It includes step-by-step expert guidance, personal document review, and priority support.

If you have any questions, just reply to this email.`,
    de: `Vor einiger Zeit hast du unsere Anerkennungsanalyse abgeschlossen und ich wollte nachfragen.

Deine Situation hat sich nicht geändert — aber jeder Monat, der vergeht, ist ein Monat Arztgehalt, den du verpasst.

Ich habe einen personalisierten Plan basierend auf deinem Profil erstellt. Du kannst ihn hier sehen:
{{RESULTS_LINK}}

Wenn du bereit bist, den ersten Schritt zu machen, kannst du ab €789 mit unserem DIY-Paket starten:
{{PAYMENT_LINK}}

Es enthält Schritt-für-Schritt Expertenbegleitung, persönliche Dokumentenprüfung und Priority-Support.

Bei Fragen antworte einfach auf diese E-Mail.`,
    fr: `Il y a quelque temps, tu as complété notre analyse d'homologation et je voulais faire un suivi.

Ta situation n'a pas changé — mais chaque mois qui passe est un mois de salaire de médecin que tu perds.

J'ai préparé un plan personnalisé basé sur ton profil. Tu peux le voir ici :
{{RESULTS_LINK}}

Si tu es prêt(e) à faire le premier pas, tu peux commencer à partir de 379 € avec notre forfait Homologation Guidée :
{{PAYMENT_LINK}}

Il inclut un accompagnement expert étape par étape, une révision personnelle des documents et un support prioritaire.

Si tu as des questions, réponds simplement à cet email.`,
    ru: `Некоторое время назад ты прошёл наш анализ гомологации, и я хотел узнать, как дела.

Твоя ситуация не изменилась — но каждый месяц, который проходит, это месяц врачебной зарплаты, который ты теряешь.

Я подготовил персонализированный план на основе твоего профиля. Ты можешь увидеть его здесь:
{{RESULTS_LINK}}

Если ты готов сделать первый шаг, можешь начать от €379 с нашим пакетом Сопровождаемая Гомологация:
{{PAYMENT_LINK}}

Он включает пошаговое экспертное сопровождение, персональную проверку документов и приоритетную поддержку.

Если есть вопросы, просто ответь на это письмо.`,
  },
  greeting: {
    es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,',
  },
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    

    const body = await req.json().catch(() => ({}));
    const testMode = body.testMode === true;
    const testEmail = body.testEmail;

    console.log(`[win-back] Starting${testMode ? ' (TEST)' : ''}...`);

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

      const html = generateEmail(
        winBackTemplate.greeting[lang],
        emailBody,
        lang
      );

      try {
        const emailResponse = await sendBrevoEmail({
          from: { name: "David from Solvia", email: "david@thesolvia.com" },
          to: [lead.email],
          subject: winBackTemplate.subject[lang],
          html,
          replyTo: "David.rehrl@thesolvia.com",
        });

        await supabase.from('email_sends').insert({
          email: lead.email.toLowerCase(),
          template_id: 'winBack',
          language: lang,
          lead_id: lead.id,
          source_table: 'leads',
          resend_email_id: emailResponse?.messageId || null,
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
