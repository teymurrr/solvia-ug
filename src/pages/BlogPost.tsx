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
import { ArrowLeft, Calendar, Clock, Eye, Share2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { post, loading, error, translations } = useSingleBlogPostBySlug(slug);

  useEffect(() => {
    if (post?.id) {
      supabase.rpc('increment_blog_view_count', { post_id: post.id }).then(() => {});
    }
  }, [post?.id]);

  useEffect(() => {
    if (slug && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
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
      await navigator.share({ title: post?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-14 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[450px] w-full mb-10 rounded-2xl" />
          <div className="space-y-4 max-w-3xl">
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
        <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
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

  const hreflangOverrides: Record<string, string> = {
    [post.language || 'en']: `/blog/${post.slug}`,
    ...Object.fromEntries(
      translations
        .filter(t => t.slug && t.language)
        .map(t => [t.language, `/blog/${t.slug}`])
    ),
  };

  return (
    <MainLayout>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        path={`/blog/${post.slug}`}
        ogImage={post.imageUrl}
        ogType="article"
        hreflangOverrides={hreflangOverrides}
      />
      <StructuredData data={[articleSchema, breadcrumbSchema]} />

      {/* Full-width hero image */}
      {post.imageUrl && (
        <div className="w-full h-[280px] sm:h-[360px] md:h-[420px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background z-10" />
          <OptimizedImage
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            useAspectRatio={false}
          />
        </div>
      )}

      <article className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section — centered, wide */}
        <header className={`max-w-3xl mx-auto ${post.imageUrl ? '-mt-16 relative z-20' : 'pt-10'}`}>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="text-muted-foreground/50">/</span>
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            {post.category && (
              <>
                <span className="text-muted-foreground/50">/</span>
                <Link to={`/blog?category=${post.category}`} className="hover:text-foreground transition-colors capitalize">
                  {post.category}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Badge className="bg-primary/10 text-primary border-0 text-sm capitalize font-medium">
                {post.category}
              </Badge>
            )}
            {post.status === 'draft' && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700">Draft</Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15] font-bold tracking-tight text-foreground mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border/60">
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
              <Share2 className="h-4 w-4 mr-1.5" /> Share
            </Button>
          </div>

          {translations.length > 0 && (
            <div className="mt-4">
              <BlogTranslations translations={translations} currentLanguage={post.language || 'en'} />
            </div>
          )}
        </header>

        {/* Main content: TOC left, article right */}
        <div className="mt-10 xl:grid xl:grid-cols-[240px_1fr] xl:gap-12 max-w-screen-xl">
          {/* Left sidebar TOC — desktop only */}
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <TableOfContents content={post.content} />
            </div>
          </aside>

          {/* Article body */}
          <div className="max-w-3xl">
            {/* Mobile TOC */}
            <div className="xl:hidden mb-8">
              <TableOfContents content={post.content} />
            </div>

            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:text-[1.0625rem]
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-li:text-muted-foreground prose-li:leading-[1.8]
                prose-img:rounded-xl prose-img:shadow-md
                prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-5
                prose-table:text-sm prose-th:bg-muted prose-th:px-4 prose-th:py-2.5 prose-td:px-4 prose-td:py-2.5 prose-td:border-border
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/60">
                {post.tags.split(',').map((tag) => (
                  <Badge key={tag.trim()} variant="outline" className="text-xs font-normal">
                    #{tag.trim()}
                  </Badge>
                ))}
              </div>
            )}

            <AuthorBio />
            <BlogComments blogPostId={post.id} />
          </div>
        </div>

        {/* Related Posts — full width */}
        <div className="max-w-screen-xl">
          <RelatedPosts
            currentPostId={post.id}
            category={post.category}
            language={post.language || 'en'}
          />
        </div>
      </article>
    </MainLayout>
  );
};

export default BlogPost;
