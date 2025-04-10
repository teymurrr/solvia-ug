
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Settings, FileText, Search, Filter } from 'lucide-react';
import ProfessionalProfileEditForm from '@/components/ProfessionalProfileEditForm';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ProfessionalDashboard = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    profession: "Doctor",
    specialty: "Cardiologist",
    email: "john.doe@example.com",
    location: "New York, USA",
    about: "Your profile is incomplete. Add more information about yourself to attract potential employers.",
    experiences: [],
    education: [],
    languages: [],
    activelySearching: false,
    profileImage: "",
    sfpCertificate: false
  });
  
  // This would normally fetch from a DB
  useEffect(() => {
    // In a real app, this would be a fetch call to get user data
    const userData = localStorage.getItem('profileData');
    if (userData) {
      setProfileData(JSON.parse(userData));
    }
  }, []);

  // This simulates saving profile data
  const handleProfileSave = (data) => {
    setProfileData(data);
    localStorage.setItem('profileData', JSON.stringify(data));
  };
  
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
                    <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {profileData.profileImage ? (
                        <img 
                          src={profileData.profileImage} 
                          alt={`${profileData.firstName} ${profileData.lastName}`} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-grow">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {profileData.firstName} {profileData.lastName}
                        {profileData.activelySearching && (
                          <Badge className="ml-2 bg-green-500">Actively searching</Badge>
                        )}
                      </h2>
                      <p className="text-medical-600">{profileData.specialty}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>{profileData.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p>{profileData.location || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Profession</h3>
                        <p>{profileData.profession}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">SFP Certificate</h3>
                        <p>{profileData.sfpCertificate ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    
                    {profileData.experiences && profileData.experiences.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                        <div className="space-y-2 mt-1">
                          {profileData.experiences.map((exp, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{exp.role} at {exp.hospital}</p>
                              <p className="text-muted-foreground">
                                {exp.location} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profileData.education && profileData.education.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Education</h3>
                        <div className="space-y-2 mt-1">
                          {profileData.education.map((edu, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{edu.degree} in {edu.field}</p>
                              <p className="text-muted-foreground">
                                {edu.institution} | {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profileData.languages && profileData.languages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Languages</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profileData.languages.map((lang, index) => (
                            <Badge key={index} variant="outline">
                              {lang.language} ({lang.level})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                      <p className="text-muted-foreground">
                        {profileData.about || "Your profile is incomplete. Add more information about yourself to attract potential employers."}
                      </p>
                    </div>
                    
                    <Button variant="default" onClick={() => setIsEditProfileOpen(true)}>
                      {Object.keys(profileData).length <= 3 ? "Complete Your Profile" : "Update Profile"}
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
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search by title, location, or keyword..." 
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="md:w-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">Full-time</Badge>
                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">Part-time</Badge>
                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">Temporary</Badge>
                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">Permanent</Badge>
                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">New York</Badge>
                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">Cardiology</Badge>
                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">English required</Badge>
                  </div>
                
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
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <Badge variant="secondary">Full-time</Badge>
                        <Badge variant="outline">$150K - $200K</Badge>
                        <Badge variant="outline">English required</Badge>
                        <Badge variant="outline">5+ years experience</Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Looking for an experienced cardiologist to join our team. Must have excellent diagnostic skills and patient care abilities.
                      </p>
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
        initialData={profileData}
      />
    </MainLayout>
  );
};

export default ProfessionalDashboard;
