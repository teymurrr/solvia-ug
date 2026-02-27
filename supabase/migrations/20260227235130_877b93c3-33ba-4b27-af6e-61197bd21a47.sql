
-- Update handle_new_user to store preferred_language from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF new.raw_user_meta_data->>'user_type' = 'professional' THEN
    INSERT INTO public.professional_profiles (
      id, 
      first_name, 
      last_name, 
      email,
      specialty,
      open_to_relocation,
      target_country,
      study_country,
      doctor_type,
      profession,
      documents_ready,
      language_level,
      preferred_language
    ) VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'first_name', ''), 
      COALESCE(new.raw_user_meta_data->>'last_name', ''),
      new.email,
      COALESCE(new.raw_user_meta_data->>'specialty', ''),
      (new.raw_user_meta_data->>'open_to_relocation')::boolean,
      COALESCE(new.raw_user_meta_data->>'target_country', ''),
      COALESCE(new.raw_user_meta_data->>'study_country', ''),
      COALESCE(new.raw_user_meta_data->>'doctor_type', ''),
      COALESCE(new.raw_user_meta_data->>'doctor_type', ''),
      COALESCE(new.raw_user_meta_data->>'documents_ready', ''),
      COALESCE(new.raw_user_meta_data->>'language_level', ''),
      COALESCE(new.raw_user_meta_data->>'preferred_language', 'en')
    );
  ELSIF new.raw_user_meta_data->>'user_type' = 'institution' THEN
    INSERT INTO public.institution_profiles (
      id, 
      institution_name,
      institution_type,
      location
    ) VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'name', COALESCE(new.raw_user_meta_data->>'first_name', '')), 
      COALESCE(new.raw_user_meta_data->>'last_name', COALESCE(new.raw_user_meta_data->>'institution_type', '')),
      COALESCE(new.raw_user_meta_data->>'location', '')
    );
  END IF;
  RETURN new;
END;
$function$;

-- BACKFILL: Fix preferred_language for existing leads based on study_country
UPDATE public.leads SET preferred_language = 'es' 
WHERE (preferred_language IS NULL OR preferred_language = 'en')
AND LOWER(study_country) IN (
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia',
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico',
  'spain', 'españa'
);

UPDATE public.leads SET preferred_language = 'de'
WHERE (preferred_language IS NULL OR preferred_language = 'en')
AND LOWER(study_country) IN ('germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz');

UPDATE public.leads SET preferred_language = 'fr'
WHERE (preferred_language IS NULL OR preferred_language = 'en')
AND LOWER(study_country) IN ('france', 'belgium', 'belgique', 'tunisia', 'tunisie', 'morocco', 'maroc', 'algeria', 'algérie');

UPDATE public.leads SET preferred_language = 'ru'
WHERE (preferred_language IS NULL OR preferred_language = 'en')
AND LOWER(study_country) IN ('russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan');

-- BACKFILL: Fix professional_profiles based on study_country  
UPDATE public.professional_profiles SET preferred_language = 'es'
WHERE preferred_language IS NULL
AND LOWER(study_country) IN (
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia',
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico',
  'spain', 'españa'
);

UPDATE public.professional_profiles SET preferred_language = 'de'
WHERE preferred_language IS NULL
AND LOWER(study_country) IN ('germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz');

UPDATE public.professional_profiles SET preferred_language = 'fr'
WHERE preferred_language IS NULL
AND LOWER(study_country) IN ('france', 'belgium', 'belgique', 'tunisia', 'tunisie', 'morocco', 'maroc', 'algeria', 'algérie');

UPDATE public.professional_profiles SET preferred_language = 'ru'
WHERE preferred_language IS NULL
AND LOWER(study_country) IN ('russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan');
