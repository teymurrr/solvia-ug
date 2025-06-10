import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, BookOpen, MessageCircle, Users, Target, Award, Play, Video, Quote } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SolviaLearning = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    email: '',
    profession: '',
    germanLanguage: false,
    fspPreparation: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.country || !formData.email || !formData.profession) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.germanLanguage && !formData.fspPreparation) {
      toast.error('Please select at least one area of interest');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting form:', formData);
      
      const { data, error } = await supabase.functions.invoke('submit-learning-form', {
        body: formData
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to submit form');
      }

      console.log('Form submitted successfully:', data);
      
      setIsSubmitted(true);
      toast.success('Thank you! Your form has been submitted successfully. Check your email for confirmation.');
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('signup-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fixed testimonials data with proper structure
  const testimonials = [
    {
      name: "Dr. Sofia Ramirez",
      profession: "General Practitioner",
      country: "Colombia",
      quote: "I was worried about learning German while working full time, but Solvia made it so manageable. The medical focus helped me feel confident speaking with patients. The TELC preparation was exactly what I needed.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Dr. Luis Herrera",
      profession: "Internal Medicine Resident",
      country: "Mexico",
      quote: "The FSP mentoring was a game changer. I passed my exam on the first try! They gave me real cases to practice with and very honest feedback. I felt like I was learning with friends.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Dr. Camila Torres",
      profession: "Pediatrician",
      country: "Argentina",
      quote: "What I liked most was the flexibility. I could join live classes or watch them later. Plus, the one-on-one coaching gave me the confidence to present findings in German like a native doctor.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Advance Your Medical Career with <span className="text-primary">Solvia Learning</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {t?.learning?.hero?.subtitle || 'Specialized German Language and FSP Preparation Courses for International Doctors'}
            </p>
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
            >
              {t?.learning?.hero?.cta || 'Sign Up for Free Consultation'}
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY5ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      </section>

      {/* German Language Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {t?.learning?.germanCourses?.title || 'German Language Courses'}
                </h2>
                <h3 className="text-xl text-primary font-semibold mb-6">
                  {t?.learning?.germanCourses?.subtitle || 'Learn German the Smart Way—From Basic to Medical Proficiency'}
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t?.learning?.germanCourses?.description || 'Our German courses are built for busy healthcare professionals. With real medical context, expert instruction, and flexible formats, we\'ll help you speak confidently in hospitals, exams, and beyond.'}
                </p>
                <Button 
                  size="lg" 
                  onClick={scrollToForm}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
                >
                  {t?.learning?.germanCourses?.cta || 'Explore More'}
                </Button>
              </div>
              <div>
                <div className="space-y-4">
                  {(t?.learning?.germanCourses?.features || [
                    "From A1 to C1 – General & Medical German",
                    "Live Online Classes + Self-Paced Options",
                    "TELC B2-C1 Medizin Exam Preparation",
                    "Realistic Medical Dialogues & Patient Scenarios",
                    "Progress Tracking & AI-Powered Feedback"
                  ]).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex items-center space-x-3">
                        {[BookOpen, Clock, Award, MessageCircle, Target][index] && (
                          React.createElement([BookOpen, Clock, Award, MessageCircle, Target][index], {
                            className: "w-5 h-5 text-primary flex-shrink-0"
                          })
                        )}
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FSP Preparation Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="grid grid-cols-1 gap-4">
                  {(t?.learning?.fspCourses?.steps || [
                    { title: "Anamnesis Training", description: "Master patient history taking" },
                    { title: "Findings Discussion", description: "Present and discuss medical findings" },
                    { title: "Doctor Dialogue", description: "Professional medical communication" }
                  ]).map((step, index) => (
                    <Card key={index} className="bg-gradient-to-r from-primary/10 to-blue-50 border-none shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {t?.learning?.fspCourses?.title || 'FSP Preparation Courses'}
                </h2>
                <h3 className="text-xl text-primary font-semibold mb-6">
                  {t?.learning?.fspCourses?.subtitle || 'Master the Fachsprachprüfung with Confidence'}
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t?.learning?.fspCourses?.description || 'The FSP is a critical step toward practicing in Germany. Our course gives you structure, practice, and expert guidance to succeed on your first attempt.'}
                </p>
                <div className="space-y-4 mb-8">
                  {(t?.learning?.fspCourses?.features || [
                    "Full FSP Curriculum (Anamnesis, Findings, Doctor Dialogue)",
                    "One-on-One Mentoring with FSP Coaches",
                    "Real Case-Based Simulations",
                    "Exam Simulators & Mock Tests",
                    "Feedback from Medical Professionals"
                  ]).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex items-center space-x-3">
                        {[Target, Users, MessageCircle, Award, Check][index] && (
                          React.createElement([Target, Users, MessageCircle, Award, Check][index], {
                            className: "w-5 h-5 text-primary flex-shrink-0"
                          })
                        )}
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  size="lg" 
                  onClick={scrollToForm}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
                >
                  {t?.learning?.fspCourses?.cta || 'Explore More'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.learning?.testimonials?.title || 'What Our Learners Say'}
              </h2>
              <p className="text-xl text-gray-600">
                Real success stories from doctors who transformed their careers with Solvia Learning
              </p>
            </div>
            
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.profession}</p>
                        <p className="text-sm text-primary font-medium">{testimonial.country}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-1 w-6 h-6 text-primary/20" />
                      <p className="text-gray-700 leading-relaxed pl-6 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Mobile Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="flex-shrink-0 w-80 bg-white shadow-lg border border-gray-200 snap-start">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.profession}</p>
                          <p className="text-sm text-primary font-medium">{testimonial.country}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-1 w-6 h-6 text-primary/20" />
                        <p className="text-gray-700 leading-relaxed pl-6 italic">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign-Up Form Section */}
      <section id="signup-form" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-none">
              <CardContent className="p-8">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Fill the form for a <span className="text-primary">Free Consultancy</span>
                      </h2>
                      <p className="text-gray-600">
                        {t?.learning?.signupForm?.subtitle || 'Be the first to know when our courses launch and get exclusive early access.'}
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                          {t?.learning?.signupForm?.fields?.fullName || 'Full Name'}
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="mt-1"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                          {t?.learning?.signupForm?.fields?.country || 'Country of Residence'}
                        </Label>
                        <Input
                          id="country"
                          type="text"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="mt-1"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          {t?.learning?.signupForm?.fields?.email || 'Email Address'}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profession" className="text-sm font-medium text-gray-700">
                          {t?.learning?.signupForm?.fields?.profession || 'Your Profession'}
                        </Label>
                        <Input
                          id="profession"
                          type="text"
                          value={formData.profession}
                          onChange={(e) => handleInputChange('profession', e.target.value)}
                          className="mt-1"
                          placeholder={t?.learning?.signupForm?.fields?.professionPlaceholder || 'e.g., Doctor, Nurse, Medical Student'}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">
                          {t?.learning?.signupForm?.interests?.title || 'What are you interested in?'}
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="germanLanguage"
                              checked={formData.germanLanguage}
                              onCheckedChange={(checked) => handleInputChange('germanLanguage', checked)}
                              disabled={isSubmitting}
                            />
                            <Label htmlFor="germanLanguage" className="text-sm text-gray-700">
                              {t?.learning?.signupForm?.interests?.germanLanguage || 'German Language Courses'}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fspPreparation"
                              checked={formData.fspPreparation}
                              onCheckedChange={(checked) => handleInputChange('fspPreparation', checked)}
                              disabled={isSubmitting}
                            />
                            <Label htmlFor="fspPreparation" className="text-sm text-gray-700">
                              {t?.learning?.signupForm?.interests?.fspPreparation || 'FSP Preparation'}
                            </Label>
                          </div>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : (t?.learning?.signupForm?.submit || 'Submit')}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t?.learning?.signupForm?.success?.title || 'Thank You!'}
                    </h3>
                    <p className="text-gray-600">
                      {t?.learning?.signupForm?.success?.message || 'Your form has been submitted successfully.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SolviaLearning;

</edits_to_apply>
