ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS country_tag TEXT NULL;

-- Populate country_tag from existing slugs/tags
UPDATE public.blog_posts SET country_tag = 'india' WHERE country_tag IS NULL AND (slug ~* '(india|mbbs|indian)' OR tags ~* '(india|mbbs|indian)');
UPDATE public.blog_posts SET country_tag = 'argentina' WHERE country_tag IS NULL AND (slug ~* 'argentin' OR tags ~* 'argentin');
UPDATE public.blog_posts SET country_tag = 'colombia' WHERE country_tag IS NULL AND (slug ~* 'colombia' OR tags ~* 'colombia');