import React, { useState, useEffect } from 'react';
import { Mail, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDigestPreferences, useUpdateDigestPreferences, DEFAULT_CATEGORIES } from '@/hooks/useDigestPreferences';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  en: {
    homologation: 'Homologation',
    language: 'Language Learning',
    fsp: 'FSP Preparation',
    'life-abroad': 'Life in Germany',
    'job-search': 'Job Search',
    journey: 'Journey Updates',
  },
  es: {
    homologation: 'Homologación',
    language: 'Aprendizaje de idiomas',
    fsp: 'Preparación FSP',
    'life-abroad': 'Vida en Alemania',
    'job-search': 'Búsqueda de empleo',
    journey: 'Actualizaciones del camino',
  },
  de: {
    homologation: 'Homologation',
    language: 'Sprachlernen',
    fsp: 'FSP-Vorbereitung',
    'life-abroad': 'Leben in Deutschland',
    'job-search': 'Jobsuche',
    journey: 'Meilensteine',
  },
  fr: {
    homologation: 'Homologation',
    language: 'Apprentissage des langues',
    fsp: 'Préparation FSP',
    'life-abroad': 'Vie en Allemagne',
    'job-search': "Recherche d'emploi",
    journey: 'Étapes du parcours',
  },
  ru: {
    homologation: 'Гомологация',
    language: 'Изучение языка',
    fsp: 'Подготовка к FSP',
    'life-abroad': 'Жизнь в Германии',
    'job-search': 'Поиск работы',
    journey: 'Достижения',
  },
};

const DigestSettings = () => {
  const { isLoggedIn } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const { data: prefs, isLoading } = useDigestPreferences();
  const updatePrefs = useUpdateDigestPreferences();

  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState('weekly');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (prefs) {
      setEnabled(prefs.enabled);
      setFrequency(prefs.frequency);
      setCategories(prefs.categories);
    }
  }, [prefs]);

  if (!isLoggedIn) return null;

  const labels = CATEGORY_LABELS[currentLanguage] || CATEGORY_LABELS.en;

  const digestT = {
    en: {
      title: 'Email Digest Settings',
      description: 'Configure your weekly community digest email',
      enableDigest: 'Email Digest',
      frequency: 'Frequency',
      weekly: 'Weekly',
      daily: 'Daily',
      never: 'Never',
      categories: 'Categories to include',
      save: 'Save Preferences',
      saving: 'Saving...',
      saved: 'Preferences saved!',
      button: 'Digest Settings',
    },
    es: {
      title: 'Configuración del Resumen',
      description: 'Configura tu resumen semanal de la comunidad',
      enableDigest: 'Resumen por email',
      frequency: 'Frecuencia',
      weekly: 'Semanal',
      daily: 'Diario',
      never: 'Nunca',
      categories: 'Categorías a incluir',
      save: 'Guardar',
      saving: 'Guardando...',
      saved: '¡Preferencias guardadas!',
      button: 'Configurar Resumen',
    },
    de: {
      title: 'Digest-Einstellungen',
      description: 'Konfiguriere deinen wöchentlichen Community-Digest',
      enableDigest: 'E-Mail-Digest',
      frequency: 'Häufigkeit',
      weekly: 'Wöchentlich',
      daily: 'Täglich',
      never: 'Nie',
      categories: 'Enthaltene Kategorien',
      save: 'Speichern',
      saving: 'Speichern...',
      saved: 'Einstellungen gespeichert!',
      button: 'Digest-Einstellungen',
    },
    fr: {
      title: 'Paramètres du Digest',
      description: 'Configurez votre digest communautaire hebdomadaire',
      enableDigest: 'Digest par email',
      frequency: 'Fréquence',
      weekly: 'Hebdomadaire',
      daily: 'Quotidien',
      never: 'Jamais',
      categories: 'Catégories à inclure',
      save: 'Enregistrer',
      saving: 'Enregistrement...',
      saved: 'Préférences enregistrées !',
      button: 'Paramètres Digest',
    },
    ru: {
      title: 'Настройки дайджеста',
      description: 'Настройте еженедельный дайджест сообщества',
      enableDigest: 'Email-дайджест',
      frequency: 'Частота',
      weekly: 'Еженедельно',
      daily: 'Ежедневно',
      never: 'Никогда',
      categories: 'Категории для включения',
      save: 'Сохранить',
      saving: 'Сохранение...',
      saved: 'Настройки сохранены!',
      button: 'Настройки дайджеста',
    },
  };

  const dt = digestT[currentLanguage as keyof typeof digestT] || digestT.en;

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    try {
      await updatePrefs.mutateAsync({ enabled, frequency, categories });
      toast.success(dt.saved);
      setOpen(false);
    } catch {
      toast.error('Error saving preferences');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Mail className="h-4 w-4" />
          {dt.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dt.title}</DialogTitle>
          <DialogDescription>{dt.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {enabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Label htmlFor="digest-enabled">{dt.enableDigest}</Label>
            </div>
            <Switch
              id="digest-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {/* Frequency */}
          {enabled && (
            <>
              <div className="space-y-2">
                <Label>{dt.frequency}</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">{dt.weekly}</SelectItem>
                    <SelectItem value="daily">{dt.daily}</SelectItem>
                    <SelectItem value="never">{dt.never}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>{dt.categories}</Label>
                <div className="space-y-2">
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={categories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                      />
                      <Label htmlFor={`cat-${cat}`} className="font-normal cursor-pointer">
                        {labels[cat] || cat}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button
            onClick={handleSave}
            disabled={updatePrefs.isPending}
            className="w-full"
          >
            {updatePrefs.isPending ? dt.saving : dt.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DigestSettings;
