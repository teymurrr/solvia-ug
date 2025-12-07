import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, Languages, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const CountryComparisonSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const comparison = landing?.countryComparison;
  
  const defaultCountries = {
    germany: {
      name: "Germany",
      flag: "🇩🇪",
      salary: "€4,200–€6,000",
      time: "3–12 months",
      language: "B2 German",
      highlight: "Highest salaries"
    },
    austria: {
      name: "Austria",
      flag: "🇦🇹",
      salary: "€3,800–€5,500",
      time: "2–8 months",
      language: "B2 German",
      highlight: "Simpler process"
    },
    spain: {
      name: "Spain",
      flag: "🇪🇸",
      salary: "€2,500–€4,000",
      time: "1–6 months",
      language: "Not mandatory",
      highlight: "Fast homologation"
    }
  };

  const countries = comparison?.countries || defaultCountries;
  const countryKeys = ['germany', 'austria', 'spain'] as const;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Compare</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {comparison?.title || "Compare Your Options"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {comparison?.subtitle || "Find the best country for your medical career"}
            </p>
          </div>

          {/* Country Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {countryKeys.map((key) => {
              const country = countries[key] || defaultCountries[key];
              return (
                <Card 
                  key={key} 
                  className="p-6 border-border/50 hover:shadow-lg transition-all hover:border-primary/30 relative overflow-hidden"
                >
                  {/* Highlight Badge */}
                  <Badge className="absolute top-4 right-4 bg-primary/10 text-primary hover:bg-primary/10">
                    {country.highlight}
                  </Badge>
                  
                  {/* Flag & Name */}
                  <div className="text-center mb-6 pt-4">
                    <div className="text-5xl mb-3">{country.flag}</div>
                    <h3 className="text-xl font-bold text-foreground">{country.name}</h3>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {comparison?.startingSalary || "Starting salary"}
                        </p>
                        <p className="font-semibold text-foreground">{country.salary}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {comparison?.homologationTime || "Homologation time"}
                        </p>
                        <p className="font-semibold text-foreground">{country.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Languages className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {comparison?.languageLevel || "Language level"}
                        </p>
                        <p className="font-semibold text-foreground">{country.language}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Button asChild size="lg" className="group">
              <Link to="/country-selection" className="flex items-center gap-2">
                {comparison?.chooseCountry || "Choose my country"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountryComparisonSection;
