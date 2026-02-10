
-- Reputation points table
CREATE TABLE public.user_reputation (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  total_points integer NOT NULL DEFAULT 0,
  posts_count integer NOT NULL DEFAULT 0,
  replies_count integer NOT NULL DEFAULT 0,
  upvotes_received integer NOT NULL DEFAULT 0,
  best_answers_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reputation" ON public.user_reputation FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reputation" ON public.user_reputation FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update reputation" ON public.user_reputation FOR UPDATE USING (true);

-- Badges definition table
CREATE TABLE public.badge_definitions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_de text,
  name_es text,
  name_fr text,
  name_ru text,
  description_en text NOT NULL,
  description_de text,
  description_es text,
  description_fr text,
  description_ru text,
  icon text NOT NULL DEFAULT 'award',
  category text NOT NULL DEFAULT 'general',
  requirement_type text NOT NULL, -- 'posts', 'replies', 'upvotes_received', 'best_answers', 'total_points'
  requirement_value integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view badge definitions" ON public.badge_definitions FOR SELECT USING (true);
CREATE POLICY "Admins can manage badge definitions" ON public.badge_definitions FOR ALL USING (is_admin(auth.uid()));

-- User badges (earned)
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert user badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- Seed badge definitions
INSERT INTO public.badge_definitions (slug, name_en, name_de, name_es, name_fr, name_ru, description_en, icon, category, requirement_type, requirement_value) VALUES
  ('first-post', 'First Post', 'Erster Beitrag', 'Primera publicación', 'Premier post', 'Первый пост', 'Created your first community post', 'pen-line', 'milestone', 'posts', 1),
  ('conversation-starter', 'Conversation Starter', 'Gesprächsstarter', 'Iniciador de conversación', 'Lanceur de conversation', 'Начинатель разговора', 'Created 5 community posts', 'message-square-plus', 'milestone', 'posts', 5),
  ('prolific-writer', 'Prolific Writer', 'Produktiver Schreiber', 'Escritor prolífico', 'Écrivain prolifique', 'Плодовитый автор', 'Created 20 community posts', 'book-open', 'milestone', 'posts', 20),
  ('first-reply', 'Helpful Hand', 'Helfende Hand', 'Mano amiga', 'Main secourable', 'Рука помощи', 'Posted your first reply', 'hand-helping', 'milestone', 'replies', 1),
  ('active-helper', 'Active Helper', 'Aktiver Helfer', 'Ayudante activo', 'Aide actif', 'Активный помощник', 'Posted 10 replies', 'heart-handshake', 'milestone', 'replies', 10),
  ('community-pillar', 'Community Pillar', 'Gemeinschaftsstütze', 'Pilar de la comunidad', 'Pilier de la communauté', 'Опора сообщества', 'Posted 50 replies', 'shield-check', 'milestone', 'replies', 50),
  ('first-upvote', 'Rising Star', 'Aufgehender Stern', 'Estrella en ascenso', 'Étoile montante', 'Восходящая звезда', 'Received your first upvote', 'star', 'engagement', 'upvotes_received', 1),
  ('popular', 'Popular', 'Beliebt', 'Popular', 'Populaire', 'Популярный', 'Received 25 upvotes', 'trending-up', 'engagement', 'upvotes_received', 25),
  ('thought-leader', 'Thought Leader', 'Vordenker', 'Líder de opinión', 'Leader d''opinion', 'Лидер мнений', 'Received 100 upvotes', 'crown', 'engagement', 'upvotes_received', 100),
  ('expert-answer', 'Expert Answer', 'Expertenantwort', 'Respuesta experta', 'Réponse d''expert', 'Экспертный ответ', 'Had a reply marked as Best Answer', 'check-circle', 'expertise', 'best_answers', 1),
  ('homologation-expert', 'Homologation Expert', 'Homologationsexperte', 'Experto en homologación', 'Expert en homologation', 'Эксперт по гомологации', 'Had 5 Best Answers', 'award', 'expertise', 'best_answers', 5),
  ('community-leader', 'Community Leader', 'Community-Leiter', 'Líder de la comunidad', 'Leader communautaire', 'Лидер сообщества', 'Earned 500 total points', 'trophy', 'prestige', 'total_points', 500);

-- Point values: post=5, reply=3, upvote_received=2, best_answer=15

-- Function to update reputation and check badges
CREATE OR REPLACE FUNCTION public.update_reputation_on_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_reputation (user_id, total_points, posts_count)
  VALUES (NEW.user_id, 5, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET total_points = user_reputation.total_points + 5,
      posts_count = user_reputation.posts_count + 1,
      updated_at = now();
  
  -- Check and award badges
  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT NEW.user_id, bd.id
  FROM public.badge_definitions bd
  LEFT JOIN public.user_badges ub ON ub.user_id = NEW.user_id AND ub.badge_id = bd.id
  WHERE ub.id IS NULL
    AND bd.requirement_type = 'posts'
    AND bd.requirement_value <= (SELECT posts_count FROM public.user_reputation WHERE user_id = NEW.user_id)
  ON CONFLICT DO NOTHING;

  -- Check total_points badges
  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT NEW.user_id, bd.id
  FROM public.badge_definitions bd
  LEFT JOIN public.user_badges ub ON ub.user_id = NEW.user_id AND ub.badge_id = bd.id
  WHERE ub.id IS NULL
    AND bd.requirement_type = 'total_points'
    AND bd.requirement_value <= (SELECT total_points FROM public.user_reputation WHERE user_id = NEW.user_id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_reputation_on_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_reputation (user_id, total_points, replies_count)
  VALUES (NEW.user_id, 3, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET total_points = user_reputation.total_points + 3,
      replies_count = user_reputation.replies_count + 1,
      updated_at = now();
  
  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT NEW.user_id, bd.id
  FROM public.badge_definitions bd
  LEFT JOIN public.user_badges ub ON ub.user_id = NEW.user_id AND ub.badge_id = bd.id
  WHERE ub.id IS NULL
    AND bd.requirement_type = 'replies'
    AND bd.requirement_value <= (SELECT replies_count FROM public.user_reputation WHERE user_id = NEW.user_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT NEW.user_id, bd.id
  FROM public.badge_definitions bd
  LEFT JOIN public.user_badges ub ON ub.user_id = NEW.user_id AND ub.badge_id = bd.id
  WHERE ub.id IS NULL
    AND bd.requirement_type = 'total_points'
    AND bd.requirement_value <= (SELECT total_points FROM public.user_reputation WHERE user_id = NEW.user_id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_reputation_on_vote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Find the author of the post or reply that was upvoted
    IF NEW.post_id IS NOT NULL THEN
      SELECT user_id INTO target_user_id FROM public.community_posts WHERE id = NEW.post_id;
    ELSIF NEW.reply_id IS NOT NULL THEN
      SELECT user_id INTO target_user_id FROM public.community_replies WHERE id = NEW.reply_id;
    END IF;

    IF target_user_id IS NOT NULL AND target_user_id != NEW.user_id THEN
      INSERT INTO public.user_reputation (user_id, total_points, upvotes_received)
      VALUES (target_user_id, 2, 1)
      ON CONFLICT (user_id) DO UPDATE
      SET total_points = user_reputation.total_points + 2,
          upvotes_received = user_reputation.upvotes_received + 1,
          updated_at = now();

      INSERT INTO public.user_badges (user_id, badge_id)
      SELECT target_user_id, bd.id
      FROM public.badge_definitions bd
      LEFT JOIN public.user_badges ub ON ub.user_id = target_user_id AND ub.badge_id = bd.id
      WHERE ub.id IS NULL
        AND bd.requirement_type = 'upvotes_received'
        AND bd.requirement_value <= (SELECT upvotes_received FROM public.user_reputation WHERE user_id = target_user_id)
      ON CONFLICT DO NOTHING;

      INSERT INTO public.user_badges (user_id, badge_id)
      SELECT target_user_id, bd.id
      FROM public.badge_definitions bd
      LEFT JOIN public.user_badges ub ON ub.user_id = target_user_id AND ub.badge_id = bd.id
      WHERE ub.id IS NULL
        AND bd.requirement_type = 'total_points'
        AND bd.requirement_value <= (SELECT total_points FROM public.user_reputation WHERE user_id = target_user_id)
      ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      SELECT user_id INTO target_user_id FROM public.community_posts WHERE id = OLD.post_id;
    ELSIF OLD.reply_id IS NOT NULL THEN
      SELECT user_id INTO target_user_id FROM public.community_replies WHERE id = OLD.reply_id;
    END IF;

    IF target_user_id IS NOT NULL AND target_user_id != OLD.user_id THEN
      UPDATE public.user_reputation
      SET total_points = GREATEST(total_points - 2, 0),
          upvotes_received = GREATEST(upvotes_received - 1, 0),
          updated_at = now()
      WHERE user_id = target_user_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers
CREATE TRIGGER reputation_on_post
  AFTER INSERT ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reputation_on_post();

CREATE TRIGGER reputation_on_reply
  AFTER INSERT ON public.community_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reputation_on_reply();

CREATE TRIGGER reputation_on_vote
  AFTER INSERT OR DELETE ON public.community_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reputation_on_vote();

-- Trigger for updated_at
CREATE TRIGGER update_user_reputation_updated_at
  BEFORE UPDATE ON public.user_reputation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
