
-- Create storage bucket for application CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('application-cvs', 'application-cvs', false);

-- Authenticated users can upload their own CVs (folder = user_id)
CREATE POLICY "Users can upload their own application CVs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'application-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own CVs
CREATE POLICY "Users can view their own application CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'application-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Institutions can view CVs for applications to their vacancies
CREATE POLICY "Institutions can view application CVs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-cvs' 
  AND EXISTS (
    SELECT 1 FROM applied_vacancies av
    JOIN vacancies v ON v.id = av.vacancy_id
    WHERE v.institution_id = auth.uid()
    AND av.user_id::text = (storage.foldername(name))[1]
  )
);

-- Admins can view all CVs
CREATE POLICY "Admins can view all application CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'application-cvs' AND is_admin(auth.uid()));
