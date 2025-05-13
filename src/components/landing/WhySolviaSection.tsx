
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Title, Description, Stats, and Button */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
                {t?.why?.heading || "Here's what makes us different from traditional recruitment agencies"}
              </h2>
              
              <p className="text-[20px] text-gray-600">
                {t?.why?.description || "At Solvia, we are passionate about connecting professionals around the world with institutions directly, without middlemen."}
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
                <Link to="/about">{t?.common?.about || "About Us"}</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Column: Feature Cards in a vertical layout */}
          <div className="space-y-4">
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.directHiring?.title || "Direct Hiring, No Fees"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.directHiring?.description || "Skip third-party recruiters and connect directly with professionals."}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                  <Smile className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.fastProcess?.title || "Fast Process, Best Results"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.fastProcess?.description || "Our streamlined approach ensures quicker placements with better outcomes."}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.verifiedProfiles?.title || "Verified Profiles"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.verifiedProfiles?.description || "All our professionals are pre-screened and verified for quality assurance."}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.transparentProcess?.title || "Transparent Process"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.transparentProcess?.description || "Track application status in real-time with our transparent process."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySolviaSection;
