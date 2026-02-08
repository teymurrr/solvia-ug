import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  productType: 'digital_starter' | 'complete' | 'personal_mentorship';
  targetCountry?: string;
  customerEmail?: string;
  discountCode?: string;
  locale?: 'en' | 'es' | 'de' | 'fr' | 'ru';
}

// Country-specific pricing configuration - CONVERSION WEEK PRICING (amounts in cents)
const getProductConfig = (productType: string, targetCountry: string | undefined) => {
  // CONVERSION WEEK: Aggressive pricing €49 / €199 / €499
  const configs: Record<string, { name: string; description: string; amount: number; regularPrice: number }> = {
    digital_starter: {
      name: 'Digital Starter',
      description: 'Self-service document preparation kit with templates & videos',
      amount: 4900, // €49 CONVERSION WEEK
      regularPrice: 9900, // Regular €99
    },
    complete: {
      name: 'Complete Package',
      description: 'Full homologation support + German language preparation',
      amount: 19900, // €199 CONVERSION WEEK
      regularPrice: 39900, // Regular €399
    },
    personal_mentorship: {
      name: 'Personal Mentorship',
      description: 'Dedicated team with 1:1 lessons and full support',
      amount: 49900, // €499 CONVERSION WEEK
      regularPrice: 99900, // Regular €999
    }
  };
  
  return configs[productType];
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
    console.log("🔍 [CREATE-PAYMENT] Function started");

    const { productType, targetCountry, customerEmail, discountCode, locale = 'en' }: PaymentRequest = await req.json();

    // Validate required fields
    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      throw new Error("Invalid email format");
    }

    console.log("✅ [CREATE-PAYMENT] Processing payment for:", customerEmail, "Country:", targetCountry);

    // Try to get authenticated user (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      userId = data.user?.id || null;
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get product configuration based on country
    const config = getProductConfig(productType, targetCountry);
    if (!config) {
      throw new Error(`Invalid product type: ${productType}`);
    }

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
        const now = new Date();
        const validFrom = discount.valid_from ? new Date(discount.valid_from) : null;
        const validUntil = discount.valid_until ? new Date(discount.valid_until) : null;
        
        if ((!validFrom || now >= validFrom) && (!validUntil || now <= validUntil)) {
          if (!discount.max_uses || discount.used_count < discount.max_uses) {
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

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ [CREATE-PAYMENT] Existing customer found:", customerId);
    }

    // Create checkout session with dynamic pricing
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: config.amount, // Always send original price, let Stripe coupon handle discount
            product_data: {
              name: config.name,
              description: config.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&lang=${locale}`,
      cancel_url: `${origin}/payment-cancelled?lang=${locale}`,
      locale: locale,
      metadata: {
        productType,
        userId: userId || 'guest',
        targetCountry: targetCountry || 'germany',
        discountCode: validDiscountCode?.code || '',
        discountAmount: discountAmount.toString(),
        originalAmount: config.amount.toString(),
      },
      billing_address_collection: 'required',
    };

    // Only add discounts if we have a valid discount code
    if (validDiscountCode) {
      const coupon = await createStripeCoupon(stripe, validDiscountCode);
      sessionConfig.discounts = [{ coupon }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Create payment record in database with target_country column
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        amount: config.amount,
        currency: 'eur',
        status: 'pending',
        payment_type: 'one-time',
        product_type: productType,
        target_country: targetCountry || 'germany',
        discount_code: validDiscountCode?.code || null,
        discount_amount: discountAmount,
        metadata: {
          locale,
          targetCountry: targetCountry || 'germany',
          customerEmail,
          originalAmount: config.amount,
          finalAmount,
        }
      });

    if (paymentError) {
      console.error("❌ [CREATE-PAYMENT] Database error:", paymentError);
    } else {
      console.log("✅ [CREATE-PAYMENT] Payment record created");
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
