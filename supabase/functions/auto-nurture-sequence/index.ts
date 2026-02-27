import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Auto Nurture Sequence
 * 
 * Runs on a schedule (or manual trigger). Checks each lead's email_sequence_day
 * and last_email_sent timestamp, and sends the next email if enough days have passed.
 * 
 * Sequence:
 *   Day 0 → feedbackAsk (immediate / Day 0)
 *   Day 1 → personalDiagnosis (3 days after feedbackAsk)
 *   Day 2 → socialProof (2 days after personalDiagnosis) 
 *   Day 3 → urgencyOffer (2 days after socialProof)
 *   Day 4 → valueInsight (7 days after urgencyOffer, final)
 */

const SEQUENCE = [
  { day: 0, templateId: 'feedbackAsk', delayDays: 0 },
  { day: 1, templateId: 'personalDiagnosis', delayDays: 3 },
  { day: 2, templateId: 'socialProof', delayDays: 2 },
  { day: 3, templateId: 'urgencyOffer', delayDays: 2 },
  { day: 4, templateId: 'valueInsight', delayDays: 7 },
];

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun === true;

    console.log(`[auto-nurture] Starting${dryRun ? ' (DRY RUN)' : ''}...`);

    // Get all active leads (not converted, with email)
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, email, email_sequence_day, last_email_sent, status, preferred_language, study_country, target_country, doctor_type, language_level, first_name, last_name')
      .eq('status', 'new')
      .not('email', 'is', null)
      .lt('email_sequence_day', 5) // Not yet completed sequence
      .limit(200);

    if (error) throw error;

    const now = new Date();
    const results = { processed: 0, sent: 0, waiting: 0, completed: 0, errors: 0 };

    for (const lead of leads || []) {
      results.processed++;
      
      const currentDay = lead.email_sequence_day || 0;
      
      // Find the next step in the sequence
      const nextStepIndex = SEQUENCE.findIndex(s => s.day === currentDay);
      if (nextStepIndex === -1 || nextStepIndex >= SEQUENCE.length - 1) {
        // Already at final step or unknown state
        results.completed++;
        continue;
      }

      const nextStep = SEQUENCE[nextStepIndex + 1];
      
      // Check if enough time has passed since last email
      if (lead.last_email_sent) {
        const lastSent = new Date(lead.last_email_sent);
        const daysSinceLastEmail = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastEmail < nextStep.delayDays) {
          results.waiting++;
          continue;
        }
      } else if (currentDay === 0) {
        // Never received any email — check if lead is old enough (created > 0 days ago for first email)
        // First email can be sent immediately
      }

      if (dryRun) {
        console.log(`[auto-nurture] Would send ${nextStep.templateId} to ${lead.email} (day ${currentDay} → ${nextStep.day})`);
        results.sent++;
        continue;
      }

      // Call send-nurture-campaign for this specific lead
      // Instead of calling the function, we invoke it directly via fetch
      const campaignUrl = `${supabaseUrl}/functions/v1/send-nurture-campaign`;
      
      try {
        const response = await fetch(campaignUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            templateId: nextStep.templateId,
            testMode: false,
          }),
        });

        if (response.ok) {
          results.sent++;
          console.log(`[auto-nurture] Triggered ${nextStep.templateId} for batch (includes ${lead.email})`);
          
          // The send-nurture-campaign function handles dedup and updating email_sequence_day,
          // so we only need to trigger it once per template per batch.
          // Break after first trigger since the campaign function processes all eligible leads.
          break;
        } else {
          const errText = await response.text();
          console.error(`[auto-nurture] Campaign trigger failed:`, errText);
          results.errors++;
        }
      } catch (fetchErr) {
        console.error(`[auto-nurture] Error calling campaign:`, fetchErr);
        results.errors++;
      }
      
      // Only trigger once per template batch
      break;
    }

    console.log(`[auto-nurture] Complete:`, results);

    return new Response(
      JSON.stringify({ success: true, ...results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("[auto-nurture] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
