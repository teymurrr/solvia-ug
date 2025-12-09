import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface MiniOnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  profession: string;
  specialty: string;
  targetCountry: string;
  languageLevel: string;
  email: string;
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

const MiniOnboardingForm = ({ onComplete }: MiniOnboardingFormProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profession: '',
    targetCountry: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.profession) {
      return;
    }

    setLoading(true);

    // Navigate to signup with pre-filled data
    const params = new URLSearchParams();
    if (formData.profession) params.set('profession', formData.profession);
    if (formData.targetCountry) params.set('country', formData.targetCountry);
    
    navigate(`/signup/professional?${params.toString()}`);
  };

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

      <Button 
        onClick={handleSubmit}
        disabled={loading || !formData.profession}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Buscar ofertas
          </>
        )}
      </Button>
    </div>
  );
};

export default MiniOnboardingForm;
