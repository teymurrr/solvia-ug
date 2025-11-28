-- Create leads table for capturing wizard submissions
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text,
  last_name text,
  target_country text,
  study_country text,
  doctor_type text,
  language_level text,
  source text DEFAULT 'wizard',
  status text DEFAULT 'new',
  converted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create unique index on email to allow upsert behavior
CREATE UNIQUE INDEX leads_email_idx ON public.leads(email);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so lead capture works without login)
CREATE POLICY "Allow anonymous lead capture" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view all leads" ON public.leads
  FOR SELECT USING (is_admin(auth.uid()));

-- Only admins can update leads
CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();