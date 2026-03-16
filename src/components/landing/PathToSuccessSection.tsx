import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Mail, Plane, ArrowRight, Clock, TrendingUp, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const PathToSuccessSection = () => {
  const { t } = useLanguage();

  const steps = [
    { titleKey: 'step1.title', descriptionKey: 'step1.description', Icon: MapPin },
    { titleKey: 'step2.title', descriptionKey: 'step2.description', Icon: GraduationCap },
    { titleKey: 'step3.title', descriptionKey: 'step3.description', Icon: Mail },
    { titleKey: 'step4.title', descriptionKey: 'step4.description', Icon: Plane },
  ] as const;

  const comparison = t?.landing?.countryComparison;

  const countries = [
    { key: 'germany', name: comparison?.countries?.germany?.name || 'Germany', flag: '🇩🇪', duration: comparison?.countries?.germany?.processDuration || '6–12 months', highlight: comparison?.countries?.germany?.highlight || 'Best salaries', price: 789, salary: '€5,500 – €12,000', tagBg: 'bg-primary/10 text-primary' },
    { key: 'spain', name: comparison?.countries?.spain?.name || 'Spain', flag: '🇪🇸', duration: comparison?.countries?.spain?.processDuration || '2–6 months', highlight: comparison?.countries?.spain?.highlight || 'Fast homologation', price: 250, salary: '€3,000 – €8,000', tagBg: 'bg-accent/10 text-accent' },
    { key: 'austria', name: comparison?.countries?.austria?.name || 'Austria', flag: '🇦🇹', duration: comparison?.countries?.austria?.processDuration || '4–8 months', highlight: comparison?.countries?.austria?.highlight || 'Simplest process', price: 789, salary: '€5,000 – €13,000', tagBg: 'bg-secondary/10 text-secondary-foreground' },
  ];

  return (
    <section id="path-to-success" className="pt-16 pb-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t?.pathToSuccess?.title || 'How It Works'}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t?.pathToSuccess?.subtitle || 'From first consultation to your first day at work — we handle everything.'}
          </p>
        </header>

        {/* Horizontal steps */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {steps.map(({ titleKey, descriptionKey, Icon }, idx) => {
            const title = t?.pathToSuccess?.steps?.[titleKey] || titleKey;
            const description = t?.pathToSuccess?.steps?.[descriptionKey] || descriptionKey;
            const isLast = idx === steps.length - 1;

            return (
              <div key={titleKey} className="relative flex flex-col items-center text-center">
                {!isLast && (
                  <div
                    className="hidden md:block absolute top-5 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px bg-border"
                    aria-hidden
                  />
                )}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-card text-primary shadow-sm mb-3">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="text-xs font-medium text-primary mb-1">
                  {t?.pathToSuccess?.stepLabel || 'Step'} {idx + 1}
                </div>
                <h3 className="text-base font-semibold leading-snug mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>

        {/* Divider + Country sub-heading */}
        <div className="max-w-5xl mx-auto mt-14 mb-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            {comparison?.title || 'Compare Your Options'}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {comparison?.subtitle || 'Compare timelines, salaries, and pricing across Europe\'s top destinations'}
          </p>
        </div>

        {/* Desktop Comparison Table */}
        <div className="max-w-5xl mx-auto hidden md:block mb-12">
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-4 border-b border-border/40">
              <div className="p-5" />
              {countries.map((c) => (
                <div key={c.key} className="p-5 text-center border-l border-border/40">
                  <span className="text-3xl mb-1 block">{c.flag}</span>
                  <h4 className="text-lg font-bold text-foreground">{c.name}</h4>
                  <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.tagBg}`}>
                    {c.highlight}
                  </span>
                </div>
              ))}
            </div>

            {/* Timeline row */}
            <div className="grid grid-cols-4 border-b border-border/30 hover:bg-muted/30 transition-colors">
              <div className="p-4 flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                {comparison?.estimatedTime || 'Timeline'}
              </div>
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30 font-semibold text-foreground">
                  {c.duration}
                </div>
              ))}
            </div>

            {/* Salary row */}
            <div className="grid grid-cols-4 border-b border-border/30 hover:bg-muted/30 transition-colors">
              <div className="p-4 flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4 shrink-0" />
                {comparison?.expectedSalary || 'Monthly salary'}
              </div>
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30 font-semibold text-foreground text-sm">
                  {c.salary}
                </div>
              ))}
            </div>

            {/* Price row */}
            <div className="grid grid-cols-4 border-b border-border/30 hover:bg-muted/30 transition-colors">
              <div className="p-4 flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                <Euro className="h-4 w-4 shrink-0" />
                {comparison?.startingFrom || 'Starting from'}
              </div>
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30">
                  <span className="text-2xl font-bold text-primary">€{c.price}</span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="grid grid-cols-4">
              <div className="p-4" />
              {countries.map((c) => (
                <div key={c.key} className="p-4 text-center border-l border-border/30">
                  <Link
                    to={`/homologation-wizard?country=${c.key}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
                  >
                    {comparison?.learnMore || 'Start here'}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 mb-12">
          {countries.map((c) => (
            <Link
              key={c.key}
              to={`/homologation-wizard?country=${c.key}`}
              onClick={() => window.scrollTo(0, 0)}
              className="block"
            >
              <div className="rounded-xl border border-border/60 bg-card p-5 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{c.flag}</span>
                  <div>
                    <h4 className="font-bold text-foreground">{c.name}</h4>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.tagBg}`}>
                      {c.highlight}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[11px] text-muted-foreground">{comparison?.estimatedTime || 'Timeline'}</p>
                    <p className="text-sm font-semibold text-foreground">{c.duration}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{comparison?.expectedSalary || 'Salary'}</p>
                    <p className="text-sm font-semibold text-foreground">{c.salary}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{comparison?.startingFrom || 'From'}</p>
                    <p className="text-lg font-bold text-primary">€{c.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Single CTA */}
        <div className="flex flex-col items-center gap-3">
          <Button asChild size="lg" className="group h-12 px-8 text-base shadow-lg shadow-primary/20">
            <Link to="/homologation-wizard" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2">
              {comparison?.cta || t?.hero?.cta || 'Check my eligibility'}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            {comparison?.ctaSubtext || 'Free assessment • No commitment required'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PathToSuccessSection;
