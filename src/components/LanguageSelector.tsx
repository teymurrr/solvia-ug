
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Language, languageNames } from '@/utils/i18n/translations';
import { toast } from '@/hooks/use-toast';

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: Language) => {
    if (newLang === currentLanguage) return;
    
    setLanguage(newLang);
    
    // Show a toast to confirm language change
    toast({
      title: "Language changed",
      description: `Interface language changed to ${languageNames[newLang]}`,
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang as Language)}
            className={currentLanguage === lang ? 'bg-muted' : ''}
          >
            {languageNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
