
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogStatistics {
  total_posts: number;
  posts_this_month: number;
  total_views: number;
  views_this_month: number;
  total_likes: number;
  total_comments: number;
}

export interface TopPost {
  id: string;
  title: string;
  view_count: number;
  like_count: number;
  category: string;
}

export interface AuthorStats {
  author_id: string;
  post_count: number;
  total_views: number;
  total_likes: number;
}

export interface ViewsOverTime {
  date: string;
  views: number;
}

export const useBlogStatistics = () => {
  const [statistics, setStatistics] = useState<BlogStatistics | null>(null);
  const [topViewedPosts, setTopViewedPosts] = useState<TopPost[]>([]);
  const [topLikedPosts, setTopLikedPosts] = useState<TopPost[]>([]);
  const [authorStats, setAuthorStats] = useState<AuthorStats[]>([]);
  const [viewsOverTime, setViewsOverTime] = useState<ViewsOverTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get main statistics
      const { data: statsData, error: statsError } = await supabase.rpc('get_blog_statistics');
      
      if (statsError) throw statsError;
      
      setStatistics(statsData);

      // Get top viewed posts
      const { data: topViewed, error: topViewedError } = await supabase
        .from('blog_posts')
        .select('id, title, view_count, like_count, category')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(5);

      if (topViewedError) throw topViewedError;
      setTopViewedPosts(topViewed || []);

      // Get top liked posts
      const { data: topLiked, error: topLikedError } = await supabase
        .from('blog_posts')
        .select('id, title, view_count, like_count, category')
        .eq('status', 'published')
        .order('like_count', { ascending: false })
        .limit(5);

      if (topLikedError) throw topLikedError;
      setTopLikedPosts(topLiked || []);

      // Get author statistics
      const { data: authors, error: authorsError } = await supabase
        .from('blog_posts')
        .select('author_id, view_count, like_count')
        .eq('status', 'published');

      if (authorsError) throw authorsError;

      // Group by author and calculate stats
      const authorMap = new Map<string, AuthorStats>();
      authors?.forEach(post => {
        const existing = authorMap.get(post.author_id) || {
          author_id: post.author_id,
          post_count: 0,
          total_views: 0,
          total_likes: 0
        };
        
        authorMap.set(post.author_id, {
          ...existing,
          post_count: existing.post_count + 1,
          total_views: existing.total_views + (post.view_count || 0),
          total_likes: existing.total_likes + (post.like_count || 0)
        });
      });

      setAuthorStats(Array.from(authorMap.values()).sort((a, b) => b.post_count - a.post_count).slice(0, 5));

      // Get views over time (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: viewsData, error: viewsError } = await supabase
        .from('blog_post_views')
        .select('viewed_at')
        .gte('viewed_at', thirtyDaysAgo.toISOString())
        .order('viewed_at');

      if (viewsError) throw viewsError;

      // Group views by date
      const viewsByDate = new Map<string, number>();
      viewsData?.forEach(view => {
        const date = new Date(view.viewed_at).toISOString().split('T')[0];
        viewsByDate.set(date, (viewsByDate.get(date) || 0) + 1);
      });

      const viewsTimeData = Array.from(viewsByDate.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setViewsOverTime(viewsTimeData);

    } catch (err) {
      console.error('Error fetching blog statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      toast({
        title: 'Error',
        description: 'Failed to load blog statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    topViewedPosts,
    topLikedPosts,
    authorStats,
    viewsOverTime,
    loading,
    error,
    refetch: fetchStatistics
  };
};
