import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("🔍 [STRIPE-WEBHOOK] Webhook received");

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "No signature provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret || "");
    } catch (error) {
      console.error("❌ [STRIPE-WEBHOOK] Signature verification failed:", error);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ [STRIPE-WEBHOOK] Event verified:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("💳 [STRIPE-WEBHOOK] Checkout completed:", session.id);

        // Update payment record
        const { data: payment, error: fetchError } = await supabaseClient
          .from("payments")
          .select("*")
          .eq("stripe_session_id", session.id)
          .single();

        if (fetchError) {
          console.error("❌ [STRIPE-WEBHOOK] Could not find payment:", fetchError);
          break;
        }

        const { error: updateError } = await supabaseClient
          .from("payments")
          .update({
            status: session.payment_status === "paid" ? "completed" : "failed",
            stripe_customer_id: session.customer as string,
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id);

        if (updateError) {
          console.error("❌ [STRIPE-WEBHOOK] Failed to update payment:", updateError);
          break;
        }

        console.log("✅ [STRIPE-WEBHOOK] Payment updated:", payment.id);

        // Deliver starter kit if applicable
        if (payment.product_type === 'german_starter_kit' && session.payment_status === 'paid') {
          const customerEmail = session.customer_email || (payment.metadata as any)?.customerEmail;
          const locale = (payment.metadata as any)?.locale || 'en';
          if (customerEmail) {
            try {
              const deliverUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/deliver-starter-kit`;
              await fetch(deliverUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
                },
                body: JSON.stringify({ email: customerEmail, language: locale }),
              });
              console.log("📦 [STRIPE-WEBHOOK] Starter kit delivery triggered for:", customerEmail);
            } catch (deliverError) {
              console.error("❌ [STRIPE-WEBHOOK] Failed to deliver starter kit:", deliverError);
            }
          }
        }

        // Increment discount code usage if applicable
        if (payment.discount_code && session.payment_status === "paid") {
          const { data: discountData } = await supabaseClient
            .from("discount_codes")
            .select("used_count")
            .eq("code", payment.discount_code)
            .single();

          if (discountData) {
            await supabaseClient
              .from("discount_codes")
              .update({
                used_count: (discountData.used_count || 0) + 1,
                updated_at: new Date().toISOString(),
              })
              .eq("code", payment.discount_code);

            console.log("🎫 [STRIPE-WEBHOOK] Discount usage incremented");
          }
        }

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("💸 [STRIPE-WEBHOOK] Charge refunded:", charge.id);

        // Find and update payment record
        const { data: payments } = await supabaseClient
          .from("payments")
          .select("*")
          .eq("stripe_customer_id", charge.customer as string);

        if (payments && payments.length > 0) {
          for (const payment of payments) {
            const { error } = await supabaseClient
              .from("payments")
              .update({
                status: "refunded",
                updated_at: new Date().toISOString(),
              })
              .eq("id", payment.id);

            if (!error) {
              console.log("✅ [STRIPE-WEBHOOK] Payment refund recorded:", payment.id);
            }
          }
        }
        break;
      }

      default:
        console.log("ℹ️ [STRIPE-WEBHOOK] Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ [STRIPE-WEBHOOK] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
