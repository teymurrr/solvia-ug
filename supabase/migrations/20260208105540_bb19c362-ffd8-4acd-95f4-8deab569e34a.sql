-- Create email-assets storage bucket for email logos and assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-assets', 'email-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access
CREATE POLICY "Email assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'email-assets');

-- Create policy for authenticated admin uploads
CREATE POLICY "Admins can upload email assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'email-assets' 
  AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update email assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'email-assets' 
  AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete email assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'email-assets' 
  AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);