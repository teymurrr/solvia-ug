
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalSignupForm } from '@/components/signup/ProfessionalSignupForm';
import { SignupLinks } from '@/components/signup/SignupLinks';

const ProfessionalSignup = () => {
  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create a Professional Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your healthcare professional account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfessionalSignupForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <SignupLinks />
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfessionalSignup;
