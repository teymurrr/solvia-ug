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
  languageLevel?: string;
}

// Two-track pricing based on language proficiency (amounts in cents)
const SPEAKER_LEVELS = ['B2', 'C1', 'native_speaker'];

const getProductConfig = (productType: string, targetCountry: string | undefined, languageLevel: string | undefined) => {
  const isSpeaker = languageLevel && SPEAKER_LEVELS.includes(languageLevel);
  const isSpain = targetCountry?.toLowerCase() === 'spain';

  if (isSpeaker) {
    // Track A: user speaks the language
    const speakerConfigs: Record<string, Record<string, { name: string; description: string; amount: number; regularPrice: number }>> = {
      spain: {
        digital_starter: { name: 'Digital Homologation', description: 'Document templates, checklists, and step-by-step digital guide', amount: 15000, regularPrice: 15000 },
        complete: { name: 'Personal Assistance', description: 'Personal case manager, authority communication, and priority support', amount: 25000, regularPrice: 25000 },
        personal_mentorship: { name: 'All-Inclusive', description: 'Everything handled: translations, fees, zero out-of-pocket extras', amount: 35000, regularPrice: 35000 },
      },
      other: {
        digital_starter: { name: 'Digital Homologation', description: 'Document templates, checklists, and step-by-step digital guide', amount: 15000, regularPrice: 15000 },
        complete: { name: 'Personal Assistance', description: 'Personal case manager, authority communication, and priority support', amount: 28900, regularPrice: 28900 },
        personal_mentorship: { name: 'All-Inclusive', description: 'Everything handled: translations, fees, zero out-of-pocket extras', amount: 190000, regularPrice: 190000 },
      },
    };
    const region = isSpain ? 'spain' : 'other';
    return speakerConfigs[region][productType];
  }

  // Track B: non-speakers — all countries same
  const configs: Record<string, { name: string; description: string; amount: number; regularPrice: number }> = {
    digital_starter: {
      name: 'Guided Homologation',
      description: 'Document preparation, authority communication, step-by-step guidance',
      amount: 37900,
      regularPrice: 37900,
    },
    complete: {
      name: 'Homologation + Language',
      description: 'Expert-guided homologation with 12-month medical language course',
      amount: 89900,
      regularPrice: 89900,
    },
    personal_mentorship: {
      name: 'Full All-Inclusive',
      description: 'Complete homologation + language + all fees covered',
      amount: 380000,
      regularPrice: 380000,
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

    const { productType, targetCountry, customerEmail, discountCode, locale = 'en', languageLevel }: PaymentRequest = await req.json();

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
    const config = getProductConfig(productType, targetCountry, languageLevel);
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
