import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import WysiwygEditor from '@/components/blog/WysiwygEditor';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  category: string | null;
  status: 'draft' | 'published';
  language: string;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  tags: string | null;
  country_tag: string | null;
}

const CATEGORIES = ['homologation', 'language-learning', 'visa', 'life-abroad', 'career', 'salaries', 'specialties'];
const LANGUAGES = ['en', 'de', 'es', 'fr', 'ru'];
const ORIGIN_COUNTRIES = ['india', 'argentina', 'colombia', 'egypt', 'philippines', 'syria', 'pakistan', 'brazil', 'mexico', 'turkey', 'iran'];

const BlogManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('en');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tags, setTags] = useState('');
  const [countryTag, setCountryTag] = useState('');
  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPosts(data as BlogPost[]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const resetForm = () => {
    setTitle(''); setSlug(''); setExcerpt(''); setContent(''); setImageUrl('');
    setCategory(''); setLanguage('en'); setStatus('draft');
    setMetaTitle(''); setMetaDescription(''); setTags(''); setCountryTag('');
    setEditing(null); setIsCreating(false);
  };

  const loadPost = (post: BlogPost) => {
    setTitle(post.title); setSlug(post.slug); setExcerpt(post.excerpt);
    setContent(post.content); setImageUrl(post.image_url || '');
    setCategory(post.category || ''); setLanguage(post.language);
    setStatus(post.status); setMetaTitle(post.meta_title || '');
    setMetaDescription(post.meta_description || ''); setTags(post.tags || '');
    setCountryTag(post.country_tag || '');
    setEditing(post); setIsCreating(false);
  };

  const handleSave = async () => {
    if (!title || !slug || !excerpt || !content) {
      toast({ title: 'Missing fields', description: 'Title, slug, excerpt and content are required', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const postData = {
      title, slug, excerpt, content,
      image_url: imageUrl || null,
      category: category || null,
      language, status,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      tags: tags || null,
      country_tag: countryTag || null,
      author_id: user!.id,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('blog_posts').update(postData).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(postData));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Post ${editing ? 'updated' : 'created'}` });
      resetForm();
      fetchPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Deleted' }); fetchPosts(); }
  };

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await supabase.from('blog_posts').update({ status: newStatus }).eq('id', post.id);
    fetchPosts();
  };

  if (editing || isCreating) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="ghost" onClick={resetForm} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to posts
          </Button>
          <h1 className="text-2xl font-bold mb-6">{editing ? 'Edit Post' : 'Create Post'}</h1>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input value={title} onChange={e => { setTitle(e.target.value); if (!editing) setSlug(generateSlug(e.target.value)); }} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug *</label>
                <Input value={slug} onChange={e => setSlug(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
                <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={status} onValueChange={(v: 'draft' | 'published') => setStatus(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Image URL</label>
              <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Excerpt *</label>
              <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Content * (HTML)</label>
              <WysiwygEditor value={content} onChange={setContent} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Meta Title (SEO)</label>
                <Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">{metaTitle.length}/60 chars</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Meta Description (SEO)</label>
                <Input value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">{metaDescription.length}/160 chars</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
                <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="homologation, germany, doctors" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Origin Country (for filtering)</label>
                <Select value={countryTag} onValueChange={setCountryTag}>
                  <SelectTrigger><SelectValue placeholder="General (no country)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">General (no country)</SelectItem>
                    {ORIGIN_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/blog')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Blog Management</h1>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Post
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {post.image_url && (
                      <div className="w-16 h-10 rounded overflow-hidden shrink-0">
                        <OptimizedImage src={post.image_url} alt="" className="w-full h-full object-cover" useAspectRatio={false} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant={post.status === 'published' ? 'default' : 'outline'} className="text-xs">
                          {post.status}
                        </Badge>
                        <span>{post.language.toUpperCase()}</span>
                        {post.category && <span>• {post.category}</span>}
                        <span>• {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(post)} title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => loadPost(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogManagement;
