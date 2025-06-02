
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useSingleBlogPost } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload, Image, Loader2, Clock, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { preprocessText } from '@/utils/textProcessor';
import WysiwygEditor from '@/components/blog/WysiwygEditor';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  imageUrl: string;
  status: 'draft' | 'published';
  language: string;
  post_group_id?: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  publishDate: string;
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
  language: 'en',
  metaTitle: '',
  metaDescription: '',
  tags: '',
  publishDate: '',
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { post, loading: postLoading, translations } = useSingleBlogPost(id);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
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
    if (!adminLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [adminLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isEditing && post) {
      const postData = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content || '',
        category: post.category || '',
        readTime: post.readTime || '',
        imageUrl: post.imageUrl || '',
        status: post.status || 'draft',
        language: post.language || 'en',
        post_group_id: post.post_group_id,
        metaTitle: '',
        metaDescription: '',
        tags: '',
        publishDate: '',
      };
      setFormData(postData);

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
      slug: !isEditing ? generateSlug(newTitle) : prev.slug,
      metaTitle: newTitle,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
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

  const handleAutoSave = async () => {
    if (!user || !formData.title) return;

    try {
      const processedContent = preprocessText(formData.content);
      
      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: processedContent,
        image_url: formData.imageUrl,
        category: formData.category || null,
        read_time: formData.readTime || null,
        status: 'draft', // Always save as draft during auto-save
        language: formData.language,
        post_group_id: formData.post_group_id || null,
      };
      
      if (isEditing) {
        await supabase
          .from('blog_posts')
          .update({
            ...blogData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      } else {
        await supabase
          .from('blog_posts')
          .insert({
            ...blogData,
            author_id: user.id,
          });
      }
      
      setLastSaved(new Date());
      console.log('Auto-saved at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
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
      if (!formData.title || !formData.excerpt || !formData.content) {
        throw new Error('Please fill in all required fields: title, excerpt, and content.');
      }
      
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const processedContent = preprocessText(formData.content);
      
      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: processedContent,
        image_url: imageUrl,
        category: formData.category || null,
        read_time: formData.readTime || null,
        status: formData.status,
        language: formData.language,
        post_group_id: formData.post_group_id || null,
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
            {lastSaved && (
              <p className="text-sm text-gray-500 mt-2">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
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
                  placeholder="Enter your blog post title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="url-friendly-title"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt <span className="text-red-500">*</span></Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Brief description of your post"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="h-20 resize-none"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
                <div className="mt-2">
                  <WysiwygEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    onAutoSave={handleAutoSave}
                    placeholder="Write your post content here... Use the toolbar to add formatting, headings, links, and media."
                  />
                </div>
                
                <div className="mt-4 space-y-4 text-sm text-gray-500 p-4" style={{ backgroundColor: 'transparent', color: '#9ca3af' }}>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-600">💡 Tips</h4>
                    
                    <div>
                      <h5 className="font-medium text-gray-600">1. Focus on One Main Keyword per Blog Post</h5>
                      <p>Choose a specific, relevant keyword (e.g., "prevent aging naturally" or "AI skin analysis") and build your post around it. Use it in:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>The title</li>
                        <li>First paragraph</li>
                        <li>At least one subheading (H2 or H3)</li>
                        <li>Alt-text of an image</li>
                        <li>Meta description</li>
                        <li>URL slug (e.g., /ai-skin-analysis-guide)</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">2. Write for Humans First, Search Engines Second</h5>
                      <p>Google rewards helpful content. Make sure your blog:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Solves a specific problem</li>
                        <li>Is easy to read (short paragraphs, bullet points)</li>
                        <li>Has a natural, conversational tone</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">3. Structure Content with Clear Headings</h5>
                      <p>Use H1 (title), H2 (section headings), and H3 (subpoints) to create a logical flow. It helps SEO and makes the blog easier to scan.</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">4. Use Internal Linking</h5>
                      <p>Link to other relevant blog posts or key pages on your site (e.g., homepage, skin analysis feature, "Join Waitlist" page). It keeps readers on your site longer and boosts authority.</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">5. Add External Links to Reputable Sources</h5>
                      <p>Reference studies or expert content from trusted sources (e.g., dermatology research). It shows credibility and Google appreciates it.</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">6. Write Meta Titles & Descriptions</h5>
                      <p>Every blog should have:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>A meta title (60 characters max)</li>
                        <li>A meta description (150–160 characters)</li>
                      </ul>
                      <p>Include your main keyword and make it compelling to boost click-through rates.</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">7. Use High-Quality Images with Alt Text</h5>
                      <p>Add relevant, original images (before/after, charts, product demos).</p>
                      <p>Use descriptive alt text with keywords to improve image SEO.</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">8. Keep it Fresh & Updated</h5>
                      <p>Google favors updated content. Revisit older blogs every 3–6 months to:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Update statistics</li>
                        <li>Add new findings</li>
                        <li>Improve formatting</li>
                        <li>Replace broken links</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">9. Write Long-Form Content (800–1500 words)</h5>
                      <p>Longer posts (when useful) tend to rank better. Combine deep insights, real examples, and clear takeaways.</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-600">10. Add a Clear Call to Action (CTA) Relevant to Doctors or Recruiters</h5>
                      <p>At the end of each blog post, guide your readers toward the next step. Examples for a healthcare recruitment platform could be:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>For Hospitals/Recruiters:</strong> "Browse qualified nurses and doctors now" or "Book a meeting to discuss your staffing needs."</li>
                        <li><strong>For Medical Professionals:</strong> "Apply to join our platform" or "Check out our latest job opportunities in Germany."</li>
                      </ul>
                      <p>Make sure CTAs are visually distinct and appear mid-post as well as at the end when possible.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar/settings */}
            <div className="space-y-6">
              {/* Post Settings */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-medium mb-4">Post Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language" className="flex items-center">
                      <Languages className="h-4 w-4 mr-1" />
                      Language
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleSelectChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

              {/* SEO & Publishing Controls */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-medium mb-4">SEO & Publishing</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      placeholder="SEO title (auto-filled from title)"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      placeholder="SEO description (150-160 characters)"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      className="h-20 resize-none"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Include your main keyword and make it compelling to boost click-through rates.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="tag1, tag2, tag3"
                      value={formData.tags}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input
                      id="publishDate"
                      name="publishDate"
                      type="datetime-local"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Show existing translations if editing */}
              {isEditing && translations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Languages className="h-4 w-4 mr-2" />
                    Available Translations
                  </h3>
                  <div className="space-y-2">
                    {translations.map((translation) => {
                      const lang = languages.find(l => l.code === translation.language);
                      return (
                        <div key={translation.id} className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span>{lang?.flag}</span>
                            <span>{lang?.name}</span>
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/admin/blog/edit/${translation.id}`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
