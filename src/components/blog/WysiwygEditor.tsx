import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Video,
  Quote,
  Code,
  CodeSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Undo,
  Redo,
  Type,
  Palette,
  AlignJustify
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onAutoSave?: () => void;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  onAutoSave
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [wordCount, setWordCount] = useState(0);
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

  // Auto-save functionality
  useEffect(() => {
    if (!value || !onAutoSave) return;
    
    const autoSaveTimer = setTimeout(() => {
      onAutoSave();
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [value, onAutoSave]);

  // Update word count
  useEffect(() => {
    const plainText = stripHtml(value);
    setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
  }, [value]);

  // Update editor content when value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  };

  const saveToHistory = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(content);
        return newHistory.slice(-50); // Keep last 50 states
      });
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
    saveToHistory();
  };

  const formatHeading = (level: number) => {
    executeCommand('formatBlock', `h${level}`);
  };

  const setLineSpacing = (spacing: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // If there's a selection, wrap it in a span with line-height
      if (!selection.isCollapsed) {
        const span = document.createElement('span');
        span.style.lineHeight = spacing;
        
        try {
          range.surroundContents(span);
        } catch (e) {
          // If surroundContents fails, insert HTML instead
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      } else {
        // If no selection, apply to the current paragraph/block element
        let element = range.commonAncestorContainer;
        
        // Find the closest block element
        while (element && element.nodeType !== Node.ELEMENT_NODE) {
          element = element.parentNode;
        }
        
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          // Find the closest block element (p, div, h1-h6, etc.)
          while (element && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI'].includes((element as Element).tagName)) {
            element = element.parentNode;
          }
          
          if (element) {
            (element as HTMLElement).style.lineHeight = spacing;
          }
        }
      }
      
      selection.removeAllRanges();
      editorRef.current?.focus();
      handleInput();
      saveToHistory();
    }
  };

  const insertLink = () => {
    if (linkText && linkUrl) {
      const target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      const linkHtml = `<a href="${linkUrl}"${target}>${linkText}</a>`;
      executeCommand('insertHTML', linkHtml);
      setLinkText('');
      setLinkUrl('');
      setOpenInNewTab(true);
      setLinkDialogOpen(false);
    }
  };

  const insertImage = () => {
    if (imageUrl && imageAlt) {
      let imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`;
      if (imageCaption) {
        imageHtml = `<figure>${imageHtml}<figcaption>${imageCaption}</figcaption></figure>`;
      }
      executeCommand('insertHTML', imageHtml);
      setImageUrl('');
      setImageAlt('');
      setImageCaption('');
      setImageDialogOpen(false);
    }
  };

  const insertVideo = () => {
    if (videoUrl) {
      let embedHtml = '';
      
      // YouTube embed
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
          embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 20px 0;">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                    frameborder="0" 
                    allowfullscreen>
            </iframe>
          </div>`;
        }
      }
      // Vimeo embed
      else if (videoUrl.includes('vimeo.com')) {
        const videoId = extractVimeoId(videoUrl);
        if (videoId) {
          embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 20px 0;">
            <iframe src="https://player.vimeo.com/video/${videoId}" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                    frameborder="0" 
                    allowfullscreen>
            </iframe>
          </div>`;
        }
      }
      
      if (!embedHtml) {
        embedHtml = `<p><a href="${videoUrl}" target="_blank" rel="noopener noreferrer">Watch Video: ${videoUrl}</a></p>`;
      }
      
      executeCommand('insertHTML', embedHtml);
      setVideoUrl('');
      setVideoDialogOpen(false);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractVimeoId = (url: string): string | null => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const insertBlockquote = () => {
    executeCommand('formatBlock', 'blockquote');
  };

  const insertCodeBlock = () => {
    const codeHtml = '<pre><code>// Your code here</code></pre>';
    executeCommand('insertHTML', codeHtml);
  };

  const insertInlineCode = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      executeCommand('insertHTML', `<code>${selection.toString()}</code>`);
    } else {
      executeCommand('insertHTML', '<code>inline code</code>');
    }
  };

  const setAlignment = (align: 'left' | 'center' | 'right') => {
    executeCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  };

  const insertDivider = () => {
    const dividerHtml = '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;" />';
    executeCommand('insertHTML', dividerHtml);
  };

  const setFontSize = (size: string) => {
    executeCommand('fontSize', size);
  };

  const setTextColor = (color: string) => {
    executeCommand('foreColor', color);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
      setHistoryIndex(newIndex);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    
    if (paste) {
      executeCommand('insertHTML', paste);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Z for undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    // Ctrl+Y or Ctrl+Shift+Z for redo
    if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      redo();
    }
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
    { name: 'Small', value: '1' },
    { name: 'Normal', value: '3' },
    { name: 'Large', value: '5' },
    { name: 'Extra Large', value: '7' },
  ];

  const lineSpacingOptions = [
    { name: 'Single', value: '1.0' },
    { name: 'Compact', value: '1.2' },
    { name: 'Normal', value: '1.5' },
    { name: 'Relaxed', value: '1.8' },
    { name: 'Double', value: '2.0' },
    { name: 'Extra', value: '2.5' },
  ];

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="h-8"
            title="Undo"
          >
            <Undo className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="h-8"
            title="Redo"
          >
            <Redo className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            className="h-8"
            title="Bold"
          >
            <Bold className="h-3 w-3" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            className="h-8"
            title="Italic"
          >
            <Italic className="h-3 w-3" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            className="h-8"
            title="Underline"
          >
            <Underline className="h-3 w-3" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('strikeThrough');
            }}
            className="h-8"
            title="Strikethrough"
          >
            <Strikethrough className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              formatHeading(1);
            }}
            className="h-8 text-xs"
            title="Heading 1"
          >
            H1
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              formatHeading(2);
            }}
            className="h-8 text-xs"
            title="Heading 2"
          >
            H2
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              formatHeading(3);
            }}
            className="h-8 text-xs"
            title="Heading 3"
          >
            H3
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              formatHeading(4);
            }}
            className="h-8 text-xs"
            title="Heading 4"
          >
            H4
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            className="h-8"
            title="Bullet List"
          >
            <List className="h-3 w-3" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            className="h-8"
            title="Numbered List"
          >
            <ListOrdered className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Blockquote & Code */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              insertBlockquote();
            }}
            className="h-8"
            title="Blockquote"
          >
            <Quote className="h-3 w-3" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              insertInlineCode();
            }}
            className="h-8"
            title="Inline Code"
          >
            <Code className="h-3 w-3" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              insertCodeBlock();
            }}
            className="h-8"
            title="Code Block"
          >
            <CodeSquare className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              setAlignment('left');
            }}
            className="h-8"
            title="Align Left"
          >
            <AlignLeft className="h-3 w-3" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              setAlignment('center');
            }}
            className="h-8"
            title="Align Center"
          >
            <AlignCenter className="h-3 w-3" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              setAlignment('right');
            }}
            className="h-8"
            title="Align Right"
          >
            <AlignRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Font Size, Line Spacing & Color */}
        <div className="flex items-center gap-1">
          <Select onValueChange={setFontSize}>
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

          <Select onValueChange={setLineSpacing}>
            <SelectTrigger className="h-8 w-20 text-xs">
              <AlignJustify className="h-3 w-3" />
            </SelectTrigger>
            <SelectContent>
              {lineSpacingOptions.map((spacing) => (
                <SelectItem key={spacing.value} value={spacing.value}>
                  {spacing.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setTextColor}>
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

        <div className="w-px h-6 bg-gray-300 mx-1" />

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
                <LinkIcon className="h-3 w-3" />
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
                    onCheckedChange={(checked) => setOpenInNewTab(checked === true)}
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
                    onClick={insertLink}
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
                    onClick={insertImage}
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
                    onClick={insertVideo}
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
            onMouseDown={(e) => {
              e.preventDefault();
              insertDivider();
            }}
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

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
        suppressContentEditableWarning={true}
      />

      {/* Enhanced Placeholder and List CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable]:empty:before {
            content: "${placeholder}";
            color: #9ca3af;
            pointer-events: none;
          }
          
          [contenteditable] h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
          }
          
          [contenteditable] h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.83em 0;
          }
          
          [contenteditable] h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 1em 0;
          }
          
          [contenteditable] h4 {
            font-size: 1em;
            font-weight: bold;
            margin: 1.33em 0;
          }
          
          [contenteditable] blockquote {
            margin: 1em 0;
            padding-left: 1em;
            border-left: 4px solid #e5e7eb;
            color: #6b7280;
            font-style: italic;
          }
          
          [contenteditable] code {
            background-color: #f3f4f6;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.9em;
          }
          
          [contenteditable] pre {
            background-color: #f3f4f6;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
          }
          
          [contenteditable] pre code {
            background-color: transparent;
            padding: 0;
          }
          
          [contenteditable] ul {
            margin: 1em 0;
            padding-left: 2em;
            list-style-type: disc;
          }
          
          [contenteditable] ol {
            margin: 1em 0;
            padding-left: 2em;
            list-style-type: decimal;
          }
          
          [contenteditable] li {
            margin: 0.5em 0;
            display: list-item;
          }
          
          [contenteditable] ul li {
            list-style-type: disc;
          }
          
          [contenteditable] ol li {
            list-style-type: decimal;
          }
          
          [contenteditable] hr {
            margin: 2em 0;
            border: none;
            border-top: 1px solid #e5e7eb;
          }
          
          [contenteditable] img {
            max-width: 100%;
            height: auto;
            margin: 1em 0;
          }
          
          [contenteditable] figure {
            margin: 1em 0;
            text-align: center;
          }
          
          [contenteditable] figcaption {
            font-size: 0.9em;
            color: #6b7280;
            margin-top: 0.5em;
          }
          
          [contenteditable] a {
            color: #3b82f6;
            text-decoration: underline;
          }
          
          [contenteditable] a:hover {
            color: #1d4ed8;
          }
        `
      }} />
    </div>
  );
};

export default WysiwygEditor;
