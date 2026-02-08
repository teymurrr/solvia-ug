import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle, ArrowRight, Clock, FileText, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const HomologationPlanPanel = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: FileText,
      title: t?.homologationResult?.timeline?.title || 'Document Analysis',
      description: t?.homologationResult?.timeline?.bestCase || 'Review your credentials',
    },
    {
      icon: GraduationCap,
      title: t?.homologationResult?.language?.title || 'Language Plan',
      description: t?.homologationResult?.language?.requiredLevel || 'Path to reach B2',
    },
    {
      icon: FileCheck,
      title: t?.homologationResult?.cta?.benefit1 || 'Homologation Steps',
      description: t?.homologationResult?.cta?.benefit3 || 'Guided through every step',
    },
  ];

  return (
    <Card className="p-5 border-primary/20 bg-gradient-to-b from-primary/5 to-background sticky top-24">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <FileCheck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg">{t?.homologationResult?.yourPlan || 'Your personalized homologation plan'}</h3>
          <p className="text-sm text-muted-foreground">
            {t?.homologationResult?.emailSent || 'We prepare everything so you can apply to these offers'}
          </p>
        </div>

        {/* Steps preview */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Time estimate */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2 border-y border-border/50">
          <Clock className="h-4 w-4" />
          <span>{t?.homologationResult?.timeline?.average || 'Estimated time: 6-9 months'}</span>
        </div>

        {/* CTA */}
        <Button asChild className="w-full group" size="lg">
          <Link to="/homologation-wizard" onClick={() => window.scrollTo(0, 0)}>
            {t?.homologationResult?.cta?.startProcess || 'Get my full plan'}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>{t?.homologationResult?.cta?.benefit3 || '+500 medical professionals homologated'}</span>
        </div>
      </div>
    </Card>
  );
};

export default HomologationPlanPanel;
