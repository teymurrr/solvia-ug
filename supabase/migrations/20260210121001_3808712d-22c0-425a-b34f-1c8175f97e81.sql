
-- Create mentor_profiles table
CREATE TABLE public.mentor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bio TEXT,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  languages_spoken TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT NOT NULL DEFAULT 'available',
  max_mentees INTEGER NOT NULL DEFAULT 3,
  current_mentees INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT mentor_availability_check CHECK (availability IN ('available', 'limited', 'unavailable')),
  UNIQUE(user_id)
);

-- Create mentor_requests table
CREATE TABLE public.mentor_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT request_status_check CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  UNIQUE(mentor_id, mentee_id)
);

-- Enable RLS
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;

-- Mentor profiles policies: anyone can view active mentors
CREATE POLICY "Anyone can view active mentor profiles"
  ON public.mentor_profiles FOR SELECT
  USING (is_active = true);

-- Users can manage their own mentor profile
CREATE POLICY "Users can create their own mentor profile"
  ON public.mentor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mentor profile"
  ON public.mentor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mentor profile"
  ON public.mentor_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Mentor requests policies
CREATE POLICY "Mentors can view their requests"
  ON public.mentor_requests FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.mentor_profiles WHERE id = mentor_id
  ) OR auth.uid() = mentee_id);

CREATE POLICY "Users can create mentor requests"
  ON public.mentor_requests FOR INSERT
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Mentors can update request status"
  ON public.mentor_requests FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.mentor_profiles WHERE id = mentor_id
  ) OR auth.uid() = mentee_id);

-- Trigger for updated_at
CREATE TRIGGER update_mentor_profiles_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentor_requests_updated_at
  BEFORE UPDATE ON public.mentor_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update mentee count on request accept
CREATE OR REPLACE FUNCTION public.update_mentor_mentee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    UPDATE public.mentor_profiles
    SET current_mentees = current_mentees + 1
    WHERE id = NEW.mentor_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'accepted' AND NEW.status IN ('declined', 'cancelled') THEN
    UPDATE public.mentor_profiles
    SET current_mentees = GREATEST(current_mentees - 1, 0)
    WHERE id = NEW.mentor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_mentee_count
  AFTER UPDATE ON public.mentor_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_mentor_mentee_count();
