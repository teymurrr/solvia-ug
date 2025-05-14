
import React from 'react';
import { Users, Building2, Globe, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const ValuesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{t?.about?.values?.title}</h2>
          <p className="text-lg text-muted-foreground">
            {t?.about?.values?.description || "The principles that guide everything we do at Solvia."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="bg-medical-100 p-2 h-fit rounded">
              <Users className="h-6 w-6 text-medical-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.about?.values?.peopleFirst || "People First"}</h3>
              <p className="text-muted-foreground">
                {t?.about?.values?.peopleFirstDesc || "We believe that at the heart of healthcare are dedicated professionals. We put their needs and career aspirations first."}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-medical-100 p-2 h-fit rounded">
              <Building2 className="h-6 w-6 text-medical-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.about?.values?.institution || "Institution Success"}</h3>
              <p className="text-muted-foreground">
                {t?.about?.values?.institutionDesc || "We're committed to helping healthcare institutions find the right talent to deliver exceptional care."}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-medical-100 p-2 h-fit rounded">
              <Globe className="h-6 w-6 text-medical-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.about?.values?.global || "Global Perspective"}</h3>
              <p className="text-muted-foreground">
                {t?.about?.values?.globalDesc || "We embrace diversity and believe in creating opportunities across geographic and cultural boundaries."}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-medical-100 p-2 h-fit rounded">
              <GraduationCap className="h-6 w-6 text-medical-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.about?.values?.learning || "Continuous Learning"}</h3>
              <p className="text-muted-foreground">
                {t?.about?.values?.learningDesc || "We're always improving our platform and processes to better serve the healthcare community."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
