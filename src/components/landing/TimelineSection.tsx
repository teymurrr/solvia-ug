
import React from 'react';
import { Timeline } from "@/components/ui/timeline";
import { FileText, Building2, Rocket } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';

const TimelineSection = () => {
  const { t } = useLanguage();
  
  // Ensure we have fallback values if t.journey is undefined
  const journeyData = t?.journey || {
    title: 'Your Journey with Solvia',
    subtitle: 'How it works - from profile creation to your new position',
    steps: {
      profile: 'Create Your Profile',
      profileDesc: 'Complete your professional profile with your expertise, experience, and requirements.',
      profileFeature: 'Detailed Profile Creation',
      apply: 'Apply to Positions',
      applyDesc: 'Browse and apply to positions that match your skills and preferences.',
      applyFeature: 'Personalized Job Matching',
      start: 'Start Your New Role',
      startDesc: 'Once hired, we'll help you with the transition to your new position.',
      startFeature: 'Seamless Onboarding Support'
    }
  };
  
  const timelineData = [
    {
      title: journeyData.steps?.profile || 'Create Your Profile',
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {journeyData.steps?.profileDesc || 'Complete your professional profile with details about your experience.'}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="text-[18px] font-medium">{journeyData.steps?.profileFeature || 'Detailed Profile Creation'}</span>
          </div>
        </div>
      ),
    },
    {
      title: journeyData.steps?.apply || 'Apply to Positions',
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {journeyData.steps?.applyDesc || 'Browse and apply to positions that match your skills.'}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-[18px] font-medium">{journeyData.steps?.applyFeature || 'Personalized Job Matching'}</span>
          </div>
        </div>
      ),
    },
    {
      title: journeyData.steps?.start || 'Start Your New Role',
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            {journeyData.steps?.startDesc || 'Once hired, we'll help you with the transition to your new role.'}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-6 w-6" />
            <span className="text-[18px] font-medium">{journeyData.steps?.startFeature || 'Seamless Onboarding Support'}</span>
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
            {journeyData.subtitle || 'How it works - from profile creation to your new position'}
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
