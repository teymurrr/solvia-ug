import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Building2, ArrowRight, Banknote } from 'lucide-react';
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
        .select('id, title, institution, location, country, salary')
        .order('posted_date', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const getCountryName = (country: string | null) => {
    if (!country) return '';
    return t?.vacancies?.countries?.[country.toLowerCase() as keyof typeof t.vacancies.countries] || country;
  };

  const displayJobs = vacancies && vacancies.length > 0 ? vacancies : [];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {displayJobs.slice(0, 4).map((job) => (
              <Card
                key={job.id}
                className="group p-6 border border-border/60 bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-foreground leading-snug mb-3">
                  {job.title}
                </h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0 text-primary/60" />
                    <span>{job.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary/60" />
                    <span>{getCountryName(job.country)}</span>
                  </div>
                </div>

                {job.salary && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    <Banknote className="h-3.5 w-3.5" />
                    {job.salary}
                  </div>
                )}
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