import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  targetCountry?: string;
  studyCountry?: string;
  doctorType?: string;
  languageLevel?: string;
  source?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: LeadData = await req.json();
    
    // Validate email
    if (!body.email || !body.email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = body.email.toLowerCase().trim();

    console.log(`Capturing lead: ${email}`);

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    if (existingLead) {
      // Update existing lead with new data
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          first_name: body.firstName || undefined,
          last_name: body.lastName || undefined,
          target_country: body.targetCountry || undefined,
          study_country: body.studyCountry || undefined,
          doctor_type: body.doctorType || undefined,
          language_level: body.languageLevel || undefined,
          source: body.source || 'wizard',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id);

      if (updateError) {
        console.error('Error updating lead:', updateError);
        throw updateError;
      }

      console.log(`Updated existing lead: ${email}`);
      return new Response(
        JSON.stringify({ success: true, action: 'updated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Insert new lead
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          email,
          first_name: body.firstName || null,
          last_name: body.lastName || null,
          target_country: body.targetCountry || null,
          study_country: body.studyCountry || null,
          doctor_type: body.doctorType || null,
          language_level: body.languageLevel || null,
          source: body.source || 'wizard',
        });

      if (insertError) {
        console.error('Error inserting lead:', insertError);
        throw insertError;
      }

      console.log(`Created new lead: ${email}`);
      return new Response(
        JSON.stringify({ success: true, action: 'created' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Lead capture error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to capture lead' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
