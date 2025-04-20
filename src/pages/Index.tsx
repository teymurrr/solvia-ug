
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from '@/components/MainLayout';
import { Users, Building2, Globe } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Global Healthcare Recruitment, <span className="text-gradient">Simplified</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Connecting qualified medical professionals with hospitals and clinics in need of talent worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link to="/signup/professional">Find Job</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup/institution">Find Talents</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{icon: Users, title: '5,000+', description: 'Healthcare Professionals'}, {icon: Building2, title: '1,200+', description: 'Healthcare Institutions'}, {icon: Globe, title: '45+', description: 'Countries Worldwide'}].map((item, i) => (
              <Card key={i} className="feature-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <item.icon className="h-12 w-12 text-medical-600 mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Healthcare Recruitment?</h2>
            <p className="text-lg mb-8">
              Join thousands of healthcare professionals and institutions already using MedConnect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Create Your Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
                <Link to="/about">Talk to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
