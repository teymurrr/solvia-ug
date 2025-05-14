import { useState, useEffect } from 'react';

export interface Application {
  id: string;
  user_id: string;
  vacancy_id: string;
  applicantId: string;
  applicantName: string;
  applicantPhoto: string;
  applicantEmail: string;
  applicantPhone: string;
  vacancyId: string;
  vacancyTitle: string;
  appliedDate: string;
  application_date: string;
  status: string;
  coverLetter: string;
  cvFileName: string;
}

export const useFetchApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be a call to your backend API
        // For now, we'll just use some mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockApplications: Application[] = [
          {
            id: '1',
            user_id: 'user1',
            vacancy_id: '1',
            applicantId: 'user1',
            applicantName: 'John Smith',
            applicantPhoto: '/placeholder.svg',
            applicantEmail: 'john.smith@example.com',
            applicantPhone: '+1234567890',
            vacancyId: '1',
            vacancyTitle: 'Senior Cardiologist',
            appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            application_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            coverLetter: 'I am writing to express my interest in the Senior Cardiologist position.',
            cvFileName: 'john_smith_cv.pdf'
          },
          {
            id: '2',
            user_id: 'user2',
            vacancy_id: '2',
            applicantId: 'user2',
            applicantName: 'Alice Johnson',
            applicantPhoto: '/placeholder.svg',
            applicantEmail: 'alice.johnson@example.com',
            applicantPhone: '+9876543210',
            vacancyId: '2',
            vacancyTitle: 'Registered Nurse',
            appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            application_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'reviewing',
            coverLetter: 'I am an experienced registered nurse with a passion for patient care.',
            cvFileName: 'alice_johnson_cv.pdf'
          },
          {
            id: '3',
            user_id: 'user3',
            vacancy_id: '1',
            applicantId: 'user3',
            applicantName: 'Bob Williams',
            applicantPhoto: '/placeholder.svg',
            applicantEmail: 'bob.williams@example.com',
            applicantPhone: '+1122334455',
            vacancyId: '1',
            vacancyTitle: 'Senior Cardiologist',
            appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            application_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'accepted',
            coverLetter: 'I have extensive experience in cardiology and am eager to contribute to your team.',
            cvFileName: 'bob_williams_cv.pdf'
          },
          {
            id: '4',
            user_id: 'user4',
            vacancy_id: '3',
            applicantId: 'user4',
            applicantName: 'Emily Davis',
            applicantPhoto: '/placeholder.svg',
            applicantEmail: 'emily.davis@example.com',
            applicantPhone: '+9988776655',
            vacancyId: '3',
            vacancyTitle: 'Medical Technician',
            appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            application_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'rejected',
            coverLetter: 'I am a certified medical technician with a strong attention to detail.',
            cvFileName: 'emily_davis_cv.pdf'
          },
        ];
        
        setApplications(mockApplications);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { applications, loading, error };
};
