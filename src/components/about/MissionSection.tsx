
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, FileCheck, HeartPulse } from 'lucide-react';

const MissionSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            We're on a mission to transform how healthcare professionals find work and how hospitals find talent. 
            By removing barriers between qualified professionals and institutions in need, we're building 
            a more efficient, borderless healthcare recruitment ecosystem.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Connections</h3>
              <p className="text-muted-foreground">
                Breaking down geographic barriers to connect healthcare professionals with opportunities worldwide.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FileCheck className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplified Process</h3>
              <p className="text-muted-foreground">
                Streamlining document collection, verification, and the entire recruitment workflow.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HeartPulse className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Better Healthcare</h3>
              <p className="text-muted-foreground">
                Contributing to stronger healthcare systems by helping institutions find the talent they need.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
