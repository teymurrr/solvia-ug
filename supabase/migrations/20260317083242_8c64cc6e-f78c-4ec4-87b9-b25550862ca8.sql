
-- Create homologation_documents table
CREATE TABLE public.homologation_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  region text,
  title text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homologation_documents ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read (internal tool)
CREATE POLICY "Authenticated users can view homologation documents"
  ON public.homologation_documents FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert homologation documents"
  ON public.homologation_documents FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update
CREATE POLICY "Admins can update homologation documents"
  ON public.homologation_documents FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete homologation documents"
  ON public.homologation_documents FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Storage policies for the existing homologation-documents bucket
-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can read homologation docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'homologation-documents');

-- Allow admins to upload files
CREATE POLICY "Admins can upload homologation docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'homologation-documents' AND public.is_admin(auth.uid()));

-- Allow admins to delete files
CREATE POLICY "Admins can delete homologation docs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'homologation-documents' AND public.is_admin(auth.uid()));
