import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

const Footer: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleProfessionalLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(path);
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign up as a professional to access this feature.",
      });
      navigate('/signup/professional');
    }
  };

  const handleInstitutionLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(path);
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign up as an institution to access this feature.",
      });
      navigate('/signup/institution');
    }
  };

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              {t?.footer?.tagline || "Connecting qualified medical professionals with healthcare institutions worldwide."}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t?.footer?.forProfessionals || "For Professionals"}</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleProfessionalLink(e, '/professionals')}
                  className="text-sm text-muted-foreground hover:text-medical-600 transition-colors"
                >
                  {t?.footer?.createProfile || "Create Profile"}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleProfessionalLink(e, '/professionals/search')}
                  className="text-sm text-muted-foreground hover:text-medical-600 transition-colors"
                >
                  {t?.footer?.findOpportunities || "Find Opportunities"}
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t?.footer?.forInstitutions || "For Institutions"}</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleInstitutionLink(e, '/institutions')}
                  className="text-sm text-muted-foreground hover:text-medical-600 transition-colors"
                >
                  {t?.footer?.postPositions || "Post Positions"}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleInstitutionLink(e, '/institutions/search')}
                  className="text-sm text-muted-foreground hover:text-medical-600 transition-colors"
                >
                  {t?.footer?.searchProfessionals || "Search Professionals"}
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t?.footer?.company || "Company"}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-medical-600 transition-colors">
                  {t?.common?.about || "About Us"}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-medical-600 transition-colors">
                  {t?.common?.contact || "Contact"}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-medical-600 transition-colors">
                  {t?.footer?.privacyPolicy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-medical-600 transition-colors">
                  {t?.footer?.termsOfService || "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Solvia Global Hub. {t?.footer?.allRightsReserved || "All rights reserved"}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-medical-600 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-medical-600 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-medical-600 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
