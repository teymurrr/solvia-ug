import React, { useState, useEffect, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Upload, Image, Loader2, Clock, Languages, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  preprocessText, 
  insertLinkAtPosition, 
  getCursorPosition,
  getTextSelection,
  formatTextAtPosition,
  insertHeadingAtPosition,
  insertListAtPosition,
  insertBlockquoteAtPosition,
  insertCodeAtPosition,
  insertImageAtPosition,
  insertVideoAtPosition,
  setTextAlignment,
  insertDividerAtPosition,
  setFontSize,
  setTextColor,
  countWords
} from '@/utils/textProcessor';
import BlogEditorToolbar from '@/components/blog/BlogEditorToolbar';

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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = adminLoading || (isEditing && postLoading);
  const wordCount = countWords(formData.content);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing || !formData.content) return;
    
    const autoSaveTimer = setTimeout(() => {
      // Auto-save logic here - could save to localStorage or draft
      console.log('Auto-saving draft...');
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [formData.content, isEditing]);

  // Save to undo stack
  const saveToUndoStack = (content: string) => {
    setUndoStack(prev => [...prev.slice(-19), content]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new change is made
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
      metaTitle: newTitle, // Auto-populate meta title
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'content') {
      saveToUndoStack(formData.content);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // Enhanced toolbar handlers
  const handleInsertLink = (linkText: string, url: string, openInNewTab: boolean) => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const cursorPosition = getCursorPosition(textarea);
      saveToUndoStack(formData.content);
      const newContent = insertLinkAtPosition(formData.content, cursorPosition, linkText, url, openInNewTab);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
        const newPosition = cursorPosition + `<a href="${url}"${openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const handleFormatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const selection = getTextSelection(textarea);
      
      if (selection.text) {
        saveToUndoStack(formData.content);
        const newContent = formatTextAtPosition(formData.content, selection.start, selection.end, format);
        setFormData(prev => ({ ...prev, content: newContent }));
        
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(selection.start, selection.start + newContent.substring(selection.start).indexOf(`</${format === 'bold' ? 'strong' : format === 'italic' ? 'em' : format}>`) + `</${format === 'bold' ? 'strong' : format === 'italic' ? 'em' : format}>`.length);
        }, 0);
      }
    }
  };

  const handleInsertHeading = (level: 1 | 2 | 3 | 4) => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const selection = getTextSelection(textarea);
      saveToUndoStack(formData.content);
      
      const headingText = selection.text || `Heading ${level}`;
      const newContent = insertHeadingAtPosition(formData.content, selection.start, level, headingText);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
        const newPosition = selection.start + `<h${level}>`.length;
        textarea.setSelectionRange(newPosition, newPosition + headingText.length);
      }, 0);
    }
  };

  const handleInsertList = (type: 'bullet' | 'numbered') => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const cursorPosition = getCursorPosition(textarea);
      saveToUndoStack(formData.content);
      const newContent = insertListAtPosition(formData.content, cursorPosition, type);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  const handleInsertBlockquote = () => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const cursorPosition = getCursorPosition(textarea);
      saveToUndoStack(formData.content);
      const newContent = insertBlockquoteAtPosition(formData.content, cursorPosition);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  const handleInsertCode = (type: 'inline' | 'block') => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const cursorPosition = getCursorPosition(textarea);
      saveToUndoStack(formData.content);
      const newContent = insertCodeAtPosition(formData.content, cursorPosition, type);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  const handleInsertImage = (url: string, altText: string, caption?: string) => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const cursorPosition = getCursorPosition(textarea);
      saveToUndoStack(formData.content);
      const newContent = insertImageAtPosition(formData.content, cursorPosition, url, altText, caption);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  const handleInsertVideo = (url: string) => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const cursorPosition = getCursorPosition(textarea);
      saveToUndoStack(formData.content);
      const newContent = insertVideoAtPosition(formData.content, cursorPosition, url);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  const handleSetAlignment = (align: 'left' | 'center' | 'right') => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const selection = getTextSelection(textarea);
      
      if (selection.text) {
        saveToUndoStack(formData.content);
        const newContent = setTextAlignment(formData.content, selection.start, selection.end, align);
        setFormData(prev => ({ ...prev, content: newContent }));
        
        setTimeout(() => {
          textarea.focus();
        }, 0);
      }
    }
  };

  const handleInsertDivider = () => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const cursorPosition = getCursorPosition(textarea);
      saveToUndoStack(formData.content);
      const newContent = insertDividerAtPosition(formData.content, cursorPosition);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, formData.content]);
      setUndoStack(prev => prev.slice(0, -1));
      setFormData(prev => ({ ...prev, content: previousContent }));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, formData.content]);
      setRedoStack(prev => prev.slice(0, -1));
      setFormData(prev => ({ ...prev, content: nextContent }));
    }
  };

  const handleSetFontSize = (size: string) => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const selection = getTextSelection(textarea);
      
      if (selection.text) {
        saveToUndoStack(formData.content);
        const newContent = setFontSize(formData.content, selection.start, selection.end, size);
        setFormData(prev => ({ ...prev, content: newContent }));
        
        setTimeout(() => {
          textarea.focus();
        }, 0);
      }
    }
  };

  const handleSetTextColor = (color: string) => {
    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const selection = getTextSelection(textarea);
      
      if (selection.text) {
        saveToUndoStack(formData.content);
        const newContent = setTextColor(formData.content, selection.start, selection.end, color);
        setFormData(prev => ({ ...prev, content: newContent }));
        
        setTimeout(() => {
          textarea.focus();
        }, 0);
      }
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
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="mt-4">
                    <div className="space-y-0">
                      <BlogEditorToolbar 
                        onInsertLink={handleInsertLink}
                        onFormatText={handleFormatText}
                        onInsertHeading={handleInsertHeading}
                        onInsertList={handleInsertList}
                        onInsertBlockquote={handleInsertBlockquote}
                        onInsertCode={handleInsertCode}
                        onInsertImage={handleInsertImage}
                        onInsertVideo={handleInsertVideo}
                        onSetAlignment={handleSetAlignment}
                        onInsertDivider={handleInsertDivider}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        onSetFontSize={handleSetFontSize}
                        onSetTextColor={handleSetTextColor}
                        wordCount={wordCount}
                      />
                      <Textarea
                        ref={contentTextareaRef}
                        id="content"
                        name="content"
                        placeholder="Write your post content here... Use the toolbar to add formatting, headings, links, and media."
                        value={formData.content}
                        onChange={handleInputChange}
                        className="min-h-[400px] rounded-t-none border-t-0 focus:border-t focus:rounded-t-md"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      💡 Tip: Select text and use the toolbar buttons to format it. The editor supports rich text formatting, media embeds, and more.
                    </p>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-md p-4 min-h-[400px] bg-gray-50">
                      <h4 className="font-medium mb-2">Preview:</h4>
                      <div 
                        className="prose prose-sm max-w-none blog-content"
                        dangerouslySetInnerHTML={{ 
                          __html: formData.content ? preprocessText(formData.content) : '<p class="text-muted-foreground">Start typing to see preview...</p>' 
                        }} 
                      />
                    </div>
                  </TabsContent>
                </Tabs>
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
