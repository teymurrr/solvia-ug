import React from 'react';
import { Users, Building2, Calendar } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] font-bold text-black text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[#006ae6]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Search</h3>
            <p className="text-gray-600">Use filters to find the exact match you need.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-[#006ae6]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">Click to view a CV or schedule an interview.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-[#006ae6]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hire</h3>
            <p className="text-gray-600">We assist with onboarding, relocation, and integration.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
