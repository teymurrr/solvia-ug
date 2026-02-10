-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
ON public.applied_vacancies
FOR SELECT
USING (is_admin(auth.uid()));

-- Allow admins to update application status
CREATE POLICY "Admins can update all applications"
ON public.applied_vacancies
FOR UPDATE
USING (is_admin(auth.uid()));