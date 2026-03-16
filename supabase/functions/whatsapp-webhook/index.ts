import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const WHATSAPP_API = "https://graph.facebook.com/v21.0";

// ── Flow definition ─────────────────────────────────────────────────────
interface Step {
  message: string;
  type: "buttons" | "list" | "text";
  options?: { id: string; title: string }[];
  field: string; // key in responses jsonb
  nextStep: string;
}

const FLOW: Record<string, Step> = {
  welcome: {
    message:
      "Hello! 👋 Welcome to *Solvia*. We help healthcare professionals relocate to Europe, especially Germany & Spain.\n\nMay I know your profession and qualification?",
    type: "buttons",
    options: [
      { id: "doctor", title: "Doctor" },
      { id: "nurse", title: "Nurse" },
      { id: "other", title: "Other" },
    ],
    field: "profession",
    nextStep: "experience",
  },
  experience: {
    message: "How many years of clinical experience do you have?",
    type: "list",
    options: [
      { id: "internship", title: "Internship only" },
      { id: "1-2", title: "1–2 years" },
      { id: "3-5", title: "3–5 years" },
      { id: "5+", title: "More than 5 years" },
    ],
    field: "experience",
    nextStep: "language_level",
  },
  language_level: {
    message: "What is your current local language level?",
    type: "list",
    options: [
      { id: "not_started", title: "Not started" },
      { id: "a1_a2", title: "A1 / A2" },
      { id: "b1_b2", title: "B1 / B2" },
      { id: "fsp_prep", title: "Preparing for FSP" },
    ],
    field: "language_level",
    nextStep: "country",
  },
  country: {
    message: "Which country are you most interested in working in?",
    type: "list",
    options: [
      { id: "germany", title: "Germany" },
      { id: "austria", title: "Austria" },
      { id: "spain", title: "Spain" },
      { id: "open", title: "Open to suggestions" },
    ],
    field: "target_country",
    nextStep: "timeline",
  },
  timeline: {
    message: "When do you plan to relocate?",
    type: "list",
    options: [
      { id: "6months", title: "Within 6 months" },
      { id: "6-12months", title: "6–12 months" },
      { id: "1-2years", title: "1–2 years" },
      { id: "exploring", title: "Just exploring" },
    ],
    field: "timeline",
    nextStep: "budget_aware",
  },
  budget_aware: {
    message:
      "Are you aware of the typical relocation costs (language, documentation, exams)?",
    type: "buttons",
    options: [
      { id: "yes", title: "Yes" },
      { id: "no", title: "No" },
      { id: "need_info", title: "Need more info" },
    ],
    field: "budget_awareness",
    nextStep: "budget_comfort",
  },
  budget_comfort: {
    message: "Are you comfortable investing in the process?",
    type: "buttons",
    options: [
      { id: "yes", title: "Yes" },
      { id: "maybe", title: "Maybe" },
      { id: "need_details", title: "Need details" },
    ],
    field: "budget_comfort",
    nextStep: "city",
  },
  city: {
    message: "Which city are you currently based in? (Please type your answer)",
    type: "text",
    field: "city",
    nextStep: "services",
  },
  services: {
    message:
      "Would you like to know more about our services and relocation pathways?",
    type: "buttons",
    options: [
      { id: "yes", title: "Yes" },
      { id: "no", title: "No" },
    ],
    field: "services_interest",
    nextStep: "services_response",
  },
  // Virtual step — handled in logic
  services_response: {
    message: "",
    type: "text",
    field: "_",
    nextStep: "consultation",
  },
  consultation: {
    message:
      "Would you be interested in a one-to-one video consultation with our advisor?",
    type: "buttons",
    options: [
      { id: "yes", title: "Yes" },
      { id: "no", title: "No" },
    ],
    field: "consultation_interest",
    nextStep: "consultation_response",
  },
  consultation_response: {
    message: "",
    type: "text",
    field: "_",
    nextStep: "collect_name",
  },
  collect_name: {
    message: "Great! Please share your *full name*:",
    type: "text",
    field: "full_name",
    nextStep: "collect_email",
  },
  collect_email: {
    message: "What is your *email address*?",
    type: "text",
    field: "email",
    nextStep: "collect_phone",
  },
  collect_phone: {
    message: "What is the best *phone number* to reach you?",
    type: "text",
    field: "phone",
    nextStep: "contact_method",
  },
  contact_method: {
    message: "What is your preferred contact method?",
    type: "buttons",
    options: [
      { id: "call", title: "Call" },
      { id: "whatsapp", title: "WhatsApp" },
      { id: "email", title: "Email" },
    ],
    field: "preferred_contact",
    nextStep: "final",
  },
  final: {
    message:
      "Thank you for reaching out! 🙏\n\nOur team will review your information and get back to you soon.\n\nIn the meantime, visit our website for more info:\n🌐 https://solvia-flexkapg.lovable.app\n\n— *Team Solvia*",
    type: "text",
    field: "_",
    nextStep: "done",
  },
};

// ── WhatsApp API helpers ────────────────────────────────────────────────
async function sendTextMessage(
  phoneNumberId: string,
  token: string,
  to: string,
  text: string
) {
  await fetch(`${WHATSAPP_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
}

async function sendButtonMessage(
  phoneNumberId: string,
  token: string,
  to: string,
  body: string,
  buttons: { id: string; title: string }[]
) {
  await fetch(`${WHATSAPP_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: body },
        action: {
          buttons: buttons.map((b) => ({
            type: "reply",
            reply: { id: b.id, title: b.title },
          })),
        },
      },
    }),
  });
}

async function sendListMessage(
  phoneNumberId: string,
  token: string,
  to: string,
  body: string,
  items: { id: string; title: string }[]
) {
  await fetch(`${WHATSAPP_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: body },
        action: {
          button: "Select an option",
          sections: [{ title: "Options", rows: items }],
        },
      },
    }),
  });
}

async function sendStep(
  phoneNumberId: string,
  token: string,
  to: string,
  stepKey: string
) {
  const step = FLOW[stepKey];
  if (!step) return;

  if (step.type === "buttons" && step.options) {
    await sendButtonMessage(phoneNumberId, token, to, step.message, step.options);
  } else if (step.type === "list" && step.options) {
    await sendListMessage(phoneNumberId, token, to, step.message, step.options);
  } else {
    await sendTextMessage(phoneNumberId, token, to, step.message);
  }
}

// ── Extract user reply ──────────────────────────────────────────────────
function extractReply(message: any): string | null {
  if (message.interactive) {
    // Button reply
    if (message.interactive.button_reply) {
      return message.interactive.button_reply.id;
    }
    // List reply
    if (message.interactive.list_reply) {
      return message.interactive.list_reply.id;
    }
  }
  if (message.text?.body) {
    return message.text.body.trim();
  }
  return null;
}

// ── Main handler ────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const WHATSAPP_VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN");
  const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response("Missing configuration", { status: 500, headers: corsHeaders });
  }

  // ── GET: Webhook verification ──────────────────────────────────────
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
      console.log("Webhook verified");
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // ── POST: Incoming messages ────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const body = await req.json();

      // Meta sends various webhook types; only process messages
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (!value?.messages?.length) {
        // Status update or other non-message webhook — acknowledge
        return new Response("OK", { status: 200, headers: corsHeaders });
      }

      const message = value.messages[0];
      const from = message.from; // sender phone number
      const reply = extractReply(message);

      if (!reply) {
        return new Response("OK", { status: 200, headers: corsHeaders });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Get or create conversation
      let { data: convo } = await supabase
        .from("whatsapp_conversations")
        .select("*")
        .eq("phone_number", from)
        .maybeSingle();

      if (!convo) {
        // New conversation — send welcome and save
        const { data: newConvo } = await supabase
          .from("whatsapp_conversations")
          .insert({ phone_number: from, current_step: "welcome", responses: {} })
          .select()
          .single();
        convo = newConvo;

        await sendStep(WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, from, "welcome");
        return new Response("OK", { status: 200, headers: corsHeaders });
      }

      const currentStep = convo.current_step;
      const responses = convo.responses || {};

      // If conversation is done, restart on any new message
      if (currentStep === "done") {
        await supabase
          .from("whatsapp_conversations")
          .update({ current_step: "welcome", responses: {}, lead_id: null })
          .eq("id", convo.id);

        await sendStep(WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, from, "welcome");
        return new Response("OK", { status: 200, headers: corsHeaders });
      }

      const step = FLOW[currentStep];
      if (!step) {
        return new Response("OK", { status: 200, headers: corsHeaders });
      }

      // Save the response
      if (step.field !== "_") {
        responses[step.field] = reply;
      }

      // Determine next step with branching logic
      let nextStep = step.nextStep;

      // Handle services_response: if they said yes, send link then go to consultation
      if (currentStep === "services") {
        if (reply === "yes") {
          await sendTextMessage(
            WHATSAPP_PHONE_NUMBER_ID,
            WHATSAPP_ACCESS_TOKEN,
            from,
            "Here's everything you need to know about our relocation pathways:\n\n🌐 https://solvia-flexkapg.lovable.app/homologation\n\nTake your time to review it!"
          );
          nextStep = "consultation";
        } else {
          nextStep = "final";
        }
      }

      // Handle consultation response
      if (currentStep === "consultation") {
        if (reply === "yes") {
          nextStep = "collect_name";
        } else {
          nextStep = "final";
        }
      }

      // Update conversation state
      await supabase
        .from("whatsapp_conversations")
        .update({ current_step: nextStep, responses })
        .eq("id", convo.id);

      // If reaching final, create lead
      if (nextStep === "final" || nextStep === "done") {
        // Map language level
        const langMap: Record<string, string> = {
          not_started: "None",
          a1_a2: "A1-A2",
          b1_b2: "B1-B2",
          fsp_prep: "FSP Preparation",
        };

        const countryMap: Record<string, string> = {
          germany: "Germany",
          austria: "Austria",
          spain: "Spain",
          open: "",
        };

        const leadData: Record<string, any> = {
          email: responses.email || `wa-${from}@whatsapp.placeholder`,
          first_name: responses.full_name?.split(" ")[0] || "",
          last_name: responses.full_name?.split(" ").slice(1).join(" ") || "",
          doctor_type: responses.profession || "",
          language_level: langMap[responses.language_level] || responses.language_level || "",
          target_country: countryMap[responses.target_country] || responses.target_country || "",
          source: "whatsapp",
          status: "new",
          preferred_language: "en",
        };

        const { data: lead } = await supabase
          .from("leads")
          .insert(leadData)
          .select("id")
          .single();

        if (lead) {
          await supabase
            .from("whatsapp_conversations")
            .update({ lead_id: lead.id, current_step: "done" })
            .eq("id", convo.id);
        }
      }

      // Send the next step message
      if (nextStep !== "done" && nextStep !== "services_response" && nextStep !== "consultation_response") {
        await sendStep(WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, from, nextStep);
      }

      // If final step, also mark as done after sending
      if (nextStep === "final") {
        await sendStep(WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, from, "final");
        await supabase
          .from("whatsapp_conversations")
          .update({ current_step: "done" })
          .eq("id", convo.id);
      }

      return new Response("OK", { status: 200, headers: corsHeaders });
    } catch (error) {
      console.error("WhatsApp webhook error:", error);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
});
