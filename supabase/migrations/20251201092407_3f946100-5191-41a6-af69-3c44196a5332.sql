-- Add target_country column to payments table for easier querying
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS target_country TEXT;

-- Create function to check if user has paid for a specific country's homologation
CREATE OR REPLACE FUNCTION public.check_paid_access(user_id_param UUID, country_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.payments
    WHERE user_id = user_id_param
    AND target_country = country_param
    AND status = 'completed'
    AND product_type IN ('homologation', 'language_prep', 'premium_support')
  );
END;
$$;

-- Create function to get all countries user has paid for
CREATE OR REPLACE FUNCTION public.get_paid_countries(user_id_param UUID)
RETURNS TABLE(target_country TEXT, product_type TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.target_country, p.product_type, p.created_at
  FROM public.payments p
  WHERE p.user_id = user_id_param
  AND p.status = 'completed'
  AND p.product_type IN ('homologation', 'language_prep', 'premium_support')
  AND p.target_country IS NOT NULL
  ORDER BY p.created_at DESC;
END;
$$;