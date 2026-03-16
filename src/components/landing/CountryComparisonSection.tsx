import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Globe, TrendingUp, Zap, Shield } from 'lucide-react';
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
      highlight: "Best salaries",
      icon: TrendingUp,
      accentColor: "from-emerald-500 to-emerald-600",
      accentBg: "bg-emerald-500/10",
      accentText: "text-emerald-600",
      salary: "€5,500 – €12,000/mo",
    },
    spain: {
      name: "Spain",
      flag: "🇪🇸",
      processDuration: "2–6 months",
      highlight: "Fast homologation",
      icon: Zap,
      accentColor: "from-amber-500 to-orange-500",
      accentBg: "bg-amber-500/10",
      accentText: "text-amber-600",
      salary: "€3,000 – €8,000/mo",
    },
    austria: {
      name: "Austria",
      flag: "🇦🇹",
      processDuration: "4–8 months",
      highlight: "Simplest process",
      icon: Shield,
      accentColor: "from-blue-500 to-blue-600",
      accentBg: "bg-blue-500/10",
      accentText: "text-blue-600",
      salary: "€5,000 – €13,000/mo",
    },
  };

  const countryKeys = ['germany', 'spain', 'austria'] as const;
  const countries = comparison?.countries || defaultCountries;

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.03),transparent_70%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full mb-5">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {comparison?.badge || "Compare Destinations"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {comparison?.title || "Choose Your Destination"}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {comparison?.subtitle || "See expected timeline and starting price for each country"}
            </p>
          </div>

          {/* Country Cards — horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {countryKeys.map((key) => {
              const country = countries[key] || defaultCountries[key];
              const defaults = defaultCountries[key];
              const Icon = defaults.icon;

              return (
                <Link
                  key={key}
                  to="/homologation-wizard"
                  onClick={() => window.scrollTo(0, 0)}
                  className="group block"
                >
                  <div className="relative rounded-2xl border border-border/60 bg-card p-6 h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
                    {/* Accent gradient top bar */}
                    <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${defaults.accentColor} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    {/* Flag + Name */}
                    <div className="flex items-center gap-3 mb-5 pt-2">
                      <span className="text-4xl">{country.flag || defaults.flag}</span>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{country.name || defaults.name}</h3>
                        <div className={`flex items-center gap-1.5 ${defaults.accentText}`}>
                          <Icon className="h-3.5 w-3.5" />
                          <span className="text-sm font-medium">{country.highlight || defaults.highlight}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-muted/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {comparison?.startingFrom || "Starting from"}
                        </p>
                        <p className="text-xl font-bold text-foreground">€150</p>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {comparison?.estimatedTime || "Timeline"}
                        </p>
                        <p className="text-base font-semibold text-foreground flex items-center justify-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {country.processDuration || defaults.processDuration}
                        </p>
                      </div>
                    </div>

                    {/* Salary range */}
                    <div className={`${defaults.accentBg} rounded-xl px-4 py-3 mb-4`}>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {comparison?.salaryRange || "Salary range"}
                      </p>
                      <p className={`text-sm font-semibold ${defaults.accentText}`}>
                        {defaults.salary}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                      {comparison?.learnMore || "Learn more"}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Button asChild size="lg" className="group h-12 px-8 text-base shadow-lg shadow-primary/20">
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
