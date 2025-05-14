
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Smile, Users, Clock } from 'lucide-react';
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
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.directHiring?.title || "Direct Collaboration, No Middlemen"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.directHiring?.description || "Connect and communicate without agencies or commissions — just people, transparently."}
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
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.fastProcess?.title || "Faster Matches, Smoother Processes"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.fastProcess?.description || "Our smart platform streamlines the journey — saving time and delivering better outcomes for everyone involved."}
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
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.verifiedProfiles?.title || "Verified Community, Trusted Interactions"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.verifiedProfiles?.description || "All profiles are reviewed and validated to ensure quality, safety, and trust on both sides."}
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
                  <h3 className="text-xl font-semibold mb-1">{t?.why?.transparentProcess?.title || "Full Transparency, Shared Control"}</h3>
                  <p className="text-gray-600">
                    {t?.why?.transparentProcess?.description || "Both professionals and institutions can track progress, respond quickly, and stay in control — no gatekeepers, no guessing."}
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
