
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
      question: "¿Quién puede aplicar a través de Solvia?",
      answer: "Solvia es para médicos que han completado su carrera de medicina fuera de Alemania o Austria y quieren ejercer ahí. Trabajamos tanto con ciudadanos de la UE como de fuera de la UE y te guiamos en cada paso—desde el reconocimiento hasta la mudanza."
    },
    {
      question: "¿Necesito hablar alemán antes de empezar con Solvia?",
      answer: "No. No necesitas hablar alemán cuando empiezas. Solvia te ayuda desde cero hasta la certificación. Te conectamos con cursos de idioma de alta calidad y te apoyamos en la preparación para el examen de alemán médico (FSP)."
    },
    {
      question: "¿Qué es el proceso de Approbation?",
      answer: "La Approbation es la licencia médica oficial que te permite trabajar como médico en Alemania o Austria. Solvia te ayuda a entender qué documentos necesitas, presentar tu solicitud correctamente y prepararte para cualquier examen requerido."
    },
    {
      question: "¿Puedo conseguir trabajo antes de mudarme a Alemania o Austria?",
      answer: "Sí. Muchos de nuestros médicos reciben ofertas de trabajo antes de llegar. Solvia te conecta con hospitales de confianza que están abiertos a candidatos internacionales y ayuda a coordinar entrevistas y contratos de forma remota."
    },
    {
      question: "¿Cuánto tiempo toma el proceso?",
      answer: "Depende de tu nivel actual de alemán, preparación de documentos y la región donde apliques. En promedio, toma entre 9 a 18 meses desde el registro hasta empezar tu trabajo—pero Solvia ayuda a reducir los retrasos."
    },
    {
      question: "¿Es Solvia gratuito?",
      answer: "Crear una cuenta y acceder a recursos básicos es gratis. También ofrecemos paquetes de apoyo pagos opcionales que incluyen traducción de documentos, coaching 1 a 1 y colocación laboral rápida."
    },
    {
      question: "¿Puedo mudarme con mi familia?",
      answer: "Absolutamente. Solvia apoya a médicos que se mudan con cónyuges e hijos, incluyendo ayuda con procesos de visa, vivienda, inscripción escolar y reunificación familiar."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Obtén respuestas a las preguntas más comunes sobre trabajar como médico en Alemania
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
