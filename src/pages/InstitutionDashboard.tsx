
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Briefcase, Settings, Search, Users, Plus, FileText, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import InstitutionProfileEditForm from '@/components/InstitutionProfileEditForm';
import VacancyForm from '@/components/VacancyForm';
import { useToast } from '@/hooks/use-toast';

const InstitutionDashboard = () => {
  // State for talent search
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [vacancyFormOpen, setVacancyFormOpen] = useState(false);
  const { toast } = useToast();
  
  // Load professionals from localStorage on component mount
  useEffect(() => {
    const savedProfessionals = localStorage.getItem('professionals');
    if (savedProfessionals) {
      setProfessionals(JSON.parse(savedProfessionals));
    }
  }, []);
  
  // Load vacancies from localStorage on component mount
  const [vacancies, setVacancies] = useState<any[]>(() => {
    const savedVacancies = localStorage.getItem('institutionVacancies');
    return savedVacancies ? JSON.parse(savedVacancies) : [];
  });

  // Save vacancies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('institutionVacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  // Handle talent search
  const handleTalentSearch = () => {
    if (searchQuery.trim()) {
      const filtered = professionals.filter(prof => 
        prof.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prof.firstName + ' ' + prof.lastName)?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfessionals(filtered);
    } else {
      setFilteredProfessionals(professionals);
    }
  };

  const handleAddVacancy = (vacancyData: any) => {
    // Add the new vacancy with a timestamp ID
    const newVacancy = { ...vacancyData, id: Date.now() };
    setVacancies([...vacancies, newVacancy]);
    setVacancyFormOpen(false);
    
    toast({
      title: "Vacancy Created",
      description: "Your vacancy has been saved and will persist even after page refresh.",
    });
  };

  const handleDeleteVacancy = (id: number) => {
    setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
    
    toast({
      title: "Vacancy Deleted",
      description: "The vacancy has been removed from your listings.",
    });
  };

  return (
    <MainLayout hideEditProfile>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Institution Dashboard</h1>
            <p className="text-muted-foreground">Manage your hospital profile and job listings</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline" onClick={() => setProfileFormOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button onClick={() => setVacancyFormOpen(true)}>
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
                    
                    <Button variant="default" onClick={() => setProfileFormOpen(true)}>Complete Your Profile</Button>
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
                {vacancies.length > 0 ? (
                  <div className="space-y-4">
                    {vacancies.map((vacancy) => (
                      <div key={vacancy.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{vacancy.title}</h3>
                            <p className="text-sm text-medical-600">{vacancy.department}</p>
                            <p className="text-xs text-muted-foreground mt-1">{vacancy.location}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteVacancy(vacancy.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => setVacancyFormOpen(true)} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Another Vacancy
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No vacancies posted yet</h3>
                    <p className="text-muted-foreground">
                      Post your first job listing to attract healthcare professionals
                    </p>
                    <Button className="mt-4" onClick={() => setVacancyFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post a Vacancy
                    </Button>
                  </div>
                )}
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
                  
                  {filteredProfessionals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProfessionals.map((professional) => (
                        <div key={professional.email} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">Dr. {professional.firstName} {professional.lastName}</h3>
                              <p className="text-sm text-medical-600">{professional.specialty}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {professional.isOpenToRelocation ? "Open to relocation" : "Not open to relocation"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">View Profile</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : professionals.length > 0 && searchQuery ? (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium">No matching professionals found</h3>
                      <p className="text-muted-foreground">Try adjusting your search criteria</p>
                    </div>
                  ) : professionals.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No professionals have signed up yet</h3>
                      <p className="text-muted-foreground">
                        Check back later as healthcare professionals join the platform
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {professionals.slice(0, 6).map((professional) => (
                        <div key={professional.email} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">Dr. {professional.firstName} {professional.lastName}</h3>
                              <p className="text-sm text-medical-600">{professional.specialty}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {professional.isOpenToRelocation ? "Open to relocation" : "Not open to relocation"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">View Profile</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {professionals.length > 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link to="/professionals">
                        <Users className="h-4 w-4 mr-2" />
                        View All Professionals
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Forms */}
      <InstitutionProfileEditForm 
        open={profileFormOpen} 
        onOpenChange={setProfileFormOpen} 
      />
      
      <VacancyForm 
        open={vacancyFormOpen} 
        onOpenChange={setVacancyFormOpen}
        onSubmit={handleAddVacancy}
      />
    </MainLayout>
  );
};

export default InstitutionDashboard;
