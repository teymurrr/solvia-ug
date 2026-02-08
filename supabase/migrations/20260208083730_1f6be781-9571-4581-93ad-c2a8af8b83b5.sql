-- Add preferred_language column to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS preferred_language TEXT;

-- Add preferred_language column to professional_profiles table
ALTER TABLE public.professional_profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT;

-- Add preferred_language column to learning_form_submissions table
ALTER TABLE public.learning_form_submissions 
ADD COLUMN IF NOT EXISTS preferred_language TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.leads.preferred_language IS 'User preferred language for emails: es, de, en, fr';
COMMENT ON COLUMN public.professional_profiles.preferred_language IS 'User preferred language for communications: es, de, en, fr';
COMMENT ON COLUMN public.learning_form_submissions.preferred_language IS 'User preferred language: es, de, en, fr';