import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, FileText, BookOpen, Stethoscope, Building2, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

// "Your Path to Success with Solvia" section
// - Clean, modern timeline/steps layout
// - Vertical timeline on mobile, horizontal steps on larger screens
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
];

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

        {/* Mobile: vertical timeline */}
        <div className="md:hidden relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" aria-hidden />
          <ol className="space-y-8">
            {steps.map(({ title, description, Icon }, idx) => (
              <li key={title} className="relative pl-16">
                <div className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 rounded-full border bg-card text-primary">
                  <span className="sr-only">Step {idx + 1}</span>
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="mb-1 text-sm font-medium text-primary">Step {idx + 1}</div>
                <h3 className="text-xl font-semibold leading-snug">{title}</h3>
                <p className="mt-2 text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop: horizontal steps with connecting line */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute top-7 left-0 right-0 h-px bg-border" aria-hidden />
            <ol className="grid grid-cols-3 lg:grid-cols-6 gap-6">
              {steps.map(({ title, description, Icon }, idx) => (
                <li key={title} className="relative bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-primary">
                      <span className="sr-only">Step {idx + 1}</span>
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="text-sm font-medium text-primary">Step {idx + 1}</div>
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-snug">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </li>
              ))}
            </ol>
          </div>
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
