-- Update the handle_new_user function to include wizard data
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
      specialty,
      open_to_relocation,
      target_country,
      study_country,
      doctor_type,
      profession,
      documents_ready,
      language_level
    ) VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'first_name', ''), 
      COALESCE(new.raw_user_meta_data->>'last_name', ''),
      COALESCE(new.raw_user_meta_data->>'specialty', ''),
      (new.raw_user_meta_data->>'open_to_relocation')::boolean,
      COALESCE(new.raw_user_meta_data->>'target_country', ''),
      COALESCE(new.raw_user_meta_data->>'study_country', ''),
      COALESCE(new.raw_user_meta_data->>'doctor_type', ''),
      COALESCE(new.raw_user_meta_data->>'doctor_type', ''),
      COALESCE(new.raw_user_meta_data->>'documents_ready', ''),
      COALESCE(new.raw_user_meta_data->>'language_level', '')
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