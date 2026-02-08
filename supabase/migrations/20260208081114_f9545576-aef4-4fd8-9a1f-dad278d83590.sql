-- Add email tracking columns to leads table for nurture campaigns
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS email_sequence_day INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_email_sent TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_campaign TEXT,
ADD COLUMN IF NOT EXISTS converted BOOLEAN DEFAULT FALSE;

-- Add index for efficient campaign queries
CREATE INDEX IF NOT EXISTS idx_leads_email_campaign ON public.leads(email_campaign);
CREATE INDEX IF NOT EXISTS idx_leads_converted ON public.leads(converted);
CREATE INDEX IF NOT EXISTS idx_leads_target_country ON public.leads(target_country);
CREATE INDEX IF NOT EXISTS idx_leads_language_level ON public.leads(language_level);