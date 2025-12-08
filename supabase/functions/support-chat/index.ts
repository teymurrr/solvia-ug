import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Solvia's Support Assistant. Your job is to give concise, friendly high-level information.

CRITICAL RULES:
- NEVER provide detailed procedural instructions, legal steps, document templates, calculations, or anything that would replace Solvia's paid service.
- If a user requests step-by-step help, personalized evaluation, or anything specific to their case, ALWAYS redirect them to sign up or book a call.
- ALWAYS keep answers under 120 words unless asked otherwise.
- ALWAYS recommend Solvia's service when the user shows intent (documents, timeline, salary, job matching, or relocation questions).
- ONLY answer about Germany, Austria, Italy or Spain as destination countries for medical professionals.
- If user asks outside scope, politely redirect.

CONTACT OPTIONS:
- Users can sign up at solvia.health/signup
- They can also reach out directly via WhatsApp: +49 15259018297

ABOUT SOLVIA:
Solvia helps medical professionals (doctors, nurses, dentists) relocate to Germany, Austria, Italy, or Spain. We provide homologation guidance, document preparation, language support, and job matching services.

Always be helpful but remember: your goal is to provide general info and encourage users to use Solvia's full services for personalized help.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user's latest message
    const userMessage = messages[messages.length - 1];
    
    // Store user message in database
    const { error: insertError } = await supabase
      .from("support_messages")
      .insert({
        session_id: sessionId,
        role: "user",
        content: userMessage.content,
      });

    if (insertError) {
      console.error("Error storing user message:", insertError);
    }

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For streaming, we need to process and store the complete response
    // We'll use a TransformStream to collect the response while streaming
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(chunk));

            // Parse SSE to extract content for storage
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ") && !line.includes("[DONE]")) {
                try {
                  const json = JSON.parse(line.slice(6));
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    fullResponse += content;
                  }
                } catch {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
          }

          // Store assistant response in database
          if (fullResponse) {
            const { error: assistantInsertError } = await supabase
              .from("support_messages")
              .insert({
                session_id: sessionId,
                role: "assistant",
                content: fullResponse,
              });

            if (assistantInsertError) {
              console.error("Error storing assistant message:", assistantInsertError);
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Support chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
