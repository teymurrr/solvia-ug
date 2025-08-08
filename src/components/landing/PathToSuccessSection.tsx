import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, FileText, BookOpen, Stethoscope, Building2, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Non-interactive, scroll-friendly vertical timeline
// - Mobile: single column with left rail
// - Desktop: alternating cards with center timeline
// - Uses design tokens only (no hard-coded colors)

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
  return (
    <section id="path-to-success" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Path to Success with Solvia</h2>
          <p className="mt-3 text-muted-foreground">
            We support you at every stage — from recognition to relocation.
          </p>
        </header>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Rail */}
          <div
            className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          <ol className="space-y-10 md:space-y-14">
            {steps.map(({ title, description, Icon }, idx) => {
              const isRight = idx % 2 === 1;
              return (
                <li key={title} className="relative">
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
                    <div
                      className={
                        [
                          'pl-12 md:pl-0',
                          isRight ? 'md:col-start-2' : '',
                        ].join(' ')
                      }
                    >
                      <Card className="animate-fade-in">
                        <CardContent className="pt-6">
                          <div className="text-sm font-medium text-primary">Step {idx + 1}</div>
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
            <Link to="/signup" aria-label="Start My Journey with Solvia">Start My Journey</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PathToSuccessSection;
