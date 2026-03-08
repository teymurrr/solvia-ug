import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HOMOLOGATION_PRODUCTS = ['digital_starter', 'complete', 'personal_mentorship'];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
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

        // === AUTOMATION 1: Deliver starter kit if applicable ===
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

        // === AUTOMATION 2-5: Homologation post-payment automations ===
        if (HOMOLOGATION_PRODUCTS.includes(payment.product_type) && session.payment_status === 'paid') {
          const customerEmail = session.customer_email || (payment.metadata as any)?.customerEmail;
          const locale = (payment.metadata as any)?.locale || 'en';
          const targetCountry = payment.target_country || (payment.metadata as any)?.targetCountry || 'germany';
          const userId = payment.user_id;

          // --- 2. Auto-create client record ---
          if (userId) {
            try {
              // Check if client record already exists
              const { data: existingClient } = await supabaseAdmin
                .from('clients')
                .select('id')
                .eq('user_id', userId)
                .single();

              let clientId: string;

              if (!existingClient) {
                const { data: newClient, error: clientError } = await supabaseAdmin
                  .from('clients')
                  .insert({
                    user_id: userId,
                    email: customerEmail,
                    target_country: targetCountry,
                  })
                  .select('id')
                  .single();

                if (clientError) {
                  console.error("❌ [STRIPE-WEBHOOK] Failed to create client:", clientError);
                } else {
                  clientId = newClient.id;
                  console.log("✅ [STRIPE-WEBHOOK] Client record created:", clientId);
                }
              } else {
                clientId = existingClient.id;
                console.log("ℹ️ [STRIPE-WEBHOOK] Client already exists:", clientId);
              }

              // --- 3. Auto-generate document checklist ---
              if (clientId!) {
                try {
                  const { data: requirements } = await supabaseAdmin
                    .from('document_requirements')
                    .select('id, document_name_en, document_name_es, document_name_de, document_name_fr, document_name_ru')
                    .eq('country', targetCountry.toLowerCase());

                  if (requirements && requirements.length > 0) {
                    // Check existing docs to avoid duplicates
                    const { data: existingDocs } = await supabaseAdmin
                      .from('client_documents')
                      .select('requirement_id')
                      .eq('client_id', clientId!);

                    const existingReqIds = new Set((existingDocs || []).map(d => d.requirement_id));

                    const newDocs = requirements
                      .filter(r => !existingReqIds.has(r.id))
                      .map(r => ({
                        client_id: clientId!,
                        requirement_id: r.id,
                        status: 'not_submitted',
                      }));

                    if (newDocs.length > 0) {
                      const { error: docsError } = await supabaseAdmin
                        .from('client_documents')
                        .insert(newDocs);

                      if (docsError) {
                        console.error("❌ [STRIPE-WEBHOOK] Failed to create doc checklist:", docsError);
                      } else {
                        console.log(`✅ [STRIPE-WEBHOOK] Created ${newDocs.length} document checklist items`);
                      }
                    }
                  }
                } catch (docErr) {
                  console.error("❌ [STRIPE-WEBHOOK] Doc checklist error:", docErr);
                }
              }
            } catch (clientErr) {
              console.error("❌ [STRIPE-WEBHOOK] Client creation error:", clientErr);
            }
          }

          // --- 4. Send payment confirmation email ---
          if (customerEmail) {
            try {
              // Fetch document requirements for the email
              const { data: docReqs } = await supabaseAdmin
                .from('document_requirements')
                .select('document_name_en, document_name_es, document_name_de, document_name_fr, document_name_ru')
                .eq('country', targetCountry.toLowerCase())
                .order('priority_order', { ascending: true })
                .limit(8);

              const confirmUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-payment-confirmation`;
              await fetch(confirmUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
                },
                body: JSON.stringify({
                  email: customerEmail,
                  language: locale,
                  productType: payment.product_type,
                  targetCountry,
                  amountPaid: payment.amount - (payment.discount_amount || 0),
                  paymentId: payment.id,
                  documentRequirements: docReqs || [],
                }),
              });
              console.log("📧 [STRIPE-WEBHOOK] Payment confirmation email triggered for:", customerEmail);
            } catch (emailErr) {
              console.error("❌ [STRIPE-WEBHOOK] Failed to send confirmation email:", emailErr);
            }
          }

          // --- 5. Admin/team notification ---
          try {
            const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
            const amountFormatted = `€${((payment.amount - (payment.discount_amount || 0)) / 100).toFixed(2)}`;

            await resend.emails.send({
              from: "Solvia System <team@thesolvia.com>",
              to: ["david@thesolvia.com"],
              subject: `💰 New Payment: ${amountFormatted} — ${payment.product_type}`,
              html: `
<h2>New Homologation Payment Received</h2>
<table style="border-collapse:collapse;font-family:sans-serif;">
<tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${customerEmail || 'N/A'}</td></tr>
<tr><td style="padding:6px 12px;font-weight:bold;">Package</td><td style="padding:6px 12px;">${payment.product_type}</td></tr>
<tr><td style="padding:6px 12px;font-weight:bold;">Country</td><td style="padding:6px 12px;">${targetCountry}</td></tr>
<tr><td style="padding:6px 12px;font-weight:bold;">Amount</td><td style="padding:6px 12px;">${amountFormatted}</td></tr>
<tr><td style="padding:6px 12px;font-weight:bold;">Discount</td><td style="padding:6px 12px;">${payment.discount_code || 'None'}</td></tr>
<tr><td style="padding:6px 12px;font-weight:bold;">Stripe Session</td><td style="padding:6px 12px;">${session.id}</td></tr>
<tr><td style="padding:6px 12px;font-weight:bold;">User ID</td><td style="padding:6px 12px;">${userId || 'Guest'}</td></tr>
</table>
<p><a href="https://supabase.com/dashboard/project/ehrxpaxvyuwiwqclqkyh/editor">View in Admin Dashboard →</a></p>`,
            });
            console.log("📨 [STRIPE-WEBHOOK] Admin notification sent");
          } catch (adminErr) {
            console.error("❌ [STRIPE-WEBHOOK] Failed to send admin notification:", adminErr);
          }

          // --- 6. Calendar booking notification (for Personal/All-Inclusive tiers) ---
          if (userId && ['complete', 'personal_mentorship'].includes(payment.product_type)) {
            try {
              await supabaseAdmin.from('notifications').insert({
                user_id: userId,
                title: 'Book Your First Consultation',
                message: 'Your package includes personal consultation sessions. Book your first call with our team!',
                type: 'info',
                link: 'https://calendly.com/david-rehrl-thesolvia/30min',
              });
              console.log("🔔 [STRIPE-WEBHOOK] Booking notification created");
            } catch (notifErr) {
              console.error("❌ [STRIPE-WEBHOOK] Failed to create notification:", notifErr);
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
