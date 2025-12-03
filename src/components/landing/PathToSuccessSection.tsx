import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, GraduationCap, Briefcase, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';

// Non-interactive, scroll-linked vertical timeline
// - Mobile: single column with left rail
// - Desktop: alternating cards with center timeline
// - Progress fill animates along the vertical rail between step icons
// - Uses design system tokens only

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

const PathToSuccessSection = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      titleKey: 'step1.title',
      descriptionKey: 'step1.description',
      Icon: Globe,
    },
    {
      titleKey: 'step2.title',
      descriptionKey: 'step2.description',
      Icon: GraduationCap,
    },
    {
      titleKey: 'step3.title',
      descriptionKey: 'step3.description',
      Icon: Briefcase,
    },
    {
      titleKey: 'step4.title',
      descriptionKey: 'step4.description',
      Icon: Plane,
    },
  ] as const;
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    let top = 0;
    let height = 1;

    const recalc = () => {
      const rect = el.getBoundingClientRect();
      top = window.scrollY + rect.top;
      height = el.offsetHeight || 1;
    };

    const compute = () => {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.25; // measure at 25% from top of viewport
      const raw = (viewportAnchor - top) / height;
      setProgress(clamp(raw));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };

    const onResize = () => {
      recalc();
      compute();
    };

    recalc();
    compute();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <section id="path-to-success" ref={sectionRef} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t?.pathToSuccess?.title || "How it works"}</h2>
          <p className="mt-3 text-muted-foreground">
            {t?.pathToSuccess?.subtitle || "We support you at every stage — from recognition to relocation."}
          </p>
        </header>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Background rail */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-1/2 z-0"
            aria-hidden
          />
          {/* Progress fill along rail */}
          <div
            className="absolute left-4 top-0 w-px bg-primary md:left-1/2 md:-translate-x-1/2 z-0 transition-[height] duration-150"
            style={{ height: `${pct}%` }}
            aria-hidden
          />

          <ol className="space-y-10 md:space-y-14">
            {steps.map(({ titleKey, descriptionKey, Icon }, idx) => {
              const isRight = idx % 2 === 1;
              const title = t?.pathToSuccess?.steps?.[titleKey] || titleKey;
              const description = t?.pathToSuccess?.steps?.[descriptionKey] || descriptionKey;
              
              return (
                <li key={titleKey} className="relative">
                  {/* Marker */}
                  <div
                    className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-1.5 z-10"
                    aria-hidden
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-card text-primary shadow-sm">
                      <span className="sr-only">Step {idx + 1}</span>
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                  </div>

                  <div className="md:grid md:grid-cols-2 md:gap-12 items-start">
                    <div className={[ 'pl-12 md:pl-0', isRight ? 'md:col-start-2' : '' ].join(' ')}>
                      <Card className="animate-fade-in">
                        <CardContent className="pt-6">
                          <div className="text-sm font-medium text-primary">
                            {t?.pathToSuccess?.stepLabel || "Step"} {idx + 1}
                          </div>
                          <h3 className="mt-1 text-xl font-semibold leading-snug">{title}</h3>
                          <p className="mt-2 text-muted-foreground">{description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" className="hover-scale">
            <Link to="/signup" aria-label={t?.pathToSuccess?.ctaLabel || "Start My Journey with Solvia"}>
              {t?.pathToSuccess?.cta || "Start My Journey"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PathToSuccessSection;
