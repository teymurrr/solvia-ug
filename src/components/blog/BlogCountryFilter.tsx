
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const COUNTRY_FLAGS: Record<string, { flag: string; label: string }> = {
  india: { flag: '🇮🇳', label: 'India' },
  argentina: { flag: '🇦🇷', label: 'Argentina' },
  colombia: { flag: '🇨🇴', label: 'Colombia' },
  egypt: { flag: '🇪🇬', label: 'Egypt' },
  philippines: { flag: '🇵🇭', label: 'Philippines' },
  syria: { flag: '🇸🇾', label: 'Syria' },
  pakistan: { flag: '🇵🇰', label: 'Pakistan' },
  brazil: { flag: '🇧🇷', label: 'Brazil' },
  mexico: { flag: '🇲🇽', label: 'Mexico' },
  turkey: { flag: '🇹🇷', label: 'Turkey' },
  iran: { flag: '🇮🇷', label: 'Iran' },
  iraq: { flag: '🇮🇶', label: 'Iraq' },
  tunisia: { flag: '🇹🇳', label: 'Tunisia' },
  morocco: { flag: '🇲🇦', label: 'Morocco' },
};

interface BlogCountryFilterProps {
  countries: string[];
  selected: string | null;
  onSelect: (country: string | null) => void;
}

const BlogCountryFilter: React.FC<BlogCountryFilterProps> = ({ countries, selected, onSelect }) => {
  if (countries.length === 0) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex items-center gap-2 pb-2">
        <Button
          variant={selected === null ? 'default' : 'outline'}
          size="sm"
          className="rounded-full text-sm shrink-0"
          onClick={() => onSelect(null)}
        >
          🌍 All
        </Button>
        {countries.map((country) => {
          const info = COUNTRY_FLAGS[country] || { flag: '🏳️', label: country.charAt(0).toUpperCase() + country.slice(1) };
          return (
            <Button
              key={country}
              variant={selected === country ? 'default' : 'outline'}
              size="sm"
              className="rounded-full text-sm shrink-0"
              onClick={() => onSelect(country)}
            >
              {info.flag} {info.label}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default BlogCountryFilter;
