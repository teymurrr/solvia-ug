import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from '@/components/MainLayout';
import ProfessionalCard from '@/components/ProfessionalCard';
import InstitutionCard from '@/components/InstitutionCard';
import { ArrowRight, Users, Building2, Globe, FileCheck, Clock, HeartPulse, BookOpen } from 'lucide-react';

const Index = () => {
  const featuredProfessionals = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Cardiologist',
      location: 'Berlin, Germany',
      specialty: 'Cardiology',
      languages: ['English', 'German'],
      experience: 8,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Neurologist',
      location: 'Barcelona, Spain',
      specialty: 'Neurology',
      languages: ['English', 'Spanish', 'Mandarin'],
      experience: 5,
    },
  ];

  const featuredInstitutions = [
    {
      id: '1',
      name: 'Berlin Medical Center',
      type: 'Hospital',
      location: 'Berlin, Germany',
      openPositions: 12,
    },
    {
      id: '2',
      name: 'Madrid Health Clinic',
      type: 'Specialty Clinic',
      location: 'Madrid, Spain',
      openPositions: 5,
    },
  ];

  const featuredBlogs = [
    {
      id: '1',
      title: 'The Future of Healthcare Recruitment',
      excerpt: 'Discover how AI and technology are transforming medical staffing.',
      date: '2025-04-15',
      readTime: '5 min read',
    },
    {
      id: '2',
      title: 'Working Abroad in Healthcare',
      excerpt: 'Essential tips for medical professionals considering international careers.',
      date: '2025-04-12',
      readTime: '4 min read',
    }
  ];

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
                <Link to="/professionals">Find Opportunities</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/institutions">Post Positions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-medical-600 mb-4" />
                <h3 className="text-3xl font-bold mb-2">5,000+</h3>
                <p className="text-muted-foreground">Healthcare Professionals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Building2 className="h-12 w-12 text-medical-600 mb-4" />
                <h3 className="text-3xl font-bold mb-2">1,200+</h3>
                <p className="text-muted-foreground">Healthcare Institutions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Globe className="h-12 w-12 text-medical-600 mb-4" />
                <h3 className="text-3xl font-bold mb-2">45+</h3>
                <p className="text-muted-foreground">Countries Worldwide</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              A seamless process to connect healthcare professionals with institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FileCheck className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Showcase your qualifications, experience, and preferences to stand out.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Globally</h3>
              <p className="text-muted-foreground">
                Discover opportunities across borders and communicate directly.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HeartPulse className="h-8 w-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advance Your Career</h3>
              <p className="text-muted-foreground">
                Find the perfect match and let us help with the transition process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Healthcare Professionals</h2>
            <Button variant="ghost" asChild className="group">
              <Link to="/professionals" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                {...professional}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Healthcare Institutions</h2>
            <Button variant="ghost" asChild className="group">
              <Link to="/institutions" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredInstitutions.map((institution) => (
              <InstitutionCard
                key={institution.id}
                {...institution}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Latest from Our Blog</h2>
            <Button variant="ghost" asChild className="group">
              <Link to="/blog" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime}</span>
                    <span>•</span>
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-medical-600 hover:text-medical-700 font-medium inline-flex items-center group"
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
                <Link to="/contact">Talk to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
