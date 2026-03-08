import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { generateEmail, type Language } from "../_shared/email-template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = 'https://solvia-flexkapg.lovable.app';

const reminderContent: Record<Language, {
  subject48h: string;
  subject7d: string;
  greeting: string;
  body48h: string;
  body7d: string;
}> = {
  en: {
    subject48h: "Don't forget to upload your documents 📄",
    subject7d: "Your homologation documents are still pending ⏳",
    greeting: "Hi there,",
    body48h: `You recently started your homologation journey with Solvia — great choice!\n\nTo keep things moving, please upload your documents so our team can begin reviewing them. The sooner we have your files, the faster we can get started.\n\nHead to your dashboard to upload: ${APP_URL}/dashboard`,
    body7d: `We noticed your documents are still pending. Don't worry — we're here to help!\n\nIf you're unsure which documents to upload or how to get them, our team is happy to guide you. Just reply to this email or book a quick call.\n\nUpload your documents here: ${APP_URL}/dashboard`,
  },
  es: {
    subject48h: "No olvides subir tus documentos 📄",
    subject7d: "Tus documentos de homologación siguen pendientes ⏳",
    greeting: "¡Hola!",
    body48h: `Recientemente comenzaste tu proceso de homologación con Solvia — ¡gran decisión!\n\nPara avanzar, sube tus documentos para que nuestro equipo pueda revisarlos. Cuanto antes los tengamos, más rápido podremos empezar.\n\nAccede a tu panel para subirlos: ${APP_URL}/dashboard`,
    body7d: `Hemos visto que tus documentos siguen pendientes. ¡No te preocupes, estamos aquí para ayudarte!\n\nSi no estás seguro de qué documentos subir o cómo obtenerlos, nuestro equipo estará encantado de guiarte. Responde a este email o reserva una llamada rápida.\n\nSube tus documentos aquí: ${APP_URL}/dashboard`,
  },
  de: {
    subject48h: "Vergiss nicht, deine Dokumente hochzuladen 📄",
    subject7d: "Deine Homologationsdokumente stehen noch aus ⏳",
    greeting: "Hallo,",
    body48h: `Du hast kürzlich deinen Homologationsprozess mit Solvia gestartet — tolle Entscheidung!\n\nUm voranzukommen, lade bitte deine Dokumente hoch, damit unser Team mit der Prüfung beginnen kann.\n\nGehe zu deinem Dashboard: ${APP_URL}/dashboard`,
    body7d: `Wir haben festgestellt, dass deine Dokumente noch ausstehen. Keine Sorge — wir helfen dir gerne!\n\nWenn du unsicher bist, welche Dokumente du brauchst, kontaktiere uns einfach.\n\nLade deine Dokumente hier hoch: ${APP_URL}/dashboard`,
  },
  fr: {
    subject48h: "N'oubliez pas de télécharger vos documents 📄",
    subject7d: "Vos documents d'homologation sont toujours en attente ⏳",
    greeting: "Bonjour,",
    body48h: `Vous avez récemment commencé votre parcours d'homologation avec Solvia — excellent choix !\n\nPour avancer, veuillez télécharger vos documents pour que notre équipe puisse les examiner.\n\nAccédez à votre tableau de bord : ${APP_URL}/dashboard`,
    body7d: `Nous avons remarqué que vos documents sont toujours en attente. Pas d'inquiétude — nous sommes là pour vous aider !\n\nContactez-nous si vous avez des questions.\n\nTéléchargez vos documents ici : ${APP_URL}/dashboard`,
  },
  ru: {
    subject48h: "Не забудьте загрузить документы 📄",
    subject7d: "Ваши документы для гомологации всё ещё ожидают ⏳",
    greeting: "Здравствуйте,",
    body48h: `Вы недавно начали процесс гомологации с Solvia — отличный выбор!\n\nЧтобы продвигаться дальше, загрузите свои документы для проверки нашей командой.\n\nПерейдите в личный кабинет: ${APP_URL}/dashboard`,
    body7d: `Мы заметили, что ваши документы всё ещё ожидают загрузки. Не переживайте — мы готовы помочь!\n\nСвяжитесь с нами, если у вас есть вопросы.\n\nЗагрузите документы здесь: ${APP_URL}/dashboard`,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const now = new Date();
    const hours48Ago = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const days7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Get all completed homologation payments
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('id, user_id, metadata, target_country, product_type, created_at')
      .eq('status', 'completed')
      .in('product_type', ['digital_starter', 'complete', 'personal_mentorship'])
      .lte('created_at', hours48Ago);

    if (paymentsError) throw paymentsError;
    if (!payments || payments.length === 0) {
      console.log("ℹ️ [DOC-REMINDER] No eligible payments found");
      return new Response(JSON.stringify({ sent: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let sentCount = 0;

    for (const payment of payments) {
      const email = (payment.metadata as any)?.customerEmail;
      if (!email) continue;

      const lang: Language = ((payment.metadata as any)?.locale || 'en') as Language;

      // Check if client has any uploaded documents
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', payment.user_id)
        .single();

      if (client) {
        const { data: docs } = await supabase
          .from('client_documents')
          .select('id')
          .eq('client_id', client.id)
          .neq('status', 'not_submitted')
          .limit(1);

        if (docs && docs.length > 0) continue; // Has uploaded docs, skip
      }

      // Determine reminder tier
      const paymentDate = new Date(payment.created_at);
      const hoursSincePayment = (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60);
      const is7DayReminder = hoursSincePayment >= 7 * 24;
      const templateId = is7DayReminder ? 'doc-reminder-7d' : 'doc-reminder-48h';

      // Check if already sent this reminder
      const { data: existing } = await supabase
        .from('email_sends')
        .select('id')
        .eq('email', email)
        .eq('template_id', templateId)
        .limit(1);

      if (existing && existing.length > 0) continue;

      // For 48h, also skip if 7d was already sent
      if (!is7DayReminder) {
        const { data: laterSent } = await supabase
          .from('email_sends')
          .select('id')
          .eq('email', email)
          .eq('template_id', 'doc-reminder-7d')
          .limit(1);
        if (laterSent && laterSent.length > 0) continue;
      }

      const content = reminderContent[lang] || reminderContent.en;
      const subject = is7DayReminder ? content.subject7d : content.subject48h;
      const body = is7DayReminder ? content.body7d : content.body48h;

      const html = generateEmail(content.greeting, body, lang);

      await resend.emails.send({
        from: "Solvia <team@thesolvia.com>",
        to: [email],
        subject,
        html,
      });

      await supabase.from('email_sends').insert({
        email,
        template_id: templateId,
        language: lang,
        status: 'sent',
        metadata: { paymentId: payment.id },
      });

      sentCount++;
      console.log(`✅ [DOC-REMINDER] Sent ${templateId} to ${email}`);
    }

    console.log(`📧 [DOC-REMINDER] Total sent: ${sentCount}`);
    return new Response(JSON.stringify({ sent: sentCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ [DOC-REMINDER] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
