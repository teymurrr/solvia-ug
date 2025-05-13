
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { featuredBlogs } from '@/data/landingPageData';
import { BlogPost } from '@/types/landing';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Find the blog post by ID
    const foundPost = featuredBlogs.find(blog => blog.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id]);

  if (!post) {
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
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/blog" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              {post.author && <span>By {post.author}</span>}
              {post.category && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {post.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>

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
              <>
                <p className="mb-4">
                  The healthcare industry is rapidly evolving, and recruitment practices are no exception. As technology continues to advance, we're seeing significant changes in how healthcare professionals find positions and how institutions identify qualified candidates.
                </p>
                <p className="mb-4">
                  Artificial intelligence is playing an increasingly important role in matching healthcare professionals with the right positions. By analyzing skills, experience, preferences, and even personality traits, AI can identify potential matches that might otherwise be overlooked.
                </p>
                <h2 className="text-2xl font-bold my-4">Global Opportunities</h2>
                <p className="mb-4">
                  The healthcare industry is becoming increasingly global, with professionals seeking opportunities across borders. This trend is driven by several factors, including:
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li className="mb-2">Higher compensation in certain regions</li>
                  <li className="mb-2">Better work-life balance</li>
                  <li className="mb-2">Opportunities for professional growth</li>
                  <li className="mb-2">Desire to experience different healthcare systems</li>
                </ul>
                <p className="mb-4">
                  Digital platforms like Solvia are making it easier than ever for healthcare professionals to explore international opportunities. By providing information on licensing requirements, language proficiency, and cultural considerations, these platforms help professionals navigate the complexities of working abroad.
                </p>
                <h2 className="text-2xl font-bold my-4">The Future of Healthcare Recruitment</h2>
                <p className="mb-4">
                  As we look to the future, several trends are likely to shape healthcare recruitment:
                </p>
                <ol className="list-decimal ml-6 mb-4">
                  <li className="mb-2">Increased use of AI and machine learning to match candidates with positions</li>
                  <li className="mb-2">Greater emphasis on soft skills and cultural fit</li>
                  <li className="mb-2">More focus on remote and hybrid work options</li>
                  <li className="mb-2">Growth of gig economy in healthcare</li>
                </ol>
                <p>
                  By staying informed about these trends and embracing new technologies, healthcare professionals and institutions can position themselves for success in an evolving landscape.
                </p>
              </>
            )}
          </div>
        </article>
      </div>
    </MainLayout>
  );
};

export default BlogDetail;
