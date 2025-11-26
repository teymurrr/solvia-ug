-- Add wizard data columns to professional_profiles table
ALTER TABLE public.professional_profiles
ADD COLUMN IF NOT EXISTS target_country TEXT,
ADD COLUMN IF NOT EXISTS study_country TEXT,
ADD COLUMN IF NOT EXISTS doctor_type TEXT,
ADD COLUMN IF NOT EXISTS documents_ready TEXT,
ADD COLUMN IF NOT EXISTS language_level TEXT;