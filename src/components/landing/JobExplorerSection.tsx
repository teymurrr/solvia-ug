import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const JobExplorerSection = () => {
  const { t } = useLanguage();
  const landing = t?.landing;
  const jobExplorer = landing?.jobExplorer;

  const { data: vacancies } = useQuery({
    queryKey: ['landing-vacancies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancies')
        .select('id, title, institution, location, job_type, specialty, profession, salary')
        .order('posted_date', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fallback sample jobs if no DB data
  const jobs = jobExplorer?.jobs;
  const fallbackJobs = [
    { id: '1', title: jobs?.job1?.title || "Internal Medicine Specialist", institution: jobs?.job1?.institution || "University Hospital Berlin", location: jobs?.job1?.location || "Berlin, Germany", job_type: jobs?.job1?.type || "Full-time", specialty: null, profession: null, salary: null },
    { id: '2', title: jobs?.job2?.title || "Pediatric Nurse", institution: jobs?.job2?.institution || "Regional Medical Center", location: jobs?.job2?.location || "Madrid, Spain", job_type: jobs?.job2?.type || "Full-time", specialty: null, profession: null, salary: null },
    { id: '3', title: jobs?.job3?.title || "General Surgeon", institution: jobs?.job3?.institution || "Vienna General Hospital", location: jobs?.job3?.location || "Vienna, Austria", job_type: jobs?.job3?.type || "Full-time", specialty: null, profession: null, salary: null },
    { id: '4', title: jobs?.job4?.title || "Emergency Room Physician", institution: jobs?.job4?.institution || "Lyon University Hospital", location: jobs?.job4?.location || "Lyon, France", job_type: jobs?.job4?.type || "Full-time", specialty: null, profession: null, salary: null },
  ];

  const displayJobs = vacancies && vacancies.length > 0 ? vacancies : fallbackJobs;

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

          {/* Job Cards - matching VacancyCard style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {displayJobs.slice(0, 4).map((job) => (
              <Card key={job.id} className="h-full border hover:border-muted-foreground/30 transition-shadow">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div>
                      <h3 className="text-lg font-semibold line-clamp-2">{job.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Building2 className="mr-1 h-4 w-4" />
                        <span>{job.institution}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.specialty && (
                        <Badge variant="outline" className="bg-muted/50">
                          {job.specialty}
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-muted/50">
                        {t?.vacancies?.jobTypes?.[job.job_type?.toLowerCase()?.replace(/[-\s]/g, '')] || job.job_type}
                      </Badge>
                      {job.salary && (
                        <Badge variant="outline" className="bg-muted/50">
                          {job.salary}
                        </Badge>
                      )}
                      {job.profession && (
                        <Badge variant="outline" className="bg-muted/50">
                          {job.profession}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
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