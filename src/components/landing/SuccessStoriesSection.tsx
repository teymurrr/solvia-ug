import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Quote, MapPin, ArrowRight, Users, Calendar, Clock, Building } from 'lucide-react';
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
      quote: "I was completely lost with the homologation until I spoke with Solvia. They explained everything step by step and I finally felt like I was making progress.",
      image: "/lovable-uploads/fb51f001-5b4c-4c12-9bff-ec7776fda396.png",
      details: {
        startDate: "January 2024",
        timeToHomologation: "9 months",
        hiredAt: "Charité Hospital Berlin"
      }
    },
    {
      name: "Luis Felipe",
      country: "Mexico",
      profession: "Neurologist",
      destination: "Bavaria, Germany",
      quote: "They handled my apostilles and translations. I only had to focus on learning German and preparing for the FSP.",
      image: "/lovable-uploads/cc32bcf9-0674-4d4f-9316-3ce0790f675e.png",
      details: {
        startDate: "March 2024",
        timeToHomologation: "7 months",
        hiredAt: "Munich University Hospital"
      }
    },
    {
      name: "Ana Lucía",
      country: "Peru",
      profession: "Nurse",
      destination: "Hamburg, Germany",
      quote: "As a nurse, I thought the process would be harder. Solvia reviewed every document and explained exactly what was wrong or missing.",
      image: "/lovable-uploads/ana-lucia-photo.png",
      details: {
        startDate: "February 2024",
        timeToHomologation: "5 months",
        hiredAt: "Hamburg University Clinic"
      }
    }
  ];

  const stories = successStories?.stories || defaultStories;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {successStories?.badge || "Success Stories"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 max-w-3xl mx-auto">
              {successStories?.title || "Professionals who trusted Solvia"}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {successStories?.subtitle || "Here are some of the professionals who transformed their careers with us"}
            </p>
            
            {/* Micro CTA above cards */}
            <Link 
              to="/homologation" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium group"
            >
              <span>{successStories?.microCta || "Want to be next?"}</span>
              <span className="underline">{successStories?.microCtaLink || "Get your free homologation plan"}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
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

                {/* Credibility Details (only for stories with details) */}
                {story.details && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span>{story.details.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{story.details.timeToHomologation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building className="h-3 w-3 text-primary" />
                      <span>{story.details.hiredAt}</span>
                    </div>
                  </div>
                )}
                
                {/* CTA Link */}
                <Link 
                  to="/homologation" 
                  className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm group"
                >
                  {successStories?.ctaText || "View my homologation plan"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            ))}
          </div>

          {/* Social Proof */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              ✔ {successStories?.socialProof || "We have already helped doctors and nurses from 12 countries start their homologation"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
