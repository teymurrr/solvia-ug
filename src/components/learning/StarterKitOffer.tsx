import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight, FileText, Headphones, ClipboardList, Map, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const StarterKitOffer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const sk = t?.learning?.starterKit;

  const items = [
    { icon: BookOpen, text: sk?.item1 || '50 Essential Medical German Phrases (PDF)' },
    { icon: FileText, text: sk?.item2 || 'FSP Exam Structure & Timeline Guide (PDF)' },
    { icon: Map, text: sk?.item3 || 'Personal Roadmap: A1 to Approbation (PDF)' },
    { icon: Headphones, text: sk?.item4 || '10 Medical Term Pronunciation Audio Files' },
    { icon: ClipboardList, text: sk?.item5 || 'Document Checklist for Approbation' },
    { icon: Star, text: sk?.item6 || 'Bonus: Free 15-min Consultation Call' },
  ];

  return (
    <Card className="mt-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-lg overflow-hidden">
      <div className="bg-primary/10 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          {sk?.badge || '🔥 Most Popular for Germany'}
        </span>
        <span className="text-xs text-muted-foreground">
          {sk?.limitedPrice || 'Limited introductory price'}
        </span>
      </div>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {sk?.title || 'Medical German Starter Kit'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {sk?.description || 'Everything you need to start your medical career in Germany — delivered instantly to your inbox.'}
            </p>
            <ul className="space-y-2 mb-6">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              {sk?.socialProof || 'Join 500+ medical professionals who started their journey here'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 min-w-[200px]">
            <div className="text-center">
              <span className="text-4xl font-bold text-foreground">€29</span>
              <p className="text-xs text-muted-foreground mt-1">{sk?.oneTime || 'One-time payment'}</p>
            </div>
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={() => navigate('/learning/starter-kit')}
            >
              {sk?.cta || 'Get Starter Kit'}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {sk?.guarantee || '30-day money-back guarantee'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StarterKitOffer;
