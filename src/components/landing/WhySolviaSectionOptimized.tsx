
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

// Lazy load icons to reduce bundle size
const StarIcon = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Star })));
const SmileIcon = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Smile })));
const UsersIcon = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Users })));
const ClockIcon = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.Clock })));

// Memoized icon wrapper
const IconWrapper = React.memo(({ children, priority = false }: { children: React.ReactNode; priority?: boolean }) => (
  <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
    <React.Suspense fallback={<div className="h-5 w-5 bg-primary/20 rounded animate-pulse" />}>
      {children}
    </React.Suspense>
  </div>
));

IconWrapper.displayName = 'IconWrapper';

const WhySolviaSectionOptimized = React.memo(() => {
  const { t } = useLanguage();
  
  const sectionData = React.useMemo(() => ({
    heading: t?.why?.heading || "Here's what makes us different from traditional recruitment agencies",
    description: t?.why?.description || "At Solvia, we are passionate about connecting professionals around the world with institutions directly, without middlemen.",
    stats: {
      positions: t?.vacancies?.positions || "Active Positions",
      professionals: t?.professionals?.title || "Professionals"
    },
    about: t?.common?.about || "About Us",
    features: [
      {
        title: t?.why?.directHiring?.title || "Direct Collaboration, No Middlemen",
        description: t?.why?.directHiring?.description || "Connect and communicate without agencies or commissions — just people, transparently.",
        icon: <StarIcon className="h-5 w-5 text-primary" />
      },
      {
        title: t?.why?.fastProcess?.title || "Faster Matches, Smoother Processes",
        description: t?.why?.fastProcess?.description || "Our smart platform streamlines the journey — saving time and delivering better outcomes for everyone involved.",
        icon: <SmileIcon className="h-5 w-5 text-primary" />
      },
      {
        title: t?.why?.verifiedProfiles?.title || "Verified Community, Trusted Interactions",
        description: t?.why?.verifiedProfiles?.description || "All profiles are reviewed and validated to ensure quality, safety, and trust on both sides.",
        icon: <UsersIcon className="h-5 w-5 text-primary" />
      },
      {
        title: t?.why?.transparentProcess?.title || "Full Transparency, Shared Control",
        description: t?.why?.transparentProcess?.description || "Both professionals and institutions can track progress, respond quickly, and stay in control — no gatekeepers, no guessing.",
        icon: <ClockIcon className="h-5 w-5 text-primary" />
      }
    ]
  }), [t]);
  
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Title, Description, Stats, and Button */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Optimized LCP element with CSS containment */}
              <h2 
                className="text-[42px] font-bold text-gray-900 leading-tight"
                style={{ contain: 'layout style' }}
              >
                {sectionData.heading}
              </h2>
              
              <p className="text-[20px] text-gray-600">
                {sectionData.description}
              </p>
              
              {/* Fixed mobile responsive stats section */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-8">
                <div className="text-center sm:text-left">
                  <span className="text-[50px] sm:text-[70px] font-bold text-primary block">200+</span>
                  <p className="text-gray-600 text-base sm:text-lg">{sectionData.stats.positions}</p>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[50px] sm:text-[70px] font-bold text-primary block">1000+</span>
                  <p className="text-gray-600 text-base sm:text-lg">{sectionData.stats.professionals}</p>
                </div>
              </div>
            </div>
            
            <div>
              <Button asChild className="px-8">
                <Link to="/about">{sectionData.about}</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Column: Feature Cards in a vertical layout */}
          <div className="space-y-4">
            {sectionData.features.map((feature, index) => (
              <Card key={index} className="border-transparent hover:shadow-lg transition-all">
                <CardContent className="p-4 flex items-center">
                  <IconWrapper priority={index === 0}>
                    {feature.icon}
                  </IconWrapper>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

WhySolviaSectionOptimized.displayName = 'WhySolviaSectionOptimized';

export default WhySolviaSectionOptimized;
