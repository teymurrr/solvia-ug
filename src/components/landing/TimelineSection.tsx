
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { FileText, Building2, Rocket } from "lucide-react";

const TimelineSection = () => {
  const timelineData = [
    {
      title: "Create Profile",
      content: (
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Build your professional profile showcasing your skills, experience, and qualifications. 
            Stand out to potential employers with a complete profile.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="text-base md:text-lg font-medium">Easy profile creation</span>
          </div>
        </div>
      ),
    },
    {
      title: "Apply",
      content: (
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Browse through healthcare opportunities worldwide. Apply to positions that match 
            your skills and aspirations with just a few clicks.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-base md:text-lg font-medium">Global opportunities</span>
          </div>
        </div>
      ),
    },
    {
      title: "Start",
      content: (
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Once hired, we'll support your transition. From relocation assistance to integration 
            support, we ensure a smooth start to your new role.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-6 w-6" />
            <span className="text-base md:text-lg font-medium">Full relocation support</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full">
      <Timeline 
        data={timelineData} 
        title="Your <span class='text-gradient'>Journey</span> with Solvia" 
        subtitle="Follow the steps to start your healthcare career journey with us"
      />
    </section>
  );
};

export default TimelineSection;
