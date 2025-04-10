
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Settings, FileText } from 'lucide-react';
import ProfessionalProfileEditForm from '@/components/ProfessionalProfileEditForm';

const ProfessionalDashboard = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Professional Dashboard</h1>
            <p className="text-muted-foreground">Manage your profile and view opportunities</p>
          </div>
          <Button variant="outline" onClick={() => setIsEditProfileOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vacancies">Vacancies</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  This is how institutions will see you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">Dr. John Doe</h2>
                      <p className="text-medical-600">Cardiologist</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>john.doe@example.com</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                        <p>Not specified</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Education</h3>
                        <p>Not specified</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p>Not specified</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                      <p className="text-muted-foreground">
                        Your profile is incomplete. Add more information about yourself to attract potential employers.
                      </p>
                    </div>
                    
                    <Button variant="default" onClick={() => setIsEditProfileOpen(true)}>
                      Complete Your Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vacancies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Vacancies</CardTitle>
                <CardDescription>
                  Explore open positions in healthcare institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((vacancy) => (
                    <div key={vacancy} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Senior Cardiologist</h3>
                          <p className="text-sm text-muted-foreground">General Hospital, New York</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs bg-medical-100 text-medical-800 px-2 py-1 rounded">Full-time</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">$150K - $200K</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Vacancies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Applications</CardTitle>
                <CardDescription>
                  Track the status of positions you've applied for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                    <p className="text-muted-foreground">
                      Once you apply for positions, they will appear here
                    </p>
                    <Button variant="outline" className="mt-4">
                      Browse Vacancies
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <ProfessionalProfileEditForm 
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      />
    </MainLayout>
  );
};

export default ProfessionalDashboard;
