
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, Eye, Settings } from 'lucide-react';
import BlogLanguageSelector from '@/components/blog/BlogLanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';

const Blog = () => {
  const { currentLanguage } = useLanguage();
  const { isAdmin } = useAdmin();
  const { posts, loading } = useBlogPosts(isAdmin, currentLanguage);

  // Filter posts based on admin status and current language
  const filteredPosts = posts.filter(post => {
    const languageMatch = post.language === currentLanguage;
    
    // If user is admin, show all posts. If not, only show published posts
    if (isAdmin) {
      return languageMatch;
    } else {
      return languageMatch && post.status === 'published';
    }
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-medical-600" />
          <p className="mt-4 text-lg">Loading blog posts...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Solvia Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, updates, and expertise from the healthcare recruitment industry
          </p>
        </div>

        {/* Language Selector and Admin Controls */}
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

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                {post.imageUrl && (
                  <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
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
                    {post.readTime && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2 blog-title">
                    {post.title}
                  </h2>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/blog/${post.id}`} className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        Read More
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground">
              {currentLanguage !== 'en' 
                ? `No posts available in the selected language.` 
                : 'Check back soon for new content.'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Blog;
