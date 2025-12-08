import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const JobExplorerSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const jobExplorer = landing?.jobExplorer;
  const jobs = jobExplorer?.jobs;
  const comparison = landing?.countryComparison;
  
  // Sample jobs for display - using translations
  const sampleJobs = [
    {
      title: jobs?.job1?.title || "Internal Medicine Specialist",
      institution: jobs?.job1?.institution || "University Hospital Berlin",
      location: jobs?.job1?.location || "Berlin, Germany",
      type: jobs?.job1?.type || "Full-time",
      country: 'germany',
      isReal: true
    },
    {
      title: jobs?.job2?.title || "Pediatric Nurse",
      institution: jobs?.job2?.institution || "Regional Medical Center",
      location: jobs?.job2?.location || "Madrid, Spain",
      type: jobs?.job2?.type || "Full-time",
      country: 'spain',
      isReal: true
    },
    {
      title: jobs?.job3?.title || "General Surgeon",
      institution: jobs?.job3?.institution || "Vienna General Hospital",
      location: jobs?.job3?.location || "Vienna, Austria",
      type: jobs?.job3?.type || "Full-time",
      country: 'austria',
      isReal: false
    },
    {
      title: jobs?.job4?.title || "Emergency Room Physician",
      institution: jobs?.job4?.institution || "Lyon University Hospital",
      location: jobs?.job4?.location || "Lyon, France",
      type: jobs?.job4?.type || "Full-time",
      country: 'france',
      isReal: false
    }
  ];

  const defaultCountryData = {
    germany: { 
      flag: '🇩🇪', 
      name: 'Germany',
      positions: 85,
      price: '€750',
      processDuration: '6–12 months',
      highlight: 'Best salaries'
    },
    austria: { 
      flag: '🇦🇹', 
      name: 'Austria',
      positions: 42,
      price: '€750',
      processDuration: '4–8 months',
      highlight: 'Simplest process'
    },
    spain: { 
      flag: '🇪🇸', 
      name: 'Spain',
      positions: 38,
      price: '€290',
      processDuration: '2–6 months',
      highlight: 'Fast homologation'
    },
    france: { 
      flag: '🇫🇷', 
      name: 'France',
      positions: 25,
      price: '€750',
      processDuration: '4–10 months',
      highlight: 'Great quality of life'
    }
  };

  const countryKeys = ['germany', 'austria', 'spain', 'france'] as const;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {jobExplorer?.title || "Explore Real Opportunities in Europe"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {jobExplorer?.subtitle || "Over 200+ active positions in Germany, Austria, Spain, Italy and France"}
            </p>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {sampleJobs.slice(0, 4).map((job, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge variant={job.isReal ? "default" : "secondary"} className="mb-2">
                      {job.isReal 
                        ? (jobExplorer?.realJob || "Real Position")
                        : (jobExplorer?.sampleJob || "Example Position")
                      }
                    </Badge>
                    {!job.isReal && (
                      <p className="text-xs text-muted-foreground">
                        {jobExplorer?.sampleDisclaimer || "Sample job for illustration"}
                      </p>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                <p className="text-muted-foreground mb-3">{job.institution}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Country Cards with Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {countryKeys.map((key) => {
              const countryTranslations = comparison?.countries?.[key];
              const country = {
                ...defaultCountryData[key],
                name: countryTranslations?.name || jobExplorer?.countries?.[key] || defaultCountryData[key].name,
                price: countryTranslations?.price || defaultCountryData[key].price,
                processDuration: countryTranslations?.processDuration || defaultCountryData[key].processDuration,
                highlight: countryTranslations?.highlight || defaultCountryData[key].highlight
              };
              const isGermany = key === 'germany';
              
              return (
                <Card 
                  key={key} 
                  className={`p-5 text-center hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-primary/30 relative ${isGermany ? 'ring-2 ring-primary/50' : ''}`}
                >
                  {/* Highlight Badge */}
                  <Badge className={`absolute top-3 right-3 text-xs ${isGermany ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                    {country.highlight}
                  </Badge>
                  
                  <div className="text-4xl mb-2 mt-4">{country.flag}</div>
                  <h4 className="font-bold text-lg text-foreground mb-1">{country.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {country.positions} {jobExplorer?.positionsAvailable || "positions available"}
                  </p>
                  
                  {/* Price */}
                  <div className="text-2xl font-bold text-primary mb-1">{country.price}</div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {comparison?.oneTimePayment || "One-time payment"}
                  </p>
                  
                  {/* Duration */}
                  <div className="flex items-center justify-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">{country.processDuration}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button asChild size="lg" className="group">
              <Link to="/homologation-wizard" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2">
                {comparison?.cta || "Get my personalized plan"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              {comparison?.ctaSubtext || "Free assessment • No commitment required"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobExplorerSection;
