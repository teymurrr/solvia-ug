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

interface CampaignRequest {
  templateId?: 'feedbackAsk' | 'valueInsight';
  testMode?: boolean;
  testEmail?: string;
  language?: Language;
}

interface Lead {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  target_country: string | null;
  study_country: string | null;
  doctor_type: string | null;
  language_level: string | null;
  email_sequence_day: number;
  preferred_language: string | null;
}

// =============================================================================
// EMAIL TEMPLATES: Personal, Conversation-Starting
// =============================================================================

const emailTemplates = {
  // Email 1: "Why did you sign up?" - Day 0
  // Goal: Start a conversation, get replies, understand their problem
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

  // Email 2: Value insight for silent users - Day 3-5
  // Goal: Provide real value, trigger curiosity, invite reply (no CTA button)
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

// Countries where we support the local language
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

const detectLeadLanguage = (lead: Lead): Language => {
  // Priority 1: Explicit preferred_language
  if (lead.preferred_language) {
    const pref = lead.preferred_language.toLowerCase();
    if (['es', 'de', 'en', 'fr', 'ru'].includes(pref)) {
      console.log(`[Language] Using preferred_language for ${lead.email}: ${pref}`);
      return pref as Language;
    }
  }
  
  const study = (lead.study_country || '').toLowerCase();
  
  // Priority 2: Study country → supported language
  if (spanishCountries.some(c => study.includes(c))) {
    console.log(`[Language] Spanish for ${lead.email} (study: ${lead.study_country})`);
    return 'es';
  }
  
  if (germanCountries.some(c => study.includes(c))) {
    console.log(`[Language] German for ${lead.email} (study: ${lead.study_country})`);
    return 'de';
  }
  
  if (frenchCountries.some(c => study.includes(c))) {
    console.log(`[Language] French for ${lead.email} (study: ${lead.study_country})`);
    return 'fr';
  }
  
  if (russianCountries.some(c => study.includes(c))) {
    console.log(`[Language] Russian for ${lead.email} (study: ${lead.study_country})`);
    return 'ru';
  }
  
  // DEFAULT: English for all unsupported countries (Indonesia, India, etc.)
  console.log(`[Language] English (default) for ${lead.email} (study: ${lead.study_country || 'unknown'})`);
  return 'en';
};

// =============================================================================
// EMAIL HTML GENERATION (Plain-text style - looks personal, not automated)
// =============================================================================

const generatePlainEmail = (
  greeting: string,
  body: string,
  signature: string
): string => {
  // Convert body paragraphs to HTML, preserving line breaks
  const bodyHtml = body
    .split('\n\n')
    .map(paragraph => `<p style="margin: 0 0 16px 0;">${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');

  // Minimal, clean HTML that looks like a personal email
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
    p {
      margin: 0 0 16px 0;
    }
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
// MAIN HANDLER
// =============================================================================

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body: CampaignRequest = await req.json().catch(() => ({}));
    const { templateId = 'feedbackAsk', testMode = false, testEmail, language } = body;

    console.log(`[send-nurture-campaign] Starting. Test: ${testMode}, Template: ${templateId}`);

    // Validate template
    if (!['feedbackAsk', 'valueInsight'].includes(templateId)) {
      return new Response(
        JSON.stringify({ error: `Invalid template: ${templateId}. Use 'feedbackAsk' or 'valueInsight'` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get leads to email
    let leadsToEmail: Lead[] = [];

    if (testMode && testEmail) {
      // Test mode: create a mock lead
      leadsToEmail = [{
        id: 'test-lead',
        email: testEmail,
        first_name: null,
        last_name: null,
        preferred_language: language || 'es',
        study_country: 'Colombia',
        target_country: 'germany',
        doctor_type: 'general',
        language_level: 'B1',
        email_sequence_day: 0
      }];
      console.log(`[send-nurture-campaign] Test mode - sending to ${testEmail}`);
    } else {
      // Production mode: get leads based on template type
      if (templateId === 'feedbackAsk') {
        // Day 0: New leads who haven't received any email yet
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('status', 'new')
          .eq('email_sequence_day', 0)
          .limit(50);

        if (error) {
          console.error('[send-nurture-campaign] Error fetching leads:', error);
          throw error;
        }
        leadsToEmail = data || [];
        console.log(`[send-nurture-campaign] Found ${leadsToEmail.length} new leads for feedbackAsk`);
      } else if (templateId === 'valueInsight') {
        // Day 3-5: Leads who received feedbackAsk but haven't replied
        // (email_sequence_day = 1, last_email_sent between 3-5 days ago)
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
        
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('email_sequence_day', 1)
          .gte('last_email_sent', fiveDaysAgo)
          .lte('last_email_sent', threeDaysAgo)
          .limit(50);

        if (error) {
          console.error('[send-nurture-campaign] Error fetching leads:', error);
          throw error;
        }
        leadsToEmail = data || [];
        console.log(`[send-nurture-campaign] Found ${leadsToEmail.length} leads for valueInsight`);
      }
    }

    if (leadsToEmail.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No leads to email", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send emails
    const results = { sent: 0, failed: 0, errors: [] as string[] };
    const template = emailTemplates[templateId];

    for (const lead of leadsToEmail) {
      try {
        const lang = language || detectLeadLanguage(lead);
        
        const subject = template.subject[lang];
        const greeting = template.greeting[lang];
        const bodyText = template.body[lang];
        const signature = template.signature[lang];

        const html = generatePlainEmail(greeting, bodyText, signature);

        console.log(`[send-nurture-campaign] Sending ${templateId} to ${lead.email} in ${lang}`);

        const emailResponse = await resend.emails.send({
          from: "David from Solvia <david@thesolvia.com>",
          to: [lead.email],
          subject: subject,
          html: html,
          reply_to: "David.rehrl@thesolvia.com"
        });

        console.log(`[send-nurture-campaign] Email sent:`, emailResponse);

        // Update lead status (unless test mode)
        if (!testMode) {
          const newSequenceDay = templateId === 'feedbackAsk' ? 1 : 2;
          
          const { error: updateError } = await supabase
            .from('leads')
            .update({
              email_sequence_day: newSequenceDay,
              last_email_sent: new Date().toISOString(),
              email_campaign: templateId
            })
            .eq('id', lead.id);

          if (updateError) {
            console.error(`[send-nurture-campaign] Error updating lead ${lead.id}:`, updateError);
          }
        }

        results.sent++;
      } catch (emailError: any) {
        console.error(`[send-nurture-campaign] Error sending to ${lead.email}:`, emailError);
        results.failed++;
        results.errors.push(`${lead.email}: ${emailError.message}`);
      }
    }

    console.log(`[send-nurture-campaign] Complete. Sent: ${results.sent}, Failed: ${results.failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${results.sent} emails, ${results.failed} failed`,
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
