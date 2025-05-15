
import { useState, useEffect } from 'react';
import { Application, ApplicationStatus } from './types';

// Mock data for applications
const mockApplicationsData: Application[] = [
  {
    id: '1',
    vacancy_id: 'v1',
    user_id: 'u1',
    application_date: '2023-05-01',
    status: 'pending',
    application_data: {},
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    applicantPhone: '+1234567890',
    applicantPhoto: '/placeholder.svg',
    vacancyTitle: 'Senior Cardiologist',
    appliedDate: '2023-05-01',
    coverLetter: 'I am writing to express my interest in the Senior Cardiologist position.',
    cvFileName: 'john_doe_cv.pdf',
    vacancy: {
      title: 'Senior Cardiologist',
      institution: 'City Hospital',
      location: 'New York'
    },
    professional: {
      first_name: 'John',
      last_name: 'Doe',
      specialty: 'Cardiology',
      profile_image: '/placeholder.svg'
    }
  },
  {
    id: '2',
    vacancy_id: 'v2',
    user_id: 'u2',
    application_date: '2023-05-10',
    status: 'reviewing',
    application_data: {},
    applicantName: 'Jane Smith',
    applicantEmail: 'jane@example.com',
    applicantPhone: '+1987654321',
    applicantPhoto: '/placeholder.svg',
    vacancyTitle: 'Pediatric Nurse',
    appliedDate: '2023-05-10',
    coverLetter: 'I am writing to express my interest in the Pediatric Nurse position.',
    cvFileName: 'jane_smith_cv.pdf',
    vacancy: {
      title: 'Pediatric Nurse',
      institution: 'Children\'s Hospital',
      location: 'Boston'
    },
    professional: {
      first_name: 'Jane',
      last_name: 'Smith',
      specialty: 'Pediatric Nursing',
      profile_image: '/placeholder.svg'
    }
  }
];

export const useFetchApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // In a real app, this would be a fetch to an API
      // For now, we'll use the mock data
      setApplications(mockApplicationsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Refresh function that can be called from outside
  const refreshApplications = async () => {
    return fetchApplications();
  };

  return { applications, loading, error, refreshApplications };
};
