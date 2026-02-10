
-- Digest preferences table
CREATE TABLE public.digest_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'daily', 'never')),
  categories TEXT[] NOT NULL DEFAULT ARRAY['homologation', 'language', 'fsp', 'life-abroad', 'job-search', 'journey'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.digest_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own preferences
CREATE POLICY "Users can view own digest preferences"
  ON public.digest_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can create own digest preferences"
  ON public.digest_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own digest preferences"
  ON public.digest_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can read all (for the digest edge function)
CREATE POLICY "Service role can read all digest preferences"
  ON public.digest_preferences FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_digest_preferences_updated_at
  BEFORE UPDATE ON public.digest_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
