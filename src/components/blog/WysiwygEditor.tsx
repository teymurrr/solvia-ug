
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const formatHeading = (level: number) => {
    executeCommand('formatBlock', `h${level}`);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    
    if (paste) {
      document.execCommand('insertHTML', false, paste);
      handleInput();
    }
  };

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('bold');
          }}
          className="h-8"
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
        >
          <Underline className="h-3 w-3" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatHeading(1);
          }}
          className="h-8 text-xs"
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
        >
          H3
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('insertUnorderedList');
          }}
          className="h-8"
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
        >
          <ListOrdered className="h-3 w-3" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
          className="h-8"
        >
          <LinkIcon className="h-3 w-3" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertImage();
          }}
          className="h-8"
        >
          <Image className="h-3 w-3" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
        suppressContentEditableWarning={true}
      />

      {/* CSS for placeholder */}
      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable]:empty:before {
            content: "${placeholder}";
            color: #9ca3af;
            pointer-events: none;
          }
        `
      }} />
    </div>
  );
};

export default WysiwygEditor;
