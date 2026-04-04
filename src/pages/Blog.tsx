
import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '@/components/MainLayout';
import { Link } from 'react-router-dom';
import { useBlogPostsOptimized } from '@/hooks/useBlogPostsOptimized';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Settings } from 'lucide-react';
import BlogLanguageSelector from '@/components/blog/BlogLanguageSelector';
import BlogCountryFilter from '@/components/blog/BlogCountryFilter';
import { useLanguage } from '@/hooks/useLanguage';
import BlogListSkeleton from '@/components/ui/blog-list-skeleton';
import { OptimizedImage } from '@/components/ui/optimized-image';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'solvia_blog_country';

const Blog = React.memo(() => {
  const { currentLanguage, t } = useLanguage();
  const { isAdmin } = useAuthOptimized();
  const { user } = useAuth();
  const { posts, loading } = useBlogPostsOptimized(isAdmin, currentLanguage);
  const seo = (t as any)?.seo?.blog;

  const [selectedCountry, setSelectedCountry] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY) || null;
  });
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Auto-select from user profile on first load
  useEffect(() => {
    if (profileLoaded) return;
    if (!user?.id) {
      setProfileLoaded(true);
      return;
    }
    supabase
      .from('professional_profiles')
      .select('study_country')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.study_country && !localStorage.getItem(STORAGE_KEY)) {
          const country = data.study_country.toLowerCase().trim();
          setSelectedCountry(country);
          localStorage.setItem(STORAGE_KEY, country);
        }
        setProfileLoaded(true);
      });
  }, [user?.id, profileLoaded]);

  const handleCountrySelect = (country: string | null) => {
    setSelectedCountry(country);
    if (country) {
      localStorage.setItem(STORAGE_KEY, country);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Get distinct countries from posts
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    posts.forEach(p => {
      if (p.country_tag) countries.add(p.country_tag);
    });
    return Array.from(countries).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => {
      const languageMatch = post.language === currentLanguage;
      if (isAdmin) return languageMatch;
      return languageMatch && post.status === 'published';
    });

    if (selectedCountry) {
      // Show country-specific posts + general posts (no country_tag)
      result = result.filter(p => p.country_tag === selectedCountry || !p.country_tag);
    }

    return result;
  }, [posts, currentLanguage, isAdmin, selectedCountry]);

  return (
    <MainLayout>
      <SEO
        title={seo?.title || 'Medical Career in Europe – Tips, Guides & Success Stories'}
        description={seo?.description || 'Expert articles on medical license recognition, language learning, visa processes, and life as a healthcare professional in Europe.'}
        path="/blog"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4"><span className="text-primary">Solvia</span> {t.blog.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.blog.subtitle}
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <BlogLanguageSelector />
          {isAdmin && (
            <Button variant="outline" asChild>
              <Link to="/admin/blog" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                {t.blog.manageBlog}
              </Link>
            </Button>
          )}
        </div>

        {availableCountries.length > 0 && (
          <div className="mb-8">
            <BlogCountryFilter
              countries={availableCountries}
              selected={selectedCountry}
              onSelect={handleCountrySelect}
            />
          </div>
        )}

        {loading ? (
          <BlogListSkeleton />
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug || post.id}`} className="block">
                <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full">
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
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {post.category && (
                          <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                        )}
                        {isAdmin && post.status === 'draft' && (
                          <Badge variant="outline" className="text-xs bg-gray-100">Draft</Badge>
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
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">{t.blog.noPosts}</h3>
            <p className="text-muted-foreground">
              {currentLanguage !== 'en' 
                ? t.blog.noPostsInLanguage 
                : t.blog.checkBackSoon}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
});

Blog.displayName = 'Blog';

export default Blog;
