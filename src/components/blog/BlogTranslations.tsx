
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/landing';
import { useLanguage } from '@/hooks/useLanguage';

interface BlogTranslationsProps {
  translations: BlogPost[];
  currentLanguage: string;
}

const languageNames = {
  en: { name: 'English', flag: '🇺🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  ru: { name: 'Русский', flag: '🇷🇺' },
};

const BlogTranslations: React.FC<BlogTranslationsProps> = ({ translations, currentLanguage }) => {
  const { t } = useLanguage();
  if (translations.length === 0) return null;

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Languages className="h-4 w-4 text-gray-600" />
        <span className="font-medium text-gray-700">{t.blog.availableInOtherLanguages}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {translations.map((translation) => {
          const langInfo = languageNames[translation.language as keyof typeof languageNames];
          if (!langInfo) return null;
          
          return (
            <Button
              key={translation.id}
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={`/blog/${translation.slug || translation.id}`} className="flex items-center gap-2">
                <span>{langInfo.flag}</span>
                <span>{langInfo.name}</span>
                {translation.status === 'draft' && (
                  <Badge variant="outline" className="text-xs">Draft</Badge>
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BlogTranslations;
