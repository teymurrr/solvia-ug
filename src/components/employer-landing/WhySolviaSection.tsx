
import React from 'react';
import { Globe, Users, FileCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const WhySolviaSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] font-bold text-black text-center mb-12">
          {t?.why?.title || "Why Solvia?"}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg">
              <Globe className="h-6 w-6 text-[#006ae6]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.why?.global?.title || "International Reach, Local Readiness"}</h3>
              <p className="text-gray-600">
                {t?.why?.global?.description || "We source skilled professionals from countries like Azerbaijan, Morocco, and beyond – all prepared for the German healthcare system, including Approbation and FSP."}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg">
              <Users className="h-6 w-6 text-[#006ae6]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.why?.verifiedProfiles?.title || "Language-Ready Candidates"}</h3>
              <p className="text-gray-600">
                {t?.why?.verifiedProfiles?.description || "We ensure every candidate reaches at least B2 level in German and provide extra training to match workplace needs."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg">
              <FileCheck className="h-6 w-6 text-[#006ae6]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.why?.directHiring?.title || "Hassle-Free Documentation"}</h3>
              <p className="text-gray-600">
                {t?.why?.directHiring?.description || "From visa paperwork to medical certifications – we guide candidates through every step, so you don't have to."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg">
              <Clock className="h-6 w-6 text-[#006ae6]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t?.why?.fastProcess?.title || "Faster Hiring, Less Admin"}</h3>
              <p className="text-gray-600">
                {t?.why?.fastProcess?.description || "Browse profiles, schedule interviews directly via our calendar tool, and access CVs instantly."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySolviaSection;
