import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPostDetail {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: 'draft' | 'published';
  category: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  language: string;
  readTime: string;
  imageUrl?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: string | null;
  post_group_id?: string | null;
  view_count?: number | null;
  like_count?: number | null;
}

export interface BlogPostTranslation {
  id: string;
  title: string;
  slug: string;
  language: string;
  status: string;
}

export const useSingleBlogPostBySlug = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    const fetchPost = async () => {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (data) {
          setPost({
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            imageUrl: data.image_url,
            category: data.category,
            readTime: data.read_time || '',
            author_id: data.author_id,
            status: data.status,
            language: data.language,
            post_group_id: data.post_group_id,
            created_at: data.created_at,
            updated_at: data.updated_at,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            tags: data.tags,
            view_count: data.view_count,
            like_count: data.like_count,
          });

          // Fetch translations
          if (data.post_group_id) {
            const { data: translationsData } = await supabase
              .from('blog_posts')
              .select('id, title, slug, language, status')
              .eq('post_group_id', data.post_group_id)
              .neq('id', data.id);

            if (translationsData) {
              setTranslations(translationsData.map(t => ({
                ...t,
                excerpt: '',
                content: '',
                imageUrl: '',
                date: '',
                author_id: '',
                category: null,
                readTime: '',
                post_group_id: data.post_group_id,
              })));
            }
          }
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, toast]);

  return { post, loading, error, translations };
};
