import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

interface CountryComparisonBarProps {
  profession?: string;
  specialty?: string;
}

const countryKeys = ['germany', 'austria', 'spain', 'france'] as const;
const countryFlags: Record<string, string> = {
  germany: '🇩🇪',
  austria: '🇦🇹',
  spain: '🇪🇸',
  france: '🇫🇷',
};
const countrySalaries: Record<string, string> = {
  germany: '5.500–12.000',
  austria: '5.000–13.000',
  spain: '3.000–8.000',
  france: '4.000–10.000',
};
const countryOffers: Record<string, number> = {
  germany: 85,
  austria: 42,
  spain: 38,
  france: 25,
};
const badgeColors: Record<string, string> = {
  germany: 'bg-emerald-500',
  austria: 'bg-blue-500',
  spain: 'bg-amber-500',
  france: 'bg-violet-500',
};

const CountryComparisonBar = ({ profession, specialty }: CountryComparisonBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 justify-center">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">{t?.vacancies?.compareDestinations || 'Compare destinations'}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {countryKeys.map((key) => (
          <Card 
            key={key} 
            className="p-5 relative border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card"
          >
            <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${badgeColors[key]} text-white text-xs px-3 py-1 whitespace-nowrap`}>
              {t?.vacancies?.countryBadges?.[key] || key}
            </Badge>
            
            <div className="space-y-4 pt-2">
              <div className="text-center">
                <span className="text-4xl block mb-2">{countryFlags[key]}</span>
                <h4 className="font-bold text-lg text-foreground">{t?.vacancies?.countries?.[key] || key}</h4>
                <p className="text-sm text-muted-foreground">{countryOffers[key]} {t?.vacancies?.availablePositions || 'available positions'}</p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mb-1">
                  <Banknote className="h-3.5 w-3.5" />
                  <span>{t?.vacancies?.expectedSalary || 'Expected salary'}</span>
                </div>
                <p className="text-xl font-bold text-primary">€{countrySalaries[key]}</p>
                <p className="text-xs text-muted-foreground">{t?.vacancies?.perMonth || '/month'}</p>
              </div>
              
              <div className="flex items-center justify-center gap-2 py-2 border-t border-border/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{t?.vacancies?.homologationTime?.[key] || ''}</p>
                  <p className="text-xs text-muted-foreground">{t?.vacancies?.estimatedTime || 'Estimated time'}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button asChild size="lg" className="gap-2">
          <Link to="/homologation-wizard">
            {t?.vacancies?.getPersonalizedPlan || 'Get my personalized plan'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CountryComparisonBar;
