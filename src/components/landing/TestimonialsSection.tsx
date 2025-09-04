import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Quote, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const TestimonialsSection = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const getStories = () => {
    if (t?.forDoctors?.successStories?.stories) {
      return t.forDoctors.successStories.stories;
    }
    
    // Fallback to English with updated images
    return [
      {
        name: "María Fernanda",
        country: "Colombia",
        specialty: "Pediatrician in Berlin",
        quote: "I didn't even know where to start, but Solvia guided me step by step.",
        image: "/lovable-uploads/fb51f001-5b4c-4c12-9bff-ec7776fda396.png"
      },
      {
        name: "Luis Felipe",
        country: "Mexico",
        specialty: "Neurologist in Bavaria",
        quote: "Thanks to Solvia, I got a job offer before I even arrived in Germany.",
        image: "/lovable-uploads/cc32bcf9-0674-4d4f-9316-3ce0790f675e.png"
      },
      {
        name: "Camila",
        country: "Argentina",
        specialty: "General Practitioner in North Rhine",
        quote: "Without Solvia, I wouldn't have passed the medical German exam.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Diego",
        country: "Chile",
        specialty: "Cardiovascular Surgeon in Hamburg",
        quote: "Solvia helped me not just find a job, but also settle in with my family.",
        image: "/lovable-uploads/5f708227-020b-4f86-ae6e-6ad00443ec94.png"
      }
    ];
  };

  const stories = getStories();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, stories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stories.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t?.forDoctors?.successStories?.title || "Real Success Stories"}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t?.forDoctors?.successStories?.subtitle || "Meet doctors who transformed their careers with Solvia and are now thriving in Germany"}
            </p>
          </div>
          
          {/* Carousel Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Main Carousel */}
            <div className="relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {stories.map((story: any, index: number) => (
                  <div key={index} className="w-full flex-shrink-0 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
                      {/* Image Section */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
                            <OptimizedImage
                              src={story.image}
                              alt={`${story.name} - Success Story`}
                              className="w-full h-full object-cover"
                              useAspectRatio={false}
                            />
                          </div>
                          {/* Success indicator */}
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-5 h-5 bg-white rounded-full"></div>
                          </div>
                          {/* Floating elements */}
                          <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                          <div className="absolute top-6 -right-6 w-6 h-6 bg-secondary/30 rounded-full animate-pulse delay-500"></div>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="mb-6">
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                            {story.name}
                          </h3>
                          <p className="text-primary font-semibold text-lg mb-2">
                            {story.specialty}
                          </p>
                          <p className="text-muted-foreground text-base">
                            {t?.forDoctors?.successStories?.originallyFrom || "Originally from"} {story.country}
                          </p>
                        </div>

                        <div className="relative">
                          <Quote className="h-10 w-10 text-primary/30 mb-4 mx-auto md:mx-0" />
                          <blockquote className="text-xl md:text-2xl font-medium text-foreground italic leading-relaxed">
                            "{story.quote}"
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-border/50 hover:bg-card hover:scale-110 transition-all duration-200 z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-border/50 hover:bg-card hover:scale-110 transition-all duration-200 z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-10 gap-4">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary scale-125 shadow-lg' 
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center gap-6 p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Join Their Success</h3>
                <p className="text-muted-foreground">Thousands of healthcare professionals chose Solvia to transform their careers</p>
              </div>
              <Button asChild size="lg" className="text-lg px-8 py-4 group">
                <Link to="/signup/professional" className="flex items-center gap-3">
                  {t?.forDoctors?.successStories?.ctaText || "Start Your Journey"}
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white animate-pulse delay-100"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white animate-pulse delay-200"></div>
                    <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                      +
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;