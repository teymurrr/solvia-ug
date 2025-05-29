
export const preprocessText = (text: string): string => {
  if (!text) return '';
  
  // Check if the text already contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(text);
  
  // If it already has HTML, return as is
  if (hasHtmlTags) {
    return text;
  }
  
  // Split text by double line breaks to identify paragraphs
  const paragraphs = text
    .split(/\n\s*\n/) // Split on double newlines (with possible whitespace)
    .filter(paragraph => paragraph.trim().length > 0); // Remove empty paragraphs
  
  // Process each paragraph
  const processedParagraphs = paragraphs.map(paragraph => {
    // Replace single line breaks within paragraphs with <br> tags
    const processedParagraph = paragraph
      .trim() // Remove leading/trailing whitespace
      .replace(/\n/g, '<br>'); // Convert single line breaks to <br>
    
    // Wrap in paragraph tags
    return `<p>${processedParagraph}</p>`;
  });
  
  // Join all paragraphs
  return processedParagraphs.join('');
};

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};
