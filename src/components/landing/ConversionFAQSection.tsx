import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const ConversionFAQSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const faq = landing?.conversionFaq;
  
  const defaultItems = [
    {
      question: "How long does the homologation process take?",
      answer: "The timeline varies by country: Germany takes 3-12 months, Austria 2-8 months, and Spain 1-6 months. Factors include your documentation completeness and language certification."
    },
    {
      question: "Can I work while my homologation is being processed?",
      answer: "In some countries like Germany, you can work under a temporary license (Berufserlaubnis) while waiting for full recognition. We help you understand your options."
    },
    {
      question: "How much does the homologation process cost?",
      answer: "Costs vary by country and include document translations, apostilles, and official fees. Solvia provides a detailed cost breakdown in your personalized plan."
    },
    {
      question: "What documents do I need?",
      answer: "Generally you need your medical diploma, transcript, work experience certificates, and identity documents. We review your specific situation and tell you exactly what's needed."
    },
    {
      question: "What if I reject a job offer?",
      answer: "You're never obligated to accept any offer. Solvia connects you with multiple opportunities so you can choose what's best for you and your family."
    },
    {
      question: "Do I need to speak German before starting the homologation?",
      answer: "No. You can start your homologation while learning German. However, you'll need B2 level for the medical language exam (FSP) before practicing."
    }
  ];

  const items = faq?.items || defaultItems;
  const countryLinks = [
    { name: 'Germany', id: 'germany' },
    { name: 'Austria', id: 'austria' },
    { name: 'Spain', id: 'spain' }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {faq?.title || "Frequently Asked Questions"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {faq?.subtitle || "Get answers to your most important questions"}
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-3">
            {items.map((item: any, index: number) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-4 data-[state=open]:bg-muted/30"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-medium text-foreground">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-muted-foreground mb-4">{item.answer}</p>
                  {/* Micro-CTA */}
                  <div className="flex flex-wrap gap-2">
                    {countryLinks.map((country) => (
                      <Link
                        key={country.id}
                        to={`/homologation-wizard?country=${country.id}`}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium group"
                      >
                        {faq?.viewPlanFor || "View my plan for"} {country.name}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default ConversionFAQSection;
