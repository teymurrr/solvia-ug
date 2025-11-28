import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface CountryOption {
  code: string;
  flag: string;
  name: string;
  description: string;
}

const countries: CountryOption[] = [
  {
    code: 'de',
    flag: '🇩🇪',
    name: 'Germany',
    description: 'High demand for doctors and nurses. Clear Approbation pathway.',
  },
  {
    code: 'at',
    flag: '🇦🇹',
    name: 'Austria',
    description: 'Strong need for healthcare staff. University recognition system.',
  },
  {
    code: 'es',
    flag: '🇪🇸',
    name: 'Spain',
    description: 'Centralized homologación. Popular entry point for Spanish-speaking doctors.',
  },
  {
    code: 'it',
    flag: '🇮🇹',
    name: 'Italy',
    description: 'Ministry-based recognition. Attractive for doctors and dentists.',
  },
  {
    code: 'fr',
    flag: '🇫🇷',
    name: 'France',
    description: 'High demand for specialists. ARS + EVC pathway for foreign doctors.',
  },
];

const CountrySelection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCountryClick = (countryCode: string) => {
    navigate(`/homologation?country=${countryCode}`);
  };

  const handleScheduleCall = () => {
    navigate('/contact');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {t?.countrySelection?.title || 'Where do you want to work?'}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {t?.countrySelection?.subtitle || 
                  "Choose the country where you want to obtain your professional recognition. You don't need to know the process – we guide you step by step."}
              </p>
            </div>

            {/* Country Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {countries.map((country) => (
                <Card
                  key={country.code}
                  onClick={() => handleCountryClick(country.code)}
                  className="cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 bg-card"
                >
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {country.flag}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                      {t?.countrySelection?.countries?.[country.code]?.name || country.name}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {t?.countrySelection?.countries?.[country.code]?.description || country.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Not Sure Section */}
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {t?.countrySelection?.notSure || "Not sure which country is right for you?"}
              </h2>
              <p className="text-muted-foreground mb-6 text-base md:text-lg">
                {t?.countrySelection?.notSureSubtitle || "Our team can help you choose the best destination based on your profile and goals."}
              </p>
              <Button 
                size="lg"
                onClick={handleScheduleCall}
                className="gap-2 h-14 px-8 text-lg font-semibold"
              >
                <Calendar className="h-5 w-5" />
                {t?.countrySelection?.scheduleCall || "Schedule a free call with us"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default CountrySelection;
