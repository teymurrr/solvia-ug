import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Building2, Clock, Euro, Star, Briefcase } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useProtectedAction } from '@/hooks/useProtectedAction';

interface VacanciesSectionRedesignedProps {
  vacancies: any[];
}

const VacanciesSectionRedesigned: React.FC<VacanciesSectionRedesignedProps> = ({ vacancies }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { handleProtectedAction } = useProtectedAction();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const title = t?.vacancies?.title || "Open Positions";
  const subtitle = t?.vacancies?.subtitle || "Discover exciting opportunities at leading healthcare institutions";
  const viewMore = t?.common?.viewMore || t?.vacancies?.viewMore || "View More";
  
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">{t?.vacancies?.latestOpportunities || "Latest Opportunities"}</span>
            </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Vacancies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
          {vacancies.map((vacancy) => (
            <Card 
              key={vacancy.id}
              className={`group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-500 ${
                hoveredCard === vacancy.id ? 'shadow-2xl scale-[1.02]' : 'shadow-lg hover:shadow-xl'
              }`}
              onMouseEnter={() => setHoveredCard(vacancy.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-8">
                {/* Header with institution */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {t?.vacancies?.jobTitles?.[vacancy.titleKey] || vacancy.title}
                      </h3>
                      <p className="text-primary font-semibold">{vacancy.institution}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>

                {/* Key details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {t?.vacancies?.locations?.[vacancy.locationKey] || vacancy.location}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {t?.vacancies?.jobTypes?.[vacancy.jobType?.toLowerCase()?.replace('-', '')] || vacancy.jobType}
                    </Badge>
                    {vacancy.salary && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {vacancy.salary}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Benefits preview */}
                {vacancy.benefits && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {vacancy.benefits.slice(0, 3).map((benefit: string, index: number) => (
                        <span 
                          key={index}
                          className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/20"
                        >
                          {benefit}
                        </span>
                      ))}
                      {vacancy.benefits.length > 3 && (
                        <span className="text-xs px-3 py-1 bg-muted/50 text-muted-foreground rounded-full">
                          +{vacancy.benefits.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Posted date */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{t?.vacancies?.postedRecently || "Posted recently"}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    onClick={() => handleProtectedAction(() => navigate(`/vacancy/${vacancy.id}`))}
                  >
                    {t?.vacancies?.viewDetails || "View Details"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
                  </Button>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">{t?.vacancies?.readyToFindJob?.title || "Ready to Find Your Dream Job?"}</h3>
              <p className="text-muted-foreground">{t?.vacancies?.readyToFindJob?.subtitle || "Join thousands of healthcare professionals who found their perfect role"}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => handleProtectedAction(() => navigate('/vacancies'))} className="group">
                {t?.vacancies?.readyToFindJob?.browsePosistions || "Browse All Positions"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  {t?.vacancies?.readyToFindJob?.getHelp || "Get Personal Help"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VacanciesSectionRedesigned;