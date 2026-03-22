import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Single-track pricing by country (amounts in cents)
const getPricingByCountry = (country: string | null): Record<string, number> => {
  const isSpain = country?.toLowerCase() === 'spain';

  if (isSpain) {
    return { digital_starter: 25000, complete: 37900, personal_mentorship: 78900 };
  }
  // Germany, Austria, and others
  return { digital_starter: 78900, complete: 149000, personal_mentorship: 299000 };
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
    console.log("🔍 [VALIDATE-DISCOUNT] Function started");

    const { code, productType, targetCountry, languageLevel } = await req.json();
    
    if (!code) {
      throw new Error("Discount code is required");
    }

    console.log("🎫 [VALIDATE-DISCOUNT] Validating code:", code, "for product:", productType, "country:", targetCountry);

    // Query discount code
    const { data: discount, error: discountError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (discountError || !discount) {
      console.log("❌ [VALIDATE-DISCOUNT] Code not found or inactive");
      return new Response(JSON.stringify({
        valid: false,
        error: "Invalid or expired discount code"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check validity dates
    const now = new Date();
    const validFrom = discount.valid_from ? new Date(discount.valid_from) : null;
    const validUntil = discount.valid_until ? new Date(discount.valid_until) : null;
    
    if (validFrom && now < validFrom) {
      console.log("❌ [VALIDATE-DISCOUNT] Code not yet active");
      return new Response(JSON.stringify({
        valid: false,
        error: "This discount code is not yet active"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    if (validUntil && now > validUntil) {
      console.log("❌ [VALIDATE-DISCOUNT] Code expired");
      return new Response(JSON.stringify({
        valid: false,
        error: "This discount code has expired"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check usage limits
    if (discount.max_uses && discount.used_count >= discount.max_uses) {
      console.log("❌ [VALIDATE-DISCOUNT] Code usage limit reached");
      return new Response(JSON.stringify({
        valid: false,
        error: "This discount code has been fully used"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check product applicability
    if (discount.applicable_products && productType && !discount.applicable_products.includes(productType)) {
      console.log("❌ [VALIDATE-DISCOUNT] Code not applicable to product");
      return new Response(JSON.stringify({
        valid: false,
        error: "This discount code is not applicable to the selected product"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get the correct base amount based on country and product type
    const pricing = getPricingByCountry(targetCountry);
    const baseAmount = pricing[productType] || 78900;
    
    // Calculate discount amount
    let discountAmount = 0;
    
    if (discount.discount_type === 'percentage') {
      discountAmount = Math.round((baseAmount * discount.discount_value) / 100);
    } else {
      discountAmount = discount.discount_value;
    }
    
    const finalAmount = Math.max(0, baseAmount - discountAmount);

    console.log("✅ [VALIDATE-DISCOUNT] Code validated successfully:", {
      code: discount.code,
      baseAmount,
      discountAmount,
      finalAmount,
      targetCountry,
      productType
    });

    return new Response(JSON.stringify({
      valid: true,
      discount: {
        code: discount.code,
        type: discount.discount_type,
        value: discount.discount_value,
        discountAmount,
        finalAmount,
        description: discount.discount_type === 'percentage' 
          ? `${discount.discount_value}% off`
          : `€${(discount.discount_value / 100).toFixed(2)} off`
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ [VALIDATE-DISCOUNT] Error:", error);
    return new Response(JSON.stringify({ 
      valid: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
