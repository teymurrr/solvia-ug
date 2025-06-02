
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Link, 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Undo,
  Redo,
  Type,
  Palette
} from 'lucide-react';

interface BlogEditorToolbarProps {
  onInsertLink: (linkText: string, url: string, openInNewTab: boolean) => void;
  onFormatText: (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => void;
  onInsertHeading: (level: 1 | 2 | 3 | 4) => void;
  onInsertList: (type: 'bullet' | 'numbered') => void;
  onInsertBlockquote: () => void;
  onInsertCode: (type: 'inline' | 'block') => void;
  onInsertImage: (url: string, altText: string, caption?: string) => void;
  onInsertVideo: (url: string) => void;
  onSetAlignment: (align: 'left' | 'center' | 'right') => void;
  onInsertDivider: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSetFontSize: (size: string) => void;
  onSetTextColor: (color: string) => void;
  wordCount: number;
}

const BlogEditorToolbar: React.FC<BlogEditorToolbarProps> = ({ 
  onInsertLink, 
  onFormatText,
  onInsertHeading,
  onInsertList,
  onInsertBlockquote,
  onInsertCode,
  onInsertImage,
  onInsertVideo,
  onSetAlignment,
  onInsertDivider,
  onUndo,
  onRedo,
  onSetFontSize,
  onSetTextColor,
  wordCount
}) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  
  const [videoUrl, setVideoUrl] = useState('');

  const handleInsertLink = () => {
    if (linkText && linkUrl) {
      onInsertLink(linkText, linkUrl, openInNewTab);
      setLinkText('');
      setLinkUrl('');
      setOpenInNewTab(true);
      setLinkDialogOpen(false);
    }
  };

  const handleInsertImage = () => {
    if (imageUrl && imageAlt) {
      onInsertImage(imageUrl, imageAlt, imageCaption);
      setImageUrl('');
      setImageAlt('');
      setImageCaption('');
      setImageDialogOpen(false);
    }
  };

  const handleInsertVideo = () => {
    if (videoUrl) {
      onInsertVideo(videoUrl);
      setVideoUrl('');
      setVideoDialogOpen(false);
    }
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setOpenInNewTab(checked === true);
  };

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#4a4a4a' },
    { name: 'Gray', value: '#808080' },
    { name: 'Light Gray', value: '#c0c0c0' },
    { name: 'Blue', value: '#0974f1' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
  ];

  const fontSizes = [
    { name: 'Small', value: '14px' },
    { name: 'Normal', value: '16px' },
    { name: 'Large', value: '18px' },
    { name: 'Extra Large', value: '20px' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-t-md">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onUndo}
          className="h-8"
          title="Undo"
        >
          <Undo className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRedo}
          className="h-8"
          title="Redo"
        >
          <Redo className="h-3 w-3" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onFormatText('bold')}
          className="h-8"
          title="Bold"
        >
          <Bold className="h-3 w-3" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onFormatText('italic')}
          className="h-8"
          title="Italic"
        >
          <Italic className="h-3 w-3" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onFormatText('underline')}
          className="h-8"
          title="Underline"
        >
          <Underline className="h-3 w-3" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onFormatText('strikethrough')}
          className="h-8"
          title="Strikethrough"
        >
          <Strikethrough className="h-3 w-3" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings Dropdown */}
      <Select onValueChange={(value) => onInsertHeading(parseInt(value) as 1 | 2 | 3 | 4)}>
        <SelectTrigger className="h-8 w-20 text-xs">
          <SelectValue placeholder="H1-H4" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">H1</SelectItem>
          <SelectItem value="2">H2</SelectItem>
          <SelectItem value="3">H3</SelectItem>
          <SelectItem value="4">H4</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInsertList('bullet')}
          className="h-8"
          title="Bullet List"
        >
          <List className="h-3 w-3" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInsertList('numbered')}
          className="h-8"
          title="Numbered List"
        >
          <ListOrdered className="h-3 w-3" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Blockquote & Code */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onInsertBlockquote}
          className="h-8"
          title="Blockquote"
        >
          <Quote className="h-3 w-3" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInsertCode('inline')}
          className="h-8"
          title="Inline Code"
        >
          <Code className="h-3 w-3" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInsertCode('block')}
          className="h-8 text-xs"
          title="Code Block"
        >
          <Code className="h-3 w-3 mr-1" />
          Block
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSetAlignment('left')}
          className="h-8"
          title="Align Left"
        >
          <AlignLeft className="h-3 w-3" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSetAlignment('center')}
          className="h-8"
          title="Align Center"
        >
          <AlignCenter className="h-3 w-3" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSetAlignment('right')}
          className="h-8"
          title="Align Right"
        >
          <AlignRight className="h-3 w-3" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size & Color */}
      <div className="flex items-center gap-1">
        <Select onValueChange={onSetFontSize}>
          <SelectTrigger className="h-8 w-20 text-xs">
            <Type className="h-3 w-3" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={onSetTextColor}>
          <SelectTrigger className="h-8 w-16 text-xs">
            <Palette className="h-3 w-3" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded border" 
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Media & Links */}
      <div className="flex items-center gap-1">
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              title="Add Link"
            >
              <Link className="h-3 w-3" />
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newTab"
                  checked={openInNewTab}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="newTab">Open in new tab</Label>
              </div>
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

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              title="Add Image"
            >
              <Image className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="imageAlt">Alt Text (required)</Label>
                <Input
                  id="imageAlt"
                  placeholder="Describe the image"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="imageCaption">Caption (optional)</Label>
                <Input
                  id="imageCaption"
                  placeholder="Image caption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleInsertImage}
                  disabled={!imageUrl || !imageAlt}
                >
                  Insert Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              title="Embed Video"
            >
              <Video className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Embed Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="videoUrl">YouTube or Vimeo URL</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVideoDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleInsertVideo}
                  disabled={!videoUrl}
                >
                  Embed Video
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onInsertDivider}
          className="h-8"
          title="Insert Divider"
        >
          <Minus className="h-3 w-3" />
        </Button>
      </div>

      {/* Word Count */}
      <div className="ml-auto flex items-center text-sm text-muted-foreground">
        <span>{wordCount} words</span>
      </div>
    </div>
  );
};

export default BlogEditorToolbar;
