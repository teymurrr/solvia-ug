import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LANGUAGE_NAMES: Record<string, string> = {
  de: "German",
  es: "Spanish",
  fr: "French",
  ru: "Russian",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language, dry_run, limit } = await req.json();

    if (!language || !LANGUAGE_NAMES[language]) {
      return new Response(
        JSON.stringify({ error: "Invalid language. Use: de, es, fr, ru" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch affected posts: non-English, no post_group_id, content has English markers
    const { data: posts, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, title, content, excerpt, meta_title, meta_description, language")
      .eq("language", language)
      .is("post_group_id", null)
      .order("created_at", { ascending: true });

    if (fetchError) throw new Error(`Fetch error: ${fetchError.message}`);

    // Filter to posts with English content
    const englishMarkers = ["Key Takeaways", "Table of Contents", "What is", "How to", "Why ", "FAQ", "Conclusion", "Introduction"];
    let affectedPosts = (posts || []).filter((p) =>
      englishMarkers.some((marker) => p.content.includes(marker))
    );

    // Apply limit if specified
    const maxPosts = limit ? Math.min(limit, affectedPosts.length) : affectedPosts.length;
    affectedPosts = affectedPosts.slice(0, maxPosts);

    if (dry_run) {
      return new Response(
        JSON.stringify({
          language,
          total_found: posts?.length || 0,
          affected: affectedPosts.length,
          titles: affectedPosts.map((p) => p.title),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetName = LANGUAGE_NAMES[language];
    const results: { id: string; title: string; status: string }[] = [];

    for (const post of affectedPosts) {
      try {
        // Translate content
        const contentPrompt = `Translate the following HTML content to ${targetName}. 
CRITICAL RULES:
- Preserve ALL HTML tags, attributes, class names, inline styles, and structure exactly as they are
- Only translate the visible text content between tags
- Do NOT translate URLs, email addresses, or code
- Do NOT add or remove any HTML tags
- Keep the same formatting and structure
- Return ONLY the translated HTML, nothing else

HTML content to translate:
${post.content}`;

        const contentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are a professional medical content translator. Translate HTML content to ${targetName} while preserving all HTML structure perfectly. Return only the translated HTML.`,
              },
              { role: "user", content: contentPrompt },
            ],
            temperature: 0.1,
          }),
        });

        if (!contentResponse.ok) {
          const errText = await contentResponse.text();
          console.error(`AI error for post ${post.id}:`, errText);
          results.push({ id: post.id, title: post.title, status: `error: ${contentResponse.status}` });
          continue;
        }

        const contentData = await contentResponse.json();
        let translatedContent = contentData.choices?.[0]?.message?.content || "";
        // Strip markdown code fences if present
        translatedContent = translatedContent
          .replace(/^```(?:html)?\s*\n?/i, "")
          .replace(/\n?```\s*$/i, "")
          .trim();

        if (!translatedContent || translatedContent.length < 100) {
          results.push({ id: post.id, title: post.title, status: "error: empty translation" });
          continue;
        }

        // Translate excerpt, meta_title, meta_description in one call
        const metaPrompt = `Translate these texts to ${targetName}. Return a JSON object with keys "excerpt", "meta_title", "meta_description" containing the translations. Only return valid JSON.

excerpt: ${JSON.stringify(post.excerpt)}
meta_title: ${JSON.stringify(post.meta_title || "")}
meta_description: ${JSON.stringify(post.meta_description || "")}`;

        const metaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: `Translate to ${targetName}. Return only valid JSON.` },
              { role: "user", content: metaPrompt },
            ],
            temperature: 0.1,
          }),
        });

        let metaTranslations = { excerpt: post.excerpt, meta_title: post.meta_title, meta_description: post.meta_description };
        if (metaResponse.ok) {
          const metaData = await metaResponse.json();
          let metaContent = metaData.choices?.[0]?.message?.content || "{}";
          metaContent = metaContent.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
          try {
            const parsed = JSON.parse(metaContent);
            metaTranslations = { ...metaTranslations, ...parsed };
          } catch { /* keep originals */ }
        }

        // Update the post
        const updateData: Record<string, string> = { content: translatedContent };
        if (metaTranslations.excerpt) updateData.excerpt = metaTranslations.excerpt;
        if (metaTranslations.meta_title) updateData.meta_title = metaTranslations.meta_title;
        if (metaTranslations.meta_description) updateData.meta_description = metaTranslations.meta_description;

        const { error: updateError } = await supabase
          .from("blog_posts")
          .update(updateData)
          .eq("id", post.id);

        if (updateError) {
          results.push({ id: post.id, title: post.title, status: `update error: ${updateError.message}` });
        } else {
          results.push({ id: post.id, title: post.title, status: "translated" });
        }

        // Small delay between posts to avoid rate limits
        await new Promise((r) => setTimeout(r, 2000));
      } catch (err) {
        results.push({ id: post.id, title: post.title, status: `exception: ${err.message}` });
      }
    }

    return new Response(
      JSON.stringify({ language, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
