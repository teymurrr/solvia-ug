
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[30px] font-bold text-black">
            Your <span className="text-gradient">Journey</span> with Solvia
          </h2>
          <p className="text-lg text-muted-foreground mt-4 mb-6">
            Follow the steps to start your recruitment journey with us
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
