import React, { useMemo } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const headings = useMemo(() => {
    const items: TOCItem[] = [];
    // Match h2 and h3 tags in HTML content
    const regex = /<h([23])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[23]>/gi;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const existingId = match[2];
      const rawText = match[3].replace(/<[^>]+>/g, '').trim();
      const id = existingId || rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (rawText) {
        items.push({ id, text: rawText, level });
      }
    }

    return items;
  }, [content]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id) || 
      // Try to find by text content if no ID
      Array.from(document.querySelectorAll('h2, h3')).find(
        h => h.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id
      );
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-muted/30 rounded-lg p-4 border" aria-label="Table of contents">
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
        <List className="h-4 w-4" />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-1.5">
        {headings.map((heading, i) => (
          <li key={i}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`text-left text-sm text-muted-foreground hover:text-primary transition-colors w-full truncate ${
                heading.level === 3 ? 'pl-4' : ''
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
