
import React from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const SuccessStoriesSection = () => {
  const { t } = useLanguage();

  const getStories = () => {
    if (t?.forDoctors?.successStories?.stories) {
      return t.forDoctors.successStories.stories;
    }
    
    // Fallback to English
    return [
      {
        name: "María Fernanda",
        country: "Colombia",
        specialty: "Pediatrician in Berlin",
        quote: "I didn't even know where to start, but Solvia guided me step by step.",
        story: "María Fernanda, a pediatrician from Medellín, dreamed of working in Europe but felt overwhelmed by the process. Through Solvia, she learned exactly which documents were needed, how to get her degree recognized, and where to enroll in German courses. Thanks to FSP exam prep and interview coaching, she received a job offer at a pediatric clinic in Berlin. Today, she works in a modern hospital, lives with her husband, and is starting family reunification.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Luis Felipe",
        country: "Mexico",
        specialty: "Neurologist in Bavaria",
        quote: "Thanks to Solvia, I got a job offer before I even arrived in Germany.",
        story: "Luis Felipe had years of experience as a neurologist in Monterrey and was seeking a more tech-driven work environment. Solvia helped him translate his documents, find an employer who valued his specialty, and arrange his visa from Mexico. He also joined intensive medical German classes and a WhatsApp group with fellow Latin doctors. Today, he works at a university hospital in Bavaria and is already involved in research projects.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Camila",
        country: "Argentina",
        specialty: "General Practitioner in North Rhine",
        quote: "Without Solvia, I wouldn't have passed the medical German exam.",
        story: "Camila was working as a GP in Córdoba but had always dreamed of moving to Europe. After months of confusion and no clear answers, she found Solvia—and everything changed. She received personalized advice, a step-by-step recognition plan, and specific lessons to pass the FSP exam. She succeeded on her first try and now treats patients at a health center in Düsseldorf.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Diego",
        country: "Chile",
        specialty: "Cardiovascular Surgeon in Hamburg",
        quote: "Solvia helped me not just find a job, but also settle in with my family.",
        story: "Diego, a cardiovascular surgeon from Santiago, had an established career but was looking for new challenges. With Solvia, he got his degree recognized, passed the FSP exam, and received an offer from a hospital in Hamburg. The team also supported him with housing search, city registration, and enrolling his children in school. Today, Diego works at one of Germany's top surgical centers, and his family is fully integrated.",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
      }
    ];
  };

  const stories = getStories();

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t?.forDoctors?.successStories?.title || "Real Success Stories"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.forDoctors?.successStories?.subtitle || "Meet doctors who transformed their careers with Solvia and are now thriving in Germany"}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {stories.map((story: any, index: number) => (
              <div 
                key={index} 
                className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="relative">
                      <OptimizedImage
                        src={story.image}
                        alt={`${story.name} - Success Story`}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                        useAspectRatio={false}
                      />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {story.name}
                      </h3>
                      <p className="text-primary font-semibold mb-1">
                        {story.specialty}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t?.forDoctors?.successStories?.originallyFrom || "Originally from"} {story.country}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Quote className="h-8 w-8 text-primary/30 mb-3" />
                    <blockquote className="text-lg font-medium text-foreground italic leading-relaxed">
                      "{story.quote}"
                    </blockquote>
                  </div>

                  <div className="relative">
                    <p className="text-muted-foreground leading-relaxed">
                      {story.story}
                    </p>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>

          {/* Call to action button */}
          <div className="text-center mt-16">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/signup/professional" className="flex items-center gap-3">
                {t?.forDoctors?.successStories?.ctaText || "Join thousands of doctors who chose Solvia"}
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                    +
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
