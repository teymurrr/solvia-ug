
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { FileText, Users, Building2 } from "lucide-react";

const TimelineSection = () => {
  const timelineData = [
    {
      title: "Post Jobs",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
            Create detailed job listings for your healthcare positions. Include requirements, 
            responsibilities, and benefits to attract the right candidates.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Easy job posting process</span>
          </div>
        </div>
      ),
    },
    {
      title: "Connect",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
            Browse through profiles of qualified healthcare professionals. Use our advanced 
            filters to find candidates that match your requirements perfectly.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Direct messaging with candidates</span>
          </div>
        </div>
      ),
    },
    {
      title: "Hire",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
            Once you've found the perfect match, we'll help with the hiring process. 
            From contract signing to relocation assistance, we're here to support you.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">Full hiring support</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full">
      <div className="container mx-auto text-center py-16">
        <h2 className="text-[30px] font-bold text-black mb-4">
          How <span className="text-primary">It</span> Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Streamline your hiring process with our comprehensive recruitment platform
        </p>
        <Timeline data={timelineData} />
      </div>
    </section>
  );
};

export default TimelineSection;
