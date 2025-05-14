
import React from 'react';
import { Timeline } from "@/components/ui/timeline";
import { FileText, Building2, Rocket } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';

const TimelineSection = () => {
  const { t } = useLanguage();
  
  // Ensure we have fallback values if t.journey is undefined
  const journeyData = t?.journey || {
    title: 'Your Journey with Solvia',
    subtitle: 'Your journey to working in a new country made simple and straightforward',
    steps: {
      profile: 'Create Profile',
      profileDesc: 'Build your professional profile showcasing your skills, experience, and qualifications. Stand out to potential employers with a complete profile.',
      profileFeature: 'Easy profile creation',
      apply: 'Apply',
      applyDesc: 'Browse through healthcare opportunities worldwide. Apply to positions that match your skills and aspirations with just a few clicks.',
      applyFeature: 'Global opportunities',
      start: 'Start',
      startDesc: "Once hired, we'll support your transition. From relocation assistance to integration support, we ensure a smooth start to your new role.",
      startFeature: 'Full relocation support'
    }
  };
  
  const timelineData = [
    {
      title: journeyData.steps?.profile || 'Create Profile',
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {journeyData.steps?.profileDesc || 'Build your professional profile showcasing your skills, experience, and qualifications.'}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="text-[18px] font-medium">{journeyData.steps?.profileFeature || 'Easy profile creation'}</span>
          </div>
        </div>
      ),
    },
    {
      title: journeyData.steps?.apply || 'Apply',
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {journeyData.steps?.applyDesc || 'Browse through healthcare opportunities worldwide. Apply to positions that match your skills.'}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-[18px] font-medium">{journeyData.steps?.applyFeature || 'Global opportunities'}</span>
          </div>
        </div>
      ),
    },
    {
      title: journeyData.steps?.start || 'Start',
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {journeyData.steps?.startDesc || "Once hired, we'll support your transition. From relocation assistance to integration support, we ensure a smooth start."}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-6 w-6" />
            <span className="text-[18px] font-medium">{journeyData.steps?.startFeature || 'Full relocation support'}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="space-y-6 mb-8 text-center">
          <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
            {journeyData.title || 'Your Journey with Solvia'}
          </h2>
          <p className="text-[20px] text-gray-600">
            {journeyData.subtitle || 'Your journey to working in a new country made simple and straightforward'}
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
