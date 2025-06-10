
-- Create a table for learning form submissions
CREATE TABLE public.learning_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  profession TEXT NOT NULL,
  german_language BOOLEAN NOT NULL DEFAULT false,
  fsp_preparation BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - allow anyone to insert (public form)
ALTER TABLE public.learning_form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert form submissions
CREATE POLICY "Anyone can submit learning forms" 
  ON public.learning_form_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows admins to view all submissions
CREATE POLICY "Admins can view all learning form submissions" 
  ON public.learning_form_submissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
