-- 1. Add email column to professional_profiles
ALTER TABLE public.professional_profiles 
ADD COLUMN IF NOT EXISTS email text;

-- 2. Add profile_id column to clients (foreign key to professional_profiles)
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.professional_profiles(id) ON DELETE SET NULL;

-- 3. Backfill emails on existing professional_profiles from auth.users
UPDATE public.professional_profiles pp
SET email = u.email
FROM auth.users u
WHERE pp.id = u.id AND pp.email IS NULL;

-- 4. Backfill profile_id on existing clients where user_id matches a professional_profile
UPDATE public.clients c
SET profile_id = c.user_id
WHERE c.user_id IS NOT NULL 
  AND c.profile_id IS NULL
  AND EXISTS (SELECT 1 FROM public.professional_profiles pp WHERE pp.id = c.user_id);

-- 5. Update handle_new_user trigger to include email
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
      language_level
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

-- 6. Create trigger to auto-set profile_id when client is created with user_id
CREATE OR REPLACE FUNCTION public.set_client_profile_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- If user_id is set and profile_id is not, try to link to professional_profile
  IF NEW.user_id IS NOT NULL AND NEW.profile_id IS NULL THEN
    -- Check if a professional_profile exists for this user
    IF EXISTS (SELECT 1 FROM public.professional_profiles WHERE id = NEW.user_id) THEN
      NEW.profile_id := NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create the trigger on clients table
DROP TRIGGER IF EXISTS set_client_profile_id_trigger ON public.clients;
CREATE TRIGGER set_client_profile_id_trigger
  BEFORE INSERT OR UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_client_profile_id();

-- 7. Create index on profile_id for better query performance
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON public.clients(profile_id);