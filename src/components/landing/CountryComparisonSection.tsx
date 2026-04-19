import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Globe, TrendingUp, Zap, Shield, Euro, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { trackEligibilityClick } from '@/lib/posthogEvents';

const CountryComparisonSection = () => {
  const { t } = useLanguage();

  const landing = t?.landing;
  const comparison = landing?.countryComparison;

  const countries = [
    {
      key: 'germany',
      name: comparison?.countries?.germany?.name || "Germany",
      flag: "🇩🇪",
      duration: comparison?.countries?.germany?.processDuration || "6–12 months",
      highlight: comparison?.countries?.germany?.highlight || "Best salaries",
      price: 789,
      salary: "€5,500 – €12,000",
      color: "hsl(var(--primary))",
      gradient: "from-primary/10 to-primary/5",
      borderColor: "border-primary/30",
      tagBg: "bg-primary/10 text-primary",
    },
    {
      key: 'spain',
      name: comparison?.countries?.spain?.name || "Spain",
      flag: "🇪🇸",
      duration: comparison?.countries?.spain?.processDuration || "2–6 months",
      highlight: comparison?.countries?.spain?.highlight || "Fast homologation",
      price: 250,
      salary: "€3,000 – €8,000",
      color: "hsl(var(--accent))",
      gradient: "from-accent/10 to-accent/5",
      borderColor: "border-accent/30",
      tagBg: "bg-accent/10 text-accent",
    },
    {
      key: 'austria',
      name: comparison?.countries?.austria?.name || "Austria",
      flag: "🇦🇹",
      duration: comparison?.countries?.austria?.processDuration || "4–8 months",
      highlight: comparison?.countries?.austria?.highlight || "Simplest process",
      price: 789,
      salary: "€5,000 – €13,000",
      color: "hsl(var(--secondary))",
      gradient: "from-secondary/10 to-secondary/5",
      borderColor: "border-secondary/30",
      tagBg: "bg-secondary/10 text-secondary-foreground",
    },
  ];

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.04),transparent_60%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
              {comparison?.title || "Choose Your Destination"}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {comparison?.subtitle || "Compare timelines, salaries, and pricing across Europe's top destinations for medical professionals"}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-10">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-border/40">
              <div className="p-5" />
              {countries.map((c) => (
                <div key={c.key} className="p-5 text-center border-l border-border/40">
                  <span className="text-3xl mb-1 block">{c.flag}</span>
                  <h3 className="text-lg font-bold text-foreground">{c.name}</h3>
                  <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.tagBg}`}>
                    {c.highlight}
                  </span>
                </div>
              ))}
            </div>

            {/* Row: Timeline */}
            <div className="grid grid-cols-4 border-b border-border/30 hover:bg-muted/30 transition-colors">
              <div className="p-4 flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                {comparison?.estimatedTime || "Timeline"}
              </div>
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30 font-semibold text-foreground">
                  {c.duration}
                </div>
              ))}
            </div>

            {/* Row: Monthly Salary */}
            <div className="grid grid-cols-4 border-b border-border/30 hover:bg-muted/30 transition-colors">
              <div className="p-4 flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4 shrink-0" />
                {comparison?.salaryRange || "Monthly salary"}
              </div>
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30 font-semibold text-foreground text-sm">
                  {c.salary}
                </div>
              ))}
            </div>

            {/* Row: Starting Price */}
            <div className="grid grid-cols-4 border-b border-border/30 hover:bg-muted/30 transition-colors">
              <div className="p-4 flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                <Euro className="h-4 w-4 shrink-0" />
                {comparison?.startingFrom || "Starting from"}
              </div>
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30">
                  <span className="text-2xl font-bold text-primary">€{c.price}</span>
                </div>
              ))}
            </div>

            {/* Row: CTAs */}
            <div className="grid grid-cols-4">
              <div className="p-4" />
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30">
                  <Link
                    to={`/homologation-wizard?country=${c.key}`}
                    onClick={() => { window.scrollTo(0, 0); trackEligibilityClick('country_comparison_country'); }}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
                  >
                    {comparison?.learnMore || "Start here"}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards (hidden on md+) */}
          <div className="md:hidden space-y-4 mb-10">
            {countries.map((c) => (
              <Link
                key={c.key}
                to={`/homologation-wizard?country=${c.key}`}
                onClick={() => { window.scrollTo(0, 0); trackEligibilityClick('country_comparison_country'); }}
                className="block"
              >
                <div className={`rounded-xl border ${c.borderColor} bg-card p-5 hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{c.flag}</span>
                    <div>
                      <h3 className="font-bold text-foreground">{c.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.tagBg}`}>
                        {c.highlight}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-[11px] text-muted-foreground">{comparison?.estimatedTime || "Timeline"}</p>
                      <p className="text-sm font-semibold text-foreground">{c.duration}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">{comparison?.salaryRange || "Salary"}</p>
                      <p className="text-sm font-semibold text-foreground">{c.salary}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">{comparison?.startingFrom || "From"}</p>
                      <p className="text-lg font-bold text-primary">€{c.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Button asChild size="lg" className="group h-12 px-8 text-base shadow-lg shadow-primary/20">
              <Link to="/homologation-wizard" onClick={() => { window.scrollTo(0, 0); trackEligibilityClick('country_comparison'); }} className="flex items-center gap-2">
                {comparison?.cta || "Check my eligibility"}
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
