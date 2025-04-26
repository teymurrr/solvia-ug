
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { FileText, Users, Building2 } from "lucide-react";

const TimelineSection = () => {
  const timelineData = [
    {
      title: "Post Jobs",
      content: (
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Create detailed job listings for your healthcare positions. Include requirements, 
            responsibilities, and benefits to attract the right candidates.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="text-base md:text-lg font-medium">Easy job posting process</span>
          </div>
        </div>
      ),
    },
    {
      title: "Connect",
      content: (
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Browse through profiles of qualified healthcare professionals. Use our advanced 
            filters to find candidates that match your requirements perfectly.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-6 w-6" />
            <span className="text-base md:text-lg font-medium">Direct messaging with candidates</span>
          </div>
        </div>
      ),
    },
    {
      title: "Hire",
      content: (
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
            Once you've found the perfect match, we'll help with the hiring process. 
            From contract signing to relocation assistance, we're here to support you.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-base md:text-lg font-medium">Full hiring support</span>
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
        subtitle="Follow the steps to start your recruitment journey with us"
      />
    </section>
  );
};

export default TimelineSection;
