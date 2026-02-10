
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCreatePost } from '@/hooks/useCommunity';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('homologation');
  const createPost = useCreatePost();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const ct = (t as any)?.community;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const post = await createPost.mutateAsync({ title, content, category });
      toast({ title: ct?.postCreated || 'Discussion posted!', description: ct?.postCreatedDesc || 'Your question is now visible to the community.' });
      setTitle('');
      setContent('');
      setCategory('homologation');
      onOpenChange(false);
      navigate(`/community/${post.id}`);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{ct?.askQuestion || 'Ask a Question'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">{ct?.categoryLabel || 'Category'}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homologation">{ct?.categories?.homologation || 'Homologation'}</SelectItem>
                <SelectItem value="language">{ct?.categories?.language || 'Language Learning'}</SelectItem>
                <SelectItem value="fsp">{ct?.categories?.fsp || 'FSP Preparation'}</SelectItem>
                <SelectItem value="life-abroad">{ct?.categories?.lifeAbroad || 'Life in Germany'}</SelectItem>
                <SelectItem value="job-search">{ct?.categories?.jobSearch || 'Job Search'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">{ct?.titleLabel || 'Title'}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={ct?.titlePlaceholder || 'What would you like to ask or share?'}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">{ct?.contentLabel || 'Details'}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={ct?.contentPlaceholder || 'Provide more details about your question or experience...'}
              rows={5}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {(t as any)?.common?.cancel || 'Cancel'}
            </Button>
            <Button type="submit" disabled={createPost.isPending || !title.trim() || !content.trim()}>
              {createPost.isPending ? (ct?.submitting || 'Posting...') : (ct?.submitPost || 'Post Discussion')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
