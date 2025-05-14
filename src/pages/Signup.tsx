
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Select the account type to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg hover:border-medical-600 transition-colors cursor-pointer"
                  onClick={() => navigate('/signup/professional')}>
                <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-medical-700" />
                </div>
                <h3 className="text-xl font-semibold">Healthcare Professional</h3>
                <p className="text-muted-foreground">Create a profile to showcase your expertise and find relevant opportunities in healthcare institutions.</p>
                <Button className="mt-2 w-full" onClick={() => navigate('/signup/professional')}>
                  Continue as Professional
                </Button>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg hover:border-medical-600 transition-colors cursor-pointer"
                  onClick={() => navigate('/signup/institution')}>
                <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-medical-700" />
                </div>
                <h3 className="text-xl font-semibold">Healthcare Institution</h3>
                <p className="text-muted-foreground">Create an account to post job opportunities, search for talent, and connect with healthcare professionals.</p>
                <Button className="mt-2 w-full" onClick={() => navigate('/signup/institution')}>
                  Continue as Institution
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-medical-700 hover:text-medical-800 font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Signup;
