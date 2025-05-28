
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { email } = await req.json()
    
    console.log('make-admin function called with email:', email);
    
    if (!email) {
      console.error('No email provided');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Looking for user with email:', email);

    // Use the Auth Admin API to find the user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);

    if (userError) {
      console.error('Error finding user by email:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to find user: ' + userError.message }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    if (!userData || !userData.user) {
      console.error('User not found with email:', email);
      return new Response(
        JSON.stringify({ error: 'User not found with this email address' }),
        { 
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    const user = userData.user;
    console.log('Found user:', user.id, user.email);

    // Check if user is already an admin
    const { data: existingRole, error: checkError } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing role:', checkError);
      return new Response(
        JSON.stringify({ error: 'Failed to check existing admin status' }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    if (existingRole) {
      console.log('User is already an admin');
      return new Response(
        JSON.stringify({ message: 'User is already an admin' }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Insert the user role
    console.log('Inserting admin role for user:', user.id);
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'admin'
      })

    if (roleError) {
      console.error('Error inserting role:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to grant admin rights: ' + roleError.message }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    console.log('Successfully granted admin rights to:', email);
    return new Response(
      JSON.stringify({ message: `User ${email} has been made an admin` }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Unexpected error in make-admin function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})
