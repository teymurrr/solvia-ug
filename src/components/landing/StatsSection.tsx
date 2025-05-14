
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const StatsSection = () => {
  const { t } = useLanguage();
  
  const statsData = [
    {icon: Users, title: '5,000+', description: t?.common?.professionals || 'Healthcare Professionals'},
    {icon: Building2, title: '1,200+', description: t?.vacancies?.positions || 'Active Positions'},
    {icon: Globe, title: '45+', description: t?.common?.countries || 'Countries Worldwide'}
  ];

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((item, i) => (
            <Card 
              key={i} 
              className="feature-card border-transparent hover:border-transparent"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <item.icon className="h-12 w-12 text-[#006ae6] mb-4" />
                <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
