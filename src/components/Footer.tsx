
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useLanguage } from '@/hooks/useLanguage';
import { Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();


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
                <Link to="/signup/professional" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.footer?.createProfile || "Create Profile"}
                </Link>
              </li>
              <li>
                <Link to="/vacancies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.footer?.findOpportunities || "Find Opportunities"}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t?.footer?.forInstitutions || "For Institutions"}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/employers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.footer?.postPositions || "Post Positions"}
                </Link>
              </li>
              <li>
                <Link to="/signup/institution" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.footer?.searchProfessionals || "Search Professionals"}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t?.footer?.company || "Company"}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.common?.about || "About Us"}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.common?.contact || "Contact"}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.footer?.privacyPolicy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.footer?.termsOfService || "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link to="/impressum" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t?.footer?.impressum || "Impressum"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Solvia Global Hub. {t?.footer?.allRightsReserved || "All rights reserved"}
            </p>
            <p>
              {t?.footer?.aiPoweredBy || "AI powered by"}{" "}
              <a 
                href="https://opxon.com/en/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-medical-600 hover:text-medical-700 transition-colors font-medium"
              >
                Opxon
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://www.instagram.com/thesolvia/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-medical-600 transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/company/thesolvia/?viewAsMember=true" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-medical-600 transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
