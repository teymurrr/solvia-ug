
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t.common.createAccount}</CardTitle>
            <CardDescription className="text-center">
              {t.common.selectAccountType}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg hover:border-medical-600 transition-colors cursor-pointer"
                  onClick={() => navigate('/signup/professional')}>
                <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-medical-700" />
                </div>
                <h3 className="text-xl font-semibold">{t.common.professional}</h3>
                <p className="text-muted-foreground">{t.common.professionalDesc}</p>
                <Button className="mt-2 w-full" onClick={() => navigate('/signup/professional')}>
                  {t.common.continueAs} {t.common.professional}
                </Button>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg hover:border-medical-600 transition-colors cursor-pointer"
                  onClick={() => navigate('/signup/institution')}>
                <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-medical-700" />
                </div>
                <h3 className="text-xl font-semibold">{t.common.institution}</h3>
                <p className="text-muted-foreground">{t.common.institutionDesc}</p>
                <Button className="mt-2 w-full" onClick={() => navigate('/signup/institution')}>
                  {t.common.continueAs} {t.common.institution}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {t.common.alreadyHaveAccount}{" "}
              <Link to="/login" className="text-medical-700 hover:text-medical-800 font-medium">
                {t.common.login}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Signup;
