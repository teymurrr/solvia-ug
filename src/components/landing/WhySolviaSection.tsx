
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Smile, Users, Clock, FileCheck, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

const WhySolviaSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Title, Description, Stats, and Button */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Here's what makes us different from traditional recruitment agencies
              </h2>
              
              <p className="text-lg text-gray-600">
                At Solvia, we are passionate about connecting professionals around the world with institutions directly, without middlemen.
              </p>
              
              <div className="flex gap-12 mt-8">
                <div>
                  <span className="text-4xl font-bold text-primary">200+</span>
                  <p className="text-gray-600">Active Positions</p>
                </div>
                <div>
                  <span className="text-4xl font-bold text-primary">1000+</span>
                  <p className="text-gray-600">Professionals</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-0">
              <Button asChild className="px-8">
                <Link to="/about">About Us</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Column: Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Direct Hiring, No Fees</h3>
                <p className="text-gray-600">
                  Skip third-party recruiters. Talk to professionals directly and hire without commission.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Verified Medical Profiles</h3>
                <p className="text-gray-600">
                  Every candidate is pre-screened, with documents and language skills ready.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Transparent Process</h3>
                <p className="text-gray-600">
                  See qualifications, availability, and status in real-time. No guesswork.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Faster Placements</h3>
                <p className="text-gray-600">
                  Instant access to candidates means faster onboarding and less admin work.
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
