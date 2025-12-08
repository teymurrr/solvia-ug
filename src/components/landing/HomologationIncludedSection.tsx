import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  FileCheck, 
  FolderOpen, 
  Languages, 
  MessageCircle, 
  Footprints, 
  Send, 
  Activity, 
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const HomologationIncludedSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const homologation = landing?.homologationIncluded;
  
  // Reduced to 4 high-impact features focused on conversion
  const defaultFeatures = [
    { text: "Document review", subtext: "avoiding months of delays" },
    { text: "Official file ready to submit", subtext: "" },
    { text: "Translations & apostilles", subtext: "" },
    { text: "Job offers included", subtext: "" }
  ];

  const features = homologation?.features || defaultFeatures.map(f => f.text);
  const featureSubtexts = homologation?.featureSubtexts || defaultFeatures.map(f => f.subtext);
  
  const icons = [
    FileCheck,
    FolderOpen,
    Languages,
    Briefcase
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">All-Inclusive</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {homologation?.title || "Everything you need to homologate your degree without errors, delays, or stress"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              {homologation?.subtitle || "Complete support to work as a doctor in Europe"}
            </p>
            {/* Digital + AI advantage */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {homologation?.digitalAdvantage || "100% digital platform with intelligent guidance, file automation, and expert human support."}
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <Card className="p-8 md:p-10 border-border/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature: string, index: number) => {
                const Icon = icons[index] || CheckCircle2;
                const subtext = featureSubtexts?.[index] || '';
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {feature}
                        {subtext && (
                          <span className="font-normal text-muted-foreground"> — {subtext}</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro-badge differentiator */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span>
                  {homologation?.microBadge || "Solvia combines technology + experts so your process moves faster and without complications."}
                </span>
              </div>
            </div>
            
            {/* CTA inside card */}
            <div className="mt-8 text-center">
              <Button asChild size="lg" className="group">
                <Link to="/homologation" className="flex items-center gap-2">
                  {homologation?.cta || "Get my free homologation plan"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              {/* Social proof */}
              <p className="mt-4 text-sm text-muted-foreground">
                {homologation?.socialProof || "We've already helped doctors from 12+ countries start their homologation."}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomologationIncludedSection;
