
import React from 'react';

const StorySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img 
                src="/lovable-uploads/431c73d2-5785-4d33-8f35-d11742c829e0.png" 
                alt="Solvia Logo" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground">
                Solvia was born from a simple observation: healthcare recruitment, especially across borders, 
                is unnecessarily complex, slow, and expensive.
              </p>
              <p className="text-muted-foreground">
                Founded by a team with backgrounds in healthcare and technology, we saw an opportunity to create 
                a platform that serves both medical professionals seeking opportunities and healthcare institutions 
                facing staffing challenges.
              </p>
              <p className="text-muted-foreground">
                Today, we're proud to be connecting thousands of healthcare professionals with institutions in over 
                45 countries, making healthcare recruitment smarter, simpler, and truly global.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
