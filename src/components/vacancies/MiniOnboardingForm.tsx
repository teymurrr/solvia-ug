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

const professions = [
  { value: 'doctor', label: 'Médico' },
  { value: 'nurse', label: 'Enfermero/a' },
  { value: 'dentist', label: 'Dentista' },
  { value: 'pharmacist', label: 'Farmacéutico/a' },
  { value: 'physiotherapist', label: 'Fisioterapeuta' },
];

const countries = [
  { value: 'germany', label: '🇩🇪 Alemania' },
  { value: 'austria', label: '🇦🇹 Austria' },
  { value: 'spain', label: '🇪🇸 España' },
  { value: 'france', label: '🇫🇷 Francia' },
];

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
          <SelectValue placeholder="Profesión" />
        </SelectTrigger>
        <SelectContent>
          {professions.map((prof) => (
            <SelectItem key={prof.value} value={prof.value}>
              {prof.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={formData.targetCountry}
        onValueChange={(value) => setFormData({ ...formData, targetCountry: value })}
      >
        <SelectTrigger className="w-full sm:w-48 bg-background">
          <SelectValue placeholder="País de destino" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
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
          Filtrar
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
