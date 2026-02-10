
-- Community Posts table
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'homologation',
  tags text[] DEFAULT '{}',
  upvotes integer NOT NULL DEFAULT 0,
  reply_count integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Community Replies table
CREATE TABLE public.community_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  upvotes integer NOT NULL DEFAULT 0,
  is_best_answer boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- Community Votes table
CREATE TABLE public.community_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES public.community_replies(id) ON DELETE CASCADE,
  vote_type text NOT NULL DEFAULT 'up',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vote_target_check CHECK (
    (post_id IS NOT NULL AND reply_id IS NULL) OR 
    (post_id IS NULL AND reply_id IS NOT NULL)
  )
);

ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

-- Unique constraints to prevent duplicate votes
CREATE UNIQUE INDEX community_votes_user_post_idx ON public.community_votes(user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX community_votes_user_reply_idx ON public.community_votes(user_id, reply_id) WHERE reply_id IS NOT NULL;

-- RLS: community_posts
CREATE POLICY "Anyone can read community posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any post" ON public.community_posts FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete any post" ON public.community_posts FOR DELETE USING (is_admin(auth.uid()));

-- RLS: community_replies
CREATE POLICY "Anyone can read community replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.community_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replies" ON public.community_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replies" ON public.community_replies FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any reply" ON public.community_replies FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete any reply" ON public.community_replies FOR DELETE USING (is_admin(auth.uid()));

-- RLS: community_votes
CREATE POLICY "Anyone can read community votes" ON public.community_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create votes" ON public.community_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON public.community_votes FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at on posts
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on replies
CREATE TRIGGER update_community_replies_updated_at
  BEFORE UPDATE ON public.community_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update reply_count on community_posts
CREATE OR REPLACE FUNCTION public.update_community_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET reply_count = reply_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_community_post_reply_count
  AFTER INSERT OR DELETE ON public.community_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_community_reply_count();

-- Function to update upvotes count
CREATE OR REPLACE FUNCTION public.update_community_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.community_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSIF NEW.reply_id IS NOT NULL THEN
      UPDATE public.community_replies SET upvotes = upvotes + 1 WHERE id = NEW.reply_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.community_posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.post_id;
    ELSIF OLD.reply_id IS NOT NULL THEN
      UPDATE public.community_replies SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.reply_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_community_vote_counts
  AFTER INSERT OR DELETE ON public.community_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_community_vote_count();
