import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import SEO from '@/components/SEO';
import StructuredData, { createArticleSchema } from '@/components/StructuredData';
import { useSingleBlogPostBySlug } from '@/hooks/useBlogPostBySlug';
import BlogComments from '@/components/blog/BlogComments';
import BlogTranslations from '@/components/blog/BlogTranslations';
import TableOfContents from '@/components/blog/TableOfContents';
import RelatedPosts from '@/components/blog/RelatedPosts';
import AuthorBio from '@/components/blog/AuthorBio';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { post, loading, error, translations } = useSingleBlogPostBySlug(slug);

  // Track page view
  useEffect(() => {
    if (post?.id) {
      supabase.rpc('increment_blog_view_count', { post_id: post.id }).then(() => {});
    }
  }, [post?.id]);

  // Handle UUID-based URLs — redirect to slug
  useEffect(() => {
    if (slug && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
      // This is a UUID, fetch the post and redirect to slug
      supabase
        .from('blog_posts')
        .select('slug')
        .eq('id', slug)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.slug) {
            navigate(`/blog/${data.slug}`, { replace: true });
          }
        });
    }
  }, [slug, navigate]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">← {t?.blog?.backToBlog || 'Back to Blog'}</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const articleSchema = createArticleSchema({
    title: post.title,
    description: post.meta_description || post.excerpt,
    image: post.imageUrl,
    datePublished: post.created_at,
    dateModified: post.updated_at,
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solvia-flexkapg.lovable.app/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://solvia-flexkapg.lovable.app/blog' },
      ...(post.category ? [{ '@type': 'ListItem', position: 3, name: post.category, item: `https://solvia-flexkapg.lovable.app/blog?category=${post.category}` }] : []),
      { '@type': 'ListItem', position: post.category ? 4 : 3, name: post.title },
    ],
  };

  const readingTime = post.readTime || `${Math.max(1, Math.ceil((post.content?.length || 0) / 1500))} min read`;

  return (
    <MainLayout>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        path={`/blog/${post.slug}`}
        ogImage={post.imageUrl}
        ogType="article"
      />
      <StructuredData data={[articleSchema, breadcrumbSchema]} />

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          {post.category && (
            <>
              <span>/</span>
              <Link to={`/blog?category=${post.category}`} className="hover:text-foreground transition-colors capitalize">
                {post.category}
              </Link>
            </>
          )}
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Badge variant="secondary" className="text-sm capitalize">{post.category}</Badge>
            )}
            {post.status === 'draft' && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700">Draft</Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-foreground">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{readingTime}</span>
            </div>
            {post.view_count != null && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.view_count} views</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>

          {/* Translations */}
          {translations.length > 0 && (
            <BlogTranslations translations={translations} currentLanguage={post.language || 'en'} />
          )}
        </header>

        {/* Hero Image */}
        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-10 shadow-lg">
            <OptimizedImage
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
              useAspectRatio={false}
            />
          </div>
        )}

        {/* Content layout with TOC */}
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-10">
          <div>
            {/* Article content */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                {post.tags.split(',').map((tag) => (
                  <Badge key={tag.trim()} variant="outline" className="text-xs">
                    #{tag.trim()}
                  </Badge>
                ))}
              </div>
            )}

            {/* Author Bio */}
            <AuthorBio />

            {/* Comments */}
            <BlogComments blogPostId={post.id} />
          </div>

          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        <RelatedPosts
          currentPostId={post.id}
          category={post.category}
          language={post.language || 'en'}
        />
      </article>
    </MainLayout>
  );
};

export default BlogPost;
