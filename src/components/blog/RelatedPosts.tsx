import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface RelatedPostsProps {
  currentPostId: string;
  category: string | null;
  language: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId, category, language }) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      let query = supabase
        .from('blog_posts')
        .select('id, title, slug, image_url, category, created_at')
        .eq('status', 'published')
        .eq('language', language)
        .neq('id', currentPostId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (category) {
        query = query.eq('category', category);
      }

      const { data } = await query;

      if (data && data.length > 0) {
        setPosts(data);
      } else if (category) {
        // Fallback: get any posts if category has none
        const { data: fallback } = await supabase
          .from('blog_posts')
          .select('id, title, slug, image_url, category, created_at')
          .eq('status', 'published')
          .eq('language', language)
          .neq('id', currentPostId)
          .order('created_at', { ascending: false })
          .limit(3);

        if (fallback) setPosts(fallback);
      }
    };

    fetchRelated();
  }, [currentPostId, category, language]);

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="block">
            <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
              {post.image_url && (
                <div className="aspect-[16/9] overflow-hidden">
                  <OptimizedImage
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    useAspectRatio={false}
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                {post.category && (
                  <Badge variant="secondary" className="text-xs w-fit capitalize">{post.category}</Badge>
                )}
                <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
