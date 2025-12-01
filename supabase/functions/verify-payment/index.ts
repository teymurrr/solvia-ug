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
    console.log("🔍 [VERIFY-PAYMENT] Function started");

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    console.log("✅ [VERIFY-PAYMENT] Verifying session:", sessionId);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      throw new Error("Session not found");
    }

    console.log("✅ [VERIFY-PAYMENT] Session retrieved:", {
      id: session.id,
      status: session.payment_status,
      customerId: session.customer
    });

    // Update payment record in database
    const updateData: any = {
      status: session.payment_status === 'paid' ? 'completed' : 'failed',
      stripe_customer_id: session.customer as string,
      stripe_payment_intent_id: session.payment_intent as string,
      updated_at: new Date().toISOString(),
    };

    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .update(updateData)
      .eq('stripe_session_id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (paymentError) {
      console.error("❌ [VERIFY-PAYMENT] Database error:", paymentError);
      throw new Error("Failed to update payment record");
    }

    // If payment is successful and discount code was used, increment usage count
    if (session.payment_status === 'paid' && payment.discount_code) {
      console.log("🎫 [VERIFY-PAYMENT] Incrementing discount code usage:", payment.discount_code);
      
      const { error: discountError } = await supabaseClient
        .from('discount_codes')
        .update({ 
          used_count: supabaseClient.sql`used_count + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('code', payment.discount_code);

      if (discountError) {
        console.error("❌ [VERIFY-PAYMENT] Error updating discount usage:", discountError);
      }
    }

    console.log("✅ [VERIFY-PAYMENT] Payment verification completed:", {
      paymentId: payment.id,
      status: payment.status,
      productType: payment.product_type,
      targetCountry: payment.target_country
    });

    return new Response(JSON.stringify({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        productType: payment.product_type,
        targetCountry: payment.target_country,
        discountCode: payment.discount_code,
        discountAmount: payment.discount_amount,
        metadata: payment.metadata,
      },
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email,
        totalAmount: session.amount_total,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ [VERIFY-PAYMENT] Error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});