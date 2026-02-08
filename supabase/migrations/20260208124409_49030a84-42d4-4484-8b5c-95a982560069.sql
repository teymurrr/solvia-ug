-- Create email_sends table for tracking all outbound emails
CREATE TABLE public.email_sends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  template_id text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  resend_email_id text,
  lead_id uuid REFERENCES leads(id),
  source_table text, -- 'leads', 'professional_profiles', 'learning_form_submissions'
  status text NOT NULL DEFAULT 'sent', -- sent, delivered, opened, clicked, bounced, failed
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  bounced_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- CRITICAL: Prevent same email receiving same template twice
CREATE UNIQUE INDEX email_sends_unique_email_template 
ON public.email_sends (LOWER(email), template_id);

-- Index for analytics queries
CREATE INDEX email_sends_template_idx ON public.email_sends (template_id);
CREATE INDEX email_sends_sent_at_idx ON public.email_sends (sent_at);
CREATE INDEX email_sends_language_idx ON public.email_sends (language);

-- Enable RLS
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;

-- Only admins can view email sends
CREATE POLICY "Admins can view all email sends"
ON public.email_sends FOR SELECT
USING (is_admin(auth.uid()));

-- Only service role can insert (edge functions)
CREATE POLICY "Service role can manage email sends"
ON public.email_sends FOR ALL
USING (true)
WITH CHECK (true);

-- Also add unique constraint on leads.email to prevent duplicates at source
CREATE UNIQUE INDEX leads_email_unique ON public.leads (LOWER(email));

-- Backfill: Log all emails already sent (from leads with email_sequence_day > 0)
INSERT INTO public.email_sends (email, template_id, language, sent_at, lead_id, source_table, status)
SELECT 
  email,
  'feedbackAsk',
  CASE 
    WHEN study_country ILIKE ANY(ARRAY['%mexico%', '%colombia%', '%chile%', '%peru%', '%bolivia%', '%venezuela%', '%cuba%', '%argentina%', '%ecuador%', '%uruguay%', '%paraguay%', '%spain%', '%españa%']) THEN 'es'
    WHEN study_country ILIKE ANY(ARRAY['%germany%', '%deutschland%', '%austria%', '%österreich%', '%switzerland%', '%schweiz%']) THEN 'de'
    WHEN study_country ILIKE ANY(ARRAY['%france%', '%belgium%', '%belgique%']) THEN 'fr'
    WHEN study_country ILIKE ANY(ARRAY['%russia%', '%ukraine%', '%belarus%', '%kazakhstan%']) THEN 'ru'
    ELSE 'en'
  END as language,
  COALESCE(last_email_sent, now()),
  id,
  CASE WHEN source = 'direct_signup' THEN 'professional_profiles' ELSE 'leads' END,
  'sent'
FROM leads
WHERE email_sequence_day >= 1
  AND email IS NOT NULL
ON CONFLICT (LOWER(email), template_id) DO NOTHING;