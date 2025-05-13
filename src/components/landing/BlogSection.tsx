
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from '@/types/landing';
import { useLanguage } from '@/hooks/useLanguage';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BlogSectionProps {
  posts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">{t?.blog?.title || "Latest from Our Blog"}</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t?.blog?.subtitle || "Insights, stories, and tips for healthcare professionals and recruiters"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((blog) => (
            <Card key={blog.id} className="border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <CardContent className="p-6">
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
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-medical-600 hover:text-medical-700 font-medium inline-flex items-center group"
                >
                  {t?.blog?.readMore || "Read More"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
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
