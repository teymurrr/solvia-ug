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
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const HomologationIncludedSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const homologation = landing?.homologationIncluded;
  
  const defaultFeatures = [
    "Complete document review",
    "Official file generation",
    "Oriented translations and apostilles",
    "Priority WhatsApp support",
    "Step-by-step guidance",
    "Proper submission to authorities",
    "Status tracking",
    "Access to verified job offers"
  ];

  const features = homologation?.features || defaultFeatures;
  
  const icons = [
    FileCheck,
    FolderOpen,
    Languages,
    MessageCircle,
    Footprints,
    Send,
    Activity,
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
              {homologation?.title || "What's Included in Your Homologation with Solvia"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {homologation?.subtitle || "Everything you need to get your medical credentials recognized in Europe"}
            </p>
          </div>

          {/* Features Grid */}
          <Card className="p-8 md:p-10 border-border/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature: string, index: number) => {
                const Icon = icons[index] || CheckCircle2;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{feature}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* CTA inside card */}
            <div className="mt-10 pt-8 border-t border-border/50 text-center">
              <Button asChild size="lg" className="group">
                <Link to="/homologation" className="flex items-center gap-2">
                  {homologation?.cta || "Get my free homologation plan"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomologationIncludedSection;
