import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, Globe, Banknote } from 'lucide-react';
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
      positions: 85,
      salary: "5,500–12,000",
      highlight: "Best salaries",
      badgeColor: "bg-emerald-500"
    },
    austria: {
      name: "Austria",
      flag: "🇦🇹",
      processDuration: "4–8 months",
      positions: 42,
      salary: "5,000–13,000",
      highlight: "Simplest process",
      badgeColor: "bg-blue-500"
    },
    spain: {
      name: "Spain",
      flag: "🇪🇸",
      processDuration: "2–6 months",
      positions: 38,
      salary: "3,000–8,000",
      highlight: "Fast homologation",
      badgeColor: "bg-amber-500"
    },
    france: {
      name: "France",
      flag: "🇫🇷",
      processDuration: "4–10 months",
      positions: 25,
      salary: "4,000–10,000",
      highlight: "Great quality of life",
      badgeColor: "bg-violet-500"
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
                {comparison?.badge || "Compare Destinations"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {comparison?.title || "Choose Your Destination"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {comparison?.subtitle || "See expected earnings and timeline for each country"}
            </p>
          </div>

          {/* Country Cards - Redesigned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {countryKeys.map((key) => {
              const country = countries[key] || defaultCountries[key];
              const defaultData = defaultCountries[key];
              
              return (
                <Card 
                  key={key} 
                  className="p-5 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card relative"
                >
                  {/* Highlight Badge */}
                  <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${defaultData.badgeColor} text-white text-xs px-3 py-1 whitespace-nowrap`}>
                    {country.highlight || defaultData.highlight}
                  </Badge>
                  
                  <div className="space-y-4 pt-2">
                    {/* Country header */}
                    <div className="text-center">
                      <span className="text-4xl block mb-2">{country.flag || defaultData.flag}</span>
                      <h4 className="font-bold text-lg text-foreground">{country.name || defaultData.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {defaultData.positions} {comparison?.positionsAvailable || "positions available"}
                      </p>
                    </div>
                    
                    {/* Main highlight: Expected Earnings */}
                    <div className="bg-primary/5 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mb-1">
                        <Banknote className="h-3.5 w-3.5" />
                        <span>{comparison?.expectedSalary || "Expected salary"}</span>
                      </div>
                      <p className="text-xl font-bold text-primary">€{country.salary || defaultData.salary}</p>
                      <p className="text-xs text-muted-foreground">/{comparison?.perMonth || "month"}</p>
                    </div>
                    
                    {/* Duration highlight */}
                    <div className="flex items-center justify-center gap-2 py-2 border-t border-border/50">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{country.processDuration || defaultData.processDuration}</p>
                        <p className="text-xs text-muted-foreground">{comparison?.estimatedTime || "Estimated time"}</p>
                      </div>
                    </div>
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
