import { useLanguage } from '@/hooks/useLanguage';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Globe, GraduationCap, Briefcase, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VisaInfo = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const visaTypes = [
    {
      icon: Globe,
      key: 'chancenkarte',
      color: 'text-primary'
    },
    {
      icon: Briefcase,
      key: 'workVisa',
      color: 'text-accent'
    },
    {
      icon: GraduationCap,
      key: 'internshipVisa',
      color: 'text-secondary'
    },
    {
      icon: BookOpen,
      key: 'languageVisa',
      color: 'text-primary'
    },
    {
      icon: Users,
      key: 'studentVisa',
      color: 'text-accent'
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              {t.visa.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              {t.visa.subtitle}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.visa.description}
            </p>
          </div>
        </section>

        {/* Visa Cards Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {visaTypes.map((visa, index) => {
              const Icon = visa.icon;
              const visaData = t.visa[visa.key as keyof typeof t.visa] as any;
              
              return (
                <Card 
                  key={visa.key}
                  className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-primary/10 ${visa.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 text-foreground">
                          {visaData.title}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                          {visaData.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="grid md:grid-cols-2 gap-8">
                    {/* Requirements */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        {visaData.requirements.title}
                      </h3>
                      <ul className="space-y-3">
                        {visaData.requirements.items.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <span className="text-accent">★</span>
                        {visaData.benefits.title}
                      </h3>
                      <ul className="space-y-3">
                        {visaData.benefits.items.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-12 border-2 border-primary/20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                {t.visa.cta.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t.visa.cta.description}
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/contact')}
              >
                {t.visa.cta.button}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default VisaInfo;
