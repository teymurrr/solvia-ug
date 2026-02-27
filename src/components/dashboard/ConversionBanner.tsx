import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react';

interface ConversionBannerProps {
  targetCountry?: string | null;
}

const ConversionBanner: React.FC<ConversionBannerProps> = ({ targetCountry }) => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const messages: Record<string, { title: string; cta: string }> = {
    en: { title: 'Your homologation roadmap is ready — unlock it now', cta: 'Start for €39' },
    es: { title: 'Tu hoja de ruta de homologación está lista — desbloquéala ahora', cta: 'Empieza por €39' },
    de: { title: 'Dein Anerkennungs-Fahrplan ist fertig — jetzt freischalten', cta: 'Starte für €39' },
    fr: { title: 'Ta feuille de route d\'homologation est prête — débloque-la maintenant', cta: 'Commence pour €39' },
    ru: { title: 'Твой план гомологации готов — разблокируй его сейчас', cta: 'Начни за €39' },
  };

  const lang = currentLanguage in messages ? currentLanguage : 'en';
  const msg = messages[lang];

  return (
    <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground pr-6 sm:pr-0">
          {msg.title}
        </p>
      </div>
      
      <Button
        size="sm"
        onClick={() => navigate(`/homologation-payment${targetCountry ? `?country=${targetCountry}` : ''}`)}
        className="gap-1.5 whitespace-nowrap shrink-0"
      >
        {msg.cta} <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default ConversionBanner;
