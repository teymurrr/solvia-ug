
CREATE TABLE public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL UNIQUE,
  current_step text NOT NULL DEFAULT 'welcome',
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  lead_id uuid REFERENCES public.leads(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage whatsapp conversations"
  ON public.whatsapp_conversations
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view whatsapp conversations"
  ON public.whatsapp_conversations
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE TRIGGER update_whatsapp_conversations_updated_at
  BEFORE UPDATE ON public.whatsapp_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
