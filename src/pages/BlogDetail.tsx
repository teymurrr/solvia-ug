
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSingleBlogPost } from '@/hooks/useBlogPosts';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import BlogComments from '@/components/blog/BlogComments';
import BlogTranslations from '@/components/blog/BlogTranslations';
import { useAdmin } from '@/hooks/useAdmin';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, loading, error, translations } = useSingleBlogPost(id);
  const { t, currentLanguage } = useLanguage();
  const { isAdmin } = useAdmin();
  
  useEffect(() => {
    // Redirect to blog listing if post is not found and not loading
    if (!loading && !post) {
      navigate('/blog', { replace: true });
    }
  }, [post, loading, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-medical-600" />
          <p className="mt-4 text-lg">Loading post...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" asChild className="flex items-center">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          {isAdmin && (
            <Button variant="outline" asChild className="flex items-center">
              <Link to={`/admin/blog/edit/${post.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Post
              </Link>
            </Button>
          )}
        </div>

        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              {post.author && <span>By {post.author}</span>}
              {post.category && (
                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                  {post.category}
                </Badge>
              )}
              {post.language && (
                <Badge variant="outline" className="text-xs">
                  {post.language.toUpperCase()}
                </Badge>
              )}
              {isAdmin && post.status === 'draft' && (
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                  Draft
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Show available translations */}
          <BlogTranslations translations={translations} currentLanguage={currentLanguage} />

          {post.imageUrl && (
            <div className="mb-8">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">{post.excerpt}</p>
            
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>The content of this post is not available.</p>
            )}
          </div>
          
          {/* Comments section */}
          {id && <BlogComments blogPostId={id} />}
        </article>
      </div>
    </MainLayout>
  );
};

export default BlogDetail;
