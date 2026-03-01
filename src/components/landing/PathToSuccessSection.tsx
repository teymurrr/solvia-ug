import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Mail, Plane, ArrowRight, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    { key: 'germany', name: 'Germany', flag: '🇩🇪', duration: '6–12 months', highlight: 'Best salaries', accent: 'border-l-emerald-500' },
    { key: 'austria', name: 'Austria', flag: '🇦🇹', duration: '4–8 months', highlight: 'Simplest process', accent: 'border-l-blue-500' },
    { key: 'spain', name: 'Spain', flag: '🇪🇸', duration: '2–6 months', highlight: 'Fast homologation', accent: 'border-l-amber-500' },
    { key: 'france', name: 'France', flag: '🇫🇷', duration: '4–10 months', highlight: 'Great quality of life', accent: 'border-l-violet-500' },
    { key: 'italy', name: 'Italy', flag: '🇮🇹', duration: '3–8 months', highlight: 'Growing demand', accent: 'border-l-red-500' },
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
            {comparison?.title || 'Choose Your Destination'}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {comparison?.subtitle || 'Find the best country for your medical career'}
          </p>
        </div>

        {/* Featured Countries: Germany & Spain */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {countries.filter(c => c.key === 'germany' || c.key === 'spain').map((c) => {
            const translated = comparison?.countries?.[c.key];
            const name = translated?.name || c.name;
            const highlight = translated?.highlight || c.highlight;
            const duration = translated?.processDuration || c.duration;

            return (
              <Link
                key={c.key}
                to="/homologation-wizard"
                onClick={() => window.scrollTo(0, 0)}
                className={`block p-6 border-l-4 ${c.accent} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-card ring-1 ring-primary/10 rounded-xl cursor-pointer`}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-6xl block mb-2">{c.flag}</span>
                    <h4 className="font-bold text-xl text-foreground">{name}</h4>
                    <span className="text-sm font-medium text-primary">{highlight}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-muted/40 rounded-lg px-4 py-3">
                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground">{comparison?.startingFrom || 'From'}</p>
                      <p className="text-xl font-bold text-primary">€39</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comparison?.estimatedTime || 'Timeline'}
                      </p>
                      <p className="text-base font-semibold text-foreground">{duration}</p>
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium text-primary flex items-center justify-center gap-1">
                    {comparison?.learnMore || 'Learn more'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Other Countries: Austria, France, Italy */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {countries.filter(c => c.key !== 'germany' && c.key !== 'spain').map((c) => {
            const translated = comparison?.countries?.[c.key];
            const name = translated?.name || c.name;
            const highlight = translated?.highlight || c.highlight;
            const duration = translated?.processDuration || c.duration;

            return (
              <Link
                key={c.key}
                to="/homologation-wizard"
                onClick={() => window.scrollTo(0, 0)}
                className={`block p-4 border-l-4 ${c.accent} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card rounded-xl cursor-pointer`}
              >
                <div className="space-y-2">
                  <div className="text-center">
                    <span className="text-3xl block mb-1">{c.flag}</span>
                    <h4 className="font-bold text-base text-foreground">{name}</h4>
                    <span className="text-xs font-medium text-primary">{highlight}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-muted/40 rounded-lg px-3 py-2">
                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground">{comparison?.startingFrom || 'From'}</p>
                      <p className="text-lg font-bold text-primary">€39</p>
                    </div>
                    <div className="w-px h-6 bg-border" />
                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comparison?.estimatedTime || 'Timeline'}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{duration}</p>
                    </div>
                  </div>
                  <p className="text-center text-xs font-medium text-primary flex items-center justify-center gap-1">
                    {comparison?.learnMore || 'Learn more'}
                    <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Single CTA */}
        <div className="flex flex-col items-center gap-3">
          <Button asChild size="lg" className="group">
            <Link to="/homologation-wizard" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2">
              {t?.hero?.cta || 'Start my homologation'}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PathToSuccessSection;
