import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TranslationItem {
  id: string;
  type: "post_title" | "post_content" | "reply_content";
  text: string;
}

interface TranslationResult {
  id: string;
  type: string;
  translated_text: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
  ru: "Russian",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, target_language } = (await req.json()) as {
      items: TranslationItem[];
      target_language: string;
    };

    if (!items?.length || !target_language) {
      return new Response(JSON.stringify({ translations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache for existing translations
    const lookups = items.map((item) => ({
      source_id: item.id,
      source_type: item.type,
    }));

    const { data: cached } = await supabase
      .from("community_translations")
      .select("source_id, source_type, translated_text")
      .eq("language", target_language)
      .in(
        "source_id",
        items.map((i) => i.id)
      );

    const cachedMap = new Map(
      (cached || []).map((c: any) => [`${c.source_type}:${c.source_id}`, c.translated_text])
    );

    const results: TranslationResult[] = [];
    const uncached: TranslationItem[] = [];

    for (const item of items) {
      const key = `${item.type}:${item.id}`;
      const existing = cachedMap.get(key);
      if (existing !== undefined) {
        results.push({ id: item.id, type: item.type, translated_text: existing });
      } else {
        uncached.push(item);
      }
    }

    // Translate uncached items via Lovable AI
    if (uncached.length > 0) {
      const targetName = LANGUAGE_NAMES[target_language] || target_language;

      const prompt = `Translate the following texts to ${targetName}. Each item has an id, type, and text. Return a JSON array with objects containing "id", "type", and "translated_text" for each item. If a text is already in ${targetName}, return it unchanged. Only return the JSON array, nothing else.

Items to translate:
${JSON.stringify(uncached.map((u) => ({ id: u.id, type: u.type, text: u.text })))}`;

      const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!lovableApiKey) {
        throw new Error("LOVABLE_API_KEY not configured");
      }

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content:
                "You are a professional translator for a medical professionals community platform. Translate accurately and naturally. Return only valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error("AI API error:", errText);
        throw new Error(`AI translation failed: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      let translatedContent = aiData.choices?.[0]?.message?.content || "[]";

      // Strip markdown code fences if present
      translatedContent = translatedContent
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();

      let translations: TranslationResult[] = [];
      try {
        translations = JSON.parse(translatedContent);
      } catch (e) {
        console.error("Failed to parse AI response:", translatedContent);
        // Return originals as fallback
        translations = uncached.map((u) => ({
          id: u.id,
          type: u.type,
          translated_text: u.text,
        }));
      }

      // Cache translations
      const toInsert = translations.map((t) => ({
        source_id: t.id,
        source_type: t.type,
        language: target_language,
        translated_text: t.translated_text,
      }));

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("community_translations")
          .upsert(toInsert, { onConflict: "source_type,source_id,language" });

        if (insertError) {
          console.error("Cache insert error:", insertError);
        }
      }

      results.push(...translations);
    }

    return new Response(JSON.stringify({ translations: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: error.message, translations: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
