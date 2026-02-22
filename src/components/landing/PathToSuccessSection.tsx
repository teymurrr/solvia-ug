import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Mail, Plane, ArrowRight } from 'lucide-react';
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

  return (
    <section id="path-to-success" className="py-16 bg-background">
      <div className="container mx-auto px-4">
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
                {/* Connecting line (desktop only, not on last) */}
                {!isLast && (
                  <div
                    className="hidden md:block absolute top-5 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px bg-border"
                    aria-hidden
                  />
                )}

                {/* Icon circle */}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-card text-primary shadow-sm mb-3">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>

                {/* Step label */}
                <div className="text-xs font-medium text-primary mb-1">
                  {t?.pathToSuccess?.stepLabel || 'Step'} {idx + 1}
                </div>

                <h3 className="text-base font-semibold leading-snug mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="hover-scale">
            <Link to="/homologation-wizard" aria-label={t?.pathToSuccess?.ctaLabel || 'Start My Free Assessment with Solvia'}>
              {t?.pathToSuccess?.cta || 'Start My Free Assessment'}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PathToSuccessSection;
