
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="relative">
        <Stethoscope className={`${sizeMap[size]} text-medical-600`} />
        <div className="absolute inset-0 bg-medical-600 blur-sm opacity-20 rounded-full animate-pulse-slow" />
      </div>
      {withText && (
        <span className={`font-bold ${textSizeMap[size]} tracking-tight`}>
          <span className="text-medical-700">Sol</span>
          <span className="text-healing-600">via</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
