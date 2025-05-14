
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, FileCheck, HeartPulse } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const MissionSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{t?.about?.mission?.title}</h2>
          <p className="text-lg text-muted-foreground">
            {t?.about?.mission?.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t?.about?.mission?.global || "Global Connections"}</h3>
              <p className="text-muted-foreground">
                {t?.about?.mission?.globalDesc || "Breaking down geographic barriers to connect healthcare professionals with opportunities worldwide."}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FileCheck className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t?.about?.mission?.process || "Simplified Process"}</h3>
              <p className="text-muted-foreground">
                {t?.about?.mission?.processDesc || "Streamlining document collection, verification, and the entire recruitment workflow."}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HeartPulse className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t?.about?.mission?.healthcare || "Better Healthcare"}</h3>
              <p className="text-muted-foreground">
                {t?.about?.mission?.healthcareDesc || "Contributing to stronger healthcare systems by helping institutions find the talent they need."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
