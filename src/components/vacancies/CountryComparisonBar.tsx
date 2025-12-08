import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Globe, TrendingUp, Star } from 'lucide-react';

interface CountryData {
  name: string;
  flag: string;
  offers: number;
  salaryRange: string;
  homologationTime: string;
  languageRequired: string;
  isRecommended?: boolean;
  recommendationReason?: string;
}

interface CountryComparisonBarProps {
  profession?: string;
  specialty?: string;
}

const CountryComparisonBar = ({ profession, specialty }: CountryComparisonBarProps) => {
  // Mock data - in production this would come from backend based on user profile
  const countries: CountryData[] = [
    {
      name: 'Alemania',
      flag: '🇩🇪',
      offers: 127,
      salaryRange: '50.000 - 85.000 €/año',
      homologationTime: '6-12 meses',
      languageRequired: 'B2 alemán',
      isRecommended: true,
      recommendationReason: 'Más ofertas para tu perfil',
    },
    {
      name: 'Austria',
      flag: '🇦🇹',
      offers: 45,
      salaryRange: '55.000 - 90.000 €/año',
      homologationTime: '4-8 meses',
      languageRequired: 'B2 alemán',
    },
    {
      name: 'España',
      flag: '🇪🇸',
      offers: 89,
      salaryRange: '35.000 - 55.000 €/año',
      homologationTime: '2-4 meses',
      languageRequired: 'Español nativo',
      recommendationReason: 'Homologación más rápida',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Comparativa de países</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {countries.map((country) => (
          <Card 
            key={country.name} 
            className={`p-4 relative ${country.isRecommended ? 'border-primary border-2 ring-2 ring-primary/20' : 'border-border/50'}`}
          >
            {country.isRecommended && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                <Star className="h-3 w-3 mr-1" />
                Recomendado
              </Badge>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{country.flag}</span>
                <span className="font-semibold text-lg">{country.name}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ofertas disponibles</span>
                  <span className="font-medium text-primary">{country.offers}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rango salarial</span>
                  <span className="font-medium">{country.salaryRange}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Homologación: {country.homologationTime}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>{country.languageRequired}</span>
                </div>
              </div>
              
              {country.recommendationReason && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <TrendingUp className="h-3 w-3" />
                    <span>{country.recommendationReason}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CountryComparisonBar;
