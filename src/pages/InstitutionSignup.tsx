
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InstitutionSignupForm } from '@/components/signup/InstitutionSignupForm';
import { SignupLinks } from '@/components/signup/SignupLinks';

const InstitutionSignup = () => {
  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Institution Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your healthcare institution account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstitutionSignupForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <SignupLinks />
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InstitutionSignup;
