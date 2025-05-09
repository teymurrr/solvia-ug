
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Globe, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const WhySolviaSection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations aren't loaded yet
  const title = t?.why?.title || "Why Solvia?";
  const subtitle = t?.why?.subtitle || "Discover what makes our platform the top choice for healthcare professionals worldwide";
  
  const globalTitle = t?.why?.global?.title || "Global Opportunities";
  const globalDescription = t?.why?.global?.description || "Access to healthcare positions across multiple countries with full relocation support";
  
  const fastTitle = t?.why?.fast?.title || "Fast Placement";
  const fastDescription = t?.why?.fast?.description || "Streamlined matching process to help you find the right position quickly";
  
  const supportTitle = t?.why?.support?.title || "Comprehensive Support";
  const supportDescription = t?.why?.support?.description || "Guidance through certification, language training, and settlement in your new country";
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Shield className="h-[30px] w-[30px] text-[#006ae6] mx-auto mb-4" />
          <h2 className="text-[30px] font-bold text-black">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-transparent hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Globe className="h-12 w-12 text-[#006ae6] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{globalTitle}</h3>
              <p className="text-muted-foreground">
                {globalDescription}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-transparent hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-[#006ae6] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{fastTitle}</h3>
              <p className="text-muted-foreground">
                {fastDescription}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-transparent hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-[#006ae6] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{supportTitle}</h3>
              <p className="text-muted-foreground">
                {supportDescription}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhySolviaSection;
