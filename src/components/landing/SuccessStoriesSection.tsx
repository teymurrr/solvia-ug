import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Quote, MapPin, ArrowRight, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const SuccessStoriesSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const successStories = landing?.successStories;
  
  const defaultStories = [
    {
      name: "María Fernanda",
      country: "Colombia",
      profession: "Pediatrician",
      destination: "Berlin, Germany",
      quote: "Solvia reviewed all my documents and told me exactly what was missing. Without them, I would have wasted months.",
      image: "/lovable-uploads/fb51f001-5b4c-4c12-9bff-ec7776fda396.png"
    },
    {
      name: "Luis Felipe",
      country: "Mexico",
      profession: "Neurologist",
      destination: "Bavaria, Germany",
      quote: "They handled my apostilles and translations. I just had to focus on learning German and preparing for the FSP.",
      image: "/lovable-uploads/cc32bcf9-0674-4d4f-9316-3ce0790f675e.png"
    },
    {
      name: "Diego",
      country: "Chile",
      profession: "Cardiovascular Surgeon",
      destination: "Hamburg, Germany",
      quote: "From document submission to job offer, Solvia was with me every step. Now I work at a top hospital in Hamburg.",
      image: "/lovable-uploads/5f708227-020b-4f86-ae6e-6ad00443ec94.png"
    }
  ];

  const stories = successStories?.stories || defaultStories;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 max-w-3xl mx-auto">
              {successStories?.title || "Thousands of doctors and nurses already recognized their credentials with Solvia"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {successStories?.subtitle || "See how we helped them achieve their dreams"}
            </p>
          </div>

          {/* 3 Static Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story: any, index: number) => (
              <Card key={index} className="p-6 border-border/50 hover:shadow-lg transition-shadow flex flex-col">
                {/* Profile */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <OptimizedImage
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                      useAspectRatio={false}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{story.name}</h3>
                    <p className="text-sm text-primary font-medium">{story.profession}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {story.destination}
                    </p>
                  </div>
                </div>
                
                {/* Quote */}
                <div className="flex-1">
                  <Quote className="h-6 w-6 text-primary/30 mb-2" />
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{story.quote}"
                  </p>
                </div>
                
                {/* CTA Link */}
                <Link 
                  to="/homologation" 
                  className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm group"
                >
                  {successStories?.viewMyPlan || "View my homologation plan"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
