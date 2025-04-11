
import React from 'react';
import { Link } from 'react-router-dom';

export const SignupLinks: React.FC = () => {
  return (
    <>
      <div className="text-sm text-center text-muted-foreground">
        Want to sign up as an institution?{" "}
        <Link to="/signup/institution" className="text-medical-700 hover:text-medical-800 font-medium">
          Institution signup
        </Link>
      </div>
      <div className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-medical-700 hover:text-medical-800 font-medium">
          Log in
        </Link>
      </div>
    </>
  );
};
