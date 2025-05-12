
import React from 'react';
import { Timeline } from "@/components/ui/timeline";
import { FileText, Building2, Rocket } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';

const TimelineSection = () => {
  const { t } = useLanguage();
  
  const timelineData = [
    {
      title: t.journey.steps.profile,
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {t.journey.steps.profileDesc}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="text-[18px] font-medium">{t.journey.steps.profileFeature}</span>
          </div>
        </div>
      ),
    },
    {
      title: t.journey.steps.apply,
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {t.journey.steps.applyDesc}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-[18px] font-medium">{t.journey.steps.applyFeature}</span>
          </div>
        </div>
      ),
    },
    {
      title: t.journey.steps.start,
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {t.journey.steps.startDesc}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-6 w-6" />
            <span className="text-[18px] font-medium">{t.journey.steps.startFeature}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-[30px] font-bold text-black">
            {t.journey.title}
          </h2>
          <p className="text-base text-muted-foreground mt-3 mb-4">
            {t.journey.subtitle}
          </p>
        </div>
        <Timeline 
          data={timelineData}
        />
      </div>
    </section>
  );
};

export default TimelineSection;
