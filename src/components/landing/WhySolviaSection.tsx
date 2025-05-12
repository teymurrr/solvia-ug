
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Smile, Users, Clock, FileCheck, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

const WhySolviaSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Title, Description, Stats, and Button */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
                Here's what makes us different from traditional recruitment agencies
              </h2>
              
              <p className="text-[20px] text-gray-600">
                At Solvia, we are passionate about connecting professionals around the world with institutions directly, without middlemen.
              </p>
              
              <div className="flex gap-12 mt-8">
                <div>
                  <span className="text-[70px] font-bold text-primary">200+</span>
                  <p className="text-gray-600 text-lg">Active Positions</p>
                </div>
                <div>
                  <span className="text-[70px] font-bold text-primary">1000+</span>
                  <p className="text-gray-600 text-lg">Professionals</p>
                </div>
              </div>
            </div>
            
            <div>
              <Button asChild className="px-8">
                <Link to="/about">About Us</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Column: Feature Cards in a single row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-transparent hover:shadow-lg transition-all h-full">
              <CardContent className="p-4 flex flex-col items-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">Direct Hiring, No Fees</h3>
                <p className="text-sm text-gray-600">
                  Skip third-party recruiters.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all h-full">
              <CardContent className="p-4 flex flex-col items-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">Verified Profiles</h3>
                <p className="text-sm text-gray-600">
                  Pre-screened candidates ready.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all h-full">
              <CardContent className="p-4 flex flex-col items-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">Transparent Process</h3>
                <p className="text-sm text-gray-600">
                  Real-time status updates.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all h-full">
              <CardContent className="p-4 flex flex-col items-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">Faster Placements</h3>
                <p className="text-sm text-gray-600">
                  Less admin work needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySolviaSection;
