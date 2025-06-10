
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, BarChart, LayoutDashboard, BookOpen, FileText, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface NavLinksProps {
  isLoggedIn: boolean;
  userType: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ isLoggedIn, userType }) => {
  const { t } = useLanguage();

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center space-x-8 flex-1">
        <Link
          to="/"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <Stethoscope className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">For Doctors</span>
        </Link>

        <Link
          to="/home"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <Home className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{t?.common?.home || "Home"}</span>
        </Link>

        <Link
          to="/about"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <Heart className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{t?.common?.about || "About Us"}</span>
        </Link>
      </div>
    );
  }

  if (userType === 'professional') {
    return (
      <div className="flex justify-center space-x-8 flex-1">
        <Link
          to="/dashboard/professional"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <LayoutDashboard className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{t?.common?.dashboard || "Dashboard"}</span>
        </Link>

        <Link
          to="/learning"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <BookOpen className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{t?.common?.learning || "Solvia Learning"}</span>
        </Link>

        <Link
          to="/blog"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <FileText className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">Wiki</span>
        </Link>
      </div>
    );
  }

  if (userType === 'institution') {
    return (
      <div className="flex justify-center space-x-8 flex-1">
        <Link
          to="/dashboard/institution"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <LayoutDashboard className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{t?.common?.dashboard || "Dashboard"}</span>
        </Link>

        <Link
          to="/insights"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <BarChart className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{t?.insights?.title || "Solvia Insights"}</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default NavLinks;
