
export const preprocessText = (text: string): string => {
  if (!text) return '';
  
  // Check if the text already contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(text);
  
  // If it already has HTML, return as is
  if (hasHtmlTags) {
    return text;
  }
  
  // Split text by double line breaks to identify paragraph blocks
  const paragraphBlocks = text.split(/\n\s*\n/);
  
  const processedParagraphs = paragraphBlocks.map(block => {
    const trimmedBlock = block.trim();
    
    // Skip empty blocks
    if (!trimmedBlock) {
      return '';
    }
    
    // Within each paragraph block, convert single newlines to <br> tags
    // This preserves intentional line breaks within paragraphs
    const linesWithBreaks = trimmedBlock
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('<br>');
    
    return `<p>${linesWithBreaks}</p>`;
  }).filter(p => p.length > 0); // Remove empty paragraphs
  
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
