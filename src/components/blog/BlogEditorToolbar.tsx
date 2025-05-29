
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Bold, Italic } from 'lucide-react';

interface BlogEditorToolbarProps {
  onInsertLink: (linkText: string, url: string) => void;
  onFormatText: (format: 'bold' | 'italic') => void;
}

const BlogEditorToolbar: React.FC<BlogEditorToolbarProps> = ({ onInsertLink, onFormatText }) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleInsertLink = () => {
    if (linkText && linkUrl) {
      onInsertLink(linkText, linkUrl);
      setLinkText('');
      setLinkUrl('');
      setLinkDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-t-md">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onFormatText('bold')}
        className="h-8"
      >
        <Bold className="h-3 w-3" />
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onFormatText('italic')}
        className="h-8"
      >
        <Italic className="h-3 w-3" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 flex items-center gap-1"
          >
            <Link className="h-3 w-3" />
            Add Link
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkText">Display Text</Label>
              <Input
                id="linkText"
                placeholder="Enter the text to display"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            {linkText && linkUrl && (
              <div className="p-2 bg-gray-50 rounded border">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <a 
                  href={linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  {linkText}
                </a>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLinkDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkText || !linkUrl}
              >
                Insert Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogEditorToolbar;
