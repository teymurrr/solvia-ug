
-- Create community_translations table for caching translated content
CREATE TABLE public.community_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type text NOT NULL CHECK (source_type IN ('post_title', 'post_content', 'reply_content')),
  source_id uuid NOT NULL,
  language text NOT NULL CHECK (language IN ('en', 'de', 'fr', 'es', 'ru')),
  translated_text text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Unique constraint to prevent duplicate translations
ALTER TABLE public.community_translations
  ADD CONSTRAINT community_translations_unique UNIQUE (source_type, source_id, language);

-- Index for fast lookups
CREATE INDEX idx_community_translations_lookup
  ON public.community_translations (source_id, language);

-- Enable RLS
ALTER TABLE public.community_translations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read community translations"
  ON public.community_translations
  FOR SELECT
  USING (true);

-- Only service role can write (edge function uses service role key)
CREATE POLICY "Service role can manage translations"
  ON public.community_translations
  FOR ALL
  USING (true)
  WITH CHECK (true);
