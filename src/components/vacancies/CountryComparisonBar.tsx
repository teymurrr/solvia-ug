import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe, TrendingUp, Banknote, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CountryData {
  name: string;
  flag: string;
  offers: number;
  salaryRange: string;
  homologationTime: string;
  badge?: string;
  badgeColor?: string;
}

interface CountryComparisonBarProps {
  profession?: string;
  specialty?: string;
}

const CountryComparisonBar = ({ profession, specialty }: CountryComparisonBarProps) => {
  const countries: CountryData[] = [
    {
      name: 'Alemania',
      flag: '🇩🇪',
      offers: 85,
      salaryRange: '5.500–12.000',
      homologationTime: '6–12 meses',
      badge: 'Mejores salarios',
      badgeColor: 'bg-emerald-500',
    },
    {
      name: 'Austria',
      flag: '🇦🇹',
      offers: 42,
      salaryRange: '5.000–13.000',
      homologationTime: '4–8 meses',
      badge: 'Proceso más simple',
      badgeColor: 'bg-blue-500',
    },
    {
      name: 'España',
      flag: '🇪🇸',
      offers: 38,
      salaryRange: '3.000–8.000',
      homologationTime: '2–6 meses',
      badge: 'Homologación rápida',
      badgeColor: 'bg-amber-500',
    },
    {
      name: 'Francia',
      flag: '🇫🇷',
      offers: 25,
      salaryRange: '4.000–10.000',
      homologationTime: '4–10 meses',
      badge: 'Gran calidad de vida',
      badgeColor: 'bg-violet-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 justify-center">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Compara destinos</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {countries.map((country) => (
          <Card 
            key={country.name} 
            className="p-5 relative border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card"
          >
            {country.badge && (
              <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${country.badgeColor} text-white text-xs px-3 py-1 whitespace-nowrap`}>
                {country.badge}
              </Badge>
            )}
            
            <div className="space-y-4 pt-2">
              {/* Country header */}
              <div className="text-center">
                <span className="text-4xl block mb-2">{country.flag}</span>
                <h4 className="font-bold text-lg text-foreground">{country.name}</h4>
                <p className="text-sm text-muted-foreground">{country.offers} posiciones disponibles</p>
              </div>
              
              {/* Main highlight: Expected Earnings */}
              <div className="bg-primary/5 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mb-1">
                  <Banknote className="h-3.5 w-3.5" />
                  <span>Salario esperado</span>
                </div>
                <p className="text-xl font-bold text-primary">€{country.salaryRange}</p>
                <p className="text-xs text-muted-foreground">/mes</p>
              </div>
              
              {/* Duration highlight */}
              <div className="flex items-center justify-center gap-2 py-2 border-t border-border/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{country.homologationTime}</p>
                  <p className="text-xs text-muted-foreground">Tiempo estimado</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button size="lg" className="gap-2">
          Obtener mi plan personalizado
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CountryComparisonBar;
