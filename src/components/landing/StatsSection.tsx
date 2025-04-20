
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Globe } from 'lucide-react';

const statsData = [
  {icon: Users, title: '5,000+', description: 'Healthcare Professionals'},
  {icon: Building2, title: '1,200+', description: 'Healthcare Institutions'},
  {icon: Globe, title: '45+', description: 'Countries Worldwide'}
];

const StatsSection = () => {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((item, i) => (
            <Card key={i} className="feature-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <item.icon className="h-12 w-12 text-medical-600 mb-4" />
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
