import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { countries, testimonialsByCountry } from '@/data/learningData';

const CountryTestimonials: React.FC = () => {
  const { t, currentLanguage: language } = useLanguage();
  const [activeTab, setActiveTab] = useState('germany');

  const getTestimonialsForCountry = (countryId: string) => {
    return testimonialsByCountry.filter(t => t.targetCountry === countryId);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t?.learning?.testimonials?.title || 'Success Stories by Country'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t?.learning?.testimonials?.subtitle || 'Real experiences from healthcare professionals who achieved their goals'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-5 mb-8">
            {countries.map((country) => (
              <TabsTrigger 
                key={country.id} 
                value={country.id}
                className="text-sm md:text-base"
              >
                <span className="mr-1">{country.flag}</span>
                <span className="hidden sm:inline">
                  {country.name[language] || country.name.en}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {countries.map((country) => (
            <TabsContent key={country.id} value={country.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getTestimonialsForCountry(country.id).map((testimonial, index) => (
                  <Card key={index} className="bg-background hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.profession[language] || testimonial.profession.en}
                          </p>
                          <p className="text-sm text-primary font-medium">
                            {testimonial.country}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-primary/20" />
                        <p className="text-muted-foreground leading-relaxed pl-6 italic">
                          "{testimonial.quote[language] || testimonial.quote.en}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {getTestimonialsForCountry(country.id).length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    {t?.learning?.testimonials?.noTestimonials || 'More success stories coming soon!'}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default CountryTestimonials;
