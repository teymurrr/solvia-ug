
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LearningFormData {
  fullName: string;
  country: string;
  email: string;
  profession: string;
  germanLanguage: boolean;
  fspPreparation: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const formData: LearningFormData = await req.json();
    console.log('Received form submission:', formData);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Save form submission to database
    const { data, error } = await supabase
      .from('learning_form_submissions')
      .insert({
        full_name: formData.fullName,
        country: formData.country,
        email: formData.email,
        profession: formData.profession,
        german_language: formData.germanLanguage,
        fsp_preparation: formData.fspPreparation,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save form submission');
    }

    console.log('Form submission saved successfully:', data);

    // Initialize Resend for email notifications
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Solvia Learning <team@thesolvia.com>",
      to: ["david.rehrl@thesolvia.com"],
      subject: "New Learning Form Submission",
      html: `
        <h2>New Learning Form Submission</h2>
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Country:</strong> ${formData.country}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Profession:</strong> ${formData.profession}</p>
        <p><strong>Interested in German Language:</strong> ${formData.germanLanguage ? 'Yes' : 'No'}</p>
        <p><strong>Interested in FSP Preparation:</strong> ${formData.fspPreparation ? 'Yes' : 'No'}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Solvia Learning <team@thesolvia.com>",
      to: [formData.email],
      subject: "Thank you for your interest in Solvia Learning",
      html: `
        <h1>Thank you for your interest, ${formData.fullName}!</h1>
        <p>We have received your information and will get back to you soon with details about our courses.</p>
        <h3>Your submission details:</h3>
        <ul>
          <li><strong>Country:</strong> ${formData.country}</li>
          <li><strong>Profession:</strong> ${formData.profession}</li>
          <li><strong>German Language Courses:</strong> ${formData.germanLanguage ? 'Yes' : 'No'}</li>
          <li><strong>FSP Preparation:</strong> ${formData.fspPreparation ? 'Yes' : 'No'}</li>
        </ul>
        <p>Best regards,<br>The Solvia Learning Team</p>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully',
        submissionId: data.id 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in submit-learning-form function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
