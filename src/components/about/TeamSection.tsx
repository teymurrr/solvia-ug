
import React from 'react';

const TeamSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-lg text-muted-foreground">
            We're a diverse team of healthcare professionals, technologists, and recruitment experts dedicated to transforming 
            healthcare staffing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="/lovable-uploads/50866c4f-dae7-4f12-82b4-78f2002e281a.png" 
                alt="Teymur Mammadov" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="text-xl font-semibold">Teymur Mammadov</h3>
            <p className="text-muted-foreground">Co-Founder</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="/lovable-uploads/6076d717-f7de-4fe6-b318-20bfcd6e2aa6.png" 
                alt="David Rehrl" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="text-xl font-semibold">David Rehrl</h3>
            <p className="text-muted-foreground">Co-Founder</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
