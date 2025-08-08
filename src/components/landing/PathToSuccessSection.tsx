import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, FileText, BookOpen, Stethoscope, Building2, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  StepperDescription,
} from '@/components/ui/stepper';

// Enhanced "Your Path to Success with Solvia" section
// - Desktop: horizontal stepper with animated progress bar and details panel
// - Mobile: vertical stepper timeline with clear progression
// - Uses design system tokens (no hard-coded colors)

const steps = [
  {
    title: 'Personal Plan',
    description:
      'We assess your background and create a customized roadmap for your journey to Germany or Austria.',
    Icon: UserCheck,
  },
  {
    title: 'Document & License Guidance',
    description:
      'Understand which documents are needed, how to get them legalized, and how to begin the Approbation (or Anerkennung) process.',
    Icon: FileText,
  },
  {
    title: 'Language Preparation',
    description:
      'Join our A1–C1 German courses with medical content included from the start. Prepare for TELC and FSP exams.',
    Icon: BookOpen,
  },
  {
    title: 'FSP Exam Support',
    description:
      'For doctors and dentists: Practice real clinical cases, take mock exams, and receive personal coaching from certified trainers.',
    Icon: Stethoscope,
  },
  {
    title: 'Job Matching',
    description:
      'We connect you with verified hospitals and clinics that value international professionals and guide you through the interview process.',
    Icon: Building2,
  },
  {
    title: 'Relocation & Integration',
    description:
      'From visa support to housing, registration, and family reunification—we help you settle in with confidence.',
    Icon: Plane,
  },
] as const;

const PathToSuccessSection = () => {
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const total = steps.length;
  const progress = total > 1 ? ((activeStep - 1) / (total - 1)) * 100 : 0;
  const current = steps[activeStep - 1];

  return (
    <section id="path-to-success" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Path to Success with Solvia</h2>
          <p className="mt-3 text-muted-foreground">
            We support you at every stage — from recognition to relocation.
          </p>
        </header>

        {/* Mobile: vertical stepper timeline */}
        <div className="md:hidden relative">
          <Stepper value={activeStep} onValueChange={setActiveStep} orientation="vertical">
            {steps.map(({ title, description, Icon }, idx) => (
              <StepperItem
                key={title}
                step={idx + 1}
                className="relative items-start [&:not(:last-child)]:flex-1"
              >
                <StepperTrigger className="items-start pb-8 last:pb-0">
                  <StepperIndicator />
                  <div className="mt-0.5 px-2 text-left">
                    <StepperTitle className="text-base font-semibold leading-snug">{title}</StepperTitle>
                    <StepperDescription className="text-muted-foreground mt-1">
                      {description}
                    </StepperDescription>
                  </div>
                </StepperTrigger>
                {idx + 1 < steps.length && (
                  <StepperSeparator className="absolute inset-y-0 left-3 top-[calc(1.5rem+0.125rem)] -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        {/* Desktop: horizontal stepper with animated progress bar */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Background track */}
            <div className="absolute top-7 left-0 right-0 h-1 bg-border/60 rounded" aria-hidden />
            {/* Progress fill */}
            <div
              className="absolute top-7 left-0 h-1 bg-primary rounded transition-all duration-300"
              style={{ width: `${progress}%` }}
              aria-hidden
            />

            <Stepper value={activeStep} onValueChange={setActiveStep} orientation="horizontal">
              <ol className="grid grid-cols-3 lg:grid-cols-6 gap-6">
                {steps.map(({ title, Icon }, idx) => (
                  <StepperItem key={title} step={idx + 1} className="relative">
                    <StepperTrigger className="flex flex-col items-center gap-2 px-2 py-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-card text-primary shadow-sm">
                        <span className="sr-only">Step {idx + 1}</span>
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="text-xs font-medium text-primary">Step {idx + 1}</div>
                      <StepperTitle className="text-sm font-semibold text-center leading-snug">
                        {title}
                      </StepperTitle>
                    </StepperTrigger>
                    {idx + 1 < steps.length && (
                      <StepperSeparator className="absolute top-7 left-1/2 right-[-50%] h-px" />
                    )}
                  </StepperItem>
                ))}
              </ol>
            </Stepper>
          </div>

          {/* Active step details */}
          <article
            className="mt-8 mx-auto max-w-3xl rounded-lg border bg-card p-6 shadow-sm animate-fade-in"
            aria-live="polite"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background text-primary">
                <current.Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <div className="text-sm font-medium text-primary">Step {activeStep} of {total}</div>
                <h3 className="mt-1 text-xl font-semibold leading-snug">{current.title}</h3>
                <p className="mt-2 text-muted-foreground">{current.description}</p>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" className="hover-scale">
            <Link to="/signup" aria-label="Start My Journey with Solvia">Start My Journey</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PathToSuccessSection;
