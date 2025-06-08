
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Link } from 'react-router-dom';
import { useBlogPostsOptimized } from '@/hooks/useBlogPostsOptimized';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Settings } from 'lucide-react';
import BlogLanguageSelector from '@/components/blog/BlogLanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import BlogListSkeleton from '@/components/ui/blog-list-skeleton';
import { OptimizedImage } from '@/components/ui/optimized-image';

const Blog = React.memo(() => {
  const { currentLanguage, t } = useLanguage();
  const { isAdmin } = useAuthOptimized();
  const { posts, loading } = useBlogPostsOptimized(isAdmin, currentLanguage);

  console.log('Current language:', currentLanguage);
  console.log('All posts fetched:', posts);
  console.log('Posts count:', posts.length);

  const filteredPosts = posts.filter(post => {
    const languageMatch = post.language === currentLanguage;
    console.log(`Post "${post.title}" - Language: ${post.language}, Current: ${currentLanguage}, Match: ${languageMatch}`);
    
    if (isAdmin) {
      return languageMatch;
    } else {
      const statusMatch = post.status === 'published';
      console.log(`Post "${post.title}" - Status: ${post.status}, Published: ${statusMatch}`);
      return languageMatch && statusMatch;
    }
  });

  console.log('Filtered posts:', filteredPosts);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Solvia Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.blog.subtitle}
            </p>
          </div>
          <BlogListSkeleton />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Solvia Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.blog.subtitle}
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <BlogLanguageSelector />
          
          {isAdmin && (
            <Button variant="outline" asChild>
              <Link to="/admin/blog" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Manage Blog
              </Link>
            </Button>
          )}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="block h-full"
                aria-label={`Read blog post: ${post.title}`}
              >
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
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        )}
                        {isAdmin && post.status === 'draft' && (
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
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">
              {currentLanguage === 'es' ? 'No se encontraron publicaciones de blog' : 'No blog posts found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {currentLanguage === 'es' 
                ? `No hay publicaciones disponibles en español. Total de publicaciones: ${posts.length}` 
                : `No posts available in the selected language. Total posts: ${posts.length}`}
            </p>
            {isAdmin && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'es' 
                    ? 'Como administrador, puedes crear nuevas publicaciones o cambiar el idioma de las existentes.' 
                    : 'As an admin, you can create new posts or change the language of existing posts.'}
                </p>
                <Button asChild>
                  <Link to="/admin/blog">
                    {currentLanguage === 'es' ? 'Gestionar Blog' : 'Manage Blog'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
});

Blog.displayName = 'Blog';

export default Blog;
