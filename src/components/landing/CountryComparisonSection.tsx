import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Euro, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const CountryComparisonSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const comparison = landing?.countryComparison;
  
  const defaultCountries = {
    germany: {
      name: "Germany",
      flag: "🇩🇪",
      processDuration: "6–12 months",
      price: "€1,490",
      highlight: "Most popular",
      includes: ["Document preparation", "FSP guidance", "Job placement"]
    },
    austria: {
      name: "Austria",
      flag: "🇦🇹",
      processDuration: "4–8 months",
      price: "€1,290",
      highlight: "Fastest process",
      includes: ["Document preparation", "Nostrifizierung", "Job placement"]
    },
    spain: {
      name: "Spain",
      flag: "🇪🇸",
      processDuration: "2–6 months",
      price: "€990",
      highlight: "Easiest language",
      includes: ["Document preparation", "MIR support", "Job placement"]
    },
    france: {
      name: "France",
      flag: "🇫🇷",
      processDuration: "4–10 months",
      price: "€1,190",
      highlight: "Great lifestyle",
      includes: ["Document preparation", "PAE support", "Job placement"]
    }
  };

  const countries = comparison?.countries || defaultCountries;
  const countryKeys = ['germany', 'austria', 'spain', 'france'] as const;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {comparison?.badge || "Homologation Services"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {comparison?.title || "Choose Your Destination"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {comparison?.subtitle || "Complete homologation packages with transparent pricing"}
            </p>
          </div>

          {/* Country Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {countryKeys.map((key) => {
              const country = countries[key] || defaultCountries[key];
              const isGermany = key === 'germany';
              return (
                <Card 
                  key={key} 
                  className={`p-6 border-border/50 hover:shadow-lg transition-all hover:border-primary/30 relative overflow-hidden ${isGermany ? 'ring-2 ring-primary/50' : ''}`}
                >
                  {/* Highlight Badge */}
                  <Badge className={`absolute top-4 right-4 ${isGermany ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'} hover:bg-primary/20`}>
                    {country.highlight}
                  </Badge>
                  
                  {/* Flag & Name */}
                  <div className="text-center mb-6 pt-4">
                    <div className="text-5xl mb-3">{country.flag}</div>
                    <h3 className="text-xl font-bold text-foreground">{country.name}</h3>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-3xl font-bold text-primary">{country.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {comparison?.oneTimePayment || "One-time payment"}
                    </p>
                  </div>
                  
                  {/* Duration */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg mb-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {country.processDuration}
                    </span>
                  </div>
                  
                  {/* Includes */}
                  <div className="space-y-2">
                    {(country.includes || defaultCountries[key].includes).map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button asChild size="lg" className="group">
              <Link to="/homologation-wizard" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2">
                {comparison?.cta || "Get my personalized plan"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              {comparison?.ctaSubtext || "Free assessment • No commitment required"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountryComparisonSection;
