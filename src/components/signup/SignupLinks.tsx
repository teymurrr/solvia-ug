
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

export const SignupLinks: React.FC = () => {
  const { t } = useLanguage();
  return (
    <>
      <div className="text-sm text-center text-muted-foreground">
        {t.auth.wantInstitutionSignup}{" "}
        <Link to="/signup/institution" className="text-medical-700 hover:text-medical-800 font-medium">
          {t.auth.institutionSignup}
        </Link>
      </div>
      <div className="text-sm text-center text-muted-foreground">
        {t.auth.alreadyHaveAccountSignup}{" "}
        <Link to="/login" className="text-medical-700 hover:text-medical-800 font-medium">
          {t.auth.loginSignup}
        </Link>
      </div>
    </>
  );
};

export default SignupLinks;
