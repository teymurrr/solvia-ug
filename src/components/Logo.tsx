
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className="flex items-center">
      <span className={`font-bold ${textSizeMap[size]} tracking-tight text-gray-500`}>
        solvia
      </span>
    </Link>
  );
};

export default Logo;
