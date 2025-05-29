
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAdmin } from '@/hooks/useAdmin';
import BlogLanguageSelector from '@/components/blog/BlogLanguageSelector';
import { OptimizedImage } from '@/components/ui/optimized-image';

const Blog = () => {
  const { t } = useLanguage();
  const { posts, loading, error } = useBlogPosts();
  const { isAdmin } = useAdmin();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t?.common?.home || "Home"}
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-4">{t?.blog?.title || "Latest from Our Blog"}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t?.blog?.subtitle || "Insights, stories, and tips for healthcare professionals and recruiters"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <BlogLanguageSelector />
            {isAdmin && (
              <Button asChild>
                <Link to="/admin/blog/new" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Link>
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-medical-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-lg text-red-500">Failed to load blog posts. Please try again later.</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((blog) => (
              <Card key={blog.id} className="border-transparent hover:shadow-lg hover:scale-[1.01] transition-all duration-300 h-[380px] flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  {blog.imageUrl && (
                    <div className="mb-4">
                      <OptimizedImage
                        src={blog.imageUrl}
                        alt={blog.title}
                        aspectRatio={16 / 9}
                        className="rounded-md"
                        containerClassName="w-full"
                      />
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="blog-title text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {blog.category && (
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                        {blog.category}
                      </Badge>
                    )}
                    {blog.language && (
                      <Badge variant="outline" className="text-xs">
                        {blog.language.toUpperCase()}
                      </Badge>
                    )}
                    {isAdmin && blog.status === 'draft' && (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4 flex-grow line-clamp-3 text-sm">{blog.excerpt}</p>
                  {blog.author && (
                    <p className="text-sm text-muted-foreground mb-4">By {blog.author}</p>
                  )}
                  <div className="mt-auto">
                    <Link
                      to={`/blog/${blog.id}`}
                      className="text-medical-600 hover:text-medical-700 font-medium inline-flex items-center group"
                    >
                      {t?.blog?.readMore || "Read More"}
                      <ArrowLeft className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform rotate-180" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl">No blog posts found.</p>
            {isAdmin && (
              <Button asChild className="mt-4">
                <Link to="/admin/blog/new">
                  Create your first post
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Blog;
