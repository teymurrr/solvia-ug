import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle, ArrowRight, Clock, FileText, GraduationCap } from 'lucide-react';

const HomologationPlanPanel = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Análisis de documentos',
      description: 'Revisamos tu título y certificados',
    },
    {
      icon: GraduationCap,
      title: 'Plan de idioma',
      description: 'Ruta para alcanzar B2 alemán',
    },
    {
      icon: FileCheck,
      title: 'Trámites de homologación',
      description: 'Te guiamos paso a paso',
    },
  ];

  return (
    <Card className="p-5 border-primary/20 bg-gradient-to-b from-primary/5 to-background sticky top-24">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <FileCheck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg">Tu plan de homologación personalizado</h3>
          <p className="text-sm text-muted-foreground">
            Preparamos todo para que puedas aplicar a estas ofertas
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
          <span>Tiempo estimado: 6-9 meses</span>
        </div>

        {/* CTA */}
        <Button asChild className="w-full group" size="lg">
          <Link to="/homologation-wizard" onClick={() => window.scrollTo(0, 0)}>
            Recibir mi plan completo
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>+500 profesionales homologados</span>
        </div>
      </div>
    </Card>
  );
};

export default HomologationPlanPanel;
