
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, BookOpen, MessageCircle, Users, Target, Award, Play, Video } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { OptimizedImage } from '@/components/ui/optimized-image';

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('signup-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Advance Your Medical Career with{' '}
              <span className="text-primary">Solvia Learning</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Specialized German Language and FSP Preparation Courses for International Doctors
            </p>
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
            >
              Sign Up for Free Consultation
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
                  German Language Courses
                </h2>
                <h3 className="text-xl text-primary font-semibold mb-6">
                  Learn German the Smart Way—From Basic to Medical Proficiency
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our German courses are built for busy healthcare professionals. With real medical context, 
                  expert instruction, and flexible formats, we'll help you speak confidently in hospitals, 
                  exams, and beyond.
                </p>
              </div>
              <div>
                <div className="space-y-4">
                  {[
                    { icon: BookOpen, title: "From A1 to C1 – General & Medical German" },
                    { icon: Clock, title: "Live Online Classes + Self-Paced Options" },
                    { icon: Award, title: "TELC B2-C1 Medizin Exam Preparation" },
                    { icon: MessageCircle, title: "Realistic Medical Dialogues & Patient Scenarios" },
                    { icon: Target, title: "Progress Tracking & AI-Powered Feedback" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <feature.icon className="w-5 h-5 text-primary" />
                        <span className="text-gray-700 font-medium">{feature.title}</span>
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
                <OptimizedImage
                  src="/lovable-uploads/431c73d2-5785-4d33-8f35-d11742c829e0.png"
                  alt="FSP exam simulation environment"
                  className="rounded-lg shadow-lg mb-8"
                  aspectRatio={16/10}
                />
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-gradient-to-r from-primary/10 to-blue-50 border-none shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">1</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Anamnesis Training</h4>
                          <p className="text-sm text-gray-600">Master patient history taking</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-blue-50 to-primary/10 border-none shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">2</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Findings Discussion</h4>
                          <p className="text-sm text-gray-600">Present and discuss medical findings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-primary/10 to-blue-50 border-none shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">3</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Doctor Dialogue</h4>
                          <p className="text-sm text-gray-600">Professional medical communication</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  FSP Preparation Courses
                </h2>
                <h3 className="text-xl text-primary font-semibold mb-6">
                  Master the Fachsprachprüfung with Confidence
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  The FSP is a critical step toward practicing in Germany. Our course gives you structure, 
                  practice, and expert guidance to succeed on your first attempt.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Target, title: "Full FSP Curriculum (Anamnesis, Findings, Doctor Dialogue)" },
                    { icon: Users, title: "One-on-One Mentoring with FSP Coaches" },
                    { icon: MessageCircle, title: "Real Case-Based Simulations" },
                    { icon: Award, title: "Exam Simulators & Mock Tests" },
                    { icon: Check, title: "Feedback from Medical Professionals" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <feature.icon className="w-5 h-5 text-primary" />
                        <span className="text-gray-700 font-medium">{feature.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                        Fill the form for a <span className="text-blue-900">free consultancy</span>
                      </h2>
                      <p className="text-gray-600">
                        Be the first to know when our courses launch and get exclusive early access.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                          Country of Residence
                        </Label>
                        <Input
                          id="country"
                          type="text"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="profession" className="text-sm font-medium text-gray-700">
                          Your Profession
                        </Label>
                        <Input
                          id="profession"
                          type="text"
                          value={formData.profession}
                          onChange={(e) => handleInputChange('profession', e.target.value)}
                          className="mt-1"
                          placeholder="e.g., Doctor, Nurse, Medical Student"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">
                          What are you interested in?
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="germanLanguage"
                              checked={formData.germanLanguage}
                              onCheckedChange={(checked) => handleInputChange('germanLanguage', checked)}
                            />
                            <Label htmlFor="germanLanguage" className="text-sm text-gray-700">
                              German Language Courses
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fspPreparation"
                              checked={formData.fspPreparation}
                              onCheckedChange={(checked) => handleInputChange('fspPreparation', checked)}
                            />
                            <Label htmlFor="fspPreparation" className="text-sm text-gray-700">
                              FSP Preparation
                            </Label>
                          </div>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                        Submit
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600">Your form has been submitted successfully.</p>
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
