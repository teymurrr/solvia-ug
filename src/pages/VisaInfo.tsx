import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Globe, GraduationCap, Briefcase, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const VisaInfo = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chancenkarte');

  const visaTypes = [
    {
      id: 'chancenkarte',
      icon: Globe,
      color: 'from-accent/20 to-accent/5',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent'
    },
    {
      id: 'workVisa',
      icon: Briefcase,
      color: 'from-accent/20 to-accent/5',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent'
    },
    {
      id: 'internshipVisa',
      icon: GraduationCap,
      color: 'from-secondary/20 to-secondary/5',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary'
    },
    {
      id: 'languageVisa',
      icon: BookOpen,
      color: 'from-accent/20 to-accent/5',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent'
    },
    {
      id: 'studentVisa',
      icon: Users,
      color: 'from-accent/20 to-accent/5',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent'
    }
  ];

  const seoData = (t as any)?.seo?.visaInfo;

  return (
    <MainLayout>
      <SEO
        title={seoData?.title || 'Work Visa Guide for Doctors in Europe – Blue Card & Chancenkarte'}
        description={seoData?.description || 'Complete guide to work visas for medical professionals in Germany and Europe.'}
        path="/visa-info"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              {t.visa.description}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              {t.visa.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t.visa.subtitle}
            </p>
          </div>
        </section>

        {/* Visa Options Tabs */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-4 h-auto bg-transparent p-0 mb-12">
                {visaTypes.map((visa) => {
                  const Icon = visa.icon;
                  const visaData = t.visa[visa.id as keyof typeof t.visa] as any;
                  // Extract short title (remove parentheses content)
                  const shortTitle = visaData.title.split('(')[0].trim();
                  
                  return (
                    <TabsTrigger
                      key={visa.id}
                      value={visa.id}
                      className="flex flex-col items-center gap-4 py-6 px-4 data-[state=active]:bg-card data-[state=active]:shadow-2xl data-[state=active]:border-2 data-[state=active]:border-primary/20 bg-card/50 backdrop-blur-sm border border-border/50 transition-all min-h-[140px] rounded-2xl hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div className={`p-4 rounded-2xl ${visa.iconBg} shrink-0`}>
                        <Icon className={`h-7 w-7 ${visa.iconColor}`} />
                      </div>
                      <span className="text-sm lg:text-base font-semibold text-center leading-snug w-full">
                        {shortTitle}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {visaTypes.map((visa) => {
                const Icon = visa.icon;
                const visaData = t.visa[visa.id as keyof typeof t.visa] as any;
                
                return (
                  <TabsContent key={visa.id} value={visa.id} className="mt-0">
                    <Card className={`border-2 bg-gradient-to-br ${visa.color} backdrop-blur-sm overflow-hidden`}>
                      <CardHeader className="pb-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-4 rounded-2xl ${visa.iconBg} ${visa.iconColor}`}>
                            <Icon className="h-10 w-10" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-3xl mb-3 text-foreground">
                              {visaData.title}
                            </CardTitle>
                            <CardDescription className="text-lg text-muted-foreground">
                              {visaData.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="grid md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                        {/* Requirements */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold">✓</span>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                              {visaData.requirements.title}
                            </h3>
                          </div>
                          <ul className="space-y-3">
                            {visaData.requirements.items.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3 group">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-muted-foreground leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <span className="text-accent font-bold">★</span>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                              {visaData.benefits.title}
                            </h3>
                          </div>
                          <ul className="space-y-3">
                            {visaData.benefits.items.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3 group">
                                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-muted-foreground leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-3xl p-12 border-2 border-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
              
              <div className="relative text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                  {t.visa.cta.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                  {t.visa.cta.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 group"
                    onClick={() => navigate('/contact')}
                  >
                    {t.visa.cta.consultationButton}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-6 group border-2"
                    onClick={() => navigate('/homologation-payment')}
                  >
                    {t.visa.cta.homologationButton}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default VisaInfo;
