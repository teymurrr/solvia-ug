import { Professional, BlogPost } from '@/types/landing';

export const featuredProfessionals: Professional[] = [
  {
    id: '1',
    firstName: 'Isabella',
    lastName: 'Rodríguez',
    specialty: 'Cardiology',
    country: 'Buenos Aires, Argentina',
    languages: [
      { language: 'Spanish', level: 'Native' },
      { language: 'English', level: 'C1' },
      { language: 'Portuguese', level: 'B2' }
    ],
    experience: 8,
    fspCertificate: true,
    activelySearching: true,
    experiences: [
      {
        hospital: 'Hospital Italiano de Buenos Aires',
        role: 'Senior Cardiologist',
        startDate: '2020',
        current: true
      }
    ],
    education: [
      {
        institution: 'Universidad de Buenos Aires',
        degree: 'Medical Doctor',
        field: 'Cardiology'
      }
    ],
    profileImage: 'https://randomuser.me/api/portraits/women/28.jpg'
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

export const featuredVacancies = [
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

export const featuredBlogs = [
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
