import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, Users, MessageCircle, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { countries } from '@/data/learningData';

interface CourseCatalogProps {
  onSelectCourse: () => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ onSelectCourse }) => {
  const { t, currentLanguage: language } = useLanguage();

  const getCourseIncludes = (countryId: string): string[] => {
    const includes: Record<string, Record<string, string[]>> = {
      germany: {
        es: ['Vocabulario hospitalario', 'Simulaciones FSP', 'Preparación TELC Medizin'],
        en: ['Hospital vocabulary', 'FSP simulations', 'TELC Medizin preparation'],
        de: ['Krankenhausvokabular', 'FSP-Simulationen', 'TELC Medizin Vorbereitung'],
        fr: ['Vocabulaire hospitalier', 'Simulations FSP', 'Préparation TELC Medizin'],
        ru: ['Больничная лексика', 'Симуляции FSP', 'Подготовка TELC Medizin']
      },
      austria: {
        es: ['Vocabulario hospitalario', 'Preparación Gleichwertigkeitsprüfung', 'ÖSD Medizin'],
        en: ['Hospital vocabulary', 'Gleichwertigkeitsprüfung prep', 'ÖSD Medizin'],
        de: ['Krankenhausvokabular', 'Gleichwertigkeitsprüfung Vorbereitung', 'ÖSD Medizin'],
        fr: ['Vocabulaire hospitalier', 'Préparation Gleichwertigkeitsprüfung', 'ÖSD Medizin'],
        ru: ['Больничная лексика', 'Подготовка Gleichwertigkeitsprüfung', 'ÖSD Medizin']
      },
      france: {
        es: ['Comunicación con pacientes', 'Terminología clínica', 'Preparación TCF/TEF'],
        en: ['Patient communication', 'Clinical terminology', 'TCF/TEF preparation'],
        de: ['Patientenkommunikation', 'Klinische Terminologie', 'TCF/TEF Vorbereitung'],
        fr: ['Communication avec les patients', 'Terminologie clinique', 'Préparation TCF/TEF'],
        ru: ['Общение с пациентами', 'Клиническая терминология', 'Подготовка TCF/TEF']
      },
      italy: {
        es: ['Vocabulario clínico', 'Examen de competencias', 'Práctica con casos reales'],
        en: ['Clinical vocabulary', 'Competency exam', 'Real case practice'],
        de: ['Klinisches Vokabular', 'Kompetenzprüfung', 'Praxis mit echten Fällen'],
        fr: ['Vocabulaire clinique', 'Examen de compétences', 'Pratique avec cas réels'],
        ru: ['Клиническая лексика', 'Экзамен на компетенцию', 'Практика с реальными случаями']
      },
      spain: {
        es: ['Comunicación profesional', 'Terminología clínica', 'Role-plays médico-paciente'],
        en: ['Professional communication', 'Clinical terminology', 'Doctor-patient role-plays'],
        de: ['Professionelle Kommunikation', 'Klinische Terminologie', 'Arzt-Patient Rollenspiele'],
        fr: ['Communication professionnelle', 'Terminologie clinique', 'Jeux de rôle médecin-patient'],
        ru: ['Профессиональная коммуникация', 'Клиническая терминология', 'Ролевые игры врач-пациент']
      }
    };
    return includes[countryId]?.[language] || includes[countryId]?.en || [];
  };

  const getMedicalPrefix = () => {
    const prefixes: Record<string, string> = {
      es: 'Médico',
      en: 'Medical',
      de: 'Medizinisches',
      fr: 'Médical',
      ru: 'Медицинский'
    };
    return prefixes[language] || prefixes.en;
  };

  const getViewCoursesLabel = () => {
    const labels: Record<string, string> = {
      es: 'Ver cursos de',
      en: 'View',
      de: 'Kurse ansehen für',
      fr: 'Voir les cours de',
      ru: 'Смотреть курсы'
    };
    return labels[language] || labels.en;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t?.learning?.catalog?.title || 'Medical Language Course Catalog'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t?.learning?.catalog?.subtitle || 'Specialized language courses for each European country'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {countries.map((country) => (
            <Card 
              key={country.id} 
              className="hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center">
                  <span className="text-5xl mb-2 block">{country.flag}</span>
                  <h3 className="text-xl font-bold text-foreground">
                    {getMedicalPrefix()} {country.language[language] || country.language.en}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t?.learning?.catalog?.levelsLabel || 'Levels'}: A1-C1
                  </p>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t?.learning?.catalog?.objectiveLabel || 'Objective'}: {t?.learning?.catalog?.workIn || 'Work in'}{' '}
                    {country.name[language] || country.name.en}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {getCourseIncludes(country.id).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={onSelectCourse}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    variant="outline"
                  >
                    {getViewCoursesLabel()} {country.language[language] || country.language.en}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCatalog;
