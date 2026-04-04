
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from '@/types/landing';
import { useLanguage } from '@/hooks/useLanguage';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { OptimizedImage } from "@/components/ui/optimized-image";

interface BlogSectionProps {
  posts?: BlogPost[];
}

const STORAGE_KEY = 'solvia_blog_country';

const BlogSection: React.FC<BlogSectionProps> = ({ posts: propsPosts }) => {
  const { t } = useLanguage();
  const { posts: fetchedPosts, loading } = useBlogPosts();
  
  const posts = propsPosts || fetchedPosts;

  // Prioritize country-relevant posts for returning users
  const displayPosts = useMemo(() => {
    const savedCountry = localStorage.getItem(STORAGE_KEY);
    if (!savedCountry || posts.length <= 3) {
      return posts.slice(0, 3);
    }

    // Sort: country-specific posts first, then general
    const sorted = [...posts].sort((a, b) => {
      const aMatch = (a as any).country_tag === savedCountry ? -1 : 0;
      const bMatch = (b as any).country_tag === savedCountry ? -1 : 0;
      return aMatch - bMatch;
    });

    return sorted.slice(0, 3);
  }, [posts]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-black mb-3">{t?.blog?.title || "Latest from Our Blog"}</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t?.blog?.subtitle || "Insights, stories, and tips for healthcare professionals and recruiters"}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : displayPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug || post.id}`} className="block">
                <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full">
                  {post.imageUrl && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <OptimizedImage
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        useAspectRatio={false}
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {post.category && (
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        )}
                        {post.status === 'draft' && (
                          <Badge variant="outline" className="text-xs bg-gray-100">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2 blog-title">
                      {post.title}
                    </h2>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {loading ? "Loading blog posts..." : "No blog posts available yet."}
            </p>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Button variant="outline" asChild className="group">
            <Link to="/blog" className="flex items-center">
              {t?.blog?.viewMore || "View More"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
