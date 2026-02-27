-- Phase 4: Add conversion_source column to payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS conversion_source text;

-- Add comment for clarity
COMMENT ON COLUMN public.payments.conversion_source IS 'Tracks which email/touchpoint drove the purchase (e.g. email_socialProof, direct, wizard_cta)';