import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface MiniOnboardingFormProps {
  onFilter?: (filters: FilterData) => void;
  onComplete?: (data: OnboardingData) => void;
}

export interface OnboardingData {
  profession: string;
  specialty: string;
  targetCountry: string;
  languageLevel: string;
  email: string;
}

export interface FilterData {
  profession: string;
  targetCountry: string;
}

const professionKeys = ['doctor', 'nurse', 'dentist', 'pharmacist', 'physiotherapist'] as const;
const countryKeys = ['germany', 'austria', 'spain', 'france'] as const;
const countryFlags: Record<string, string> = {
  germany: '🇩🇪',
  austria: '🇦🇹',
  spain: '🇪🇸',
  france: '🇫🇷',
};

const MiniOnboardingForm = ({ onFilter, onComplete }: MiniOnboardingFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FilterData>({
    profession: '',
    targetCountry: '',
  });

  const handleFilter = () => {
    if (onFilter) {
      onFilter(formData);
    }
  };

  const handleClear = () => {
    setFormData({ profession: '', targetCountry: '' });
    if (onFilter) {
      onFilter({ profession: '', targetCountry: '' });
    }
  };

  const hasFilters = formData.profession || formData.targetCountry;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
      <Select
        value={formData.profession}
        onValueChange={(value) => setFormData({ ...formData, profession: value })}
      >
        <SelectTrigger className="w-full sm:w-48 bg-background">
          <SelectValue placeholder={t?.vacancies?.profession || 'Profession'} />
        </SelectTrigger>
        <SelectContent>
          {professionKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {t?.vacancies?.professions?.[key] || key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={formData.targetCountry}
        onValueChange={(value) => setFormData({ ...formData, targetCountry: value })}
      >
        <SelectTrigger className="w-full sm:w-48 bg-background">
          <SelectValue placeholder={t?.vacancies?.targetCountry || 'Destination country'} />
        </SelectTrigger>
        <SelectContent>
          {countryKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {countryFlags[key]} {t?.vacancies?.countries?.[key] || key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          onClick={handleFilter}
          className="flex-1 sm:flex-none"
        >
          <Search className="h-4 w-4 mr-2" />
          {t?.vacancies?.filter || 'Filter'}
        </Button>
        
        {hasFilters && (
          <Button 
            variant="outline"
            onClick={handleClear}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MiniOnboardingForm;
