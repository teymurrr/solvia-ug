import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const JobExplorerSection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const jobExplorer = landing?.jobExplorer;
  const jobs = jobExplorer?.jobs;
  
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

  const countryCards = [
    { 
      key: 'germany', 
      flag: '🇩🇪', 
      name: jobExplorer?.countries?.germany || 'Germany',
      positions: 85 
    },
    { 
      key: 'austria', 
      flag: '🇦🇹', 
      name: jobExplorer?.countries?.austria || 'Austria',
      positions: 42 
    },
    { 
      key: 'spain', 
      flag: '🇪🇸', 
      name: jobExplorer?.countries?.spain || 'Spain',
      positions: 38 
    },
    { 
      key: 'france', 
      flag: '🇫🇷', 
      name: jobExplorer?.countries?.france || 'France',
      positions: 25 
    },
    { 
      key: 'italy', 
      flag: '🇮🇹', 
      name: jobExplorer?.countries?.italy || 'Italy',
      positions: 18 
    }
  ];

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

          {/* Country Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {countryCards.map((country) => (
              <Card 
                key={country.key} 
                className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer border-border/50 hover:border-primary/30"
              >
                <div className="text-3xl mb-2">{country.flag}</div>
                <h4 className="font-semibold text-foreground">{country.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {country.positions} {jobExplorer?.positionsAvailable || "positions available"}
                </p>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Button asChild size="lg" className="group">
              <Link to="/signup/professional" className="flex items-center gap-2">
                {jobExplorer?.viewOffersForProfile || "View offers for my profile"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobExplorerSection;
