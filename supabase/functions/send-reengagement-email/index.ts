import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

type Language = 'en' | 'es' | 'de' | 'fr' | 'ru';

const baseUrl = 'https://solvia-flexkapg.lovable.app';

// Templates for incomplete profile (existing)
const profileTemplates: Record<Language, { subject: (name: string) => string; body: (name: string, link: string) => string }> = {
  en: {
    subject: (name) => `${name}, your profile is almost ready`,
    body: (name, link) => `Hi ${name},\n\nYou signed up a few days ago — welcome! I noticed your profile isn't complete yet.\n\nA complete profile helps hospitals find you and makes your applications stand out. It only takes 5 minutes.\n\nComplete your profile: ${link}\n\nIf you have any questions about the process, just reply to this email.\n\nBest,\nDavid`,
  },
  es: {
    subject: (name) => `${name}, tu perfil está casi listo`,
    body: (name, link) => `Hola ${name},\n\nTe registraste hace unos días — ¡bienvenido/a! Noté que tu perfil aún no está completo.\n\nUn perfil completo ayuda a que los hospitales te encuentren y hace que tus solicitudes destaquen. Solo toma 5 minutos.\n\nCompleta tu perfil: ${link}\n\nSi tienes alguna pregunta sobre el proceso, solo responde a este correo.\n\nSaludos,\nDavid`,
  },
  de: {
    subject: (name) => `${name}, dein Profil ist fast fertig`,
    body: (name, link) => `Hallo ${name},\n\nDu hast dich vor einigen Tagen registriert — willkommen! Mir ist aufgefallen, dass dein Profil noch nicht vollständig ist.\n\nEin vollständiges Profil hilft Krankenhäusern, dich zu finden. Es dauert nur 5 Minuten.\n\nProfil vervollständigen: ${link}\n\nBei Fragen antworte einfach auf diese E-Mail.\n\nBeste Grüße,\nDavid`,
  },
  fr: {
    subject: (name) => `${name}, ton profil est presque prêt`,
    body: (name, link) => `Salut ${name},\n\nTu t'es inscrit(e) il y a quelques jours — bienvenue ! J'ai remarqué que ton profil n'est pas encore complet.\n\nUn profil complet aide les hôpitaux à te trouver. Ça prend seulement 5 minutes.\n\nComplète ton profil : ${link}\n\nSi tu as des questions, réponds simplement à cet email.\n\nCordialement,\nDavid`,
  },
  ru: {
    subject: (name) => `${name}, твой профиль почти готов`,
    body: (name, link) => `Привет ${name},\n\nТы зарегистрировался несколько дней назад — добро пожаловать! Я заметил, что твой профиль ещё не заполнен.\n\nПолный профиль помогает больницам найти тебя. Это займёт всего 5 минут.\n\nЗаполни профиль: ${link}\n\nЕсли есть вопросы, просто ответь на это письмо.\n\nС уважением,\nDavid`,
  },
};

// Templates for wizard-incomplete users (new)
const wizardTemplates: Record<Language, { subject: (name: string) => string; body: (name: string, wizardLink: string, paymentLink: string) => string }> = {
  en: {
    subject: (name) => `${name}, your homologation plan is waiting`,
    body: (name, wizardLink, paymentLink) => `Hi ${name},\n\nYou signed up on Solvia but haven't completed the homologation assessment yet.\n\nThe assessment takes just 2 minutes and gives you a personalized roadmap for your medical career abroad — including what documents you need, language requirements, and estimated timeline.\n\nComplete your assessment: ${wizardLink}\n\nAlready know what you need? Start your homologation from €39: ${paymentLink}\n\nIf you have questions, just reply to this email.\n\nBest,\nDavid`,
  },
  es: {
    subject: (name) => `${name}, tu plan de homologación te espera`,
    body: (name, wizardLink, paymentLink) => `Hola ${name},\n\nTe registraste en Solvia pero aún no has completado el análisis de homologación.\n\nEl análisis toma solo 2 minutos y te da una hoja de ruta personalizada para tu carrera médica en el extranjero — incluyendo documentos necesarios, requisitos de idioma y tiempo estimado.\n\nCompleta tu análisis: ${wizardLink}\n\n¿Ya sabes lo que necesitas? Empieza tu homologación desde €39: ${paymentLink}\n\nSi tienes preguntas, solo responde a este correo.\n\nSaludos,\nDavid`,
  },
  de: {
    subject: (name) => `${name}, dein Anerkennungsplan wartet`,
    body: (name, wizardLink, paymentLink) => `Hallo ${name},\n\nDu hast dich bei Solvia angemeldet, aber die Anerkennungsanalyse noch nicht abgeschlossen.\n\nDie Analyse dauert nur 2 Minuten und gibt dir einen personalisierten Fahrplan für deine Karriere — einschließlich Dokumente, Sprachanforderungen und geschätzter Zeitrahmen.\n\nAnalyse abschließen: ${wizardLink}\n\nWeißt du schon, was du brauchst? Starte deine Anerkennung ab €39: ${paymentLink}\n\nBei Fragen antworte einfach auf diese E-Mail.\n\nBeste Grüße,\nDavid`,
  },
  fr: {
    subject: (name) => `${name}, ton plan d'homologation t'attend`,
    body: (name, wizardLink, paymentLink) => `Salut ${name},\n\nTu t'es inscrit(e) sur Solvia mais tu n'as pas encore complété l'analyse d'homologation.\n\nL'analyse prend seulement 2 minutes et te donne une feuille de route personnalisée — documents nécessaires, exigences linguistiques et délai estimé.\n\nComplète ton analyse : ${wizardLink}\n\nTu sais déjà ce qu'il te faut ? Commence ton homologation à partir de €39 : ${paymentLink}\n\nSi tu as des questions, réponds simplement à cet email.\n\nCordialement,\nDavid`,
  },
  ru: {
    subject: (name) => `${name}, твой план гомологации ждёт`,
    body: (name, wizardLink, paymentLink) => `Привет ${name},\n\nТы зарегистрировался на Solvia, но ещё не прошёл анализ гомологации.\n\nАнализ занимает всего 2 минуты и даёт персонализированный план — необходимые документы, языковые требования и примерные сроки.\n\nПройди анализ: ${wizardLink}\n\nУже знаешь, что нужно? Начни гомологацию от €39: ${paymentLink}\n\nЕсли есть вопросы, просто ответь на это письмо.\n\nС уважением,\nDavid`,
  },
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: profiles, error: profileError } = await supabase
      .from("professional_profiles")
      .select("id, first_name, email, profession, specialty, about, location, target_country, created_at, preferred_language")
      .lt("created_at", threeDaysAgo.toISOString());

    if (profileError) throw profileError;

    const results = { sent: 0, skipped: 0, errors: 0, profileEmails: 0, wizardEmails: 0 };

    for (const profile of profiles || []) {
      if (!profile.email) {
        results.skipped++;
        continue;
      }

      // Determine what type of re-engagement is needed
      const isProfileIncomplete = !profile.about || !profile.location || !profile.specialty;
      const isWizardIncomplete = !profile.target_country;
      
      if (!isProfileIncomplete && !isWizardIncomplete) {
        results.skipped++;
        continue;
      }

      // Determine which template to use (prioritize wizard completion over profile)
      const templateId = isWizardIncomplete ? 'reengagement-wizard-incomplete' : 'reengagement-incomplete-profile';

      // Check deduplication
      const { data: existingSend } = await supabase
        .from("email_sends")
        .select("id")
        .eq("email", profile.email)
        .eq("template_id", templateId)
        .limit(1);

      if (existingSend && existingSend.length > 0) {
        results.skipped++;
        continue;
      }

      // Determine language from profile preferred_language or auth metadata
      let lang: Language = 'en';
      if (profile.preferred_language && ['en', 'es', 'de', 'fr', 'ru'].includes(profile.preferred_language)) {
        lang = profile.preferred_language as Language;
      } else {
        const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
        const metaLang = userData?.user?.user_metadata?.preferred_language;
        if (metaLang && ['en', 'es', 'de', 'fr', 'ru'].includes(metaLang)) {
          lang = metaLang as Language;
        }
      }

      const name = profile.first_name || 'there';
      const dashboardLink = `${baseUrl}/dashboard/professional`;
      const wizardLink = `${baseUrl}/homologation-wizard?utm_source=reengagement`;
      const paymentLink = `${baseUrl}/homologation-payment?utm_source=reengagement`;

      let subject: string;
      let bodyText: string;

      if (isWizardIncomplete) {
        const tmpl = wizardTemplates[lang];
        subject = tmpl.subject(name);
        bodyText = tmpl.body(name, wizardLink, paymentLink);
        results.wizardEmails++;
      } else {
        const tmpl = profileTemplates[lang];
        subject = tmpl.subject(name);
        bodyText = tmpl.body(name, dashboardLink);
        results.profileEmails++;
      }

      try {
        const emailResult = await resend.emails.send({
          from: "David <david.rehrl@thesolvia.com>",
          reply_to: "David.rehrl@thesolvia.com",
          to: [profile.email],
          subject,
          text: bodyText,
        });

        await supabase.from("email_sends").insert({
          email: profile.email,
          template_id: templateId,
          language: lang,
          status: "sent",
          lead_id: null,
          source_table: "professional_profiles",
          resend_email_id: emailResult?.data?.id || null,
        });

        // Create in-app notification
        const notifMessages: Record<Language, { title: string; message: string }> = {
          en: isWizardIncomplete 
            ? { title: 'Complete your assessment', message: 'Get your personalized homologation roadmap in 2 minutes.' }
            : { title: 'Complete your profile', message: 'A complete profile helps hospitals find you.' },
          es: isWizardIncomplete
            ? { title: 'Completa tu análisis', message: 'Obtén tu hoja de ruta personalizada en 2 minutos.' }
            : { title: 'Completa tu perfil', message: 'Un perfil completo te ayuda a destacar.' },
          de: isWizardIncomplete
            ? { title: 'Analyse abschließen', message: 'Erhalte deinen personalisierten Fahrplan in 2 Minuten.' }
            : { title: 'Profil vervollständigen', message: 'Ein vollständiges Profil hilft Krankenhäusern, dich zu finden.' },
          fr: isWizardIncomplete
            ? { title: 'Complète ton analyse', message: 'Obtiens ta feuille de route en 2 minutes.' }
            : { title: 'Complète ton profil', message: 'Un profil complet aide les hôpitaux à te trouver.' },
          ru: isWizardIncomplete
            ? { title: 'Пройди анализ', message: 'Получи персональный план за 2 минуты.' }
            : { title: 'Заполни профиль', message: 'Полный профиль помогает больницам найти тебя.' },
        };

        const notif = notifMessages[lang];
        await supabase.from("notifications").insert({
          user_id: profile.id,
          type: "tip",
          title: notif.title,
          message: notif.message,
          link: isWizardIncomplete ? "/homologation-wizard" : "/dashboard/professional",
        });

        results.sent++;
      } catch (emailError) {
        console.error("Error sending email to", profile.email, emailError);
        results.errors++;
      }
    }

    console.log("Re-engagement results:", results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-reengagement-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
