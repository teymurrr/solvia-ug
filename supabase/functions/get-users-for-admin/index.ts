import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting get-users-for-admin function");

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
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Check if user is admin
    const { data: isAdminData, error: adminCheckError } = await supabaseAdmin
      .rpc('is_admin', { uid: user.id });

    if (adminCheckError || !isAdminData) {
      return new Response(
        JSON.stringify({ error: "Access denied. Admin role required." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    console.log("Fetching users with search:", searchQuery, "page:", page);

    // Get ALL users from auth.users (paginate through all pages)
    let allUsers: any[] = [];
    let currentPage = 1;
    const fetchPerPage = 1000;
    
    while (true) {
      const { data: authUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
        page: currentPage,
        perPage: fetchPerPage,
      });

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch users" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      allUsers = allUsers.concat(authUsers.users);
      
      // If we got fewer than requested, we've reached the end
      if (authUsers.users.length < fetchPerPage) break;
      currentPage++;
    }

    console.log("Total auth users fetched:", allUsers.length);

    // Filter users if search query provided
    let filteredUsers = allUsers;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredUsers = allUsers.filter(u => 
        u.email?.toLowerCase().includes(searchLower) ||
        u.user_metadata?.first_name?.toLowerCase().includes(searchLower) ||
        u.user_metadata?.last_name?.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination to filtered results
    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    // Get professional profiles for additional info
    const userIds = paginatedUsers.map(u => u.id);
    const { data: profiles } = await supabaseAdmin
      .from('professional_profiles')
      .select('id, first_name, last_name, target_country')
      .in('id', userIds);

    // Get existing payments for these users
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('user_id, target_country, product_type, status, payment_method, created_at')
      .in('user_id', userIds)
      .eq('status', 'completed');

    // Map profiles and payments to users
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const paymentMap = new Map<string, typeof payments>();
    payments?.forEach(p => {
      const existing = paymentMap.get(p.user_id) || [];
      existing.push(p);
      paymentMap.set(p.user_id, existing);
    });

    // Build response
    const usersWithDetails = paginatedUsers.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      user_type: u.user_metadata?.user_type,
      first_name: profileMap.get(u.id)?.first_name || u.user_metadata?.first_name,
      last_name: profileMap.get(u.id)?.last_name || u.user_metadata?.last_name,
      target_country: profileMap.get(u.id)?.target_country || u.user_metadata?.target_country,
      paid_access: paymentMap.get(u.id) || []
    }));

    return new Response(
      JSON.stringify({ 
        users: usersWithDetails,
        total,
        page,
        limit
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
