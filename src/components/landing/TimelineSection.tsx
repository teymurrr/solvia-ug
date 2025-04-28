
import React from 'react';
import { Timeline } from "@/components/ui/timeline";
import { FileText, Building2, Rocket } from "lucide-react";

const TimelineSection = () => {
  const timelineData = [
    {
      title: "Create Profile",
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Build your professional profile showcasing your skills, experience, and qualifications. 
            Stand out to potential employers with a complete profile.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="text-[18px] font-medium">Easy profile creation</span>
          </div>
        </div>
      ),
    },
    {
      title: "Apply",
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Browse through healthcare opportunities worldwide. Apply to positions that match 
            your skills and aspirations with just a few clicks.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-[18px] font-medium">Global opportunities</span>
          </div>
        </div>
      ),
    },
    {
      title: "Start",
      content: (
        <div className="space-y-4">
          <p className="text-[18px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Once hired, we'll support your transition. From relocation assistance to integration 
            support, we ensure a smooth start to your new role.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-6 w-6" />
            <span className="text-[18px] font-medium">Full relocation support</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-8 bg-white"> {/* Reduced vertical padding */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-8"> {/* Reduced margin bottom */}
          <h2 className="text-[30px] font-bold text-black">
            Your Journey with Solvia
          </h2>
          <p className="text-base text-muted-foreground mt-3 mb-4"> {/* Reduced margins */}
            Your journey to working in a new country made simple and straightforward
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
