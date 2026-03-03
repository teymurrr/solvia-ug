
-- Update all Solvia Homecare vacancies to point to the correct institution account (david.rehrl@me.com)
UPDATE public.vacancies 
SET institution_id = '79abea8a-7277-4e06-904e-c3fb17bee645' 
WHERE institution = 'Solvia Homecare' 
AND institution_id = 'df03a807-9b71-4126-a409-e36ea2053f90';

-- Update the institution profile name to "Solvia Homecare"
UPDATE public.institution_profiles 
SET institution_name = 'Solvia Homecare',
    institution_type = 'Homecare',
    updated_at = now()
WHERE id = '79abea8a-7277-4e06-904e-c3fb17bee645';
