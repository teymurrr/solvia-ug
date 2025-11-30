-- Create clients table for onboarding wizard data
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  target_country TEXT,
  federal_state TEXT,
  current_location TEXT,
  name_matches_documents TEXT, -- 'yes', 'no', 'not_sure'
  diploma_apostilled TEXT, -- 'yes', 'no', 'dont_know'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for anonymous onboarding)
CREATE POLICY "Anyone can insert clients"
ON public.clients
FOR INSERT
WITH CHECK (true);

-- Users can view their own client records
CREATE POLICY "Users can view their own client records"
ON public.clients
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own client records
CREATE POLICY "Users can update their own client records"
ON public.clients
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all clients
CREATE POLICY "Admins can view all clients"
ON public.clients
FOR SELECT
USING (is_admin(auth.uid()));

-- Admins can update all clients
CREATE POLICY "Admins can update all clients"
ON public.clients
FOR UPDATE
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();