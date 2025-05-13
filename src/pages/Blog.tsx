
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { featuredBlogs } from '@/data/landingPageData';

const Blog = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <Card key={blog.id} className="border-transparent hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
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
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>{blog.readTime}</span>
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                {blog.category && (
                  <div className="mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                )}
                <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                {blog.author && (
                  <p className="text-sm text-muted-foreground mb-4">By {blog.author}</p>
                )}
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-medical-600 hover:text-medical-700 font-medium inline-flex items-center group"
                >
                  {t?.blog?.readMore || "Read More"}
                  <ArrowLeft className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform rotate-180" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Blog;
