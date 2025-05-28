
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserWithEmail {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the user from the JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const { data: isAdminData, error: adminError } = await supabaseAdmin
      .rpc('is_admin', { uid: user.id });

    if (adminError || !isAdminData) {
      return new Response(JSON.stringify({ error: 'Access denied - admin rights required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all users from auth.users
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers();

    if (authUsersError) {
      console.error('Error fetching auth users:', authUsersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get professional profiles
    const { data: professionals, error: profError } = await supabaseAdmin
      .from('professional_profiles')
      .select('id, first_name, last_name, created_at');

    // Get institution profiles
    const { data: institutions, error: instError } = await supabaseAdmin
      .from('institution_profiles')
      .select('id, institution_name, created_at');

    if (profError && instError) {
      console.error('Error fetching profiles:', { profError, instError });
      return new Response(JSON.stringify({ error: 'Failed to fetch user profiles' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Combine the data
    const usersWithEmails: UserWithEmail[] = [];

    // Add professionals
    if (professionals) {
      professionals.forEach(prof => {
        const authUser = authUsers.users.find(u => u.id === prof.id);
        if (authUser) {
          usersWithEmails.push({
            id: prof.id,
            email: authUser.email || '',
            first_name: prof.first_name,
            last_name: prof.last_name,
            user_type: 'professional',
            created_at: prof.created_at
          });
        }
      });
    }

    // Add institutions
    if (institutions) {
      institutions.forEach(inst => {
        const authUser = authUsers.users.find(u => u.id === inst.id);
        if (authUser && !usersWithEmails.find(user => user.id === inst.id)) {
          usersWithEmails.push({
            id: inst.id,
            email: authUser.email || '',
            first_name: inst.institution_name,
            user_type: 'institution',
            created_at: inst.created_at
          });
        }
      });
    }

    return new Response(JSON.stringify({ users: usersWithEmails }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-users-with-emails function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
