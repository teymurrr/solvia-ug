import { useState } from 'react';

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
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  coverLetter: string;
  cvFileName: string;
}

export interface Vacancy {
  id: string;
  title: string;
  institution: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  job_type: string;
  created_at: string;
}

export interface ApplicationFilter {
  status: string;
  date: string;
}

export const mockVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Senior Cardiologist',
    institution: 'Heart Medical Center',
    department: 'Cardiology',
    location: 'Berlin, Germany',
    description: 'We are looking for an experienced cardiologist to join our growing team.',
    requirements: [
      'MD or equivalent medical degree',
      'Board certification in cardiology',
      'At least 5 years of experience',
      'Strong communication skills'
    ],
    job_type: 'Full-time',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Registered Nurse',
    institution: 'City General Hospital',
    department: 'Emergency Medicine',
    location: 'Munich, Germany',
    description: 'Join our emergency department as a registered nurse providing immediate care.',
    requirements: [
      'BSN degree',
      'Valid nursing license',
      'Emergency care certification',
      'Ability to work under pressure'
    ],
    job_type: 'Part-time',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Medical Assistant',
    institution: 'Klinikum Stuttgart',
    department: 'General Practice',
    location: 'Stuttgart, Germany',
    description: 'Seeking a detail-oriented medical assistant to support our general practice.',
    requirements: [
      'Completion of a medical assistant program',
      'Certification as a medical assistant',
      'Experience with patient care',
      'Excellent organizational skills'
    ],
    job_type: 'Full-time',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Physical Therapist',
    institution: 'Reha Zentrum Heidelberg',
    department: 'Rehabilitation',
    location: 'Heidelberg, Germany',
    description: 'We are hiring a physical therapist to help patients recover from injuries.',
    requirements: [
      'Master’s degree in physical therapy',
      'Valid physical therapy license',
      'Experience in rehabilitation',
      'Strong interpersonal skills'
    ],
    job_type: 'Full-time',
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Radiology Technician',
    institution: 'Universitätsklinikum Freiburg',
    department: 'Radiology',
    location: 'Freiburg, Germany',
    description: 'Looking for a skilled radiology technician to perform imaging procedures.',
    requirements: [
      'Associate’s degree in radiology technology',
      'Certification as a radiology technician',
      'Experience with imaging equipment',
      'Attention to detail'
    ],
    job_type: 'Full-time',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useApplicationFilters = () => {
  const [filters, setFilters] = useState<ApplicationFilter>({
    status: 'all',
    date: 'all'
  });

  const updateApplicationFilters = (filterKey: keyof ApplicationFilter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value
    }));
  };

  return { filters, updateApplicationFilters };
};
