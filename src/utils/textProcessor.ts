
export const preprocessText = (text: string): string => {
  if (!text) return '';
  
  // Check if the text already contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(text);
  
  // If it already has HTML, return as is
  if (hasHtmlTags) {
    return text;
  }
  
  // Convert plain text to HTML with proper paragraph formatting
  let processedText = text
    // Replace multiple consecutive line breaks with paragraph breaks
    .replace(/\n\s*\n/g, '</p><p>')
    // Replace single line breaks with <br> tags
    .replace(/\n/g, '<br>')
    // Wrap the entire content in paragraph tags
    .replace(/^(.*)$/, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    // Fix paragraphs that start with <br>
    .replace(/<p><br>/g, '<p>')
    // Fix multiple <br> tags at the start of paragraphs
    .replace(/<p>(<br>)+/g, '<p>');
  
  return processedText;
};

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};
