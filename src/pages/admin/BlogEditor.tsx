
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useSingleBlogPost } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Upload, Image, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  imageUrl: string;
  status: 'draft' | 'published';
}

const initialFormData: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  readTime: '',
  imageUrl: '',
  status: 'draft',
};

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { post, loading: postLoading } = useSingleBlogPost(id);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const isLoading = adminLoading || (isEditing && postLoading);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  useEffect(() => {
    // Redirect if user is not admin
    if (!adminLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [adminLoading, isAdmin, navigate]);

  useEffect(() => {
    // Populate form with post data if editing
    if (isEditing && post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content || '',
        category: post.category || '',
        readTime: post.readTime || '',
        imageUrl: post.imageUrl || '',
        status: post.status || 'draft',
      });

      if (post.imageUrl) {
        setImagePreview(post.imageUrl);
      }
    }
  }, [isEditing, post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug if title changes and we're creating a new post
      slug: !isEditing ? generateSlug(newTitle) : prev.slug,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      // If there's an existing image URL but no new file, return the existing URL
      return formData.imageUrl || null;
    }

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('blog_images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Image Upload Failed',
        description: 'Failed to upload image.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save blog posts.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.title || !formData.excerpt || !formData.content) {
        throw new Error('Please fill in all required fields: title, excerpt, and content.');
      }
      
      // Upload image if provided
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: imageUrl,
        category: formData.category || null,
        read_time: formData.readTime || null,
        status: formData.status,
      };
      
      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...blogData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: 'Post Updated',
          description: 'Blog post has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            ...blogData,
            author_id: user.id,
          });
        
        if (error) throw error;
        
        toast({
          title: 'Post Created',
          description: 'Blog post has been created successfully.',
        });
      }
      
      // Redirect to blog list
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save blog post.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-medical-600" />
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/admin/blog" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog Administration
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge className={formData.status === 'published' ? 
                'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'}>
                {formData.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
              <Switch 
                id="status"
                checked={formData.status === 'published'} 
                onCheckedChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    status: checked ? 'published' : 'draft'
                  }));
                }}
              />
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Post title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="text-xl font-medium"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="post-url-slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt <span className="text-red-500">*</span></Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Brief summary of your post (shown in previews)"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="h-24 resize-none"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your post content here... (HTML supported)"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[300px]"
                  required
                />
              </div>
            </div>

            {/* Sidebar/settings */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-medium mb-4">Post Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="Category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="readTime" className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Read Time
                    </Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      placeholder="e.g., '5 min read'"
                      value={formData.readTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-medium mb-4">Featured Image</h3>
                {imagePreview ? (
                  <div className="mb-4">
                    <div className="relative aspect-[16/9] rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center mb-4">
                    <Image className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4 mr-2" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </div>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </Label>
                  
                  {/* External image URL input */}
                  <div className="mt-4">
                    <Label htmlFor="imageUrl">Or use image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      disabled={!!imageFile}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default BlogEditor;
