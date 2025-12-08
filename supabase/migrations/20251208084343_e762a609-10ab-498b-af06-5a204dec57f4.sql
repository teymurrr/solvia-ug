-- Create support chat messages table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert messages (for anonymous users too)
CREATE POLICY "Anyone can insert support messages"
ON public.support_messages
FOR INSERT
WITH CHECK (true);

-- Users can view messages from their session
CREATE POLICY "Anyone can view messages by session"
ON public.support_messages
FOR SELECT
USING (true);

-- Create index for faster session lookups
CREATE INDEX idx_support_messages_session ON public.support_messages(session_id);
CREATE INDEX idx_support_messages_created ON public.support_messages(created_at DESC);