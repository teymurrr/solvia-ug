
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { FileText, Building2, Rocket } from "lucide-react";

const TimelineSection = () => {
  const timelineData = [
    {
      title: "Create Profile",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
            Build your professional profile showcasing your skills, experience, and qualifications. 
            Stand out to potential employers with a complete profile.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Easy profile creation</span>
          </div>
        </div>
      ),
    },
    {
      title: "Apply",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
            Browse through healthcare opportunities worldwide. Apply to positions that match 
            your skills and aspirations with just a few clicks.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">Global opportunities</span>
          </div>
        </div>
      ),
    },
    {
      title: "Start",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
            Once hired, we'll support your transition. From relocation assistance to integration 
            support, we ensure a smooth start to your new role.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-5 w-5" />
            <span className="text-sm font-medium">Full relocation support</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full">
      <Timeline data={timelineData} />
    </section>
  );
};

export default TimelineSection;
