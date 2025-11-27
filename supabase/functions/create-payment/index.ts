import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  productType: 'homologation' | 'language_prep' | 'premium_support';
  discountCode?: string;
  locale?: 'en' | 'es' | 'de' | 'fr' | 'ru';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("🔍 [CREATE-PAYMENT] Function started");

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    console.log("✅ [CREATE-PAYMENT] User authenticated:", user.email);

    const { productType, discountCode, locale = 'en' }: PaymentRequest = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Product configuration - prices need to be created in Stripe
    const productConfig: Record<string, { priceId: string; amount: number }> = {
      homologation: {
        priceId: "price_1SAH082L7RuO91AufX32666C", // Basic Package €1199
        amount: 119900,
      },
      language_prep: {
        priceId: "price_language_prep", // Standard Package €1399 - needs Stripe price
        amount: 139900,
      },
      premium_support: {
        priceId: "price_premium_support", // Premium Package €2599 - needs Stripe price
        amount: 259900,
      }
    };

    if (!productConfig[productType]) {
      throw new Error(`Invalid product type: ${productType}`);
    }

    const config = productConfig[productType];
    let finalAmount = config.amount;
    let discountAmount = 0;
    let validDiscountCode = null;

    // Validate discount code if provided
    if (discountCode) {
      console.log("🎫 [CREATE-PAYMENT] Validating discount code:", discountCode);
      
      const { data: discount, error: discountError } = await supabaseClient
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (!discountError && discount) {
        // Check if discount is still valid
        const now = new Date();
        const validFrom = discount.valid_from ? new Date(discount.valid_from) : null;
        const validUntil = discount.valid_until ? new Date(discount.valid_until) : null;
        
        if ((!validFrom || now >= validFrom) && (!validUntil || now <= validUntil)) {
          // Check usage limits
          if (!discount.max_uses || discount.used_count < discount.max_uses) {
            // Check if applicable to this product
            if (!discount.applicable_products || discount.applicable_products.includes(productType)) {
              validDiscountCode = discount;
              
              if (discount.discount_type === 'percentage') {
                discountAmount = Math.round((config.amount * discount.discount_value) / 100);
              } else {
                discountAmount = discount.discount_value;
              }
              
              finalAmount = Math.max(0, config.amount - discountAmount);
              console.log("✅ [CREATE-PAYMENT] Discount applied:", { discountAmount, finalAmount });
            }
          }
        }
      }
    }

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ [CREATE-PAYMENT] Existing customer found:", customerId);
    }

    // Create checkout session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&lang=${locale}`,
      cancel_url: `${origin}/payment-cancelled?lang=${locale}`,
      locale: locale,
      discounts: validDiscountCode ? [{
        coupon: await createStripeCoupon(stripe, validDiscountCode)
      }] : undefined,
      metadata: {
        productType,
        userId: user.id,
        discountCode: validDiscountCode?.code || '',
        discountAmount: discountAmount.toString(),
      },
      automatic_tax: {
        enabled: true,
      },
      billing_address_collection: 'required',
      payment_intent_data: {
        receipt_email: user.email,
      },
    });

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        stripe_session_id: session.id,
        amount: config.amount,
        currency: 'eur',
        status: 'pending',
        payment_type: 'one-time',
        product_type: productType,
        discount_code: validDiscountCode?.code || null,
        discount_amount: discountAmount,
        metadata: {
          locale,
          originalAmount: config.amount,
          finalAmount,
        }
      });

    if (paymentError) {
      console.error("❌ [CREATE-PAYMENT] Database error:", paymentError);
    } else {
      console.log("✅ [CREATE-PAYMENT] Payment record created:", payment);
    }

    console.log("✅ [CREATE-PAYMENT] Checkout session created:", session.id);

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ [CREATE-PAYMENT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function createStripeCoupon(stripe: Stripe, discount: any): Promise<string> {
  try {
    const coupon = await stripe.coupons.create({
      name: `Discount: ${discount.code}`,
      [discount.discount_type === 'percentage' ? 'percent_off' : 'amount_off']: 
        discount.discount_type === 'percentage' ? discount.discount_value : discount.discount_value,
      currency: discount.discount_type === 'fixed' ? 'eur' : undefined,
      duration: 'once',
    });
    return coupon.id;
  } catch (error) {
    console.error("❌ [CREATE-PAYMENT] Error creating Stripe coupon:", error);
    throw error;
  }
}