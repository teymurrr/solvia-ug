
import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const USPSection = () => {
  const { t } = useLanguage();

  const getUsps = () => {
    if (t?.forDoctors?.usp?.items) {
      return t.forDoctors.usp.items.map((item: any) => ({
        icon: Check,
        title: item.title,
        description: item.description
      }));
    }
    
    // Fallback to English
    return [
      {
        icon: Check,
        title: "Guidance at every step",
        description: "From degree recognition and the FSP exam to job search, visa, and housing—we guide you through every step in one single platform."
      },
      {
        icon: Check,
        title: "Smart platform with a human touch",
        description: "Track your progress, upload documents, and receive reminders. And if you need help, our team is just one message away."
      },
      {
        icon: Check,
        title: "Specialists in international doctors",
        description: "We understand the unique challenges faced by professionals from Latin America, Asia, Africa, or Eastern Europe. We know what works—and help you avoid common mistakes."
      },
      {
        icon: Check,
        title: "Direct access to trusted employers",
        description: "We work with verified hospitals that value international talent. You focus on preparing—we connect you with the right opportunities."
      }
    ];
  };

  const usps = getUsps();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            {t?.forDoctors?.usp?.title || "This is what sets us apart:"}
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            {t?.forDoctors?.usp?.subtitle || "Thousands of doctors face a complex process when moving to Germany. At Solvia, we make it simple. Here's what makes us different:"}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {usps.map((usp, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <usp.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">{usp.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{usp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;
