
import React from 'react';

const SuccessStoriesSection = () => {
  const stories = [
    {
      name: "María Fernanda",
      country: "Colombia",
      specialty: "Pediatrician in Berlin",
      quote: "I didn't even know where to start, but Solvia guided me step by step.",
      story: "María Fernanda, a pediatrician from Medellín, dreamed of working in Europe but felt overwhelmed by the process. Through Solvia, she learned exactly which documents were needed, how to get her degree recognized, and where to enroll in German courses. Thanks to FSP exam prep and interview coaching, she received a job offer at a pediatric clinic in Berlin. Today, she works in a modern hospital, lives with her husband, and is starting family reunification."
    },
    {
      name: "Luis Felipe",
      country: "Mexico",
      specialty: "Neurologist in Bavaria",
      quote: "Thanks to Solvia, I got a job offer before I even arrived in Germany.",
      story: "Luis Felipe had years of experience as a neurologist in Monterrey and was seeking a more tech-driven work environment. Solvia helped him translate his documents, find an employer who valued his specialty, and arrange his visa from Mexico. He also joined intensive medical German classes and a WhatsApp group with fellow Latin doctors. Today, he works at a university hospital in Bavaria and is already involved in research projects."
    },
    {
      name: "Camila",
      country: "Argentina",
      specialty: "General Practitioner in North Rhine",
      quote: "Without Solvia, I wouldn't have passed the medical German exam.",
      story: "Camila was working as a GP in Córdoba but had always dreamed of moving to Europe. After months of confusion and no clear answers, she found Solvia—and everything changed. She received personalized advice, a step-by-step recognition plan, and specific lessons to pass the FSP exam. She succeeded on her first try and now treats patients at a health center in Düsseldorf."
    },
    {
      name: "Diego",
      country: "Chile",
      specialty: "Cardiovascular Surgeon in Hamburg",
      quote: "Solvia helped me not just find a job, but also settle in with my family.",
      story: "Diego, a cardiovascular surgeon from Santiago, had an established career but was looking for new challenges. With Solvia, he got his degree recognized, passed the FSP exam, and received an offer from a hospital in Hamburg. The team also supported him with housing search, city registration, and enrolling his children in school. Today, Diego works at one of Germany's top surgical centers, and his family is fully integrated."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Success stories from the Solvia community
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-primary mb-1">
                    {story.name} ({story.country}) – {story.specialty}
                  </h3>
                  <blockquote className="text-lg italic text-muted-foreground mb-4">
                    "{story.quote}"
                  </blockquote>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {story.story}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
