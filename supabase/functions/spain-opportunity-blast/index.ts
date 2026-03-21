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

function detectLanguage(contact: { preferred_language?: string | null; study_country?: string | null; country?: string | null; email: string }): Language {
  if (contact.preferred_language) {
    const pref = contact.preferred_language.toLowerCase();
    if (['es', 'de', 'en', 'fr', 'ru'].includes(pref)) return pref as Language;
  }
  const study = (contact.study_country || contact.country || '').toLowerCase();
  if (spanishCountries.some(c => study.includes(c))) return 'es';
  if (germanCountries.some(c => study.includes(c))) return 'de';
  if (frenchCountries.some(c => study.includes(c))) return 'fr';
  if (russianCountries.some(c => study.includes(c))) return 'ru';

  const domain = contact.email.toLowerCase().split('@')[1] || '';
  if (spanishTLDs.some(tld => domain.endsWith(tld))) return 'es';
  if (germanTLDs.some(tld => domain.endsWith(tld))) return 'de';
  if (frenchTLDs.some(tld => domain.endsWith(tld))) return 'fr';
  if (russianTLDs.some(tld => domain.endsWith(tld))) return 'ru';

  return 'en';
}

const template = {
  subject: {
    es: 'Nueva oportunidad: trabaja en España mientras esperas tu homologación',
    en: 'New opportunity: work in Spain while waiting for your homologation',
    de: 'Neue Möglichkeit: Arbeite in Spanien während du auf deine Anerkennung wartest',
    fr: 'Nouvelle opportunité : travaille en Espagne en attendant ton homologation',
    ru: 'Новая возможность: работай в Испании, пока ждёшь гомологацию',
  },
  body: {
    es: `¿Cómo va tu homologación y tienes dificultades con el alemán?

Ahora, además de Alemania, también tenemos <b>oportunidades de empleo en España</b> para profesionales sanitarios. Si estás esperando homologación en Alemania, España puede ser un primer paso, trabajas, ganas experiencia europea y tienes tiempo para aprender alemán.

¿Te interesa o conoces a alguien que lo puede ser? Simplemente <b>responde a este email o escríbenos.</b>`,
    en: `How is your homologation going — are you having difficulties with German?

Now, in addition to Germany, we also have job opportunities in Spain for healthcare professionals. If you're waiting for your homologation in Germany, Spain can be a first step — you work, gain European experience, and have time to learn German.

Interested, or know someone who might be? Simply reply to this email or write to us.`,
    de: `Wie läuft deine Anerkennung — hast du Schwierigkeiten mit Deutsch?

Neben Deutschland haben wir jetzt auch Jobmöglichkeiten in Spanien für Gesundheitsfachkräfte. Wenn du auf deine Anerkennung in Deutschland wartest, kann Spanien ein erster Schritt sein — du arbeitest, sammelst europäische Erfahrung und hast Zeit, Deutsch zu lernen.

Interessiert, oder kennst du jemanden? Antworte einfach auf diese E-Mail oder schreib uns.`,
    fr: `Comment avance ton homologation — tu as des difficultés avec l'allemand ?

Maintenant, en plus de l'Allemagne, nous avons aussi des opportunités d'emploi en Espagne pour les professionnels de santé. Si tu attends ton homologation en Allemagne, l'Espagne peut être une première étape — tu travailles, tu gagnes de l'expérience européenne et tu as le temps d'apprendre l'allemand.

Intéressé(e), ou tu connais quelqu'un qui pourrait l'être ? Réponds simplement à cet email ou écris-nous.`,
    ru: `Как продвигается твоя гомологация — есть трудности с немецким?

Теперь, помимо Германии, у нас также есть вакансии в Испании для медицинских специалистов. Если ты ждёшь гомологацию в Германии, Испания может стать первым шагом — ты работаешь, получаешь европейский опыт и имеешь время выучить немецкий.

Интересно, или знаешь кого-то, кому может быть? Просто ответь на это письмо или напиши нам.`,
  },
  greeting: {
    es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,',
  },
};

interface Contact {
  email: string;
  preferred_language?: string | null;
  study_country?: string | null;
  country?: string | null;
  source_table: string;
  source_id: string;
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
    

    const body = await req.json().catch(() => ({}));
    const testMode = body.testMode === true;
    const testEmail = body.testEmail;

    console.log(`[spain-opportunity] Starting${testMode ? ' (TEST)' : ''}...`);

    // 1. Gather contacts from all three sources
    const contacts = new Map<string, Contact>();

    // Leads
    const { data: leads } = await supabase
      .from('leads')
      .select('id, email, preferred_language, study_country')
      .not('email', 'is', null);

    for (const l of leads || []) {
      const key = l.email.toLowerCase();
      if (!contacts.has(key)) {
        contacts.set(key, { email: key, preferred_language: l.preferred_language, study_country: l.study_country, source_table: 'leads', source_id: l.id });
      }
    }

    // Professional profiles (email is on the profile itself)
    const { data: profiles } = await supabase
      .from('professional_profiles')
      .select('id, email, preferred_language, study_country')
      .not('email', 'is', null);

    for (const p of profiles || []) {
      if (!p.email) continue;
      const key = p.email.toLowerCase();
      if (!contacts.has(key)) {
        contacts.set(key, { email: key, preferred_language: p.preferred_language, study_country: p.study_country, source_table: 'professional_profiles', source_id: p.id });
      }
    }

    // Learning form submissions
    const { data: learners } = await supabase
      .from('learning_form_submissions')
      .select('id, email, preferred_language, country')
      .not('email', 'is', null);

    for (const l of learners || []) {
      const key = l.email.toLowerCase();
      if (!contacts.has(key)) {
        contacts.set(key, { email: key, preferred_language: l.preferred_language, country: l.country, source_table: 'learning_form_submissions', source_id: l.id });
      }
    }

    console.log(`[spain-opportunity] Found ${contacts.size} unique contacts`);

    const results = { sent: 0, skipped: 0, failed: 0, total: contacts.size };

    for (const [email, contact] of contacts) {
      // Check already sent
      const { data: existing } = await supabase
        .from('email_sends')
        .select('id')
        .ilike('email', email)
        .eq('template_id', 'spainOpportunity')
        .limit(1);

      if (existing && existing.length > 0) {
        results.skipped++;
        continue;
      }

      if (testMode && testEmail && email !== testEmail.toLowerCase()) {
        results.skipped++;
        continue;
      }

      const lang = detectLanguage(contact);

      const html = generateEmail(
        template.greeting[lang],
        template.body[lang],
        lang
      );

      try {
        const emailResponse = await sendBrevoEmail({
          from: { name: "David from Solvia", email: "david@thesolvia.com" },
          to: [email],
          subject: template.subject[lang],
          html,
          replyTo: "David.rehrl@thesolvia.com",
        });

        await supabase.from('email_sends').insert({
          email,
          template_id: 'spainOpportunity',
          language: lang,
          lead_id: contact.source_table === 'leads' ? contact.source_id : null,
          source_table: contact.source_table,
          resend_email_id: emailResponse?.data?.id || null,
          status: 'sent',
        });

        results.sent++;
        console.log(`[spain-opportunity] Sent to ${email} in ${lang}`);
      } catch (emailErr: any) {
        console.error(`[spain-opportunity] Error sending to ${email}:`, emailErr);
        results.failed++;
      }
    }

    console.log(`[spain-opportunity] Complete:`, results);

    return new Response(
      JSON.stringify({ success: true, ...results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("[spain-opportunity] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
