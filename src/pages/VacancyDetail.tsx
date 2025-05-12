import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Calendar, Building, Medal, Clock, ArrowLeft, Heart } from 'lucide-react';

// This would come from an API in a real application
const getVacancyById = (id: string) => {
  return {
    id,
    title: 'Neurologist',
    institution: 'Berlin Medical Center',
    location: 'Berlin, Germany',
    jobType: 'Full-time',
    specialty: 'Neurology',
    profession: 'Doctor',
    description: 'We are looking for an experienced neurologist to join our team at Berlin Medical Center, one of Germany\'s leading medical facilities. The ideal candidate will have experience in clinical practice and research, with a focus on neurological disorders. You will be responsible for diagnosing and treating patients with various neurological conditions, participating in clinical research, and collaborating with other specialists in our multidisciplinary team.',
    requirements: [
      '5+ years of experience in clinical neurology',
      'German language proficiency (B2 level or higher)',
      'Board certification in neurology',
      'Experience with EEG and other neurological diagnostic procedures',
      'Research experience is a plus',
      'Excellent communication and teamwork skills'
    ],
    responsibilities: [
      'Diagnose and treat patients with neurological disorders',
      'Perform and interpret neurological examinations and tests',
      'Develop treatment plans for patients',
      'Collaborate with multidisciplinary teams',
      'Participate in clinical research',
      'Stay updated with latest developments in neurology'
    ],
    benefits: [
      'Competitive salary package',
      'Professional development opportunities',
      'Modern work environment',
      'Research opportunities',
      'Health insurance',
      '30 days of annual leave'
    ],
    salary: '€85,000 - €110,000 annually depending on experience',
    workHours: '40 hours per week',
    postedDate: '2025-03-15',
    applicationDeadline: '2025-05-15',
  };
};

const VacancyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const vacancy = getVacancyById(id || '');
  const [isSaved, setIsSaved] = useState(false);
  
  // Enhanced navigation state tracking
  const fromDashboard = location.state?.fromDashboard || false;
  const fromLandingPage = location.state?.fromLandingPage || false;
  const searchQuery = location.state?.searchQuery || '';
  const currentPage = location.state?.currentPage || 1;
  const selectedFilters = location.state?.selectedFilters || {};
  
  // Enhanced navigation that respects where the user came from
  const handleGoBack = () => {
    if (fromDashboard) {
      // Go back to the dashboard with the vacancies tab active
      navigate('/dashboard/professional', { 
        state: { 
          activeTab: 'vacancies',
          searchQuery,
          currentPage,
          selectedFilters
        }
      });
    } else if (fromLandingPage) {
      // Go back to the landing page
      navigate('/', {
        state: { 
          searchQuery,
          currentPage,
          selectedFilters
        }
      });
    } else {
      // Otherwise, go back to the general vacancies page
      navigate('/vacancies');
    }
  };
  
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Calculate days remaining until deadline
  const calculateDaysRemaining = () => {
    const today = new Date();
    const deadline = new Date(vacancy.applicationDeadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = calculateDaysRemaining();
  
  // Get badge variant based on job type
  const getJobTypeBadgeVariant = (type: string) => {
    switch(type) {
      case 'Full-time':
        return 'default';
      case 'Part-time':
        return 'secondary';
      case 'Internship':
        return 'outline';
      case 'Volunteer':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Handle save/unsave vacancy
  const handleSaveVacancy = () => {
    setIsSaved(!isSaved);
    
    if (!isSaved) {
      toast({
        title: "Vacancy saved",
        description: "This vacancy has been added to your saved list",
      });
    } else {
      toast({
        title: "Vacancy removed",
        description: "This vacancy has been removed from your saved list",
      });
    }
  };

  // Handle apply button click - preserve source origin and search state when applying
  const handleApply = () => {
    navigate(`/vacancies/${id}/apply`, { 
      state: { 
        fromDashboard,
        fromLandingPage,
        searchQuery,
        currentPage,
        selectedFilters
      }
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={handleGoBack} 
          className="inline-flex items-center text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {fromDashboard ? 'Back to Dashboard' : fromLandingPage ? 'Back to Home' : 'Back to Vacancies'}
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{vacancy.title}</h1>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Building className="h-4 w-4 mr-1" />
                    <span className="text-lg">{vacancy.institution}</span>
                  </div>
                </div>
                <Badge variant={getJobTypeBadgeVariant(vacancy.jobType)} className="whitespace-nowrap">
                  {vacancy.jobType}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 my-6">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{vacancy.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{vacancy.profession} • {vacancy.specialty}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{vacancy.workHours}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className={daysRemaining < 7 ? 'text-destructive font-medium' : ''}>
                    {daysRemaining <= 0 
                      ? 'Deadline passed' 
                      : `Deadline: ${formatDate(vacancy.applicationDeadline)} (${daysRemaining} days left)`}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground">{vacancy.description}</p>
            </div>
            
            {/* Responsibilities */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {vacancy.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
            
            {/* Requirements */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {vacancy.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
            
            {/* Benefits */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {vacancy.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="space-y-5 pt-6">
                {/* Salary */}
                <div>
                  <h3 className="text-lg font-semibold mb-1">Salary</h3>
                  <p className="text-muted-foreground">{vacancy.salary}</p>
                </div>
                
                {/* Posted Date */}
                <div>
                  <h3 className="text-lg font-semibold mb-1">Posted On</h3>
                  <p className="text-muted-foreground">{formatDate(vacancy.postedDate)}</p>
                </div>
                
                {/* Application Deadline */}
                <div>
                  <h3 className="text-lg font-semibold mb-1">Application Deadline</h3>
                  <p className={`${daysRemaining < 7 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {formatDate(vacancy.applicationDeadline)}
                    <br />
                    {daysRemaining <= 0 
                      ? 'Deadline passed' 
                      : `${daysRemaining} days remaining`}
                  </p>
                </div>
                
                {/* Apply Button */}
                <Button className="w-full mt-4" size="lg" onClick={handleApply}>
                  Apply Now
                </Button>
                
                {/* Save Button - Updated with heart icon */}
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  onClick={handleSaveVacancy}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                  {isSaved ? 'Saved' : 'Save for Later'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VacancyDetail;
