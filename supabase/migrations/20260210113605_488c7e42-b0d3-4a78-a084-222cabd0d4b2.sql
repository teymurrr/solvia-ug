
-- Journey updates table
CREATE TABLE public.journey_updates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  milestone_type text NOT NULL DEFAULT 'general', -- exam, language, relocation, document, job, general
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.journey_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read journey updates" ON public.journey_updates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create updates" ON public.journey_updates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own updates" ON public.journey_updates FOR DELETE USING (auth.uid() = user_id);

-- Journey reactions table
CREATE TABLE public.journey_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  update_id uuid NOT NULL REFERENCES public.journey_updates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL, -- 🎉 👏 💪 ❤️
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(update_id, user_id, emoji)
);

ALTER TABLE public.journey_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions" ON public.journey_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can react" ON public.journey_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own reactions" ON public.journey_reactions FOR DELETE USING (auth.uid() = user_id);
