
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';
import { 
  VacancyHeader, 
  VacancyMetaInfo, 
  VacancyDescription,
  VacancySidebar,
  formatDate,
  calculateDaysRemaining
} from '@/components/vacancy-detail';

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
  const searchQuery = location.state?.searchQuery || '';
  const currentPage = location.state?.currentPage || 1;
  const selectedFilters = location.state?.selectedFilters || {};
  
  // Handle navigation back to dashboard
  const handleGoBack = () => {
    // Always go back to the dashboard with the vacancies tab active
    navigate('/dashboard/professional', { 
      state: { 
        activeTab: 'vacancies',
        searchQuery,
        currentPage,
        selectedFilters
      }
    });
  };
  
  // Calculate days remaining until deadline
  const daysRemaining = calculateDaysRemaining(vacancy.applicationDeadline);

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

  // Handle apply button click
  const handleApply = () => {
    navigate(`/vacancies/${id}/apply`, { 
      state: { 
        fromDashboard: true,
        searchQuery,
        currentPage,
        selectedFilters
      }
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <VacancyHeader
          title={vacancy.title}
          institution={vacancy.institution}
          jobType={vacancy.jobType}
          onGoBack={handleGoBack}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <VacancyMetaInfo
              location={vacancy.location}
              profession={vacancy.profession}
              specialty={vacancy.specialty}
              workHours={vacancy.workHours}
              applicationDeadline={vacancy.applicationDeadline}
              daysRemaining={daysRemaining}
              formatDate={formatDate}
            />
            
            <VacancyDescription
              description={vacancy.description}
              responsibilities={vacancy.responsibilities}
              requirements={vacancy.requirements}
              benefits={vacancy.benefits}
            />
          </div>
          
          {/* Sidebar */}
          <div>
            <VacancySidebar
              salary={vacancy.salary}
              postedDate={vacancy.postedDate}
              applicationDeadline={vacancy.applicationDeadline}
              daysRemaining={daysRemaining}
              isSaved={isSaved}
              formatDate={formatDate}
              onApply={handleApply}
              onSaveVacancy={handleSaveVacancy}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VacancyDetail;
