
import { useState, useEffect } from 'react';

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  profession?: string;
  country?: string;
  language?: string;
  isOpenToRelocation?: boolean;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    const loadProfessionals = () => {
      try {
        const savedProfessionals = localStorage.getItem('professionals');
        console.log('Raw localStorage professionals data:', savedProfessionals);
        
        if (savedProfessionals) {
          const parsedProfessionals = JSON.parse(savedProfessionals);
          console.log('Parsed professionals:', parsedProfessionals);
          
          if (Array.isArray(parsedProfessionals)) {
            setProfessionals(parsedProfessionals);
            setFilteredProfessionals(parsedProfessionals);
          } else {
            console.error('Professionals data is not an array:', parsedProfessionals);
            setProfessionals([]);
            setFilteredProfessionals([]);
          }
        } else {
          console.log('No professionals found in localStorage');
          const sampleData = [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Smith',
              specialty: 'Cardiology',
              profession: 'Doctor',
              country: 'Germany',
              language: 'English',
              isOpenToRelocation: true
            },
            {
              id: '2',
              firstName: 'Maria',
              lastName: 'Garcia',
              specialty: 'Neurology',
              profession: 'Specialist',
              country: 'Spain',
              language: 'Spanish',
              isOpenToRelocation: false
            },
            {
              id: '3',
              firstName: 'David',
              lastName: 'Chen',
              specialty: 'Pediatrics',
              profession: 'Doctor',
              country: 'Canada',
              language: 'English',
              isOpenToRelocation: true
            }
          ];
          
          setProfessionals(sampleData);
          setFilteredProfessionals(sampleData);
          localStorage.setItem('professionals', JSON.stringify(sampleData));
        }
      } catch (error) {
        console.error('Error loading professionals:', error);
        setProfessionals([]);
        setFilteredProfessionals([]);
      }
    };
    
    loadProfessionals();
    window.addEventListener('storage', loadProfessionals);
    
    return () => {
      window.removeEventListener('storage', loadProfessionals);
    };
  }, []);

  return { professionals, filteredProfessionals, setFilteredProfessionals };
};
