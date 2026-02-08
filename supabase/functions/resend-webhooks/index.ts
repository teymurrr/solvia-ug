import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("🔍 [RESEND-WEBHOOK] Webhook received");

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const webhookSecret = Deno.env.get("RESEND_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("❌ [RESEND-WEBHOOK] Missing RESEND_WEBHOOK_SECRET");
      return new Response(
        JSON.stringify({ error: "Missing webhook secret configuration" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get raw body for signature verification
    const body = await req.text();

    // Extract Svix headers for signature verification
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("❌ [RESEND-WEBHOOK] Missing Svix headers");
      return new Response(JSON.stringify({ error: "Missing Svix headers" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify webhook signature
    let event;
    try {
      event = await resend.webhooks.verify({
        body,
        signature: svixSignature,
      });
      console.log("✅ [RESEND-WEBHOOK] Signature verified:", event.type);
    } catch (error) {
      console.error("❌ [RESEND-WEBHOOK] Signature verification failed:", error);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Process different event types
    const emailId = event.data?.email_id;

    if (!emailId) {
      console.warn("⚠️ [RESEND-WEBHOOK] No email_id in event data");
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (event.type) {
      case "email.opened": {
        console.log("📧 [RESEND-WEBHOOK] Email opened:", emailId);
        const { error } = await supabaseClient
          .from("email_sends")
          .update({ opened_at: new Date().toISOString() })
          .eq("resend_email_id", emailId);

        if (error) {
          console.error(
            "❌ [RESEND-WEBHOOK] Failed to update opened_at:",
            error
          );
        } else {
          console.log("✅ [RESEND-WEBHOOK] opened_at updated for:", emailId);
        }
        break;
      }

      case "email.clicked": {
        console.log("🔗 [RESEND-WEBHOOK] Email clicked:", emailId);
        const { error } = await supabaseClient
          .from("email_sends")
          .update({ clicked_at: new Date().toISOString() })
          .eq("resend_email_id", emailId);

        if (error) {
          console.error(
            "❌ [RESEND-WEBHOOK] Failed to update clicked_at:",
            error
          );
        } else {
          console.log("✅ [RESEND-WEBHOOK] clicked_at updated for:", emailId);
        }
        break;
      }

      case "email.bounced": {
        console.log("❌ [RESEND-WEBHOOK] Email bounced:", emailId);
        const bounceReason = event.data?.bounce_reason || "unknown";
        const { error } = await supabaseClient
          .from("email_sends")
          .update({
            bounced_at: new Date().toISOString(),
            metadata: {
              bounce_reason: bounceReason,
            },
          })
          .eq("resend_email_id", emailId);

        if (error) {
          console.error(
            "❌ [RESEND-WEBHOOK] Failed to update bounced_at:",
            error
          );
        } else {
          console.log(
            "✅ [RESEND-WEBHOOK] bounced_at updated for:",
            emailId,
            "Reason:",
            bounceReason
          );
        }
        break;
      }

      case "email.complained": {
        console.log("⚠️ [RESEND-WEBHOOK] Email complaint:", emailId);
        // Get existing metadata to preserve it
        const { data: existing } = await supabaseClient
          .from("email_sends")
          .select("metadata")
          .eq("resend_email_id", emailId)
          .single();

        const currentMetadata = existing?.metadata || {};

        const { error } = await supabaseClient
          .from("email_sends")
          .update({
            metadata: {
              ...currentMetadata,
              complained: true,
              complaint_reason: event.data?.reason || "unknown",
            },
          })
          .eq("resend_email_id", emailId);

        if (error) {
          console.error(
            "❌ [RESEND-WEBHOOK] Failed to update complaint metadata:",
            error
          );
        } else {
          console.log("✅ [RESEND-WEBHOOK] Complaint recorded for:", emailId);
        }
        break;
      }

      case "email.delivered": {
        console.log("✅ [RESEND-WEBHOOK] Email delivered:", emailId);
        // Update status to delivered if needed
        const { error } = await supabaseClient
          .from("email_sends")
          .update({ status: "delivered" })
          .eq("resend_email_id", emailId);

        if (error) {
          console.error(
            "❌ [RESEND-WEBHOOK] Failed to update delivery status:",
            error
          );
        } else {
          console.log("✅ [RESEND-WEBHOOK] Status updated to delivered:", emailId);
        }
        break;
      }

      default:
        console.log("ℹ️ [RESEND-WEBHOOK] Unhandled event type:", event.type);
    }

    // Always return 200 for valid signatures to prevent Resend retries
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ [RESEND-WEBHOOK] Unexpected error:", error);
    // Return 200 to acknowledge receipt (don't retry)
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
