import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import LearningSection from '@/components/landing/LearningSection';
import BlogSection from '@/components/landing/BlogSection';
import CTASection from '@/components/landing/CTASection';
import { Professional, BlogPost } from '@/types/landing';

const featuredProfessionals: Professional[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialty: 'Cardiology',
    country: 'Berlin, Germany',
    languages: [
      { language: 'English', level: 'C2' },
      { language: 'German', level: 'C1' }
    ],
    experience: 8,
    fspCertificate: true,
    activelySearching: true,
    experiences: [
      {
        hospital: 'Berlin Medical Center',
        role: 'Senior Cardiologist',
        startDate: '2020',
        current: true
      }
    ],
    education: [
      {
        institution: 'Charité University Hospital',
        degree: 'Medical Doctor',
        field: 'Cardiology'
      }
    ],
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    specialty: 'Neurology',
    country: 'Barcelona, Spain',
    languages: [
      { language: 'English', level: 'C1' },
      { language: 'Spanish', level: 'C1' },
      { language: 'Mandarin', level: 'Native' }
    ],
    experience: 5,
    fspCertificate: false,
    activelySearching: true,
    experiences: [
      {
        hospital: 'Barcelona Neurological Institute',
        role: 'Neurologist',
        startDate: '2021',
        current: true
      }
    ],
    education: [
      {
        institution: 'University of Barcelona',
        degree: 'Medical Doctor',
        field: 'Neurology'
      }
    ],
    profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: '3',
    firstName: 'Elena',
    lastName: 'Petrova',
    specialty: 'Pediatrics',
    country: 'Paris, France',
    languages: [
      { language: 'English', level: 'B2' },
      { language: 'French', level: 'C2' },
      { language: 'Russian', level: 'Native' }
    ],
    experience: 12,
    fspCertificate: true,
    activelySearching: false,
    experiences: [
      {
        hospital: 'Paris Children\'s Hospital',
        role: 'Head of Pediatrics',
        startDate: '2018',
        current: true
      }
    ],
    education: [
      {
        institution: 'Moscow Medical Academy',
        degree: 'Medical Doctor',
        field: 'Pediatrics'
      }
    ],
    profileImage: 'https://randomuser.me/api/portraits/women/56.jpg'
  },
  {
    id: '4',
    firstName: 'James',
    lastName: 'Wilson',
    specialty: 'Anesthesiology',
    country: 'Amsterdam, Netherlands',
    languages: [
      { language: 'English', level: 'Native' },
      { language: 'Dutch', level: 'B1' }
    ],
    experience: 7,
    fspCertificate: true,
    activelySearching: true,
    experiences: [
      {
        hospital: 'Amsterdam Medical Center',
        role: 'Anesthesiologist',
        startDate: '2022',
        current: true
      }
    ],
    education: [
      {
        institution: 'Oxford University',
        degree: 'Medical Doctor',
        field: 'Anesthesiology'
      }
    ],
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg'
  }
];

const featuredVacancies = [
  {
    id: '1',
    title: 'Senior Cardiologist',
    institution: 'Berlin Medical Center',
    location: 'Berlin, Germany',
    jobType: 'Full-time',
    description: 'Join our team of expert cardiologists in providing world-class cardiac care.',
    requirements: [
      'Board certification in Cardiology',
      'Minimum 5 years experience',
      'Fluent in German (C1) and English'
    ],
    postedDate: '2025-04-01',
    applicationDeadline: '2025-05-15'
  },
  {
    id: '2',
    title: 'Pediatric Nurse',
    institution: 'Madrid Health Clinic',
    location: 'Madrid, Spain',
    jobType: 'Part-time',
    description: 'Seeking experienced pediatric nurses to join our growing team.',
    requirements: [
      'Registered Nurse certification',
      'Pediatric care experience',
      'Spanish language proficiency'
    ],
    postedDate: '2025-04-10',
    applicationDeadline: '2025-05-20'
  },
  {
    id: '3',
    title: 'Emergency Physician',
    institution: 'Vienna General Hospital',
    location: 'Vienna, Austria',
    jobType: 'Full-time',
    description: 'Join our emergency department team providing critical care services.',
    requirements: [
      'Emergency Medicine certification',
      'Minimum 3 years experience',
      'German language proficiency (B2)'
    ],
    postedDate: '2025-04-05',
    applicationDeadline: '2025-05-25'
  },
  {
    id: '4',
    title: 'Physiotherapist',
    institution: 'Swiss Rehab Center',
    location: 'Zurich, Switzerland',
    jobType: 'Full-time',
    description: 'Experienced physiotherapist needed for our rehabilitation center.',
    requirements: [
      'Physiotherapy license',
      'Sports medicine experience',
      'German and English proficiency'
    ],
    postedDate: '2025-04-08',
    applicationDeadline: '2025-05-30'
  }
];

const featuredBlogs = [
  {
    id: '1',
    title: 'The Future of Healthcare Recruitment',
    excerpt: 'Discover how AI and technology are transforming medical staffing.',
    date: '2025-04-15',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Working Abroad in Healthcare',
    excerpt: 'Essential tips for medical professionals considering international careers.',
    date: '2025-04-12',
    readTime: '4 min read',
  }
];

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <ProfessionalsSection professionals={featuredProfessionals} />
      <HowItWorksSection />
      <VacanciesSection vacancies={featuredVacancies} />
      <LearningSection />
      <BlogSection posts={featuredBlogs} />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
