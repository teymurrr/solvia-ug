-- Drop existing insert policy if exists
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;

-- Create new insert policy that allows both authenticated users and guest checkout
CREATE POLICY "Allow payment creation for users and guests" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  -- Allow if user_id matches the authenticated user
  (auth.uid() = user_id) 
  OR 
  -- Allow guest checkout (user_id is null)
  (user_id IS NULL)
);

-- Ensure the update and select policies exist for users
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;
CREATE POLICY "Users can update their own payments" 
ON public.payments 
FOR UPDATE 
USING (auth.uid() = user_id);