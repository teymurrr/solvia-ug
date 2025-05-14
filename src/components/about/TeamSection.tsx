
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { OptimizedImage } from '@/components/ui/optimized-image';

const TeamSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{t?.about?.team?.title}</h2>
          <p className="text-lg text-muted-foreground">
            {t?.about?.team?.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <OptimizedImage 
                src="/lovable-uploads/50866c4f-dae7-4f12-82b4-78f2002e281a.png" 
                alt="Teymur Mammadov"
                aspectRatio={1} 
                className="object-top"
                width={160}
                height={160}
              />
            </div>
            <h3 className="text-xl font-semibold">Teymur Mammadov</h3>
            <p className="text-muted-foreground">{t?.about?.team?.cofounder || "Co-Founder"}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <OptimizedImage 
                src="/lovable-uploads/6076d717-f7de-4fe6-b318-20bfcd6e2aa6.png" 
                alt="David Rehrl"
                aspectRatio={1} 
                className="object-top"
                width={160}
                height={160}
              />
            </div>
            <h3 className="text-xl font-semibold">David Rehrl</h3>
            <p className="text-muted-foreground">{t?.about?.team?.cofounder || "Co-Founder"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
