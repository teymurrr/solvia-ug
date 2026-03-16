import React from 'react';
import { Link } from 'react-router-dom';

const AuthorBio: React.FC = () => {
  return (
    <div className="mt-10 p-6 bg-muted/30 rounded-xl border flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
        S
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">Solvia Team</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Solvia helps healthcare professionals navigate medical license recognition across Europe. 
          Our team combines medical expertise with immigration knowledge to guide doctors, nurses, 
          and specialists through homologation in Germany, Austria, and Spain.
        </p>
        <Link to="/about" className="text-sm text-primary hover:underline font-medium">
          Learn more about Solvia →
        </Link>
      </div>
    </div>
  );
};

export default AuthorBio;
