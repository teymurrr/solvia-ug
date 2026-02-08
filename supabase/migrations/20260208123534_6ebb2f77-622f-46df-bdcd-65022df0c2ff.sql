-- Add registered users (professional_profiles) to leads table for email campaign
-- Only insert those not already in leads table (by email match)
INSERT INTO leads (id, email, first_name, last_name, target_country, study_country, 
                   doctor_type, language_level, source, status, email_sequence_day)
SELECT 
  pp.id,
  pp.email,
  pp.first_name,
  pp.last_name,
  pp.target_country,
  pp.study_country,
  pp.doctor_type,
  pp.language_level,
  'direct_signup',        -- Mark source as direct signup
  'new',                  -- New status for email sequence
  0                       -- Ready for feedbackAsk email
FROM professional_profiles pp
LEFT JOIN leads l ON LOWER(pp.email) = LOWER(l.email)
WHERE l.id IS NULL
  AND pp.email IS NOT NULL;