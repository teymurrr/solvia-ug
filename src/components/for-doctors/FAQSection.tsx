
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
      question: "Who can apply through Solvia?",
      answer: "Solvia is for doctors who have completed their medical degree outside of Germany or Austria and want to practice there. We work with both EU and non-EU citizens and guide you through every step—from recognition to relocation."
    },
    {
      question: "Do I need to speak German before starting with Solvia?",
      answer: "No. You don't need to speak German when you begin. Solvia helps you from zero to certification. We connect you with high-quality language courses and support you in preparing for the medical German exam (FSP)."
    },
    {
      question: "What is the Approbation process?",
      answer: "Approbation is the official medical license that allows you to work as a doctor in Germany or Austria. Solvia helps you understand which documents you need, submit your application correctly, and prepare for any required exams."
    },
    {
      question: "Can I get a job before moving to Germany or Austria?",
      answer: "Yes. Many of our doctors receive job offers before arriving. Solvia connects you with trusted hospitals that are open to international candidates and help arrange interviews and contracts remotely."
    },
    {
      question: "How long does the process take?",
      answer: "It depends on your current level of German, document readiness, and the region where you apply. On average, it takes between 9 to 18 months from registration to starting your job—but Solvia helps reduce delays."
    },
    {
      question: "Is Solvia free to use?",
      answer: "Creating an account and accessing basic resources is free. We also offer optional paid support packages that include document translation, 1-on-1 coaching, and fast-track job placement."
    },
    {
      question: "Can I move with my family?",
      answer: "Absolutely. Solvia supports doctors who relocate with spouses and children, including help with visa processes, housing, school registration, and family reunification."
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
