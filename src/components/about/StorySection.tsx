
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const StorySection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations are not available
  const title = t?.about?.story?.title || "Our Story";
  const description = t?.about?.story?.description || "Founded in 2022, Solvia began with a simple idea: to make medical recruitment transparent, efficient, and human-centered. Today, we serve thousands of professionals and institutions across multiple countries.";

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
          <p className="text-lg text-muted-foreground text-center">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
