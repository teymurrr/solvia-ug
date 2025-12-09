import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface LearningFAQProps {
  onTakeTest?: () => void;
}

const LearningFAQ: React.FC<LearningFAQProps> = ({ onTakeTest }) => {
  const { t, language } = useLanguage();

  const faqs = [
    {
      question: {
        es: '¿Qué idioma debo aprender según el país donde quiero trabajar?',
        en: 'What language should I learn for my target country?',
        de: 'Welche Sprache sollte ich für mein Zielland lernen?',
        fr: 'Quelle langue dois-je apprendre pour mon pays cible ?',
        ru: 'Какой язык мне нужно учить для целевой страны?'
      },
      answer: {
        es: 'Alemania y Austria requieren alemán, Francia requiere francés, Italia requiere italiano, y España requiere español. Todos nuestros cursos están especializados en vocabulario médico.',
        en: 'Germany and Austria require German, France requires French, Italy requires Italian, and Spain requires Spanish. All our courses are specialized in medical vocabulary.',
        de: 'Deutschland und Österreich erfordern Deutsch, Frankreich erfordert Französisch, Italien erfordert Italienisch, und Spanien erfordert Spanisch. Alle unsere Kurse sind auf medizinisches Vokabular spezialisiert.',
        fr: "L'Allemagne et l'Autriche exigent l'allemand, la France exige le français, l'Italie exige l'italien, et l'Espagne exige l'espagnol. Tous nos cours sont spécialisés en vocabulaire médical.",
        ru: 'Германия и Австрия требуют немецкий, Франция требует французский, Италия требует итальянский, а Испания требует испанский. Все наши курсы специализированы на медицинской лексике.'
      }
    },
    {
      question: {
        es: '¿Cuánto tiempo necesito desde A1 para llegar a nivel profesional médico?',
        en: 'How long from A1 to medical professional level?',
        de: 'Wie lange von A1 bis zum medizinischen Fachniveau?',
        fr: "Combien de temps faut-il de A1 au niveau professionnel médical ?",
        ru: 'Сколько времени нужно от A1 до медицинского профессионального уровня?'
      },
      answer: {
        es: 'Típicamente 12-18 meses con estudio constante. Nuestros cursos intensivos pueden acelerar este proceso. El tiempo exacto depende de tu dedicación y nivel inicial.',
        en: 'Typically 12-18 months with consistent study. Our intensive courses can accelerate this process. The exact time depends on your dedication and starting level.',
        de: 'Typischerweise 12-18 Monate bei konstantem Lernen. Unsere Intensivkurse können diesen Prozess beschleunigen. Die genaue Zeit hängt von Ihrer Hingabe und Ihrem Ausgangsniveau ab.',
        fr: "Typiquement 12-18 mois avec une étude constante. Nos cours intensifs peuvent accélérer ce processus. Le temps exact dépend de votre dévouement et de votre niveau initial.",
        ru: 'Обычно 12-18 месяцев при постоянном обучении. Наши интенсивные курсы могут ускорить этот процесс. Точное время зависит от вашей преданности и начального уровня.'
      }
    },
    {
      question: {
        es: '¿Qué examen oficial requiere cada país?',
        en: 'What official exam does each country require?',
        de: 'Welche offizielle Prüfung verlangt jedes Land?',
        fr: 'Quel examen officiel chaque pays exige-t-il ?',
        ru: 'Какой официальный экзамен требует каждая страна?'
      },
      answer: {
        es: 'Alemania: FSP y TELC B2-C1 Medizin. Austria: Gleichwertigkeitsprüfung. Francia: TCF/TEF y pruebas profesionales. Italia: CILS y pruebas clínicas. España: DELE médico (no obligatorio pero recomendado).',
        en: 'Germany: FSP and TELC B2-C1 Medizin. Austria: Gleichwertigkeitsprüfung. France: TCF/TEF and professional tests. Italy: CILS and clinical tests. Spain: Medical DELE (not mandatory but recommended).',
        de: 'Deutschland: FSP und TELC B2-C1 Medizin. Österreich: Gleichwertigkeitsprüfung. Frankreich: TCF/TEF und Fachprüfungen. Italien: CILS und klinische Tests. Spanien: Medizinisches DELE (nicht obligatorisch, aber empfohlen).',
        fr: "Allemagne : FSP et TELC B2-C1 Medizin. Autriche : Gleichwertigkeitsprüfung. France : TCF/TEF et tests professionnels. Italie : CILS et tests cliniques. Espagne : DELE médical (non obligatoire mais recommandé).",
        ru: 'Германия: FSP и TELC B2-C1 Medizin. Австрия: Gleichwertigkeitsprüfung. Франция: TCF/TEF и профессиональные тесты. Италия: CILS и клинические тесты. Испания: Медицинский DELE (не обязательно, но рекомендуется).'
      }
    },
    {
      question: {
        es: '¿Puedo aprender mientras trabajo?',
        en: 'Can I learn while working?',
        de: 'Kann ich lernen während ich arbeite?',
        fr: 'Puis-je apprendre tout en travaillant ?',
        ru: 'Могу ли я учиться во время работы?'
      },
      answer: {
        es: 'Sí, nuestros cursos están diseñados para profesionales ocupados. Ofrecemos clases en vivo por la tarde/noche, módulos a tu ritmo, y acceso 24/7 a materiales grabados.',
        en: 'Yes, our courses are designed for busy professionals. We offer evening/night live classes, self-paced modules, and 24/7 access to recorded materials.',
        de: 'Ja, unsere Kurse sind für vielbeschäftigte Fachkräfte konzipiert. Wir bieten Abend-/Nachtkurse live, Module im eigenen Tempo und 24/7 Zugang zu aufgezeichneten Materialien.',
        fr: "Oui, nos cours sont conçus pour les professionnels occupés. Nous proposons des cours en direct le soir/nuit, des modules à votre rythme, et un accès 24h/24 aux supports enregistrés.",
        ru: 'Да, наши курсы разработаны для занятых профессионалов. Мы предлагаем вечерние/ночные живые занятия, модули в собственном темпе и круглосуточный доступ к записанным материалам.'
      }
    },
    {
      question: {
        es: '¿Necesito homologación antes de empezar el idioma?',
        en: 'Do I need homologation before starting the language?',
        de: 'Brauche ich eine Anerkennung bevor ich mit der Sprache beginne?',
        fr: "Ai-je besoin d'une homologation avant de commencer la langue ?",
        ru: 'Нужна ли мне гомологация перед началом изучения языка?'
      },
      answer: {
        es: 'No, puedes empezar a aprender el idioma mientras inicias tu proceso de homologación. De hecho, recomendamos empezar ambos en paralelo para optimizar tu tiempo.',
        en: "No, you can start learning the language while initiating your homologation process. In fact, we recommend starting both in parallel to optimize your time.",
        de: 'Nein, Sie können mit dem Sprachlernen beginnen, während Sie Ihren Anerkennungsprozess starten. Tatsächlich empfehlen wir, beides parallel zu beginnen, um Ihre Zeit zu optimieren.',
        fr: "Non, vous pouvez commencer à apprendre la langue tout en initiant votre processus d'homologation. En fait, nous recommandons de commencer les deux en parallèle pour optimiser votre temps.",
        ru: 'Нет, вы можете начать изучение языка одновременно с процессом гомологации. Фактически, мы рекомендуем начать оба параллельно, чтобы оптимизировать ваше время.'
      }
    },
    {
      question: {
        es: '¿Qué pasa si no sé mi nivel de idioma?',
        en: "What if I don't know my language level?",
        de: 'Was ist, wenn ich mein Sprachniveau nicht kenne?',
        fr: 'Et si je ne connais pas mon niveau de langue ?',
        ru: 'Что если я не знаю свой уровень языка?'
      },
      answer: {
        es: '¡Ofrecemos un test de nivel gratuito! Completa nuestra evaluación online y recibirás tu resultado junto con recomendaciones personalizadas para tu plan de estudios.',
        en: "We offer a free level test! Complete our online assessment and you'll receive your result along with personalized recommendations for your study plan.",
        de: 'Wir bieten einen kostenlosen Einstufungstest an! Absolvieren Sie unsere Online-Bewertung und Sie erhalten Ihr Ergebnis zusammen mit personalisierten Empfehlungen für Ihren Lernplan.',
        fr: "Nous offrons un test de niveau gratuit ! Complétez notre évaluation en ligne et vous recevrez votre résultat ainsi que des recommandations personnalisées pour votre plan d'études.",
        ru: 'Мы предлагаем бесплатный тест на уровень! Пройдите нашу онлайн-оценку, и вы получите результат вместе с персонализированными рекомендациями для вашего плана обучения.'
      }
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t?.learning?.faq?.title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t?.learning?.faq?.subtitle || 'Everything you need to know about learning medical languages'}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                  {faq.question[language] || faq.question.en}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer[language] || faq.answer.en}
                  {index === faqs.length - 1 && onTakeTest && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-semibold text-primary mt-2"
                      onClick={onTakeTest}
                    >
                      {t?.learning?.faq?.takeTest || '→ Take the free test now'}
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default LearningFAQ;
