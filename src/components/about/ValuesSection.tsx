
import React from 'react';
import { Shield, Award, Lightbulb, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const ValuesSection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations are not available
  const title = t?.about?.values?.title || "Our Values";
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-medical-600" />,
      title: t?.about?.values?.integrity || "Integrity",
      description: t?.about?.values?.integrityDesc || "We operate with transparency and honesty in all our interactions."
    },
    {
      icon: <Award className="h-8 w-8 text-medical-600" />,
      title: t?.about?.values?.excellence || "Excellence",
      description: t?.about?.values?.excellenceDesc || "We strive for the highest standards in our services and operations."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-medical-600" />,
      title: t?.about?.values?.innovation || "Innovation",
      description: t?.about?.values?.innovationDesc || "We continuously seek better ways to serve our users and solve problems."
    },
    {
      icon: <Users className="h-8 w-8 text-medical-600" />,
      title: t?.about?.values?.inclusion || "Inclusion",
      description: t?.about?.values?.inclusionDesc || "We embrace diversity and create equal opportunities for all."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
