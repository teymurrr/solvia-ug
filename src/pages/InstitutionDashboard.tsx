
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Briefcase, Settings, Search, Users, Plus, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

const InstitutionDashboard = () => {
  // State for search results in talents tab
  const [talentSearchResults, setTalentSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle talent search
  const handleTalentSearch = () => {
    // This would normally call an API
    // For demo, we'll just set some results based on the search query
    if (searchQuery.trim()) {
      setTalentSearchResults([1, 2, 3]); // Mock results
    } else {
      setTalentSearchResults([]);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Institution Dashboard</h1>
            <p className="text-muted-foreground">Manage your hospital profile and job listings</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline" asChild>
              <Link to="/profile/institution/edit">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Vacancy
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vacancies">Your Vacancies</TabsTrigger>
            <TabsTrigger value="talents">Talent Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Profile</CardTitle>
                <CardDescription>
                  This is how healthcare professionals will see your institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">General Hospital</h2>
                      <p className="text-medical-600">Hospital</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>contact@hospital.com</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                        <p>Not specified</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                        <p>Not specified</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p>New York, USA</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                      <p className="text-muted-foreground">
                        Your profile is incomplete. Add more information about your institution to attract healthcare professionals.
                      </p>
                    </div>
                    
                    <Button variant="default">Complete Your Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vacancies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Posted Vacancies</CardTitle>
                <CardDescription>
                  Manage job listings and view applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No vacancies posted yet</h3>
                    <p className="text-muted-foreground">
                      Post your first job listing to attract healthcare professionals
                    </p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Post a Vacancy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="talents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Healthcare Professionals</CardTitle>
                <CardDescription>
                  Find and connect with qualified professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by specialty, name, or location" 
                        className="pl-10" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button type="button" onClick={handleTalentSearch}>Search</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((professional) => (
                      <div key={professional} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">Dr. Jane Smith</h3>
                            <p className="text-sm text-medical-600">Neurologist</p>
                            <p className="text-xs text-muted-foreground mt-1">New York, USA</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">View Profile</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild={talentSearchResults.length > 0}
                    disabled={talentSearchResults.length === 0}
                  >
                    {talentSearchResults.length > 0 ? (
                      <Link to="/professionals">
                        <Users className="h-4 w-4 mr-2" />
                        View All Professionals
                      </Link>
                    ) : (
                      <span>
                        <Users className="h-4 w-4 mr-2" />
                        No Professionals Found
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default InstitutionDashboard;

// Missing User icon in the above component
const User = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};
