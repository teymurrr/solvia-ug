import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Globe, FileCheck, Clock, Users, Building2, Calendar } from 'lucide-react';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import { featuredProfessionals } from '@/data/landingPageData';

const EmployersLanding = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find, Connect & Hire Global Healthcare Professionals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/professionals">Browse Talents</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Book a Call</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Solvia Section */}
        <section className="py-16 bg-white">
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

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
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
        <ProfessionalsSection professionals={featuredProfessionals} />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
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
