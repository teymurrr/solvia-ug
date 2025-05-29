
export const preprocessText = (text: string): string => {
  if (!text) return '';
  
  // Check if the text already contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(text);
  
  // If it already has HTML, return as is
  if (hasHtmlTags) {
    return text;
  }
  
  // Split text by single line breaks and treat each as a paragraph
  // This preserves the user's intended formatting better
  const lines = text
    .split(/\n/) // Split on single newlines
    .map(line => line.trim()) // Trim each line
    .filter(line => line.length > 0); // Remove empty lines
  
  // Process each line as a paragraph
  const processedParagraphs = lines.map(line => {
    return `<p>${line}</p>`;
  });
  
  // Join all paragraphs
  return processedParagraphs.join('');
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
