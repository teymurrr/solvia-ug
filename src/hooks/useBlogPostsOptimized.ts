
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';

interface OptimizedBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: 'draft' | 'published';
  language: string;
  created_at: string;
  author_id: string;
}

export const useBlogPostsOptimized = (fetchDrafts = false, language?: string) => {
  const [posts, setPosts] = useState<OptimizedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const { currentLanguage } = useLanguage();

  const queryLanguage = language || currentLanguage;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Optimized query - exclude content field for better performance
        let query = supabase
          .from('blog_posts')
          .select(`
            id, 
            title, 
            slug, 
            category,
            created_at,
            status,
            author_id,
            language
          `)
          .eq('language', queryLanguage)
          .order('created_at', { ascending: false });
        
        if (!fetchDrafts) {
          query = query.eq('status', 'published');
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setPosts(data || []);
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
