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
      isReal: true
    },
    {
      title: jobs?.job4?.title || "Emergency Room Physician",
      institution: jobs?.job4?.institution || "Lyon University Hospital",
      location: jobs?.job4?.location || "Lyon, France",
      type: jobs?.job4?.type || "Full-time",
      country: 'france',
      isReal: true
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {jobExplorer?.title || "200+ positions waiting for qualified professionals"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {jobExplorer?.subtitle || "Real hospitals and clinics across 4 countries are hiring now."}
            </p>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
            {sampleJobs.slice(0, 4).map((job, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="default" className="mb-2">
                    {job.type}
                  </Badge>
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

          {/* CTA */}
          <div className="flex justify-center">
            <Button asChild size="lg" className="group">
              <Link to="/vacancies" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2">
                {jobExplorer?.viewOffersForProfile || "See all open positions"}
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
