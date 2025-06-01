
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Link, 
  Bold, 
  Italic, 
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from 'lucide-react';

interface BlogEditorToolbarProps {
  onInsertLink: (linkText: string, url: string) => void;
  onFormatText: (format: 'bold' | 'italic') => void;
  onInsertHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
}

const BlogEditorToolbar: React.FC<BlogEditorToolbarProps> = ({ 
  onInsertLink, 
  onFormatText,
  onInsertHeading 
}) => {
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

  const headingButtons = [
    { level: 1 as const, icon: Heading1, label: 'H1' },
    { level: 2 as const, icon: Heading2, label: 'H2' },
    { level: 3 as const, icon: Heading3, label: 'H3' },
    { level: 4 as const, icon: Heading4, label: 'H4' },
    { level: 5 as const, icon: Heading5, label: 'H5' },
    { level: 6 as const, icon: Heading6, label: 'H6' },
  ];

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
      
      {/* Heading buttons */}
      <div className="flex items-center gap-1">
        {headingButtons.map(({ level, icon: Icon, label }) => (
          <Button
            key={level}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertHeading(level)}
            className="h-8 text-xs"
            title={`Insert ${label} heading`}
          >
            <Icon className="h-3 w-3" />
          </Button>
        ))}
      </div>
      
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
