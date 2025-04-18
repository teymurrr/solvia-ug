
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const { isLoggedIn, userType } = useAuth();
  const navigate = useNavigate();

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (userType === 'professional') {
        navigate('/dashboard/professional');
      } else if (userType === 'institution') {
        navigate('/dashboard/institution');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <Link to="/" onClick={handleLogoClick} className="flex items-center">
      <span className={`font-bold ${textSizeMap[size]} tracking-tight text-gray-500`}>
        solvia
      </span>
    </Link>
  );
};

export default Logo;
