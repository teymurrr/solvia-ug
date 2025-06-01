
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

// New utility to insert link at cursor position
export const insertLinkAtPosition = (text: string, position: number, linkText: string, url: string): string => {
  const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  return text.slice(0, position) + linkHtml + text.slice(position);
};

// Utility to find cursor position in textarea
export const getCursorPosition = (textarea: HTMLTextAreaElement): number => {
  return textarea.selectionStart || 0;
};
