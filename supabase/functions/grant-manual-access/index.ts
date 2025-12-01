import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GrantAccessRequest {
  targetUserId: string;
  targetCountry: string;
  productType: string;
  paymentMethod: string;
  amount: number;
  currency?: string;
  adminNotes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting grant-manual-access function");

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Create client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verify the requesting user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    console.log("User authenticated:", user.id);

    // Check if user is admin using the is_admin function
    const { data: isAdminData, error: adminCheckError } = await supabaseAdmin
      .rpc('is_admin', { uid: user.id });

    if (adminCheckError || !isAdminData) {
      console.error("Admin check failed:", adminCheckError);
      return new Response(
        JSON.stringify({ error: "Access denied. Admin role required." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    console.log("Admin verified");

    // Parse the request body
    const body: GrantAccessRequest = await req.json();
    const { 
      targetUserId, 
      targetCountry, 
      productType, 
      paymentMethod, 
      amount, 
      currency = 'eur',
      adminNotes 
    } = body;

    // Validate required fields
    if (!targetUserId || !targetCountry || !productType || !paymentMethod) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: targetUserId, targetCountry, productType, paymentMethod" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Creating manual payment record for user:", targetUserId);

    // Check if user already has access to this country
    const { data: existingPayment, error: checkError } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('user_id', targetUserId)
      .eq('target_country', targetCountry)
      .eq('status', 'completed')
      .single();

    if (existingPayment) {
      return new Response(
        JSON.stringify({ error: "User already has access to this country" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create the manual payment record
    const { data: payment, error: insertError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: targetUserId,
        target_country: targetCountry,
        product_type: productType,
        payment_type: 'one_time',
        payment_method: paymentMethod,
        amount: amount || 0,
        currency: currency,
        status: 'completed',
        admin_notes: adminNotes,
        granted_by: user.id,
        metadata: {
          granted_manually: true,
          granted_at: new Date().toISOString(),
          granted_by_email: user.email
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating payment record:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create payment record", details: insertError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Manual access granted successfully:", payment.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Access granted successfully",
        payment: payment
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
