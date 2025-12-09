import React from 'react';
import { Check, Users, BookOpen, Award, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const ValueProposition: React.FC = () => {
  const { t, currentLanguage: language } = useLanguage();

  const getValuePoints = () => {
    const points = [
      {
        icon: BookOpen,
        text: {
          es: 'Cursos diseñados solo para profesionales de la salud',
          en: 'Courses designed only for healthcare professionals',
          de: 'Kurse nur für Gesundheitsfachkräfte konzipiert',
          fr: 'Cours conçus uniquement pour les professionnels de santé',
          ru: 'Курсы разработаны только для медицинских специалистов'
        }
      },
      {
        icon: Users,
        text: {
          es: 'Enfocados en comunicación clínica real',
          en: 'Focused on real clinical communication',
          de: 'Fokussiert auf echte klinische Kommunikation',
          fr: 'Axés sur la communication clinique réelle',
          ru: 'Ориентированы на реальную клиническую коммуникацию'
        }
      },
      {
        icon: Award,
        text: {
          es: 'Ruta clara desde A1 hasta nivel profesional',
          en: 'Clear path from A1 to professional level',
          de: 'Klarer Weg von A1 bis zum professionellen Niveau',
          fr: 'Chemin clair de A1 au niveau professionnel',
          ru: 'Четкий путь от A1 до профессионального уровня'
        }
      },
      {
        icon: Check,
        text: {
          es: 'Preparación para exámenes oficiales (TELC, OET, FSP)',
          en: 'Official exam preparation (TELC, OET, FSP)',
          de: 'Offizielle Prüfungsvorbereitung (TELC, OET, FSP)',
          fr: 'Préparation aux examens officiels (TELC, OET, FSP)',
          ru: 'Подготовка к официальным экзаменам (TELC, OET, FSP)'
        }
      },
      {
        icon: Clock,
        text: {
          es: 'Compatible con horarios ocupados',
          en: 'Compatible with busy schedules',
          de: 'Vereinbar mit vollen Terminplänen',
          fr: 'Compatible avec les emplois du temps chargés',
          ru: 'Совместимо с загруженным графиком'
        }
      },
      {
        icon: Globe,
        text: {
          es: 'Más de 1,000 estudiantes en Europa',
          en: 'Over 1,000 students across Europe',
          de: 'Über 1.000 Studenten in Europa',
          fr: 'Plus de 1 000 étudiants en Europe',
          ru: 'Более 1000 студентов по всей Европе'
        }
      }
    ];
    return points;
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-10">
            {t?.learning?.value?.title || 'Why Solvia Learning Works'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getValuePoints().map((point, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 bg-background rounded-lg p-4 shadow-sm"
              >
                <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                  <point.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium">
                  {point.text[language] || point.text.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
