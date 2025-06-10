
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How long does the recognition process take?",
      answer: "The recognition process typically takes 3-6 months, depending on your documents and the state you're applying to. We help you prepare all required documents and guide you through each step to minimize delays."
    },
    {
      question: "Do I need to speak German before applying?",
      answer: "You need at least B2 level German for most medical positions, plus medical German certification (FSP exam). Our platform connects you with specialized German language courses designed for healthcare professionals."
    },
    {
      question: "What documents do I need for degree recognition?",
      answer: "You'll need your medical degree, transcripts, certificate of good standing, work experience certificates, and language certificates. All documents must be translated and apostilled. We provide a complete checklist and help you organize everything."
    },
    {
      question: "Can Solvia help me find a job before moving to Germany?",
      answer: "Yes! We work with verified hospitals and clinics that are actively recruiting international doctors. Many of our users receive job offers before arriving in Germany, which helps with visa applications."
    },
    {
      question: "What is the FSP exam and when do I need to take it?",
      answer: "The FSP (Fachsprachprüfung) is a medical German language exam required for medical license recognition. You typically take it after completing B2 German and before starting work. We offer specialized FSP preparation courses."
    },
    {
      question: "Is Solvia free to use?",
      answer: "Solvia offers both free and premium features. You can access basic information, checklists, and some resources for free. Premium features include personalized guidance, document review, and direct employer connections."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Get answers to the most common questions about working as a doctor in Germany
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
