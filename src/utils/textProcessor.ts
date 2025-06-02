
export const preprocessText = (text: string): string => {
  if (!text) return '';
  
  // Check if the text already contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(text);
  
  // If it already has HTML, return as is
  if (hasHtmlTags) {
    return text;
  }
  
  // Split text by double line breaks to identify paragraph blocks
  // Use a more precise regex that preserves the structure
  const paragraphBlocks = text.split(/\n\s*\n/);
  
  const processedParagraphs = paragraphBlocks.map(block => {
    // Don't trim the block too aggressively - only trim start/end whitespace
    const cleanBlock = block.replace(/^\s+|\s+$/g, '');
    
    // Skip completely empty blocks
    if (!cleanBlock) {
      return '';
    }
    
    // Within each paragraph block, convert single newlines to <br> tags
    // This preserves intentional line breaks within paragraphs
    // Don't filter out empty lines - they might be intentional spacing
    const linesWithBreaks = cleanBlock
      .split(/\n/)
      .map(line => line) // Keep lines as they are, don't trim individual lines
      .join('<br>');
    
    return `<p>${linesWithBreaks}</p>`;
  }).filter(p => p.length > 0); // Remove only completely empty paragraphs
  
  // Join all paragraphs with some spacing
  return processedParagraphs.join('\n\n');
};

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

// Enhanced link insertion with new tab option
export const insertLinkAtPosition = (text: string, position: number, linkText: string, url: string, openInNewTab: boolean = true): string => {
  const target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
  const linkHtml = `<a href="${url}"${target}>${linkText}</a>`;
  return text.slice(0, position) + linkHtml + text.slice(position);
};

// Format text with various styles
export const formatTextAtPosition = (text: string, start: number, end: number, format: 'bold' | 'italic' | 'underline' | 'strikethrough'): string => {
  const selectedText = text.substring(start, end);
  if (!selectedText) return text;

  let tag: string;
  switch (format) {
    case 'bold':
      tag = 'strong';
      break;
    case 'italic':
      tag = 'em';
      break;
    case 'underline':
      tag = 'u';
      break;
    case 'strikethrough':
      tag = 's';
      break;
    default:
      return text;
  }

  const formattedText = `<${tag}>${selectedText}</${tag}>`;
  return text.substring(0, start) + formattedText + text.substring(end);
};

// Insert heading at position
export const insertHeadingAtPosition = (text: string, position: number, level: 1 | 2 | 3 | 4, headingText?: string): string => {
  const defaultText = `Heading ${level}`;
  const content = headingText || defaultText;
  const headingHtml = `<h${level}>${content}</h${level}>`;
  return text.slice(0, position) + headingHtml + text.slice(position);
};

// Insert list at position
export const insertListAtPosition = (text: string, position: number, type: 'bullet' | 'numbered'): string => {
  const listTag = type === 'bullet' ? 'ul' : 'ol';
  const listHtml = `<${listTag}>\n<li>List item 1</li>\n<li>List item 2</li>\n<li>List item 3</li>\n</${listTag}>`;
  return text.slice(0, position) + listHtml + text.slice(position);
};

// Insert blockquote at position
export const insertBlockquoteAtPosition = (text: string, position: number): string => {
  const blockquoteHtml = '<blockquote>This is a quote or important note.</blockquote>';
  return text.slice(0, position) + blockquoteHtml + text.slice(position);
};

// Insert code at position
export const insertCodeAtPosition = (text: string, position: number, type: 'inline' | 'block'): string => {
  if (type === 'inline') {
    const codeHtml = '<code>inline code</code>';
    return text.slice(0, position) + codeHtml + text.slice(position);
  } else {
    const codeHtml = '<pre><code>// Code block\nfunction example() {\n  return "Hello, World!";\n}</code></pre>';
    return text.slice(0, position) + codeHtml + text.slice(position);
  }
};

// Insert image at position
export const insertImageAtPosition = (text: string, position: number, url: string, altText: string, caption?: string): string => {
  let imageHtml = `<img src="${url}" alt="${altText}" style="max-width: 100%; height: auto;" />`;
  
  if (caption) {
    imageHtml = `<figure>${imageHtml}<figcaption>${caption}</figcaption></figure>`;
  }
  
  return text.slice(0, position) + imageHtml + text.slice(position);
};

// Insert video embed at position
export const insertVideoAtPosition = (text: string, position: number, url: string): string => {
  let embedHtml = '';
  
  // YouTube embed
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe src="https://www.youtube.com/embed/${videoId}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                frameborder="0" 
                allowfullscreen>
        </iframe>
      </div>`;
    }
  }
  // Vimeo embed
  else if (url.includes('vimeo.com')) {
    const videoId = extractVimeoId(url);
    if (videoId) {
      embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe src="https://player.vimeo.com/video/${videoId}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                frameborder="0" 
                allowfullscreen>
        </iframe>
      </div>`;
    }
  }
  
  if (!embedHtml) {
    embedHtml = `<p><a href="${url}" target="_blank" rel="noopener noreferrer">Watch Video: ${url}</a></p>`;
  }
  
  return text.slice(0, position) + embedHtml + text.slice(position);
};

// Set text alignment
export const setTextAlignment = (text: string, start: number, end: number, align: 'left' | 'center' | 'right'): string => {
  const selectedText = text.substring(start, end);
  if (!selectedText) return text;

  const alignedText = `<div style="text-align: ${align};">${selectedText}</div>`;
  return text.substring(0, start) + alignedText + text.substring(end);
};

// Insert horizontal divider
export const insertDividerAtPosition = (text: string, position: number): string => {
  const dividerHtml = '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;" />';
  return text.slice(0, position) + dividerHtml + text.slice(position);
};

// Set font size
export const setFontSize = (text: string, start: number, end: number, size: string): string => {
  const selectedText = text.substring(start, end);
  if (!selectedText) return text;

  const styledText = `<span style="font-size: ${size};">${selectedText}</span>`;
  return text.substring(0, start) + styledText + text.substring(end);
};

// Set text color
export const setTextColor = (text: string, start: number, end: number, color: string): string => {
  const selectedText = text.substring(start, end);
  if (!selectedText) return text;

  const coloredText = `<span style="color: ${color};">${selectedText}</span>`;
  return text.substring(0, start) + coloredText + text.substring(end);
};

// Utility to get cursor position in textarea
export const getCursorPosition = (textarea: HTMLTextAreaElement): number => {
  return textarea.selectionStart || 0;
};

// Get text selection
export const getTextSelection = (textarea: HTMLTextAreaElement): { start: number; end: number; text: string } => {
  return {
    start: textarea.selectionStart || 0,
    end: textarea.selectionEnd || 0,
    text: textarea.value.substring(textarea.selectionStart || 0, textarea.selectionEnd || 0)
  };
};

// Count words in text
export const countWords = (text: string): number => {
  const plainText = stripHtml(text);
  return plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
};

// Helper functions for video URL extraction
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const regex = /vimeo\.com\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
