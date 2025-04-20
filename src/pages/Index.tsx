import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from '@/components/MainLayout';
import InstitutionCard from '@/components/InstitutionCard';
import VacancyCard from '@/components/VacancyCard';
import { ArrowRight, Users, Building2, Globe, FileCheck, Clock, HeartPulse, BookOpen, Briefcase, GraduationCap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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

const featuredVacancies = [
  {
    id: '1',
    title: 'Senior Cardiologist',
    institution: 'Berlin Medical Center',
    location: 'Berlin, Germany',
    jobType: 'Full-time',
    description: 'Join our team of expert cardiologists in providing world-class cardiac care.',
    requirements: [
      'Board certification in Cardiology',
      'Minimum 5 years experience',
      'Fluent in German (C1) and English'
    ],
    postedDate: '2025-04-01',
    applicationDeadline: '2025-05-15'
  },
  {
    id: '2',
    title: 'Pediatric Nurse',
    institution: 'Madrid Health Clinic',
    location: 'Madrid, Spain',
    jobType: 'Part-time',
    description: 'Seeking experienced pediatric nurses to join our growing team.',
    requirements: [
      'Registered Nurse certification',
      'Pediatric care experience',
      'Spanish language proficiency'
    ],
    postedDate: '2025-04-10',
    applicationDeadline: '2025-05-20'
  },
  {
    id: '3',
    title: 'Emergency Physician',
    institution: 'Vienna General Hospital',
    location: 'Vienna, Austria',
    jobType: 'Full-time',
    description: 'Join our emergency department team providing critical care services.',
    requirements: [
      'Emergency Medicine certification',
      'Minimum 3 years experience',
      'German language proficiency (B2)'
    ],
    postedDate: '2025-04-05',
    applicationDeadline: '2025-05-25'
  },
  {
    id: '4',
    title: 'Physiotherapist',
    institution: 'Swiss Rehab Center',
    location: 'Zurich, Switzerland',
    jobType: 'Full-time',
    description: 'Experienced physiotherapist needed for our rehabilitation center.',
    requirements: [
      'Physiotherapy license',
      'Sports medicine experience',
      'German and English proficiency'
    ],
    postedDate: '2025-04-08',
    applicationDeadline: '2025-05-30'
  }
];

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
                <Link to="/professionals">Find Job</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/institutions">Find Talents</Link>
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

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <h2 className="text-3xl font-bold">Professionals</h2>
              <div className="flex-1 flex justify-end">
                <Button variant="ghost" asChild className="group">
                  <Link to="/professionals" className="flex items-center">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Connect with talented healthcare professionals ready for their next opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {featuredProfessionals.map((professional) => (
              <Card key={professional.id} className="w-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Users className="h-10 w-10 text-gray-400" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                          {professional.name}
                        </h3>
                        <p className="text-sm text-medical-600">{professional.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="h-4 w-4" />
                          <span className="font-medium">Title</span>
                        </div>
                        <p className="text-sm">{professional.title}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">Languages</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {professional.languages.map((lang, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Experience</span>
                        </div>
                        <p className="text-sm">{professional.experience} years</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <h2 className="text-3xl font-bold">Vacancies</h2>
              <div className="flex-1 flex justify-end">
                <Button variant="ghost" asChild className="group">
                  <Link to="/institutions" className="flex items-center">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Discover exciting opportunities at leading healthcare institutions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {featuredVacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                {...vacancy}
                showSaveOption={false}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Solvia Learning</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Enhance your medical career with specialized German language and FSP courses designed for healthcare professionals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="text-left">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">German Language Courses</h3>
                      <p className="text-muted-foreground">
                        Master medical German with our specialized courses, from basic to advanced levels
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">FSP Preparation</h3>
                      <p className="text-muted-foreground">
                        Comprehensive preparation for your medical license examination in Germany
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="mt-6" asChild>
              <Link to="/learning" className="flex items-center">
                Explore Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
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
              <Card key={blog.id} className="feature-card hover:shadow-lg transition-shadow">
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
