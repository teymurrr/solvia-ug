
-- Add notes column for internal institution notes
ALTER TABLE public.applied_vacancies ADD COLUMN IF NOT EXISTS institution_notes text;

-- Add interview status to existing statuses (the column is text, so no enum change needed)
-- We just ensure the data model supports: pending, reviewing, interview, offered, accepted, rejected, withdrawn
