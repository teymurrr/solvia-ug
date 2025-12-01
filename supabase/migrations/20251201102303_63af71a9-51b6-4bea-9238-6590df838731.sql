-- Add columns to payments table for manual access tracking
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'stripe',
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS granted_by uuid REFERENCES auth.users(id);

-- Update RLS policies to allow admins to insert manual payments
CREATE POLICY "Admins can insert manual payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Allow admins to update any payment
CREATE POLICY "Admins can update all payments" 
ON public.payments 
FOR UPDATE 
USING (is_admin(auth.uid()));