
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Clock, FileCheck, DollarSign } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const WhySolviaSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-black mb-4">Why Solvia?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The smarter way to connect healthcare professionals with institutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-transparent hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <DollarSign className="h-12 w-12 text-[#006ae6] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Hiring, No Fees</h3>
              <p className="text-muted-foreground">
                Skip third-party recruiters. Talk to professionals directly and hire without commission.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-transparent hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <UserCheck className="h-12 w-12 text-[#006ae6] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Medical Profiles</h3>
              <p className="text-muted-foreground">
                Every candidate is pre-screened, with documents and language skills ready.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-transparent hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FileCheck className="h-12 w-12 text-[#006ae6] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
              <p className="text-muted-foreground">
                See qualifications, availability, and status in real-time. No guesswork.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-transparent hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-[#006ae6] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Faster Placements</h3>
              <p className="text-muted-foreground">
                Instant access to candidates means faster onboarding and less admin work.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhySolviaSection;
