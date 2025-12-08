import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, Globe, Euro, FileCheck, Target, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const specialties = [
  { value: 'general', label: 'Medicina General' },
  { value: 'pediatrics', label: 'Pediatría' },
  { value: 'surgery', label: 'Cirugía' },
  { value: 'cardiology', label: 'Cardiología' },
  { value: 'neurology', label: 'Neurología' },
  { value: 'psychiatry', label: 'Psiquiatría' },
  { value: 'anesthesiology', label: 'Anestesiología' },
  { value: 'radiology', label: 'Radiología' },
  { value: 'other', label: 'Otra especialidad' },
];

const countries = [
  { value: 'germany', label: 'Alemania' },
  { value: 'austria', label: 'Austria' },
  { value: 'spain', label: 'España' },
  { value: 'switzerland', label: 'Suiza' },
];

const languageLevels = [
  { value: 'none', label: 'Sin conocimientos' },
  { value: 'a1', label: 'A1 - Principiante' },
  { value: 'a2', label: 'A2 - Básico' },
  { value: 'b1', label: 'B1 - Intermedio' },
  { value: 'b2', label: 'B2 - Intermedio Alto' },
  { value: 'c1', label: 'C1 - Avanzado' },
];

const MiniOnboardingForm = ({ onComplete }: MiniOnboardingFormProps) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    profession: '',
    specialty: '',
    targetCountry: '',
    languageLevel: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.profession) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Save lead to Supabase
      const { error } = await supabase.from('leads').insert({
        email: formData.email,
        doctor_type: formData.profession,
        target_country: formData.targetCountry,
        language_level: formData.languageLevel,
        source: 'vacancies_page',
        status: 'new',
      });

      if (error) {
        if (error.code === '23505') {
          // Duplicate email - still allow them to proceed
          toast.info('¡Ya tienes una cuenta! Mostrando ofertas...');
        } else {
          throw error;
        }
      } else {
        toast.success('¡Perfil guardado! Mostrando ofertas personalizadas...');
      }

      onComplete(formData);
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Error al guardar. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            Completa tu perfil para ver tus ofertas exactas
          </h3>
          <p className="text-muted-foreground text-sm">
            Esto nos permite mostrarte:
          </p>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Países donde homologar más rápido</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Euro className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Salarios según tu especialidad</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Ofertas verificadas</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Requisitos específicos para ti</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profesión *</Label>
              <Select
                value={formData.profession}
                onValueChange={(value) => setFormData({ ...formData, profession: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu profesión" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((prof) => (
                    <SelectItem key={prof.value} value={prof.value}>
                      {prof.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidad</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) => setFormData({ ...formData, specialty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCountry">País de destino</Label>
              <Select
                value={formData.targetCountry}
                onValueChange={(value) => setFormData({ ...formData, targetCountry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="¿Dónde quieres trabajar?" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languageLevel">Nivel de idioma (opcional)</Label>
              <Select
                value={formData.languageLevel}
                onValueChange={(value) => setFormData({ ...formData, languageLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tu nivel de alemán" />
                </SelectTrigger>
                <SelectContent>
                  {languageLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <FileCheck className="h-4 w-4 mr-2" />
                Ver ofertas personalizadas
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default MiniOnboardingForm;
