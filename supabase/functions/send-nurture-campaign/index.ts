import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// =============================================================================
// EMAIL SYSTEM: Personal, Reply-Focused Approach
// No sales funnels. No CTA buttons. Just genuine conversations.
// =============================================================================

type Language = 'es' | 'en' | 'de' | 'fr' | 'ru';
type TemplateId = 'feedbackAsk' | 'valueInsight';

interface CampaignRequest {
  templateId?: TemplateId;
  testMode?: boolean;
  testEmail?: string;
  language?: Language;
  includeAllSources?: boolean; // Query all tables, not just leads
}

interface EmailRecipient {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  study_country: string | null;
  target_country: string | null;
  doctor_type: string | null;
  language_level: string | null;
  preferred_language: string | null;
  source_table: string;
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

const emailTemplates = {
  feedbackAsk: {
    subject: {
      es: 'Pregunta rápida sobre por qué te registraste',
      en: 'Quick question about why you signed up',
      de: 'Kurze Frage, warum du dich angemeldet hast',
      fr: 'Petite question sur ton inscription',
      ru: 'Короткий вопрос о твоей регистрации'
    },
    greeting: {
      es: 'Hola,',
      en: 'Hi,',
      de: 'Hallo,',
      fr: 'Salut,',
      ru: 'Привет,'
    },
    body: {
      es: `te registraste en Solvia hace poco y quería hacer un breve check-in.

Normalmente, cuando alguien se registra es porque tiene un problema muy concreto (reconocimiento de título, encontrar hospital, exámenes de idioma, mudanza, etc.).

Estoy trabajando en la próxima versión y quería preguntarte directamente:

¿con qué esperabas que Solvia te ayudara?

Una frase corta es más que suficiente.`,
      en: `You signed up to Solvia a while ago — quick check-in from my side.

When people sign up, it's usually because of one specific problem (diploma recognition, finding a hospital, language exams, relocation).

I'm currently shaping the next version and wanted to ask you directly:

What were you hoping Solvia would help you with?

One short sentence is more than enough.`,
      de: `Du hast dich vor kurzem bei Solvia angemeldet — ich wollte mich kurz melden.

Wenn sich jemand anmeldet, ist es meistens wegen eines bestimmten Problems (Anerkennung, Krankenhaus finden, Sprachprüfungen, Umzug).

Ich arbeite gerade an der nächsten Version und wollte dich direkt fragen:

Wobei hattest du gehofft, dass Solvia dir helfen kann?

Ein kurzer Satz reicht völlig aus.`,
      fr: `Tu t'es inscrit(e) sur Solvia il y a quelques temps — je voulais faire un petit check-in.

Quand quelqu'un s'inscrit, c'est généralement pour un problème spécifique (reconnaissance de diplôme, trouver un hôpital, examens de langue, déménagement).

Je travaille sur la prochaine version et je voulais te demander directement:

Qu'est-ce que tu espérais que Solvia t'aide à faire?

Une courte phrase suffit amplement.`,
      ru: `Ты недавно зарегистрировался в Solvia — хотел просто узнать, как дела.

Обычно люди регистрируются из-за конкретной проблемы (признание диплома, поиск больницы, языковые экзамены, переезд).

Я сейчас работаю над следующей версией и хотел спросить напрямую:

Чем ты надеялся, что Solvia тебе поможет?

Одного короткого предложения вполне достаточно.`
    },
    signature: {
      es: 'Gracias,\n\nDavid',
      en: 'Thanks,\n\nDavid',
      de: 'Danke,\n\nDavid',
      fr: 'Merci,\n\nDavid',
      ru: 'Спасибо,\n\nDavid'
    }
  },

  valueInsight: {
    subject: {
      es: 'Lo que muchos médicos subestiman al mudarse a Alemania',
      en: 'What most doctors underestimate about moving to Germany',
      de: 'Was die meisten Ärzte beim Umzug nach Deutschland unterschätzen',
      fr: 'Ce que la plupart des médecins sous-estiment en déménageant en Allemagne',
      ru: 'Что большинство врачей недооценивают при переезде в Германию'
    },
    greeting: {
      es: 'Hola,',
      en: 'Hi,',
      de: 'Hallo,',
      fr: 'Salut,',
      ru: 'Привет,'
    },
    body: {
      es: `Un dato rápido de trabajar con médicos internacionales:

Los mayores retrasos no vienen del idioma — vienen del proceso de reconocimiento de documentos.

Hemos visto a personas perder 6-12 meses solo por este paso.

Si todavía estás considerando Alemania/Austria y quieres evitar eso, con gusto te explico tus opciones.`,
      en: `A quick insight from working with international doctors:

The biggest delays don't come from language — they come from the document recognition process.

We've seen people lose 6-12 months just because of this step.

If you're still considering Germany/Austria and want to avoid that, I'm happy to explain your options.`,
      de: `Ein kurzer Einblick aus der Arbeit mit internationalen Ärzten:

Die größten Verzögerungen kommen nicht von der Sprache — sie kommen vom Anerkennungsprozess der Dokumente.

Wir haben gesehen, wie Menschen 6-12 Monate nur wegen dieses Schrittes verloren haben.

Wenn du immer noch Deutschland/Österreich in Betracht ziehst und das vermeiden möchtest, erkläre ich dir gerne deine Optionen.`,
      fr: `Un aperçu rapide de mon travail avec des médecins internationaux:

Les plus grands retards ne viennent pas de la langue — ils viennent du processus de reconnaissance des documents.

Nous avons vu des gens perdre 6-12 mois juste à cause de cette étape.

Si tu considères toujours l'Allemagne/Autriche et que tu veux éviter ça, je t'explique volontiers tes options.`,
      ru: `Быстрый инсайт из работы с международными врачами:

Самые большие задержки происходят не из-за языка — они из-за процесса признания документов.

Мы видели, как люди теряли 6-12 месяцев только из-за этого шага.

Если ты все еще рассматриваешь Германию/Австрию и хочешь этого избежать, я с удовольствием объясню твои варианты.`
    },
    signature: {
      es: 'Saludos,\n\nDavid',
      en: 'Best,\n\nDavid',
      de: 'Beste Grüße,\n\nDavid',
      fr: 'Cordialement,\n\nDavid',
      ru: 'С уважением,\n\nDavid'
    }
  }
};

// =============================================================================
// LANGUAGE DETECTION
// =============================================================================

const spanishCountries = [
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia', 
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico',
  'spain', 'españa'
];

const germanCountries = ['germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz'];
const frenchCountries = ['france', 'belgium', 'belgique', 'switzerland', 'suisse', 'canada', 'morocco', 'algeria', 'tunisia'];
const russianCountries = ['russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan', 'kyrgyzstan'];

const detectLanguage = (recipient: EmailRecipient): Language => {
  if (recipient.preferred_language) {
    const pref = recipient.preferred_language.toLowerCase();
    if (['es', 'de', 'en', 'fr', 'ru'].includes(pref)) {
      return pref as Language;
    }
  }
  
  const study = (recipient.study_country || '').toLowerCase();
  
  if (spanishCountries.some(c => study.includes(c))) return 'es';
  if (germanCountries.some(c => study.includes(c))) return 'de';
  if (frenchCountries.some(c => study.includes(c))) return 'fr';
  if (russianCountries.some(c => study.includes(c))) return 'ru';
  
  return 'en';
};

// =============================================================================
// EMAIL HTML GENERATION
// =============================================================================

const generatePlainEmail = (greeting: string, body: string, signature: string): string => {
  const bodyHtml = body
    .split('\n\n')
    .map(paragraph => `<p style="margin: 0 0 16px 0;">${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background-color: #ffffff;
    }
    p { margin: 0 0 16px 0; }
  </style>
</head>
<body>
  <p style="margin: 0 0 16px 0;">${greeting}</p>
  ${bodyHtml}
  <p style="margin: 24px 0 0 0; white-space: pre-line;">${signature}</p>
</body>
</html>`;
};

// =============================================================================
// DEDUPLICATION: Check if email+template already sent
// =============================================================================

const checkAlreadySent = async (
  supabase: ReturnType<typeof createClient>,
  email: string,
  templateId: TemplateId
): Promise<boolean> => {
  const { data } = await supabase
    .from('email_sends')
    .select('id')
    .eq('template_id', templateId)
    .ilike('email', email)
    .limit(1);
  
  return (data && data.length > 0);
};

// =============================================================================
// LOG EMAIL SEND
// =============================================================================

const logEmailSend = async (
  supabase: ReturnType<typeof createClient>,
  recipient: EmailRecipient,
  templateId: TemplateId,
  language: Language,
  resendEmailId: string | null,
  status: 'sent' | 'failed'
): Promise<void> => {
  try {
    await supabase.from('email_sends').insert({
      email: recipient.email.toLowerCase(),
      template_id: templateId,
      language,
      lead_id: recipient.source_table === 'leads' ? recipient.id : null,
      source_table: recipient.source_table,
      resend_email_id: resendEmailId,
      status
    });
  } catch (err) {
    console.error(`[logEmailSend] Error logging send for ${recipient.email}:`, err);
  }
};

// =============================================================================
// MAIN HANDLER
// =============================================================================

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body: CampaignRequest = await req.json().catch(() => ({}));
    const { 
      templateId = 'feedbackAsk', 
      testMode = false, 
      testEmail, 
      language,
      includeAllSources = false 
    } = body;

    console.log(`[send-nurture-campaign] Starting. Test: ${testMode}, Template: ${templateId}, AllSources: ${includeAllSources}`);

    if (!['feedbackAsk', 'valueInsight'].includes(templateId)) {
      return new Response(
        JSON.stringify({ error: `Invalid template: ${templateId}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let recipients: EmailRecipient[] = [];

    if (testMode && testEmail) {
      recipients = [{
        id: 'test-lead',
        email: testEmail,
        first_name: null,
        last_name: null,
        preferred_language: language || 'es',
        study_country: 'Colombia',
        target_country: 'germany',
        doctor_type: 'general',
        language_level: 'B1',
        source_table: 'test'
      }];
      console.log(`[send-nurture-campaign] Test mode - sending to ${testEmail}`);
    } else {
      // Get recipients from leads table (primary source)
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('id, email, first_name, last_name, study_country, target_country, doctor_type, language_level, preferred_language')
        .eq('status', 'new')
        .not('email', 'is', null)
        .limit(100);

      if (leadsError) throw leadsError;

      recipients = (leadsData || []).map(l => ({
        ...l,
        source_table: 'leads'
      }));

      // If includeAllSources, also get from other tables (deduplicated by email_sends)
      if (includeAllSources) {
        // Get from learning_form_submissions not already in email_sends
        const { data: learningData } = await supabase
          .from('learning_form_submissions')
          .select('id, email, full_name, country, preferred_language')
          .not('email', 'is', null)
          .limit(50);

        if (learningData) {
          for (const l of learningData) {
            const [firstName, ...lastParts] = (l.full_name || '').split(' ');
            recipients.push({
              id: l.id,
              email: l.email,
              first_name: firstName || null,
              last_name: lastParts.join(' ') || null,
              study_country: l.country,
              target_country: null,
              doctor_type: null,
              language_level: null,
              preferred_language: l.preferred_language,
              source_table: 'learning_form_submissions'
            });
          }
        }
      }

      console.log(`[send-nurture-campaign] Found ${recipients.length} potential recipients`);
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No recipients found", sent: 0, skipped: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const results = { sent: 0, skipped: 0, failed: 0, errors: [] as string[] };
    const template = emailTemplates[templateId];

    for (const recipient of recipients) {
      try {
        // DEDUPLICATION CHECK: Skip if already sent this template to this email
        if (!testMode) {
          const alreadySent = await checkAlreadySent(supabase, recipient.email, templateId);
          if (alreadySent) {
            console.log(`[send-nurture-campaign] Skipping ${recipient.email} - already received ${templateId}`);
            results.skipped++;
            continue;
          }
        }

        const lang = language || detectLanguage(recipient);
        const html = generatePlainEmail(
          template.greeting[lang],
          template.body[lang],
          template.signature[lang]
        );

        console.log(`[send-nurture-campaign] Sending ${templateId} to ${recipient.email} in ${lang}`);

        const emailResponse = await resend.emails.send({
          from: "David from Solvia <david@thesolvia.com>",
          to: [recipient.email],
          subject: template.subject[lang],
          html,
          reply_to: "David.rehrl@thesolvia.com"
        });

        const resendEmailId = emailResponse?.data?.id || null;

        // Log the send to email_sends table
        if (!testMode) {
          await logEmailSend(supabase, recipient, templateId, lang, resendEmailId, 'sent');

          // Also update leads table if from leads
          if (recipient.source_table === 'leads') {
            await supabase
              .from('leads')
              .update({
                email_sequence_day: templateId === 'feedbackAsk' ? 1 : 2,
                last_email_sent: new Date().toISOString(),
                email_campaign: templateId
              })
              .eq('id', recipient.id);
          }
        }

        results.sent++;
      } catch (emailError: any) {
        console.error(`[send-nurture-campaign] Error sending to ${recipient.email}:`, emailError);
        results.failed++;
        results.errors.push(`${recipient.email}: ${emailError.message}`);
        
        // Log failed send
        if (!testMode) {
          await logEmailSend(supabase, recipient, templateId, 'en', null, 'failed');
        }
      }
    }

    console.log(`[send-nurture-campaign] Complete. Sent: ${results.sent}, Skipped: ${results.skipped}, Failed: ${results.failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${results.sent}, skipped ${results.skipped} (already sent), failed ${results.failed}`,
        templateId,
        ...results
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("[send-nurture-campaign] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
