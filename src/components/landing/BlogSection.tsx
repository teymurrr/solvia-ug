
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from '@/types/landing';
import { useLanguage } from '@/hooks/useLanguage';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useBlogPosts } from '@/hooks/useBlogPosts';

interface BlogSectionProps {
  posts?: BlogPost[]; // Make posts optional since we'll fetch if not provided
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts: propsPosts }) => {
  const { t } = useLanguage();
  const { posts: fetchedPosts, loading } = useBlogPosts();
  
  // Use posts from props if provided, otherwise use fetched posts
  const posts = propsPosts || fetchedPosts;

  // Only show up to 2 posts in the landing page section
  const displayPosts = posts.slice(0, 2);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">{t?.blog?.title || "Latest from Our Blog"}</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t?.blog?.subtitle || "Insights, stories, and tips for healthcare professionals and recruiters"}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-medical-600"></div>
          </div>
        ) : displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayPosts.map((blog) => (
              <Card key={blog.id} className="border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  {blog.imageUrl && (
                    <div className="mb-4">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="rounded-md object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{blog.readTime}</span>
                    <span>•</span>
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{blog.excerpt}</p>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-medical-600 hover:text-medical-700 font-medium inline-flex items-center group mt-auto"
                  >
                    {t?.blog?.readMore || "Read More"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No blog posts available yet.</p>
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
