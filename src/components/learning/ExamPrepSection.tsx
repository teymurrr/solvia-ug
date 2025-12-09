import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { countries } from '@/data/learningData';

interface ExamPrepSectionProps {
  onSelectCountry: () => void;
}

const ExamPrepSection: React.FC<ExamPrepSectionProps> = ({ onSelectCountry }) => {
  const { t, currentLanguage: language } = useLanguage();

  const getExamDetails = () => {
    const details: Record<string, Record<string, { exams: string[]; note: string }>> = {
      germany: {
        es: { exams: ['FSP (Fachsprachprüfung)', 'TELC B2-C1 Medizin'], note: 'Obligatorios para la Approbation' },
        en: { exams: ['FSP (Fachsprachprüfung)', 'TELC B2-C1 Medizin'], note: 'Required for Approbation' },
        de: { exams: ['FSP (Fachsprachprüfung)', 'TELC B2-C1 Medizin'], note: 'Erforderlich für die Approbation' },
        fr: { exams: ['FSP (Fachsprachprüfung)', 'TELC B2-C1 Medizin'], note: "Requis pour l'Approbation" },
        ru: { exams: ['FSP (Fachsprachprüfung)', 'TELC B2-C1 Medizin'], note: 'Требуется для Approbation' }
      },
      austria: {
        es: { exams: ['Gleichwertigkeitsprüfung', 'ÖSD Medizin'], note: 'Para reconocimiento de título' },
        en: { exams: ['Gleichwertigkeitsprüfung', 'ÖSD Medizin'], note: 'For title recognition' },
        de: { exams: ['Gleichwertigkeitsprüfung', 'ÖSD Medizin'], note: 'Für Titelanerkennung' },
        fr: { exams: ['Gleichwertigkeitsprüfung', 'ÖSD Medizin'], note: 'Pour la reconnaissance du titre' },
        ru: { exams: ['Gleichwertigkeitsprüfung', 'ÖSD Medizin'], note: 'Для признания диплома' }
      },
      france: {
        es: { exams: ['TCF/TEF', 'Épreuves professionnelles'], note: 'Nivel B2 mínimo requerido' },
        en: { exams: ['TCF/TEF', 'Professional tests'], note: 'B2 minimum level required' },
        de: { exams: ['TCF/TEF', 'Fachprüfungen'], note: 'Mindestens B2-Niveau erforderlich' },
        fr: { exams: ['TCF/TEF', 'Épreuves professionnelles'], note: 'Niveau B2 minimum requis' },
        ru: { exams: ['TCF/TEF', 'Профессиональные тесты'], note: 'Требуется минимум уровень B2' }
      },
      italy: {
        es: { exams: ['CILS Medico', 'Prove cliniche'], note: 'Evaluación de competencias clínicas' },
        en: { exams: ['CILS Medico', 'Clinical tests'], note: 'Clinical competency assessment' },
        de: { exams: ['CILS Medico', 'Klinische Tests'], note: 'Beurteilung der klinischen Kompetenz' },
        fr: { exams: ['CILS Medico', 'Tests cliniques'], note: 'Évaluation des compétences cliniques' },
        ru: { exams: ['CILS Medico', 'Клинические тесты'], note: 'Оценка клинических компетенций' }
      },
      spain: {
        es: { exams: ['DELE Médico'], note: 'No obligatorio pero recomendado' },
        en: { exams: ['Medical DELE'], note: 'Not mandatory but recommended' },
        de: { exams: ['Medizinisches DELE'], note: 'Nicht obligatorisch aber empfohlen' },
        fr: { exams: ['DELE Médical'], note: 'Non obligatoire mais recommandé' },
        ru: { exams: ['Медицинский DELE'], note: 'Не обязательно, но рекомендуется' }
      }
    };
    return details;
  };

  const examDetails = getExamDetails();

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t?.learning?.exams?.title || 'Medical Exam Preparation for Europe'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t?.learning?.exams?.subtitle || 'FSP, OET, TELC, and more — prepare for the exam your country requires'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {countries.map((country) => {
            const details = examDetails[country.id]?.[language] || examDetails[country.id]?.en;
            
            return (
              <Card key={country.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{country.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {country.name[language] || country.name.en}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {details?.exams.map((exam, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{exam}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    {details?.note}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button size="lg" onClick={onSelectCountry}>
            {t?.learning?.exams?.cta || 'See preparation for your country'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExamPrepSection;
