
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/landing';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';

export const useBlogPosts = (fetchDrafts = false, language?: string) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const { currentLanguage } = useLanguage();

  // Use provided language or fall back to current language
  const queryLanguage = language || currentLanguage;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('blog_posts')
          .select(`
            id, 
            title, 
            slug, 
            excerpt, 
            content, 
            image_url,
            category,
            read_time,
            created_at,
            updated_at,
            status,
            author_id,
            language,
            post_group_id
          `)
          .eq('language', queryLanguage)
          .order('created_at', { ascending: false });
        
        // Only fetch published posts unless fetchDrafts is true
        if (!fetchDrafts) {
          query = query.eq('status', 'published');
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Map the data to match our BlogPost type
        const formattedPosts: BlogPost[] = data.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.image_url,
          date: post.created_at,
          category: post.category,
          readTime: post.read_time,
          author_id: post.author_id,
          status: post.status,
          language: post.language,
          post_group_id: post.post_group_id,
        }));
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to fetch blog posts');
        toast({
          title: 'Error',
          description: 'Failed to fetch blog posts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn || !fetchDrafts) {
      fetchPosts();
    }
  }, [fetchDrafts, toast, isLoggedIn, queryLanguage]);

  return { posts, loading, error };
};

export const useSingleBlogPost = (id: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id, 
            title, 
            slug, 
            excerpt, 
            content, 
            image_url,
            category,
            read_time,
            created_at,
            updated_at,
            status,
            author_id,
            language,
            post_group_id
          `)
          .eq('id', id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          const formattedPost: BlogPost = {
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            imageUrl: data.image_url,
            date: data.created_at,
            category: data.category,
            readTime: data.read_time,
            author_id: data.author_id,
            status: data.status,
            language: data.language,
            post_group_id: data.post_group_id,
          };
          
          setPost(formattedPost);

          // Fetch translations if post_group_id exists
          if (data.post_group_id) {
            const { data: translationsData } = await supabase
              .from('blog_posts')
              .select(`
                id, title, language, status
              `)
              .eq('post_group_id', data.post_group_id)
              .neq('id', id);
            
            if (translationsData) {
              setTranslations(translationsData.map(t => ({
                ...t,
                // Add minimal required fields for BlogPost type
                slug: '',
                excerpt: '',
                content: '',
                imageUrl: '',
                date: '',
                author_id: '',
              })));
            }
          }
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to fetch blog post');
        toast({
          title: 'Error',
          description: 'Failed to fetch blog post',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  return { post, loading, error, translations };
};
