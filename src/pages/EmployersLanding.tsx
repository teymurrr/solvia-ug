import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainLayout from '@/components/MainLayout';
import { Globe, FileCheck, Clock, Users, Building2, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import { featuredProfessionals } from '@/data/landingPageData';
import { Card, CardContent } from "@/components/ui/card";

const EmployersLanding = () => {
  // Sample insights data
  const insights = [
    {
      id: 1,
      title: "Healthcare Recruitment Trends 2025",
      excerpt: "Latest insights on international medical recruitment and what it means for your institution.",
      readTime: "5 min read",
      date: "2025-04-15"
    },
    {
      id: 2,
      title: "Integrating International Medical Staff",
      excerpt: "Best practices for onboarding and integrating international healthcare professionals.",
      readTime: "8 min read",
      date: "2025-04-10"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find, Connect & Hire Global Healthcare Professionals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
              </p>
              <Button size="lg" asChild>
                <Link to="/professionals">Browse Talents</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search</h3>
                <p className="text-gray-600">Use filters to find the exact match you need.</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">Click to view a CV or schedule an interview.</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hire</h3>
                <p className="text-gray-600">We assist with onboarding, relocation, and integration.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Professionals Section */}
        <section className="py-16 bg-gradient-to-tr from-blue-50/50 via-white to-blue-50/50">
          <ProfessionalsSection professionals={featuredProfessionals} />
        </section>

        {/* Why Solvia Section */}
        <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Solvia?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">International Reach, Local Readiness</h3>
                  <p className="text-gray-600">
                    We source skilled professionals from countries like Azerbaijan, Morocco, and beyond – all prepared for the German healthcare system, including Approbation and FSP.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Language-Ready Candidates</h3>
                  <p className="text-gray-600">
                    We ensure every candidate reaches at least B2 level in German and provide extra training to match workplace needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Hassle-Free Documentation</h3>
                  <p className="text-gray-600">
                    From visa paperwork to medical certifications – we guide candidates through every step, so you don't have to.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Faster Hiring, Less Admin</h3>
                  <p className="text-gray-600">
                    Browse profiles, schedule interviews directly via our calendar tool, and access CVs instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insights Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex flex-col items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-3xl font-bold mb-2">Solvia Insights</h2>
                <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
                  Expert analysis and guidance for healthcare recruitment
                </p>
                <Button variant="ghost" asChild className="group mx-auto">
                  <Link to="/insights" className="flex items-center">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <Card key={insight.id} className="border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{insight.readTime}</span>
                      <span>•</span>
                      <span>{new Date(insight.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{insight.title}</h3>
                    <p className="text-muted-foreground mb-4">{insight.excerpt}</p>
                    <Link
                      to={`/insights/${insight.id}`}
                      className="text-primary hover:text-primary/90 font-medium inline-flex items-center group"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary via-primary/95 to-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Still hiring the old way?</h2>
            <p className="text-xl mb-8">Let Solvia AI do the heavy lifting.<br />We bring talent. You focus on care.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup/institution">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default EmployersLanding;
