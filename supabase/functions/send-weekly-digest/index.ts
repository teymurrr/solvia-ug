import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Language = "es" | "en" | "de" | "fr" | "ru";

interface DigestData {
  topPosts: { title: string; reply_count: number; category: string }[];
  journeyUpdates: { content: string; milestone_type: string; author: string }[];
  stats: { newPosts: number; newReplies: number; newMembers: number };
}

// =============================================================================
// I18N
// =============================================================================

const i18n: Record<Language, Record<string, string>> = {
  en: {
    subject: "Your Weekly Solvia Community Digest",
    greeting: "Hi",
    intro: "Here's what happened in the Solvia community this week:",
    topDiscussions: "🔥 Top Discussions",
    journeyMilestones: "🎉 Journey Milestones",
    communityStats: "📊 Community Stats",
    newPosts: "New discussions",
    newReplies: "New replies",
    newMembers: "New members",
    replies: "replies",
    viewCommunity: "Visit Community",
    noActivity: "It was a quiet week. Start a discussion!",
    unsubscribe: "Unsubscribe from digest",
    footer: "You're receiving this because you're a Solvia community member.",
  },
  es: {
    subject: "Tu Resumen Semanal de la Comunidad Solvia",
    greeting: "Hola",
    intro: "Esto es lo que pasó en la comunidad Solvia esta semana:",
    topDiscussions: "🔥 Discusiones Destacadas",
    journeyMilestones: "🎉 Hitos del Camino",
    communityStats: "📊 Estadísticas",
    newPosts: "Nuevas discusiones",
    newReplies: "Nuevas respuestas",
    newMembers: "Nuevos miembros",
    replies: "respuestas",
    viewCommunity: "Visitar Comunidad",
    noActivity: "Fue una semana tranquila. ¡Inicia una discusión!",
    unsubscribe: "Cancelar suscripción al resumen",
    footer: "Recibes esto porque eres miembro de la comunidad Solvia.",
  },
  de: {
    subject: "Dein wöchentlicher Solvia Community-Überblick",
    greeting: "Hallo",
    intro: "Das ist diese Woche in der Solvia-Community passiert:",
    topDiscussions: "🔥 Top-Diskussionen",
    journeyMilestones: "🎉 Meilensteine",
    communityStats: "📊 Community-Statistiken",
    newPosts: "Neue Diskussionen",
    newReplies: "Neue Antworten",
    newMembers: "Neue Mitglieder",
    replies: "Antworten",
    viewCommunity: "Community besuchen",
    noActivity: "Es war eine ruhige Woche. Starte eine Diskussion!",
    unsubscribe: "Digest abbestellen",
    footer: "Du erhältst dies, weil du Mitglied der Solvia-Community bist.",
  },
  fr: {
    subject: "Votre résumé hebdomadaire de la communauté Solvia",
    greeting: "Bonjour",
    intro: "Voici ce qui s'est passé dans la communauté Solvia cette semaine :",
    topDiscussions: "🔥 Discussions populaires",
    journeyMilestones: "🎉 Étapes du parcours",
    communityStats: "📊 Statistiques",
    newPosts: "Nouvelles discussions",
    newReplies: "Nouvelles réponses",
    newMembers: "Nouveaux membres",
    replies: "réponses",
    viewCommunity: "Visiter la communauté",
    noActivity: "C'était une semaine calme. Lancez une discussion !",
    unsubscribe: "Se désabonner du digest",
    footer: "Vous recevez ceci car vous êtes membre de la communauté Solvia.",
  },
  ru: {
    subject: "Еженедельный дайджест сообщества Solvia",
    greeting: "Привет",
    intro: "Вот что произошло в сообществе Solvia на этой неделе:",
    topDiscussions: "🔥 Топ-обсуждения",
    journeyMilestones: "🎉 Достижения",
    communityStats: "📊 Статистика",
    newPosts: "Новых обсуждений",
    newReplies: "Новых ответов",
    newMembers: "Новых участников",
    replies: "ответов",
    viewCommunity: "Перейти в сообщество",
    noActivity: "Неделя была спокойной. Начните обсуждение!",
    unsubscribe: "Отписаться от дайджеста",
    footer: "Вы получаете это письмо, потому что вы участник сообщества Solvia.",
  },
};

// =============================================================================
// HTML GENERATION
// =============================================================================

const generateDigestHtml = (
  lang: Language,
  firstName: string,
  data: DigestData,
  unsubscribeUrl: string
): string => {
  const t = i18n[lang];
  const hasActivity =
    data.topPosts.length > 0 || data.journeyUpdates.length > 0;

  const postsSection =
    data.topPosts.length > 0
      ? `<h2 style="font-size:18px;color:#1a1a1a;margin:24px 0 12px;">${t.topDiscussions}</h2>
        ${data.topPosts
          .map(
            (p) =>
              `<div style="padding:12px;border:1px solid #e5e5e5;border-radius:8px;margin-bottom:8px;">
              <strong style="color:#1a1a1a;">${p.title}</strong>
              <div style="font-size:13px;color:#666;margin-top:4px;">${p.reply_count} ${t.replies}</div>
            </div>`
          )
          .join("")}`
      : "";

  const journeySection =
    data.journeyUpdates.length > 0
      ? `<h2 style="font-size:18px;color:#1a1a1a;margin:24px 0 12px;">${t.journeyMilestones}</h2>
        ${data.journeyUpdates
          .map(
            (j) =>
              `<div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:8px;">
              <strong>${j.author}</strong>: ${j.content}
            </div>`
          )
          .join("")}`
      : "";

  const statsSection = `<h2 style="font-size:18px;color:#1a1a1a;margin:24px 0 12px;">${t.communityStats}</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 12px;background:#f0f9ff;border-radius:8px;text-align:center;width:33%;">
          <div style="font-size:24px;font-weight:bold;color:#0369a1;">${data.stats.newPosts}</div>
          <div style="font-size:12px;color:#666;">${t.newPosts}</div>
        </td>
        <td style="width:8px;"></td>
        <td style="padding:8px 12px;background:#f0fdf4;border-radius:8px;text-align:center;width:33%;">
          <div style="font-size:24px;font-weight:bold;color:#15803d;">${data.stats.newReplies}</div>
          <div style="font-size:12px;color:#666;">${t.newReplies}</div>
        </td>
        <td style="width:8px;"></td>
        <td style="padding:8px 12px;background:#fef3c7;border-radius:8px;text-align:center;width:33%;">
          <div style="font-size:24px;font-weight:bold;color:#a16207;">${data.stats.newMembers}</div>
          <div style="font-size:12px;color:#666;">${t.newMembers}</div>
        </td>
      </tr>
    </table>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;">
  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="font-size:22px;color:#1a1a1a;margin:0;">Solvia Community</h1>
  </div>
  
  <p>${t.greeting} ${firstName},</p>
  <p>${hasActivity ? t.intro : t.noActivity}</p>
  
  ${postsSection}
  ${journeySection}
  ${statsSection}
  
  <div style="text-align:center;margin:32px 0;">
    <a href="https://solvia-flexkapg.lovable.app/community" style="display:inline-block;padding:12px 24px;background:#0369a1;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">${t.viewCommunity}</a>
  </div>
  
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">
  <p style="font-size:12px;color:#999;text-align:center;">
    ${t.footer}<br>
    <a href="${unsubscribeUrl}" style="color:#999;">${t.unsubscribe}</a>
  </p>
</body>
</html>`;
};

// =============================================================================
// FETCH DIGEST DATA
// =============================================================================

const fetchDigestData = async (
  supabase: ReturnType<typeof createClient>,
  categories: string[]
): Promise<DigestData> => {
  const oneWeekAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Top posts this week
  const { data: topPosts } = await supabase
    .from("community_posts")
    .select("title, reply_count, category")
    .gte("created_at", oneWeekAgo)
    .in("category", categories)
    .order("reply_count", { ascending: false })
    .limit(5);

  // Journey updates this week
  const { data: journeyRaw } = await supabase
    .from("journey_updates")
    .select("content, milestone_type, user_id")
    .gte("created_at", oneWeekAgo)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get author names for journey updates
  const journeyUpdates: DigestData["journeyUpdates"] = [];
  if (journeyRaw && journeyRaw.length > 0) {
    const userIds = [...new Set(journeyRaw.map((j) => j.user_id))];
    const { data: profiles } = await supabase
      .from("professional_profiles")
      .select("id, first_name, last_name")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, `${p.first_name} ${p.last_name}`])
    );

    for (const j of journeyRaw) {
      journeyUpdates.push({
        content: j.content,
        milestone_type: j.milestone_type,
        author: profileMap.get(j.user_id) || "Community Member",
      });
    }
  }

  // Stats
  const { count: newPosts } = await supabase
    .from("community_posts")
    .select("id", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo);

  const { count: newReplies } = await supabase
    .from("community_replies")
    .select("id", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo);

  const { count: newMembers } = await supabase
    .from("professional_profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo);

  return {
    topPosts: topPosts || [],
    journeyUpdates,
    stats: {
      newPosts: newPosts || 0,
      newReplies: newReplies || 0,
      newMembers: newMembers || 0,
    },
  };
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

    const body = await req.json().catch(() => ({}));
    const { testMode = false, testEmail, language } = body;

    console.log(
      `[send-weekly-digest] Starting. testMode=${testMode}`
    );

    // Get all users with digest enabled
    const { data: prefs, error: prefsError } = await supabase
      .from("digest_preferences")
      .select("user_id, categories, frequency")
      .eq("enabled", true)
      .neq("frequency", "never");

    if (prefsError) throw prefsError;

    // Also include users without preferences (default: opted-in)
    const { data: allProfiles } = await supabase
      .from("professional_profiles")
      .select("id, first_name, email, preferred_language")
      .not("email", "is", null);

    const prefsMap = new Map(
      (prefs || []).map((p) => [p.user_id, p])
    );

    // Users who explicitly opted out
    const { data: optedOut } = await supabase
      .from("digest_preferences")
      .select("user_id")
      .or("enabled.eq.false,frequency.eq.never");

    const optedOutSet = new Set((optedOut || []).map((o) => o.user_id));

    // Build recipient list
    interface Recipient {
      userId: string;
      email: string;
      firstName: string;
      language: Language;
      categories: string[];
    }

    const recipients: Recipient[] = [];

    if (testMode && testEmail) {
      recipients.push({
        userId: "test",
        email: testEmail,
        firstName: "Test",
        language: (language as Language) || "en",
        categories: [
          "homologation",
          "language",
          "fsp",
          "life-abroad",
          "job-search",
          "journey",
        ],
      });
    } else {
      for (const profile of allProfiles || []) {
        if (optedOutSet.has(profile.id)) continue;
        if (!profile.email) continue;

        const pref = prefsMap.get(profile.id);
        const categories = pref?.categories || [
          "homologation",
          "language",
          "fsp",
          "life-abroad",
          "job-search",
          "journey",
        ];

        const lang = (profile.preferred_language as Language) || "en";

        recipients.push({
          userId: profile.id,
          email: profile.email,
          firstName: profile.first_name || "there",
          language: ["en", "es", "de", "fr", "ru"].includes(lang)
            ? lang
            : "en",
          categories,
        });
      }
    }

    console.log(
      `[send-weekly-digest] ${recipients.length} recipients to process`
    );

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No recipients" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const results = { sent: 0, failed: 0, errors: [] as string[] };

    // Fetch digest data once (with all categories)
    const allCategories = [
      "homologation",
      "language",
      "fsp",
      "life-abroad",
      "job-search",
    ];
    const digestData = await fetchDigestData(supabase, allCategories);

    const appUrl = "https://solvia-flexkapg.lovable.app";

    for (const recipient of recipients) {
      try {
        // Filter data by user's category preferences
        const filteredData: DigestData = {
          topPosts: digestData.topPosts.filter((p) =>
            recipient.categories.includes(p.category)
          ),
          journeyUpdates: recipient.categories.includes("journey")
            ? digestData.journeyUpdates
            : [],
          stats: digestData.stats,
        };

        const unsubscribeUrl = `${appUrl}/community?unsubscribe=${recipient.userId}`;
        const html = generateDigestHtml(
          recipient.language,
          recipient.firstName,
          filteredData,
          unsubscribeUrl
        );

        await resend.emails.send({
          from: "Solvia Community <community@thesolvia.com>",
          to: [recipient.email],
          subject: i18n[recipient.language].subject,
          html,
          reply_to: "David.rehrl@thesolvia.com",
        });

        if (!testMode) {
          await supabase.from("email_sends").insert({
            email: recipient.email.toLowerCase(),
            template_id: "weekly_digest",
            language: recipient.language,
            source_table: "digest_preferences",
            status: "sent",
          });
        }

        results.sent++;
        console.log(
          `[send-weekly-digest] Sent to ${recipient.email} (${recipient.language})`
        );
      } catch (err) {
        results.failed++;
        results.errors.push(
          `${recipient.email}: ${(err as Error).message}`
        );
        console.error(
          `[send-weekly-digest] Failed for ${recipient.email}:`,
          err
        );
      }
    }

    console.log(
      `[send-weekly-digest] Done. Sent: ${results.sent}, Failed: ${results.failed}`
    );

    return new Response(JSON.stringify({ success: true, ...results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("[send-weekly-digest] Error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
