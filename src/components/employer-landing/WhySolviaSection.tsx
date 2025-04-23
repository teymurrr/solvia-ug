import React from 'react';
import { Globe, Users, FileCheck, Clock } from 'lucide-react';

const WhySolviaSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Solvia?</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex gap-4 items-start">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">International Reach, Local Readiness</h3>
              <p className="text-gray-600">
                We source skilled professionals from countries like Azerbaijan, Morocco, and beyond – all prepared for the German healthcare system, including Approbation and FSP.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Language-Ready Candidates</h3>
              <p className="text-gray-600">
                We ensure every candidate reaches at least B2 level in German and provide extra training to match workplace needs.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Hassle-Free Documentation</h3>
              <p className="text-gray-600">
                From visa paperwork to medical certifications – we guide candidates through every step, so you don't have to.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Faster Hiring, Less Admin</h3>
              <p className="text-gray-600">
                Browse profiles, schedule interviews directly via our calendar tool, and access CVs instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySolviaSection;
