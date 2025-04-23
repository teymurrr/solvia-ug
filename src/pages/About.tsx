
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Globe, FileCheck, Clock, HeartPulse, Users, Building2, GraduationCap } from 'lucide-react';

const About = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold">About Solvia</h1>
            <p className="text-xl text-muted-foreground">
              Modernizing healthcare recruitment across borders, connecting talent with opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              We're on a mission to transform how healthcare professionals find work and how hospitals find talent. 
              By removing barriers between qualified professionals and institutions in need, we're building 
              a more efficient, borderless healthcare recruitment ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Globe className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Connections</h3>
                <p className="text-muted-foreground">
                  Breaking down geographic barriers to connect healthcare professionals with opportunities worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FileCheck className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simplified Process</h3>
                <p className="text-muted-foreground">
                  Streamlining document collection, verification, and the entire recruitment workflow.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <HeartPulse className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Better Healthcare</h3>
                <p className="text-muted-foreground">
                  Contributing to stronger healthcare systems by helping institutions find the talent they need.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="hero-gradient w-full h-64 md:h-96 rounded-lg" />
              </div>
              
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="text-muted-foreground">
                  Solvia was born from a simple observation: healthcare recruitment, especially across borders, 
                  is unnecessarily complex, slow, and expensive.
                </p>
                <p className="text-muted-foreground">
                  Founded by a team with backgrounds in healthcare and technology, we saw an opportunity to create 
                  a platform that serves both medical professionals seeking opportunities and healthcare institutions 
                  facing staffing challenges.
                </p>
                <p className="text-muted-foreground">
                  Today, we're proud to be connecting thousands of healthcare professionals with institutions in over 
                  45 countries, making healthcare recruitment smarter, simpler, and truly global.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">
              We're a diverse team of healthcare professionals, technologists, and recruitment experts dedicated to transforming 
              healthcare staffing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team cards would go here - simplified for this example */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Founder & CEO</h3>
              <p className="text-muted-foreground">Healthcare technology expert with 15+ years experience</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Chief Medical Officer</h3>
              <p className="text-muted-foreground">Former Hospital Director with global healthcare experience</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Head of Partnerships</h3>
              <p className="text-muted-foreground">International recruitment specialist with hospital networks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do at Solvia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="bg-medical-100 p-2 h-fit rounded">
                <Users className="h-6 w-6 text-medical-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">People First</h3>
                <p className="text-muted-foreground">
                  We believe that at the heart of healthcare are dedicated professionals. We put their needs and career aspirations first.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-medical-100 p-2 h-fit rounded">
                <Building2 className="h-6 w-6 text-medical-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Institution Success</h3>
                <p className="text-muted-foreground">
                  We're committed to helping healthcare institutions find the right talent to deliver exceptional care.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-medical-100 p-2 h-fit rounded">
                <Globe className="h-6 w-6 text-medical-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Global Perspective</h3>
                <p className="text-muted-foreground">
                  We embrace diversity and believe in creating opportunities across geographic and cultural boundaries.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-medical-100 p-2 h-fit rounded">
                <GraduationCap className="h-6 w-6 text-medical-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  We're always improving our platform and processes to better serve the healthcare community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Join the Solvia Community</h2>
            <p className="text-lg mb-8">
              Whether you're a healthcare professional seeking new opportunities or an institution looking for talent, 
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Create Your Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
                <Link to="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;

